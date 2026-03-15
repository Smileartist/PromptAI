from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.prompt import Prompt

delete_bp = Blueprint("delete_bp", __name__)

@delete_bp.route("/all-data", methods=["DELETE"])
@jwt_required()
def delete_all_data():
    current_user_email = get_jwt_identity()
    try:
        Prompt.delete_all_by_user(current_user_email)
        return jsonify({"status": "success", "message": "All data deleted successfully"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@delete_bp.route("/account", methods=["DELETE"])
@jwt_required()
def delete_account():
    current_user_email = get_jwt_identity()
    try:
        # 1. Delete all user prompts first
        Prompt.delete_all_by_user(current_user_email)
        # 2. Delete the user document
        User.delete(current_user_email)
        return jsonify({"status": "success", "message": "Account and all associated data deleted successfully"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
