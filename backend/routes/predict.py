import os
import uuid
import traceback
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from model_loader import predict_image
from preclassifier import is_leaf_or_plant
from data.disease_info import DISEASE_INFO
from repositories import get_repository

predict_bp = Blueprint("predict", __name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IS_VERCEL = os.getenv("VERCEL") is not None
UPLOAD_FOLDER = "/tmp/uploads" if IS_VERCEL else os.path.abspath(os.path.join(BASE_DIR, "..", "uploads"))
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@predict_bp.route("/predict", methods=["POST"])
@jwt_required()
def predict():
    try:
        user_id = int(get_jwt_identity())

        if "image" not in request.files:
            return jsonify({"error": "No image uploaded."}), 400

        image = request.files["image"]
        if image.filename == "":
            return jsonify({"error": "No image selected."}), 400

        filename = f"{uuid.uuid4()}_{image.filename}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        image.save(filepath)
        print(f"[INFO] Image saved: {filepath}")

        if not is_leaf_or_plant(filepath):
            print("[INFO] Pre-classifier: No leaf/plant detected.")
            return jsonify({
                "id": None,
                "prediction": "No Leaf/ Plant detected!! Try another image",
                "confidence": 0.0,
                "top3": [],
                "details": None
            }), 200

        predictions = predict_image(filepath)
        print("[INFO] Prediction completed.")

        best_prediction = predictions[0]["class"]
        best_confidence = predictions[0]["confidence"]

        details = DISEASE_INFO.get(
            best_prediction,
            {
                "healthy": False,
                "description": "Information unavailable.",
                "symptoms": [],
                "causes": [],
                "treatment": [],
                "prevention": []
            }
        )

        repo = get_repository()
        record = repo.create_prediction(
            user_id=user_id,
            image_path=filepath,
            prediction=best_prediction,
            confidence=best_confidence,
            top3=predictions,
            details=details
        )
        print("[INFO] Prediction stored via repository abstraction.")

        return jsonify({
            "id": record["id"],
            "prediction": best_prediction,
            "confidence": best_confidence,
            "top3": predictions,
            "details": details
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500