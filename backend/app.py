import os
from datetime import timedelta

from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from sqlalchemy import inspect

from database import db

# Models
from models.user import User
from models.prediction import Prediction

# Blueprints
from routes.auth_new import auth_bp
from routes.predict import predict_bp
from routes.history import history_bp
from routes.profile import profile_bp

# ---------------------------------------------------------
# App
# ---------------------------------------------------------

app = Flask(__name__)

# ---------------------------------------------------------
# JWT Configuration
# ---------------------------------------------------------

app.config["JWT_SECRET_KEY"] = "change_this_to_a_long_random_secret"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)

jwt = JWTManager(app)

# ---------------------------------------------------------
# Database Configuration
# ---------------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

INSTANCE_DIR = os.path.join(BASE_DIR, "instance")
os.makedirs(INSTANCE_DIR, exist_ok=True)

DB_PATH = os.path.join(INSTANCE_DIR, "prediction.db")

app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_PATH}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# ---------------------------------------------------------
# Extensions
# ---------------------------------------------------------

CORS(app)

db.init_app(app)

# ---------------------------------------------------------
# JWT Error Handlers
# ---------------------------------------------------------

@jwt.invalid_token_loader
def invalid_token_callback(error):
    print("INVALID TOKEN:", error)
    return {"error": error}, 401


@jwt.unauthorized_loader
def missing_token_callback(error):
    print("MISSING TOKEN:", error)
    return {"error": error}, 401


@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    print("TOKEN EXPIRED")
    return {"error": "Token expired"}, 401


@jwt.needs_fresh_token_loader
def needs_fresh_callback(jwt_header, jwt_payload):
    print("FRESH TOKEN REQUIRED")
    return {"error": "Fresh token required"}, 401

# ---------------------------------------------------------
# Register Blueprints
# ---------------------------------------------------------

app.register_blueprint(auth_bp)
app.register_blueprint(predict_bp)
app.register_blueprint(history_bp)
app.register_blueprint(profile_bp)

# ---------------------------------------------------------
# Routes
# ---------------------------------------------------------

@app.route("/")
def home():
    return {
        "status": "running",
        "message": "Crop Disease Detection API",
        "profile_route_loaded": True
    }


UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")


@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(
        UPLOAD_FOLDER,
        filename
    )

# ---------------------------------------------------------
# Main
# ---------------------------------------------------------

if __name__ == "__main__":

    with app.app_context():

        print("=" * 60)
        print("Database Path :", DB_PATH)

        db.create_all()

        inspector = inspect(db.engine)

        print("Tables :", inspector.get_table_names())

        print("\nRegistered Routes")
        print("-" * 60)

        for rule in app.url_map.iter_rules():
            print(f"{rule.rule:30} -> {rule.endpoint}")

        print("-" * 60)

    app.run(
        host="0.0.0.0",
        port=8000,
        debug=True
    )