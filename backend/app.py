import os
from datetime import timedelta

from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from sqlalchemy import inspect

from database import db
from models.user import User
from models.prediction import Prediction

from routes.auth import auth_bp
from routes.predict import predict_bp
from routes.history import history_bp
from routes.profile import profile_bp

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)

load_dotenv(os.path.join(PROJECT_ROOT, ".env"))
load_dotenv(os.path.join(BASE_DIR, ".env"), override=True)

app = Flask(__name__)

# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "change_this_to_a_long_random_secret")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)
jwt = JWTManager(app)

import shutil

# Database Configuration
IS_VERCEL = os.getenv("VERCEL") is not None
if IS_VERCEL:
    DB_PATH = "/tmp/prediction.db"
    bundled_db = os.path.join(BASE_DIR, "instance", "prediction.db")
    if not os.path.exists(DB_PATH) and os.path.exists(bundled_db):
        try:
            shutil.copy2(bundled_db, DB_PATH)
            print("[INFO] Copied seed database to /tmp/prediction.db")
        except Exception as e:
            print("[WARN] Could not copy seed DB:", e)
    UPLOAD_FOLDER = "/tmp/uploads"
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
else:
    INSTANCE_DIR = os.path.join(BASE_DIR, "instance")
    os.makedirs(INSTANCE_DIR, exist_ok=True)
    DB_PATH = os.path.join(INSTANCE_DIR, "prediction.db")
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Extensions & CORS
cors_origins = os.getenv("CORS_ORIGINS")
origins_list = [origin.strip() for origin in cors_origins.split(",") if origin.strip()] if cors_origins else "*"
CORS(
    app,
    resources={r"/*": {"origins": origins_list}},
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)
db.init_app(app)

# JWT Error Handlers
@jwt.invalid_token_loader
def invalid_token_callback(error):
    print("[JWT ERROR] Invalid Token:", error)
    return {"error": error}, 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    print("[JWT ERROR] Missing Token:", error)
    return {"error": error}, 401

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    print("[JWT ERROR] Token Expired")
    return {"error": "Token expired"}, 401

@jwt.needs_fresh_token_loader
def needs_fresh_callback(jwt_header, jwt_payload):
    print("[JWT ERROR] Fresh Token Required")
    return {"error": "Fresh token required"}, 401

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(predict_bp)
app.register_blueprint(history_bp)
app.register_blueprint(profile_bp)

# Also register under /api prefix for API consistency
app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(predict_bp, url_prefix="/api")
app.register_blueprint(history_bp, url_prefix="/api")
app.register_blueprint(profile_bp, url_prefix="/api")

with app.app_context():
    db.create_all()
    # Ensure default user exists (essential for ephemeral /tmp SQLite on Vercel)
    try:
        if not User.query.filter_by(email="pravin@gmail.com").first():
            seed_user = User(
                user_name="pravin",
                name="pravin",
                email="pravin@gmail.com",
                password="pbkdf2:sha256:1000000$RjKs7SOgcfqBgJk4$2c84b232ddcdb7498ac64e75a92b315db31078fb3b26ca4dda7a89a61d041234"
            )
            db.session.add(seed_user)
            db.session.commit()
            print("[INFO] Seeded default user pravin@gmail.com successfully")
    except Exception as e:
        print("[WARN] Could not seed default user:", e)

# Static & Base Routes
@app.route("/")
@app.route("/api/health")
def home():
    return {
        "status": "running",
        "message": "Crop Disease Detection API",
        "profile_route_loaded": True
    }


@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

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
        port=int(os.getenv("PORT", "8000")),
        debug=True
    )
