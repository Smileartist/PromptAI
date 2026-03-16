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
You are an expert Prompt Engineer. Your task is to transform a user's simple, raw idea into a highly descriptive, contextual, and masterfully structured AI prompt that can be used to get the exact desired output from any advanced AI model.

User's raw idea: "{idea}"

To engineer the perfect prompt, you MUST include and expand upon:
1.  **Expert Persona/Role**: Assign a highly specific and seasoned identity (e.g., "Senior Copywriter", "Lead DevOps Engineer").
2.  **Detailed Context**: Explain the background, the "why" behind the request, and the target audience or system.
3.  **Clear Objectives**: Outline precise deliverables and goals.
4.  **Operational Guidelines & Constraints**: Absolute rules for tone, style, formatting (e.g., Markdown, JSON), and what to avoid.
5.  **Output Structure**: Specify exactly how the response should be formatted for maximum readability (headers, lists, structure).

Expected output format must be STRICT JSON ONLY (without markdown code blocks):
{{
  "prompt": "<your fully engineered, highly detailed and descriptive prompt>",
  "category": "<one of: Coding, Writing, Marketing, Design, Research, Productivity, General>"
}}
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
