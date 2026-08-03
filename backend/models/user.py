# from database import db

# class User(db.Model):

#     __tablename__ = "users"

#     id = db.Column(
#         db.Integer,
#         primary_key=True
#     )

#     username = db.Column(
#         db.String(100),
#         nullable=False
#     )

#     email = db.Column(
#         db.String(150),
#         unique=True,
#         nullable=False
#     )

#     password = db.Column(
#         db.String(255),
#         nullable=False
#     )

#     predictions = db.relationship(
#         "Prediction",
#         backref="user",
#         lazy=True,
#         cascade="all, delete-orphan"
#     )

from database import db

class User(db.Model):

    __tablename__ = "users"

    # Primary key column renamed to user_id to match requested schema
    user_id = db.Column(db.Integer, primary_key=True)

    # username stored as user_name
    user_name = db.Column(db.String(100), nullable=False)

    # Full name (display name)
    name = db.Column(db.String(100), nullable=True)

    email = db.Column(db.String(100), unique=True, nullable=False)

    password = db.Column(db.String(255), nullable=False)

    predictions = db.relationship(
        "Prediction",
        back_populates="user",
        cascade="all, delete-orphan"
    )