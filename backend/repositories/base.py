from abc import ABC, abstractmethod
from typing import Optional, List, Dict, Any

class BaseRepository(ABC):
    @abstractmethod
    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_user_by_username(self, user_name: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def create_user(self, user_name: str, name: str, email: str, password_hash: str) -> Dict[str, Any]:
        pass

    @abstractmethod
    def create_prediction(self, user_id: int, image_path: str, prediction: str, confidence: float, top3: list, details: dict) -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_user_history(self, user_id: int) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_prediction_by_id(self, user_id: int, prediction_id: int) -> Optional[Dict[str, Any]]:
        pass
