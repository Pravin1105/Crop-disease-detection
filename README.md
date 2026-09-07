# Crop-Disease-Detection (v1.2)

AI-assisted Crop Disease Detection and Diagnostic System built with Flask, PyTorch (ConvNeXtV2), React (Vite), Tailwind CSS, SQLite, and MongoDB.

---

## Features & Architecture (v1.2)

- **AI Diagnostic Inference Engine**: ConvNeXtV2 model pre-trained to detect and classify 29 crop disease and healthy plant classes with heuristic leaf pre-classification.
- **Modular Database Abstraction**: Base Repository interface supporting both **SQLite (V1)** and **MongoDB (V2)** via `DATABASE_TYPE` environment configuration.
- **Agricultural Diagnostic UI Design System**:
  - Dark mode (`#07100B` background, `#0D1710` surface, `#39D353` green accent) and Light mode (`#F7FAF7`, `#168A35`).
  - Persistent Dark/Light mode theme switcher.
  - Multi-language support (i18n) for Assamese, Bengali, English, Spanish, Hindi, Marathi, Odia, Punjabi, and Tamil.
- **CI/CD Pipeline**: GitHub Actions automated workflow for backend Python verification and frontend Vite build verification.

---

## Quick Start

### 1. Backend Server Setup
```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Run Flask backend server (default SQLite port 8000)
python3 backend/app.py
```

### 2. Frontend Development Server
```bash
# Install Node modules
npm install

# Start Vite dev server (port 5173)
npm run dev
```

---

## Environment Variables (.env)

```env
PORT=8000
JWT_SECRET_KEY=your_jwt_secret_key
DATABASE_TYPE=sqlite # options: sqlite | mongodb
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=crop_disease_db
MODEL_PATH=best_convnextv2.pth
```
