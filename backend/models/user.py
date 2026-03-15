from models.db import db
from datetime import datetime

class User:
    def __init__(self, username, email, password_hash):
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
            "username": self.username,
            "email": self.email,
            "password_hash": self.password_hash,
            "created_at": self.created_at.isoformat()
        }

    @staticmethod
    def create(username, email, password_hash):
        user_ref = db.collection("users").document(email)
        user_ref.set({
            "username": username,
            "email": email,
            "password_hash": password_hash,
            "created_at": datetime.utcnow()
        })
        return User(username, email, password_hash)

    @staticmethod
    def find_by_email(email):
        user_ref = db.collection("users").document(email).get()
        if user_ref.exists:
            data = user_ref.to_dict()
            user = User(data["username"], data["email"], data["password_hash"])
            user.created_at = datetime.fromisoformat(data["created_at"]) if isinstance(data["created_at"], str) else data["created_at"]
            return user
        return None

    @staticmethod
    def find_by_username(username):
        users_ref = db.collection("users")
        query = users_ref.where("username", "==", username).limit(1).get()
        if query:
            data = query[0].to_dict()
            user = User(data["username"], data["email"], data["password_hash"])
            user.created_at = datetime.fromisoformat(data["created_at"]) if isinstance(data["created_at"], str) else data["created_at"]
            return user
        return None
