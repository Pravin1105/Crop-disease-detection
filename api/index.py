import sys
import os
import traceback

# Add backend directory to sys.path so app.py and blueprints can be imported
base_dir = os.path.dirname(__file__)
candidates = [
    os.path.join(base_dir, "..", "backend"),
    os.path.join(base_dir, "backend"),
    os.path.join(os.getcwd(), "backend")
]
for path in candidates:
    abs_path = os.path.abspath(path)
    if os.path.isdir(abs_path) and abs_path not in sys.path:
        sys.path.insert(0, abs_path)

try:
    from app import app
except Exception as e:
    err_tb = traceback.format_exc()
    from flask import Flask, jsonify
    app = Flask(__name__)
    
    @app.route("/", defaults={"path": ""}, methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    @app.route("/<path:path>", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    def catch_all(path):
        return jsonify({
            "status": "error",
            "message": "Backend initialization failed on Vercel",
            "error": str(e),
            "traceback": err_tb.splitlines(),
            "sys_path": sys.path,
            "cwd": os.getcwd()
        }), 500

# Vercel Serverless Function entrypoint
app = app
