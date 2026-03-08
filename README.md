# Ojas.AI

Ojas.AI is a production-oriented AI diet planning platform for dietitians and patients.

## Tech Stack

- Frontend: Next.js (App Router), TypeScript, TailwindCSS, React Query, Zustand, Recharts
- Backend: FastAPI, SQLAlchemy, PostgreSQL, Redis, JWT auth
- AI: OpenAI API with deterministic fallback planner
- Infra: Docker, docker-compose, environment-based config

## Core Features

- Role-based authentication (`dietitian`, `patient`) with JWT
- Dietitian dashboard:
  - Create patient profiles
  - View patient history
  - Generate/regenerate AI diet plans
  - Add patient progress logs
  - Export plan as PDF
- Patient dashboard:
  - View daily meal cards and macros
  - Track weight progress chart
  - Weekly meal planner
  - Grocery list generation
  - Dark mode

## Project Structure

```text
.
|-- app/                          # Next.js frontend
|   |-- api/backend/[...path]/    # Proxy API layer to FastAPI
|   |-- dashboard/dietitian/      # Dietitian dashboard UI
|   |-- dashboard/patient/        # Patient dashboard UI
|   |-- lib/                      # API client, state, types
|-- backend/
|   |-- app/
|   |   |-- api/routes/           # FastAPI endpoints
|   |   |-- core/                 # Settings and security
|   |   |-- database/             # SQLAlchemy setup
|   |   |-- models/               # ORM models
|   |   |-- schemas/              # Pydantic schemas
|   |   |-- services/             # AI and cache services
|   |-- main.py                   # FastAPI entrypoint
|-- docker-compose.yml
```

## API Endpoints

- Auth
  - `POST /auth/signup`
  - `POST /auth/login`
- Patients
  - `POST /patients`
  - `GET /patients`
  - `GET /patients/{id}`
- Diet plans
  - `POST /diet/generate`
  - `GET /diet/{patient_id}`
  - `GET /diet/{patient_id}/weekly`
  - `GET /diet/{patient_id}/grocery-list`
- Progress
  - `POST /progress`
  - `GET /progress/{patient_id}`
- Export
  - `GET /export/diet/{patient_id}/pdf`

## Local Setup

### 1. Frontend

```bash
npm install
npm run dev
```

Create `.env` in project root from `.env.example`:

```bash
NEXT_PUBLIC_API_BASE_URL=/api/backend
BACKEND_INTERNAL_URL=http://localhost:8000
```

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Create `backend/.env` from `backend/.env.example`:

```bash
APP_NAME=Ojas.AI API
ENVIRONMENT=development
SECRET_KEY=replace-with-a-long-random-secret
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/ojasai
REDIS_URL=redis://localhost:6379/0
LLM_PROVIDER=openai
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
CORS_ORIGINS=http://localhost:3000
```

### 3. Infrastructure (PostgreSQL + Redis + app containers)

```bash
docker compose up --build
```

## Notes

- If `OPENAI_API_KEY` is missing, the backend uses a deterministic nutrition fallback planner.
- SQLAlchemy tables are auto-created on backend startup for rapid development.
- For production hardening, add Alembic migrations, HTTPS termination, secret management, and structured logging.
