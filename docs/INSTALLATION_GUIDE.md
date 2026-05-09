# Installation Guide

Follow these steps to set up Intelliconnect locally for development.

## Prerequisites
- Node.js (v18+)
- Python (v3.14 recommended, or v3.10+)
- Google Cloud Console account (for OAuth Client ID)
- Google AI Studio account (for Gemini API Key)

## Step 1: Clone the Project
```bash
git clone <repository_url>
cd intelliconnect1
```

## Step 2: Backend Setup
```bash
cd backend
python -m venv venv

# Activate Virtual Environment
source venv/bin/activate       # macOS/Linux
venv\Scripts\activate          # Windows

# Install Dependencies
pip install -r requirements.txt

# Run Migrations
python manage.py migrate

# Start Server (Runs on port 8000)
python manage.py runserver
```

## Step 3: Frontend Setup
Open a new terminal window.
```bash
cd frontend

# Install Dependencies
npm install

# Start Vite Dev Server (Runs on port 5173)
npm run dev
```

The frontend uses Vite's proxy settings to forward `/api` requests to `http://localhost:8000`, bypassing CORS issues locally.