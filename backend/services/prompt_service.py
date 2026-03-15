from models.db import db
from models.prompt import Prompt

class PromptService:
    @staticmethod
    def create_prompt(user_input: str, generated_prompt: str, category: str, user_id: int = None):
        try:
            new_prompt = Prompt(
                user_input=user_input,
                generated_prompt=generated_prompt,
                category=category,
                user_id=user_id
            )
            db.session.add(new_prompt)
            db.session.commit()
            return new_prompt
        except Exception as e:
            db.session.rollback()
            raise RuntimeError(f"Database error while saving prompt: {str(e)}")

    @staticmethod
    def get_all_prompts(search_query: str = None, user_id: int = None):
        try:
            query = Prompt.query
            
            if user_id:
                query = query.filter_by(user_id=user_id)
            else:
                # To prevent exposing everyone's prompts when not authenticated, 
                # we only return prompts where user_id is None (or just return empty, but offline handles itself)
                query = query.filter_by(user_id=None)
                
            if search_query:
                # Search across multiple text fields case-insensitively
                search_term = f"%{search_query}%"
                query = query.filter(
                    Prompt.user_input.ilike(search_term) | 
                    Prompt.generated_prompt.ilike(search_term) |
                    Prompt.category.ilike(search_term)
                )
                
            prompts = query.order_by(Prompt.created_at.desc()).all()
            return prompts
        except Exception as e:
            raise RuntimeError(f"Database error while fetching prompts: {str(e)}")

    @staticmethod
    def delete_prompt(prompt_id: int):
        try:
            prompt = Prompt.query.get(prompt_id)
            if not prompt:
                return False
                
            db.session.delete(prompt)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            raise RuntimeError(f"Database error while deleting prompt: {str(e)}")
