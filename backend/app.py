from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load env variables BEFORE importing routes that initialize services
load_dotenv(override=True)

# Initialize Firebase Admin SDK before other imports
from models.db import db

from routes.health_routes import health_bp
from routes.prompts_routes import prompts_bp
from routes.generate_routes import generate_bp
from routes.auth_routes import auth_bp
from routes.delete_routes import delete_bp
from flask_jwt_extended import JWTManager

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Configure JWT
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-fallback-key")

    JWTManager(app)

    # Register Blueprints
    app.register_blueprint(health_bp, url_prefix="/health")
    app.register_blueprint(prompts_bp, url_prefix="/prompts")
    app.register_blueprint(generate_bp, url_prefix="/generate")
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(delete_bp, url_prefix="/delete")

    return app

app = create_app()

if __name__ == "__main__":
    # With Firebase, we don't need db.create_all()
    app.run(debug=True, port=int(os.getenv("PORT", 5000)))
