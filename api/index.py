import sys
import os

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

from app import app

# Vercel Serverless Function entrypoint
app = app
