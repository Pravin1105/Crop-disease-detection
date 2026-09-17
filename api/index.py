import sys
import os

# Add backend directory to sys.path so app.py and blueprints can be imported
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from app import app

# Vercel Serverless Function entrypoint
app = app
