from services.openai_service import llm

def generate_code(prompt):

    response = llm.chat_completion(
        model="deepseek-ai/deepseek-coder-6.7b-instruct",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        max_tokens=500
    )

    return response.choices[0].message.content