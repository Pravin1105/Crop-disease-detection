from flask import Blueprint, request, jsonify

from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)

from flask_jwt_extended import (
    create_access_token
)

from database import db
from models.user import User

auth_bp = Blueprint(
    "auth",
    __name__
)


# ---------------------------------------
# Register
# ---------------------------------------

@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:

        return jsonify({
            "error": "Missing required fields."
        }), 400

    existing = User.query.filter_by(email=email).first()

    if existing:
        return jsonify({"error": "Email already exists."}), 409

    user = User(
        user_name=username,
        name=username,
        email=email,
        password=generate_password_hash(password, method="pbkdf2:sha256")
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Registration successful."}), 201


# ---------------------------------------
# Login
# ---------------------------------------

@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if user is None or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid credentials."}), 401

    token = create_access_token(identity=str(user.user_id))

    return jsonify({
        "token": token,
        "username": user.user_name,
        "user_id": user.user_id,
        "user_name": user.user_name,
        "name": user.name,
        "email": user.email
    })
