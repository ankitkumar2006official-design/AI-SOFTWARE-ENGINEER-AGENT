def clean_text(text):

    return text.strip()


def format_response(response):

    return {
        "success": True,
        "response": response
    }