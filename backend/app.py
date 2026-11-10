import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq, AuthenticationError, RateLimitError, BadRequestError, APIConnectionError
from dotenv import load_dotenv

# Load .env file safely from backend directory or parent if present
env_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(env_path):
    load_dotenv(dotenv_path=env_path)
parent_env = os.path.join(os.path.dirname(__file__), '..', '.env')
if os.path.exists(parent_env):
    load_dotenv(dotenv_path=parent_env)
load_dotenv()

app = Flask(__name__)

# Production-ready CORS configuration allowing requests from Vercel and local dev
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"]
)

# Retrieve and sanitize API Key
raw_api_key = os.getenv("GROQ_API_KEY", "")
api_key = raw_api_key.strip().strip("'\"") if raw_api_key else ""

print("GROQ_API_KEY Configured:", bool(api_key))

# Initialize Groq client safely (does not crash app startup if key missing)
client = None
if api_key:
    try:
        client = Groq(api_key=api_key)
    except Exception as init_err:
        print(f"Warning: Failed to initialize Groq client: {init_err}", file=sys.stderr)


@app.route("/", methods=["GET"])
def home():
    """Root health probe."""
    return "Groq AI Backend Running", 200


@app.route("/test", methods=["GET"])
def test():
    """Simple status check for frontend ping."""
    return jsonify({
        "status": "ok",
        "service": "groq-ai-agent-backend"
    }), 200


@app.route("/health", methods=["GET"])
def health():
    """
    Comprehensive health check endpoint.
    Reports backend runtime status and Groq readiness without exposing secrets.
    """
    is_ready = bool(client and api_key)
    return jsonify({
        "status": "ok" if is_ready else "degraded",
        "service": "groq-ai-agent-backend",
        "groq_configured": is_ready,
        "default_model": os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b"),
        "version": "1.0.0"
    }), 200 if is_ready else 503


