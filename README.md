# Intelliconnect

Intelliconnect is a comprehensive meeting intelligence platform that analyzes meeting recordings and transcripts using Google's Gemini AI to extract summaries, key decisions, tasks, and participant contributions. 

## Tech Stack

### Frontend
- **Framework**: React 19 via Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide React (Icons), Framer Motion (Animations)
- **State Management**: Zustand, React Hook Form
- **Routing**: React Router DOM v7
- **Authentication**: Google OAuth (`@react-oauth/google`)

### Backend
- **Framework**: Django 6.0 + Django REST Framework (DRF)
- **Language**: Python 3.14
- **Database**: SQLite (default via `dj_database_url`)
- **AI Integration**: Google GenAI (`gemini-3.1-flash-lite`)
- **Key Libraries**: `json-repair`, `pydantic`

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/ARCHITECTURE.md) | System design and component overview |
| [API Documentation](docs/API_DOCUMENTATION.md) | All endpoints and request/response formats |
| [AI Analysis](docs/AI_ANALYSIS.md) | Gemini AI integration and pipeline |
| [Database Schema](docs/DATABASE_SCHEMA.md) | Models, relationships, ERD |
| [Workflow](docs/WORKFLOW.md) | End-to-end user journey |
| [Security](docs/SECURITY.md) | Auth flow and security considerations |
| [Deployment](docs/DEPLOYMENT.md) | Production deployment guide |
| [Installation Guide](docs/INSTALLATION_GUIDE.md) | Local development setup |
| [Features](docs/FEATURES.md) | Full feature list |
| [Performance Analysis](docs/PERFORMANCE_ANALYSIS.md) | Optimizations and bottlenecks |
| [System Design](docs/SYSTEM_DESIGN.md) | Architecture decisions and tradeoffs |
| [Folder Structure](docs/FOLDER_STRUCTURE.md) | Annotated directory tree |

## Quick Start

### 1. Clone the repository
```bash
git clone <repo-url>
cd intelliconnect1
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Environment Variables
Ensure you set the `.env` variables in both the `frontend` and `backend` as per the [Installation Guide](docs/INSTALLATION_GUIDE.md).