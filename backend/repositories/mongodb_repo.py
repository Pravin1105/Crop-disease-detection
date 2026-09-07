import os
from datetime import datetime
from typing import Optional, List, Dict, Any
from pymongo import MongoClient, DESCENDING
from repositories.base import BaseRepository

class MongoDBRepository(BaseRepository):
    def __init__(self):
        uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
        db_name = os.getenv("MONGODB_DB", "crop_disease_db")
        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.users = self.db["users"]
        self.predictions = self.db["predictions"]
        self.counters = self.db["counters"]

    def _get_next_sequence(self, name: str) -> int:
        seq_doc = self.counters.find_one_and_update(
            {"_id": name},
            {"$inc": {"seq": 1}},
            upsert=True,
            return_document=True
        )
        return seq_doc["seq"]

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        user = self.users.find_one({"email": email})
        if not user:
            return None
        return {
            "user_id": user["user_id"],
            "user_name": user["user_name"],
            "name": user.get("name"),
            "email": user["email"],
            "password": user["password"]
        }

    def get_user_by_username(self, user_name: str) -> Optional[Dict[str, Any]]:
        user = self.users.find_one({"user_name": user_name})
        if not user:
            return None
        return {
            "user_id": user["user_id"],
            "user_name": user["user_name"],
            "name": user.get("name"),
            "email": user["email"],
            "password": user["password"]
        }

    def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        user = self.users.find_one({"user_id": user_id})
        if not user:
            return None
        return {
            "user_id": user["user_id"],
            "user_name": user["user_name"],
            "name": user.get("name"),
            "email": user["email"],
            "password": user["password"]
        }

    def create_user(self, user_name: str, name: str, email: str, password_hash: str) -> Dict[str, Any]:
        user_id = self._get_next_sequence("user_id")
        user_doc = {
            "user_id": user_id,
            "user_name": user_name,
            "name": name,
            "email": email,
            "password": password_hash,
            "created_at": datetime.utcnow()
        }
        self.users.insert_one(user_doc)
        return {
            "user_id": user_id,
            "user_name": user_name,
            "name": name,
            "email": email
        }

    def create_prediction(self, user_id: int, image_path: str, prediction: str, confidence: float, top3: list, details: dict) -> Dict[str, Any]:
        prediction_id = self._get_next_sequence("prediction_id")
        now = datetime.utcnow()
        doc = {
            "id": prediction_id,
            "user_id": user_id,
            "image_path": image_path,
            "prediction": prediction,
            "confidence": confidence,
            "top3": top3,
            "details": details,
            "created_at": now
        }
        self.predictions.insert_one(doc)
        return {
            "id": prediction_id,
            "user_id": user_id,
            "image_path": image_path,
            "prediction": prediction,
            "confidence": confidence,
            "top3": top3,
            "details": details,
            "created_at": now
        }

    def get_user_history(self, user_id: int) -> List[Dict[str, Any]]:
        cursor = self.predictions.find({"user_id": user_id}).sort("created_at", DESCENDING)
        return [
            {
                "id": p["id"],
                "prediction": p["prediction"],
                "confidence": p["confidence"],
                "image": f"/uploads/{os.path.basename(p['image_path'])}",
                "created_at": p["created_at"]
            }
            for p in cursor
        ]

    def get_prediction_by_id(self, user_id: int, prediction_id: int) -> Optional[Dict[str, Any]]:
        p = self.predictions.find_one({"id": prediction_id, "user_id": user_id})
        if not p:
            return None
        return {
            "id": p["id"],
            "prediction": p["prediction"],
            "confidence": p["confidence"],
            "image": f"/uploads/{os.path.basename(p['image_path'])}",
            "top3": p["top3"],
            "details": p["details"],
            "created_at": p["created_at"]
        }
