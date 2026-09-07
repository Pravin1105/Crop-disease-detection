from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

from repositories import get_repository

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}

    user_name = data.get("user_name") or data.get("username")
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not user_name or not email or not password:
        return jsonify({"error": "Username, email, and password are required."}), 400

    user_name = user_name.strip()
    email = email.strip().lower()
    name = name.strip() if name and name.strip() else user_name

    repo = get_repository()

    if repo.get_user_by_email(email):
        return jsonify({"error": "Email address already registered."}), 409

    if repo.get_user_by_username(user_name):
        return jsonify({"error": "Username is already taken."}), 409

    password_hash = generate_password_hash(password, method="pbkdf2:sha256")
    user = repo.create_user(
        user_name=user_name,
        name=name,
        email=email,
        password_hash=password_hash
    )

    return jsonify({
        "message": "Registration successful.",
        "user": {
            "user_id": user["user_id"],
            "user_name": user["user_name"],
            "name": user["name"],
            "email": user["email"]
        }
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    repo = get_repository()
    user = repo.get_user_by_email(email)

    if user is None or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials."}), 401

    token = create_access_token(identity=str(user["user_id"]))

    return jsonify({
        "token": token,
        "username": user["user_name"],
        "user_id": user["user_id"],
        "user_name": user["user_name"],
        "name": user["name"],
        "email": user["email"]
    })