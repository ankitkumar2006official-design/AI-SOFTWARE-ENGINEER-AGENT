from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq

app = Flask(__name__)

CORS(app)

# GROQ CLIENT

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

@app.route("/")
def home():

    return "Groq AI Backend Running"


@app.route("/chat", methods=["POST"])
def chat():

    data = request.json

    message = data.get("message")
    mode = data.get("mode")

    system_prompt = ""

    # DIFFERENT AI MODES

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

    # GROQ AI RESPONSE

    completion = client.chat.completions.create(

        model="llama-3.3-70b-versatile",

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

    reply = completion.choices[0].message.content

    return jsonify({
        "response": reply
    })


if __name__ == "__main__":

    app.run(debug=True)