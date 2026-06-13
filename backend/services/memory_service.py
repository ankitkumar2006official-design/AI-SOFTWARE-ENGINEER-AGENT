chat_memory = []


def save_message(role, message):
    chat_memory.append({
        "role": role,
        "message": message
    })


def get_memory():
    return chat_memory