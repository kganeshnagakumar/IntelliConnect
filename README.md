# IntelliConnect 🚀

IntelliConnect is an advanced, AI-driven meeting intelligence platform. It processes meeting recordings and transcripts to generate actionable insights, personalized tasks, and role-based summaries using state-of-the-art LLMs (Gemini/Claude) and advanced audio processing pipelines.

## 🌟 Features

- **Automated Meeting Ingestion**: Upload various audio/video formats or direct integrations.
- **AI-Powered Analysis**: Generates high-quality context summaries and role-based insights.
- **Task Extraction & Assignment**: Automatically detects action items and assigns them to participants.
- **Automated Mail Flow**: A managed Power Automate solution (`Mail_flow_1_0_0_1_managed`) is included for routing automated notifications, reports, and task assignments seamlessly.
- **Beautiful Neomorphic UI**: A sleek, modern dashboard built with React, TailwindCSS, and Framer Motion.
- **Robust Backend Pipeline**: Django + Celery + Redis architecture for reliable asynchronous processing.

## 🏗️ Architecture

- **Frontend**: React, Vite, TailwindCSS, Framer Motion
- **Backend**: Django, Django REST Framework, Celery, Redis
- **Database**: PostgreSQL (Supabase)
- **AI Models**: Google Gemini / Anthropic Claude integrations
- **Storage**: Supabase Storage
- **Workflows & Notifications**: Microsoft Power Automate (`Mail_flow_1_0_0_1_managed` solution package)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Python (3.10+)
- Docker & Docker Compose
- Supabase account & credentials
- Gemini/Claude API keys

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/intelli3.git
   cd intelli3
   ```

2. **Environment Setup:**
   Copy the `.env.example` files in both the frontend and backend directories and fill in your API keys and database credentials.

3. **Start the Backend (Docker):**
   ```bash
   cd backend
   docker-compose up --build
   ```

4. **Start the Frontend:**
   ```bash
   cd frontend/console-sensei
   npm install
   npm run dev
   ```

5. Access the application at `http://localhost:5173`.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for detailed instructions on how to get started, our code style guidelines, and the pull request process.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.
