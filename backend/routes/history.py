import os
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models.prediction import Prediction

history_bp = Blueprint(
    "history",
    __name__
)


@history_bp.route("/history", methods=["GET"])
@jwt_required()
def get_history():

    user_id = int(get_jwt_identity())

    predictions = Prediction.query.filter_by(
        user_id=user_id
    ).order_by(
        Prediction.created_at.desc()
    ).all()

    history = []

    for p in predictions:

        history.append({

            "id": p.id,

            "prediction": p.prediction,

            "confidence": p.confidence,

            "image": "/uploads/" + os.path.basename(p.image_path),

            "created_at": p.created_at

        })

    return jsonify(history)


@history_bp.route("/history/<int:id>", methods=["GET"])
@jwt_required()
def get_prediction(id):

    user_id = int(get_jwt_identity())

    prediction = Prediction.query.filter_by(
        id=id,
        user_id=user_id
    ).first_or_404()

    return jsonify({

        "id": prediction.id,

        "prediction": prediction.prediction,

        "confidence": prediction.confidence,

        "image": "/uploads/" + os.path.basename(prediction.image_path),

        "top3": prediction.top3,

        "details": prediction.details,

        "created_at": prediction.created_at

    })