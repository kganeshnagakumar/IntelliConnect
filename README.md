<h1 align="center">INTELLICONNECT</h1>

<p align="center">
  <img src="https://github.com/user-attachments/assets/35ebd7bc-3de8-4133-833d-023570951ad2" width="300" alt="IntelliConnect Logo">
</p>

<p align="center">
 Intelligent meeting management platform for automating task tracking and meeting follow-ups.
</p>

**Project Type:** AI-Based Web Application / Automation Platform  
**GitHub URL:** [https://github.com/kganeshnagakumar/IntelliConnect](https://github.com/kganeshnagakumar/IntelliConnect)

---

##  Description

INTELLICONNECT is a comprehensive meeting intelligence platform that analyzes meeting recordings and transcripts using Google's Gemini AI to extract summaries, key decisions, tasks, and participant contributions. 

It automates task tracking and meeting follow-ups during virtual meetings such as Microsoft Teams, Google Meet, and Zoom. The system processes transcripts and uses AI-based language processing techniques to automatically generate meeting summaries, extract action items, identify responsible team members, and detect deadlines. All extracted tasks are organized in a centralized dashboard with automated reminders, notifications, and progress tracking, ultimately improving collaboration, accountability, and team productivity.

##  Problem Statement

<img width="1536" height="1024" alt="Problem Statement Graphic" src="https://github.com/user-attachments/assets/6cf067f8-e8da-4fbb-8df8-1a0126a55699" />

In virtual meetings, participants often miss important tasks, deadlines, and responsibilities due to manual note-taking and communication gaps. This leads to delayed follow-ups, poor accountability, reduced productivity, and difficulty in tracking meeting outcomes. 

Organizations require an intelligent, automated solution that can analyze meeting discussions, generate summaries, identify action items, assign responsibilities, and provide centralized task tracking for efficient workflow management.

##  Proposed Solution

The proposed AI Meeting Assistant system leverages Artificial Intelligence, Natural Language Processing techniques, and the Gemini API to automate the complete meeting workflow. 

The system processes meeting transcripts, generates concise AI-powered summaries, extracts action items, identifies responsible individuals, detects deadlines, and stores all meeting tasks in a centralized dashboard. Users receive automated reminders and notifications to ensure timely follow-ups and effective collaboration.

<img width="1536" height="1024" alt="Proposed Solution Workflow" src="https://github.com/user-attachments/assets/da94a813-9ef0-419f-9f9e-e4dcfd227bd5" />

This solution minimizes manual work, improves communication accuracy, enhances productivity, and simplifies meeting management through intelligent automation.

---

## Comprehensive Tech Stack

<img width="1881" height="836" alt="Tech Stack Overview" src="https://github.com/user-attachments/assets/f21d435b-48d8-4ce2-8076-1f4ca734d05f" />

### Frontend
* **Web Framework:** React 19 via Vite
* **Mobile Framework:** React Native
* **Language:** TypeScript, JavaScript, HTML, CSS
* **Styling:** Tailwind CSS, Lucide React (Icons), Framer Motion (Animations)
* **State Management:** Zustand, React Hook Form
* **Routing:** React Router DOM v7
* **Authentication:** Google OAuth (`@react-oauth/google`)

### Backend
* **Framework:** Python (Django 6.0 Framework) + Django REST Framework (DRF)
* **Language:** Python 3.14
* **Data Processing:** Python NLP & Deep Learning algorithms
* **Key Libraries:** `json-repair`, `pydantic`

### Database
* **Production/Cloud:** Supabase
* **Local/Default:** SQLite (via `dj_database_url`)

### AI, Automation & Visualization
* **AI Integration:** Google GenAI API (`gemini-3.1-flash-lite`)
* **Automation:** SharePoint, Power Automate
* **Visualization & Reporting:** Power BI

---

##  Documentation

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



##  Quick Start

### 1. Clone the repository
```bash
git clone <repo-url>
cd intelliconnect

```

### 2. Backend Setup

Navigate to the backend directory, set up your virtual environment, and run the server:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

```

### 3. Frontend Setup

Navigate to the frontend directory, install dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev

```

### 4. Environment Variables

Ensure you set the `.env` variables in both the `frontend` and `backend` directories as per the [Installation Guide](https://www.google.com/search?q=docs/INSTALLATION_GUIDE.md).

---

## Conclusion

INTELLICONNECT is an intelligent and efficient meeting automation platform designed to simplify virtual meeting management. By integrating the Gemini API and Natural Language Processing techniques, the system reduces manual effort, improves accountability, enhances collaboration, and increases organizational productivity. This project demonstrates how Artificial Intelligence can transform traditional meeting workflows into smarter, more automated, and productivity-driven systems for modern organizations.
