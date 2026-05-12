# IntelliConnect Frontend — Console Sensei

Vite + React 18 + TypeScript dashboard for the IntelliConnect platform.

## Stack
- **Vite** + **React 18** + **TypeScript**
- **Framer Motion** (animations)
- **Lucide React** (icons)
- **Supabase JS** (auth)
- **Axios** (API calls)
- **jsPDF** (client-side PDF export)

## Local Dev

```bash
cp .env.example .env   # fill VITE_BACKEND_URL and VITE_SUPABASE_*
npm install
npm run dev            # http://localhost:5173
```

## Pages

| Route | Component | Description |
|---|---|---|
| `/login` | `Login.tsx` | Google OAuth via Supabase |
| `/dashboard` | `DashboardHome.tsx` | Overview & stats |
| `/dashboard/meetings` | `Meetings.tsx` | Upload, process, view & export meetings |
| `/dashboard/documents` | `Documents.tsx` | Document vault — view, download, share, rename |
| `/dashboard/tasks` | `Tasks.tsx` | Action item tracker |
| `/dashboard/participants` | `Participants.tsx` | Participant roster |
| `/dashboard/settings` | `Settings.tsx` | User preferences |

## Environment Variables

```
VITE_BACKEND_URL=http://localhost:8000
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```