@app.route("/chat", methods=["POST", "OPTIONS"])
def chat():
    """
    Main AI Agent interaction endpoint supporting all 4 core engineering modules.
    Accepts: { "message": string, "mode": string }
    """
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    try:
        # Check Groq client availability
        if not client or not api_key:
            return jsonify({
                "success": False,
                "error": "GROQ_API_KEY is not configured on the backend server. Please verify your Render environment variables or backend .env.",
                "error_type": "missing_api_key"
            }), 503

        data = request.get_json(silent=True)
        if not data or not isinstance(data, dict):
            return jsonify({
                "success": False,
                "error": "Invalid JSON body received. Expected { message: string, mode: string }",
                "error_type": "invalid_request"
            }), 400

        message = data.get("message", "").strip()
        if not message:
            return jsonify({
                "success": False,
                "error": "Task prompt cannot be empty. Please provide instructions.",
                "error_type": "empty_prompt"
            }), 400

        mode = data.get("mode", "assistant").lower()

        # Highly specialized system prompts for each of the 4 engineering modules
        if mode == "generator":
            system_prompt = (
                "You are an elite Autonomous AI Software Engineer and Senior Full-Stack Architect.\n"
                "Your goal is to generate clean, modular, production-ready code with complete implementations.\n"
                "Guidelines:\n"
                "- Write comprehensive, runnable code. Avoid placeholders, 'TODO', or truncation.\n"
                "- Include appropriate markdown code fences with explicit language tags (e.g. ```python, ```typescript, ```dockerfile).\n"
                "- Suggest file paths above each code block (e.g., `src/auth/service.py`).\n"
                "- Implement proper error handling, input validation, and defensive coding.\n"
                "- Provide a concise architecture summary and execution instructions."
            )

        elif mode == "assistant":
            system_prompt = (
                "You are a Staff Software Engineer and Technical Advisor.\n"
                "Your goal is to answer technical questions, explain software engineering concepts, and guide architectural decisions.\n"
                "Guidelines:\n"
                "- Explain complex topics clearly with structured headings, bullet points, and concrete code examples.\n"
                "- Compare trade-offs between different approaches, libraries, and design patterns.\n"
                "- Keep responses technically rigorous, practical, and directly applicable to production systems."
            )

        elif mode == "debugger":
            system_prompt = (
                "You are a Principal Debugging Engineer and Root Cause Analysis specialist.\n"
                "Your goal is to diagnose errors, stack traces, race conditions, memory leaks, and broken code.\n"
                "Guidelines:\n"
                "1. Root Cause Analysis: Identify precisely why and where the failure occurs.\n"
                "2. Fixed Code: Provide the fully corrected code implementation with clear diffs or complete replacement blocks.\n"
                "3. Explanation: Explain what was wrong and how the fix resolves it.\n"
                "4. Prevention: Provide testing fixtures or safeguards to prevent regressions."
            )

        elif mode == "deploy":
            system_prompt = (
                "You are a Senior DevOps and Cloud Infrastructure SRE.\n"
                "Your goal is to provide production-grade deployment configurations, automation pipelines, and cloud setup guides.\n"
                "Guidelines:\n"
                "- Provide complete, multi-stage Dockerfiles with non-root security best practices.\n"
                "- Provide CI/CD workflow definitions (e.g., GitHub Actions, Render/Vercel deployment guides).\n"
                "- Include Docker Compose manifests, environment variable specifications, and health check configurations.\n"
                "- Give step-by-step instructions for zero-downtime production deployment."
            )

        elif mode == "settings":
            system_prompt = (
                "You are an AI Engineering Runtime Assistant.\n"
                "Help the user inspect configuration, select optimal LLM parameters, and diagnose system connectivity."
            )

        else:
            system_prompt = (
                "You are an Autonomous AI Software Engineer. Provide rigorous, production-quality engineering solutions."
            )

        # Resilient candidate model cascade (ordered by active availability & speed on Groq Cloud)
        candidate_models = [
            os.getenv("GROQ_MODEL"),
            "qwen/qwen3.8-27b",
            "openai/gpt-oss-120b",
            "openai/gpt-oss-20b",
            "llama-3.3-70b-versatile",
            "llama-3.1-8b-instant"
        ]
        # Filter duplicates and None/empty strings
        seen = set()
        unique_candidates = []
        for m in candidate_models:
            if m and m not in seen:
                seen.add(m)
                unique_candidates.append(m)

        completion = None
        last_error = None
        successful_model = None

        for model_id in unique_candidates:
            try:
                completion = client.chat.completions.create(
                    model=model_id,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": message}
                    ],
                    temperature=0.7,
                    max_tokens=2500,
                    timeout=60.0
                )
                if completion and completion.choices:
                    successful_model = model_id
                    break
            except (BadRequestError, RateLimitError) as specific_err:
                last_error = specific_err
                # If rate-limited or decommissioned model, try next candidate
                continue
            except Exception as candidate_err:
                last_error = candidate_err
                continue

        if not completion or not completion.choices:
            if last_error:
                raise last_error
            raise Exception("No candidate Groq models were able to process the request.")

        reply = completion.choices[0].message.content or ""

        return jsonify({
            "success": True,
            "response": reply,
            "model": successful_model
        }), 200

    except AuthenticationError as auth_err:
        return jsonify({
            "success": False,
            "error": "Authentication failed with Groq API. Please verify GROQ_API_KEY in backend settings.",
            "error_type": "auth_error",
            "details": str(auth_err)
        }), 401

    except RateLimitError as rate_err:
        return jsonify({
            "success": False,
            "error": "Groq API rate limit reached. Please wait a few seconds and try again.",
            "error_type": "rate_limit",
            "details": str(rate_err)
        }), 429

    except APIConnectionError as conn_err:
        return jsonify({
            "success": False,
            "error": "Failed to connect to Groq Cloud API. Please check internet connectivity.",
            "error_type": "connection_error",
            "details": str(conn_err)
        }), 502

    except Exception as e:
        import traceback
        traceback.print_exc()

        return jsonify({
            "success": False,
            "error": str(e),
            "error_type": "server_error"
        }), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )
