from flask import Blueprint, request, jsonify
from models.user import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import datetime

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"status": "error", "message": "Missing required fields"}), 400

    if User.find_by_email(email):
        return jsonify({"status": "error", "message": "User with that email already exists"}), 409
    
    if User.find_by_username(username):
        return jsonify({"status": "error", "message": "User with that username already exists"}), 409

    hashed_password = generate_password_hash(password)
    user = User.create(username, email, hashed_password)
    return jsonify({"status": "success", "message": "User registered successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"status": "error", "message": "Missing required fields"}), 400

    user = User.find_by_email(email)
    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=user.email, expires_delta=datetime.timedelta(days=7))
        return jsonify({"status": "success", "message": "Login successful", "token": access_token}), 200
    else:
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    current_user_email = get_jwt_identity()
    user = User.find_by_email(current_user_email)
    if user:
        return jsonify({"status": "success", "data": {"username": user.username, "email": user.email}}), 200
    return jsonify({"status": "error", "message": "User not found"}), 404
