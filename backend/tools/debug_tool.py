from services.openai_service import llm


def debug_code(error_message):
    prompt = f"Fix this error:\n{error_message}"

    response = llm.invoke(prompt)

    return response.content