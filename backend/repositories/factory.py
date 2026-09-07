import os
from repositories.base import BaseRepository

_repo_instance = None

def get_repository() -> BaseRepository:
    global _repo_instance
    if _repo_instance is not None:
        return _repo_instance

    db_type = os.getenv("DATABASE_TYPE", "sqlite").lower()
    if db_type == "mongodb":
        from repositories.mongodb_repo import MongoDBRepository
        _repo_instance = MongoDBRepository()
    else:
        from repositories.sqlite_repo import SQLiteRepository
        _repo_instance = SQLiteRepository()

    return _repo_instance
