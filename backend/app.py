import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv

# Load .env file safely regardless of invocation directory
env_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(env_path):
    load_dotenv(dotenv_path=env_path)
load_dotenv()

app = Flask(__name__)

# Enable CORS for React frontend
CORS(app, resources={r"/*": {"origins": "*"}})

# Check API key
api_key = os.getenv("GROQ_API_KEY")

print("GROQ_API_KEY Loaded:", bool(api_key))

if not api_key:
    raise Exception(
        "GROQ_API_KEY not found. Create a .env file and add:\nGROQ_API_KEY=your_key_here"
    )

# Initialize Groq client
client = Groq(api_key=api_key)


@app.route("/")
def home():
    return "Groq AI Backend Running"


@app.route("/test")
def test():
    return jsonify({"status": "ok"})


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()

        print("Received Data:", data)

        if not data:
            return jsonify({
                "error": "No JSON data received"
            }), 400

        message = data.get("message", "")
        mode = data.get("mode", "assistant")

        # AI Modes
        if mode == "generator":
            system_prompt = """
            You are an expert AI software engineer.
            Generate clean production-ready code.
            """

        elif mode == "assistant":
            system_prompt = """
            You are a senior coding assistant.
            Explain concepts clearly.
            """

        elif mode == "debugger":
            system_prompt = """
            You are an expert debugger.
            Fix errors and explain bugs.
            """

        elif mode == "deploy":
            system_prompt = """
            You are a DevOps engineer.
            Explain deployment step by step.
            """

        elif mode == "settings":
            system_prompt = """
            You are an AI settings assistant.
            """

        else:
            system_prompt = "You are a helpful AI assistant."

        # Available chat models on this Groq account with resilient fallback
        candidate_models = [
            os.getenv("GROQ_MODEL"),
            "openai/gpt-oss-120b",
            "qwen/qwen3.8-27b",
            "openai/gpt-oss-20b",
            "llama-3.1-70b-versatile"
        ]
        candidate_models = [m for m in candidate_models if m]

        completion = None
        last_error = None
        for model_id in candidate_models:
            try:
                completion = client.chat.completions.create(
                    model=model_id,
                    messages=[
                        {
                            "role": "system",
                            "content": system_prompt
                        },
                        {
                            "role": "user",
                            "content": message
                        }
                    ],
                    temperature=0.7,
                    max_tokens=2048
                )
                if completion:
                    break
            except Exception as err:
                last_error = err
                continue

        if not completion:
            raise last_error

        reply = completion.choices[0].message.content

        return jsonify({
            "success": True,
            "response": reply
        })

    except Exception as e:
        import traceback
        traceback.print_exc()

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )