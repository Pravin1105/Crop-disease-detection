# Crop Disease Detection --- Architecture

## 1. Architecture Versions

### V1

```text
React/Vite
    |
    | HTTP/REST
    v
Flask REST API
    | \
    |  \--> PyTorch / ConvNeXtV2
    |
    +----> SQLite
```

### V2

```text
React/Vite
    |
    | HTTP/REST
    v
Flask REST API
    | \
    |  \--> PyTorch / ConvNeXtV2
    |
    +----> MongoDB
```

The frontend contract should remain stable between V1 and V2 wherever practical. The database access layer changes; business behavior should not.

## 2. V2 Data Flow

### Prediction Flow

```text
User
  |
  v
React upload form
  |
  | multipart/form-data
  v
Flask prediction endpoint
  |
  +--> validate JWT
  |
  +--> validate image
  |
  +--> preprocess image
  |
  +--> ConvNeXtV2 inference
  |
  +--> top-k result construction
  |
  +--> persist prediction in MongoDB
  |
  v
JSON response
  |
  v
React result page
```

### History Flow

```text
React history page
  |
  v
GET /api/predictions
  |
  v
JWT validation
  |
  v
MongoDB predictions collection
  |
  | filter: authenticated user
  | sort: timestamp descending
  v
Flask JSON response
  |
  v
React history UI
```

### Disease Information Flow

```text
Prediction result
      |
      v
GET /api/diseases/<identifier>
      |
      v
MongoDB diseases collection
      |
      v
Disease information
```

## 3. Repository Structure

```text
crop-disease-detection/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   └── assets/
│   ├── public/
│   ├── package.json
│   └── vite.config.*
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── inference/
│   │   ├── database/
│   │   │   ├── sqlite/
│   │   │   └── mongodb/
│   │   ├── models/
│   │   ├── services/
│   │   ├── schemas/
│   │   └── utils/
│   ├── tests/
│   ├── requirements.txt
│   └── run.py
│
├── model/
│   ├── weights/
│   └── labels/
│
├── data/
│   └── disease_information/
│
├── docs/
│   ├── prd.md
│   ├── architecture.md
│   ├── rules.md
│   ├── phases.md
│   └── design.md
│
├── .env.example
├── .gitignore
└── README.md
```

## 4. Technology Stack

### Frontend
- React
- Vite
- JavaScript
- HTML
- CSS

### Backend
- Python
- Flask
- REST APIs
- JWT authentication

### Machine Learning
- PyTorch
- ConvNeXtV2
- Existing preprocessing/inference pipeline

### Persistence
- V1: SQLite
- V2: MongoDB
- V2 Python driver: PyMongo

## 5. Database Responsibilities
- `users`: Stores application identity and profile fields.
- `predictions`: Stores user-linked inference metadata (user identifier, image metadata, predicted disease, confidence, top predictions, model version, timestamp).
- `diseases`: Stores disease information keyed by a stable disease identifier.

## 6. Database Abstraction
Use a persistence interface/service boundary:
```text
API/service layer
       |
       v
repository/database interface
       |
   +---+---+
   |       |
SQLite   MongoDB
```
