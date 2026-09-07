import os
from typing import Optional, List, Dict, Any
from database import db
from models.user import User
from models.prediction import Prediction
from repositories.base import BaseRepository

class SQLiteRepository(BaseRepository):
    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        user = User.query.filter_by(email=email).first()
        if not user:
            return None
        return {
            "user_id": user.user_id,
            "user_name": user.user_name,
            "name": user.name,
            "email": user.email,
            "password": user.password
        }

    def get_user_by_username(self, user_name: str) -> Optional[Dict[str, Any]]:
        user = User.query.filter_by(user_name=user_name).first()
        if not user:
            return None
        return {
            "user_id": user.user_id,
            "user_name": user.user_name,
            "name": user.name,
            "email": user.email,
            "password": user.password
        }

    def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        user = User.query.filter_by(user_id=user_id).first()
        if not user:
            return None
        return {
            "user_id": user.user_id,
            "user_name": user.user_name,
            "name": user.name,
            "email": user.email,
            "password": user.password
        }

    def create_user(self, user_name: str, name: str, email: str, password_hash: str) -> Dict[str, Any]:
        user = User(
            user_name=user_name,
            name=name,
            email=email,
            password=password_hash
        )
        db.session.add(user)
        db.session.commit()
        return {
            "user_id": user.user_id,
            "user_name": user.user_name,
            "name": user.name,
            "email": user.email
        }

    def create_prediction(self, user_id: int, image_path: str, prediction: str, confidence: float, top3: list, details: dict) -> Dict[str, Any]:
        record = Prediction(
            user_id=user_id,
            image_path=image_path,
            prediction=prediction,
            confidence=confidence,
            top3=top3,
            details=details
        )
        db.session.add(record)
        db.session.commit()
        return {
            "id": record.id,
            "user_id": record.user_id,
            "image_path": record.image_path,
            "prediction": record.prediction,
            "confidence": record.confidence,
            "top3": record.top3,
            "details": record.details,
            "created_at": record.created_at
        }

    def get_user_history(self, user_id: int) -> List[Dict[str, Any]]:
        predictions = Prediction.query.filter_by(user_id=user_id).order_by(Prediction.created_at.desc()).all()
        return [
            {
                "id": p.id,
                "prediction": p.prediction,
                "confidence": p.confidence,
                "image": f"/uploads/{os.path.basename(p.image_path)}",
                "created_at": p.created_at
            }
            for p in predictions
        ]

    def get_prediction_by_id(self, user_id: int, prediction_id: int) -> Optional[Dict[str, Any]]:
        p = Prediction.query.filter_by(id=prediction_id, user_id=user_id).first()
        if not p:
            return None
        return {
            "id": p.id,
            "prediction": p.prediction,
            "confidence": p.confidence,
            "image": f"/uploads/{os.path.basename(p.image_path)}",
            "top3": p.top3,
            "details": p.details,
            "created_at": p.created_at
        }
