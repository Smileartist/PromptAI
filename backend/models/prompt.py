from models.db import db
from datetime import datetime
from firebase_admin import firestore

class Prompt:
    def __init__(self, user_id, user_input, generated_prompt, category):
        self.user_id = user_id
        self.user_input = user_input
        self.generated_prompt = generated_prompt
        self.category = category
        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "user_input": self.user_input,
            "generated_prompt": self.generated_prompt,
            "category": self.category,
            "created_at": self.created_at.isoformat()
        }

    @staticmethod
    def create(user_id, user_input, generated_prompt, category):
        prompts_ref = db.collection("prompts")
        new_prompt_ref = prompts_ref.document()
        new_prompt_ref.set({
            "user_id": user_id,
            "user_input": user_input,
            "generated_prompt": generated_prompt,
            "category": category,
            "created_at": datetime.utcnow()
        })
        return Prompt(user_id, user_input, generated_prompt, category)

    @staticmethod
    def get_by_user_id(user_id, query=None):
        prompts_ref = db.collection("prompts")
        query_ref = prompts_ref.where("user_id", "==", user_id).order_by("created_at", direction=firestore.Query.DESCENDING)
        
        docs = query_ref.stream()
        prompts = []
        for doc in docs:
            data = doc.to_dict()
            prompt = Prompt(data["user_id"], data["user_input"], data["generated_prompt"], data["category"])
            prompt.created_at = datetime.fromisoformat(data["created_at"]) if isinstance(data["created_at"], str) else data["created_at"]
            prompts.append({"id": doc.id, **prompt.to_dict()})
            
        if query:
            q = query.lower()
            prompts = [p for p in prompts if 
                       q in p["user_input"].lower() or 
                       q in p["generated_prompt"].lower() or 
                       q in p["category"].lower()]

        return prompts

    @staticmethod
    def delete(prompt_id):
        db.collection("prompts").document(prompt_id).delete()
        return True

    @staticmethod
    def delete_all_by_user(user_id):
        prompts_ref = db.collection("prompts")
        docs = prompts_ref.where("user_id", "==", user_id).stream()
        
        batch = db.batch()
        count = 0
        for doc in docs:
            batch.delete(doc.reference)
            count += 1
            if count >= 500: # Firestore batch limit
                batch.commit()
                batch = db.batch()
                count = 0
        
        if count > 0:
            batch.commit()
        return True
