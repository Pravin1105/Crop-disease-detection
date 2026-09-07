from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from repositories import get_repository

history_bp = Blueprint("history", __name__)

@history_bp.route("/history", methods=["GET"])
@jwt_required()
def get_history():
    user_id = int(get_jwt_identity())
    repo = get_repository()
    history = repo.get_user_history(user_id)
    return jsonify(history)

@history_bp.route("/history/<int:id>", methods=["GET"])
@jwt_required()
def get_prediction(id):
    user_id = int(get_jwt_identity())
    repo = get_repository()
    prediction = repo.get_prediction_by_id(user_id, id)
    if not prediction:
        return jsonify({"error": "Prediction not found."}), 404
    return jsonify(prediction)