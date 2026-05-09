# Folder Structure

## Project Root

```
.
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions CI workflow
├── docs/                    # Documentation hub
│   ├── AI_ANALYSIS.md
│   ├── API_DOCUMENTATION.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── DEPLOYMENT.md
│   ├── FEATURES.md
│   ├── FOLDER_STRUCTURE.md
│   ├── INSTALLATION_GUIDE.md
│   ├── PERFORMANCE_ANALYSIS.md
│   ├── SECURITY.md
│   ├── SYSTEM_DESIGN.md
│   ├── WORKFLOW.md
│   └── index.md             # Documentation index
├── frontend/                # React/Vite Frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── backend/                 # Django REST Backend
│   ├── auth_custom/
│   ├── intelliconnect_backend/
│   ├── meetings/
│   ├── manage.py
│   └── requirements.txt
├── .env.example             # Environment variables template
├── .gitignore               # Ignored files
├── CONTRIBUTING.md          # Contribution guidelines
├── LICENSE                  # MIT License
└── README.md                # Project overview and quick start
```

## Frontend (`frontend/`)
```
frontend/
├── src/
│   ├── api/                 # API service definitions (Axios/fetch calls)
│   ├── assets/              # Static assets (images, SVGs)
│   ├── components/
│   │   ├── Layout/          # Main application wrapper and structural elements
│   │   ├── Login/           # Authentication UI
│   │   ├── MeetingHistory/  # Meeting history lists and cards
│   │   ├── RecordedMeetings/# Upload, configuration, processing UI steps
│   │   └── ui/              # Reusable generic UI components
│   ├── hooks/               # Custom React hooks
│   ├── pages/
│   │   ├── Analytics/       # Global analytics and charts
│   │   ├── Dashboard/       # Main overview dashboard
│   │   ├── MeetingHistory/  # Historical data view
│   │   ├── RecordedMeetings/# Meeting upload and analysis flow
│   │   └── Settings/        # User configuration
│   ├── store/               # Zustand global state definitions
│   ├── styles/              # Global CSS, Tailwind configurations
│   ├── utils/               # Helper functions (e.g., Supabase client setup)
│   ├── App.tsx              # Router configuration
│   └── main.tsx             # React entry point
├── package.json             # NPM dependencies and scripts
└── vite.config.ts           # Vite bundler configuration & proxies
```

## Backend (`backend/`)
```
backend/
├── auth_custom/             # Custom authentication application
│   ├── models.py            # User extensions (if any)
│   ├── urls.py              # Auth API routes (/api/auth/)
│   └── views.py             # User sync view for Google OAuth
├── intelliconnect_backend/  # Main Django project settings
│   ├── settings.py          # Configuration (DB, CORS, Middleware)
│   ├── urls.py              # Root URL router
│   └── wsgi.py / asgi.py    # Deployment entry points
├── meetings/                # Core business logic application
│   ├── migrations/          # DB schema migrations
│   ├── models.py            # Meeting, Task, Participant, IntegratedIntelligence
│   ├── serializers.py       # DRF JSON transformers
│   ├── urls.py              # Meeting API routes (/api/meetings/, etc.)
│   └── views.py             # ViewSets (Analytics, Processing, CRUD)
├── manage.py                # Django CLI utility
└── requirements.txt         # Python dependencies
```