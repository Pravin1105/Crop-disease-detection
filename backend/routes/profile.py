from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from repositories import get_repository

profile_bp = Blueprint("profile", __name__)

@profile_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    repo = get_repository()
    user = repo.get_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    return jsonify({
        "user_id": user["user_id"],
        "user_name": user["user_name"],
        "name": user["name"],
        "email": user["email"]
    })