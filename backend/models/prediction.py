from database import db
from datetime import datetime


class Prediction(db.Model):

    __tablename__ = "predictions"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.user_id"),
        nullable=False
    )

    user = db.relationship(
        "User",
        back_populates="predictions"
    )

    image_path = db.Column(
        db.String(255),
        nullable=False
    )

    prediction = db.Column(
        db.String(255),
        nullable=False
    )

    confidence = db.Column(
        db.Float,
        nullable=False
    )

    top3 = db.Column(
        db.JSON,
        nullable=False
    )

    details = db.Column(
        db.JSON,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

