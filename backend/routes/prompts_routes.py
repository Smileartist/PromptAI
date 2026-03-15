from flask import Blueprint, request, jsonify
from models.prompt import Prompt
from flask_jwt_extended import jwt_required, get_jwt_identity

prompts_bp = Blueprint("prompts_bp", __name__)

@prompts_bp.route("/", methods=["GET"])
@jwt_required()
def get_prompts():
    current_user_email = get_jwt_identity()
    query = request.args.get("query")
    prompts = Prompt.get_by_user_id(current_user_email, query)
    return jsonify({"status": "success", "data": prompts}), 200

@prompts_bp.route("/<string:prompt_id>", methods=["DELETE"])
@jwt_required()
def delete_prompt(prompt_id):
    current_user_email = get_jwt_identity()
    # Optional: Add logic to ensure the user owns the prompt before deleting
    # For now, we trust the frontend to only send valid IDs for the current user
    Prompt.delete(prompt_id)
    return jsonify({"status": "success", "message": "Prompt deleted"}), 200
