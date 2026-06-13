from services.openai_service import generate_response


class SoftwareEngineerAgent:

    def process_request(self, message):

        response = generate_response(message)

        return response