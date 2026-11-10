import os
import sys
from groq import Groq
from dotenv import load_dotenv

# Load .env file safely
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
if os.path.exists(env_path):
    load_dotenv(dotenv_path=env_path)
load_dotenv()

raw_api_key = os.getenv("GROQ_API_KEY", "")
api_key = raw_api_key.strip().strip("'\"") if raw_api_key else ""

client = None
if api_key:
    try:
        client = Groq(api_key=api_key)
    except Exception as e:
        print(f"Failed to initialize Groq client in openai_service: {e}", file=sys.stderr)


def generate_response(prompt, mode="assistant"):
    """Generate response using resilient Groq model cascade."""
    if not client:
        raise Exception("GROQ_API_KEY is not configured on the server.")

    candidate_models = [
        os.getenv("GROQ_MODEL"),
        "qwen/qwen3.8-27b",
        "openai/gpt-oss-120b",
        "openai/gpt-oss-20b",
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant"
    ]
    seen = set()
    unique_candidates = [m for m in candidate_models if m and not (m in seen or seen.add(m))]

    last_error = None
    for model_id in unique_candidates:
        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "user", "content": prompt}
                ],
                model=model_id,
                temperature=0.7,
                max_tokens=2048,
                timeout=60.0
            )
            if chat_completion and chat_completion.choices:
                return chat_completion.choices[0].message.content or ""
        except Exception as err:
            last_error = err
            continue

    if last_error:
        raise last_error
    raise Exception("No candidate Groq model responded successfully.")


class LLMWrapper:
    """Compatibility wrapper for legacy tools expecting an llm object."""

    def invoke(self, prompt):
        content = generate_response(str(prompt))
        return type("LLMResponse", (), {"content": content})()

    def chat_completion(self, model=None, messages=None, max_tokens=1000):
        if not messages:
            prompt = ""
        else:
            prompt = messages[-1].get("content", "")
        content = generate_response(prompt)
        choice = type("Choice", (), {"message": type("Msg", (), {"content": content})()})()
        return type("Completion", (), {"choices": [choice]})()


llm = LLMWrapper()
