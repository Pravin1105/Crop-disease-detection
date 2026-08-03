from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

import os
import uuid
import traceback

from database import db
from model_loader import predict_image
from data.disease_info import DISEASE_INFO
from models.prediction import Prediction

predict_bp = Blueprint("predict", __name__)

# ---------------------------------------------------------
# Upload Folder
# ---------------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_FOLDER = os.path.abspath(
    os.path.join(BASE_DIR, "..", "uploads")
)

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ---------------------------------------------------------
# Predict Route
# ---------------------------------------------------------

@predict_bp.route("/predict", methods=["POST"])
@jwt_required()
def predict():

    try:

        user_id = int(get_jwt_identity())

        # ---------------------------------------------
        # Validate Image
        # ---------------------------------------------

        if "image" not in request.files:

            return jsonify({

                "error": "No image uploaded."

            }), 400

        image = request.files["image"]

        if image.filename == "":

            return jsonify({

                "error": "No image selected."

            }), 400

        # ---------------------------------------------
        # Save Image
        # ---------------------------------------------

        filename = f"{uuid.uuid4()}_{image.filename}"

        filepath = os.path.join(
            UPLOAD_FOLDER,
            filename
        )

        image.save(filepath)

        print(f"[INFO] Image saved : {filepath}")

        # ---------------------------------------------
        # Pre-classifier: verify it's a leaf/plant before calling the model
        # ---------------------------------------------

        from preclassifier import is_leaf_or_plant

        is_plant = is_leaf_or_plant(filepath)

        if not is_plant:
            print("[INFO] Pre-classifier: No leaf/plant detected.")

            # Don't save prediction to DB. Return a user-friendly response with
            # an empty disease details payload and no top3 predictions.
            return jsonify({
                "id": None,
                "prediction": "No Leaf/ Plant detected!! Try another image",
                "confidence": 0.0,
                "top3": [],
                "details": None
            }), 200

        # ---------------------------------------------
        # Model Prediction
        # ---------------------------------------------

        predictions = predict_image(filepath)

        print("[INFO] Prediction completed.")

        best_prediction = predictions[0]["class"]
        best_confidence = predictions[0]["confidence"]

        # ---------------------------------------------
        # Disease Information
        # ---------------------------------------------

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

        # ---------------------------------------------
        # Save Prediction
        # ---------------------------------------------

        record = Prediction(

            user_id=user_id,

            image_path=filepath,

            prediction=best_prediction,

            confidence=best_confidence,

            top3=predictions,

            details=details

        )

        db.session.add(record)
        db.session.commit()

        print("[INFO] Prediction stored in database.")

        # ---------------------------------------------
        # Response
        # ---------------------------------------------

        return jsonify({

            "id": record.id,

            "prediction": best_prediction,

            "confidence": best_confidence,

            "top3": predictions,

            "details": details

        }), 200

    except Exception as e:

        db.session.rollback()

        traceback.print_exc()

        return jsonify({

            "error": str(e)

        }), 500