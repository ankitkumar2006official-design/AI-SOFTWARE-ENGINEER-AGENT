import os

from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_response(prompt):

    candidate_models = ["openai/gpt-oss-120b", "qwen/qwen3.8-27b", "openai/gpt-oss-20b"]
    for model_id in candidate_models:
        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=model_id
            )
            return chat_completion.choices[0].message.content
        except Exception:
            continue
    raise Exception("No available chat model responded successfully on Groq.")