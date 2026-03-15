import os
import openai
import json

class AIService:
    def __init__(self):
        self.client = None

    def generate_and_categorize(self, idea: str):
        if not self.client:
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise ValueError("OpenAI API key is not configured in .env")
            self.client = openai.OpenAI(api_key=api_key)

        prompt_instruction = f"""
You are a prompt engineering assistant. Convert a user's simple idea into a well-structured AI prompt and assign the most appropriate category.
User's idea: "{idea}"
Expected output format is strict JSON ONLY without markdown wrapping:
{{
  "prompt": "<your structured prompt>",
  "category": "<one of: Coding, Writing, Marketing, Design, Research, Productivity, General>"
}}
If the category is unknown or unclear, use "General".
"""
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a prompt engineering assistant that outputs JSON."},
                    {"role": "user", "content": prompt_instruction}
                ],
                response_format={ "type": "json_object" }
            )
            
            text_response = response.choices[0].message.content
            text_response = text_response.strip()
            result = json.loads(text_response)
            
            # Validate output
            prompt_text = result.get("prompt", "")
            category = result.get("category", "General")
            
            allowed_categories = ["Coding", "Writing", "Marketing", "Design", "Research", "Productivity", "General"]
            if category not in allowed_categories:
                category = "General"
                
            return {
                "prompt": prompt_text,
                "category": category
            }
        except Exception as e:
            # Re-raise to be handled by the route
            raise RuntimeError(f"AI generation failed: {str(e)}")

ai_service_instance = AIService()
