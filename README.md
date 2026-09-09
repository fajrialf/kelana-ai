# KelanaAI

AI-powered travel itinerary planner. Provide a destination, budget, duration, and travel style — get a full day-by-day plan, budget breakdown, food picks, and transport suggestions in seconds.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript 5, Tailwind CSS v4 |
| Backend | FastAPI (Python 3.13), SQLAlchemy 2, psycopg2 |
| AI | Amazon Bedrock (Amazon Nova Lite) + Knowledge Base (RAG) |
| Database | PostgreSQL |
| Auth | JWT (python-jose + bcrypt) |

---

## Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- AWS account with Bedrock access and a configured Knowledge Base

---

## Repository Layout

```
alkademi/
├── backend/          # FastAPI application
│   ├── main.py
│   ├── databases.py
│   ├── dependencies.py
│   ├── migrate.py
│   ├── migrations/   # SQL migration files
│   ├── models/
│   ├── services/
│   ├── travel-guides/
│   └── requirements.txt
└── frontend/         # Next.js application
    ├── app/
    │   ├── page.tsx
    │   ├── layout.tsx
    │   ├── about/
    │   ├── auth/
    │   ├── ask/
    │   ├── chat/
    │   ├── trips/
    │   ├── profile/
    │   ├── components/
    │   ├── hooks/
    │   ├── models/
    │   └── services/
    ├── public/
    └── package.json
```

---

## Local Development

### 1. Clone the repository

```bash
git clone <repo-url>
cd alkademi
```

### 2. Backend setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate.bat

# macOS / Linux
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Backend environment variables

Create `backend/.env` (copy the block below and fill in your values):

```env
# PostgreSQL connection string
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<dbname>

# JWT
JWT_SECRET=<strong-random-secret>
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60

# AWS credentials
AWS_ACCESS_KEY_ID=<your-access-key-id>
AWS_SECRET_ACCESS_KEY=<your-secret-access-key>
AWS_REGION=ap-southeast-2

# Amazon Bedrock
AWS_BEARER_TOKEN_BEDROCK=<bearer-token-if-required>
MODEL_ID=amazon.nova-lite-v1:0

# Bedrock Knowledge Base
KNOWLEDGE_BASE_ID=<your-knowledge-base-id>
KNOWLEDGE_BASE_MODEL_ARN=arn:aws:bedrock:<region>::foundation-model/amazon.nova-lite-v1:0

# CORS — comma-separated list of allowed origins
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

#### Run database migrations

Make sure PostgreSQL is running and the database exists, then:

```bash
python migrate.py
```

This creates a `schema_migrations` tracking table and applies any pending `.sql` files from `migrations/` in filename order.

#### Start the backend

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API is available at `http://localhost:8000`.  
Interactive docs: `http://localhost:8000/docs`

---

### 3. Frontend setup

```bash
cd frontend
npm install
```

#### Frontend environment variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

#### Start the frontend

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

---

## API Reference

All protected routes require the `Authorization: Bearer <token>` header obtained from `/api/v1/auth/login`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | No | Health check |
| POST | `/api/v1/auth/register` | No | Register a new user |
| POST | `/api/v1/auth/login` | No | Login, returns JWT |
| GET | `/api/v1/auth/me` | Yes | Get current user info |
| POST | `/api/v1/trip` | Yes | Create trip + AI itinerary |
| GET | `/api/v1/trips` | Yes | List trips (supports `q`, `page`, `sort`) |
| GET | `/api/v1/trips/{id}` | Yes | Get single trip |
| PUT | `/api/v1/trips/{id}` | Yes | Update trip |
| DELETE | `/api/v1/trips/{id}` | Yes | Delete trip |
| POST | `/api/v1/ask` | Yes | Ask AI a travel question (RAG) |
| POST | `/api/v1/conversations` | Yes | Create conversation |
| GET | `/api/v1/conversations` | Yes | List conversations |
| PATCH | `/api/v1/conversations/{id}` | Yes | Rename conversation |
| DELETE | `/api/v1/conversations/{id}` | Yes | Delete conversation |
| POST | `/api/v1/conversations/{id}/messages` | Yes | Send message in conversation |
| GET | `/api/v1/conversations/{id}/messages` | Yes | Get messages in conversation |

---

## Deployment

The production stack uses **Neon** (serverless PostgreSQL) for the database, **FastAPI Cloud** for the backend, and **Vercel** for the Next.js frontend.

---

### 1. Database — Neon

1. Go to [neon.tech](https://neon.tech) → create a new project and database.
2. Copy the connection string from the **Dashboard → Connection Details** panel. It looks like:
   ```
   postgresql://user:password@ep-xxxx.region.aws.neon.tech/dbname?sslmode=require
   ```
3. Use this value as `DATABASE_URL` in your backend `.env`.
4. Run migrations once after setting up the connection:
   ```bash
   python migrate.py
   ```
   This creates the `schema_migrations` tracking table and applies all pending `.sql` files from `migrations/`.

> **Note:** Neon requires `sslmode=require` in the connection string. psycopg2 handles this automatically when the parameter is present in the URL.

---

### 2. Backend — FastAPI Cloud

FastAPI Cloud is the official hosting platform built by the FastAPI team. It provides automatic HTTPS, autoscaling, and zero-downtime deployments.

#### 2.1 Push to GitHub

Make sure your latest code is pushed to the main branch before deploying.

#### 2.2 Create an account and new app

1. Go to [fastapicloud.com](https://fastapicloud.com) and sign up or log in.
2. Click **New App** → connect your GitHub account if prompted.
3. Select the repository and set the **Root Directory** to `backend`.
4. Give your app a name. FastAPI Cloud will detect `main.py` automatically.
5. Click **Deploy**. The platform installs dependencies from `requirements.txt` and starts the app.

Your backend will be live at a URL like `https://your-app.fastapicloud.dev`.

#### 2.3 Set environment variables

In the FastAPI Cloud dashboard → your app → **Environment Variables**, add each variable below. Mark sensitive values as **Secret** so they are encrypted and never shown again.

| Variable | Secret | Value |
|---|---|---|
| `DATABASE_URL` | ✅ | `postgresql://user:password@ep-xxxx.region.aws.neon.tech/dbname?sslmode=require` |
| `JWT_SECRET` | ✅ | A strong random string |
| `JWT_ALGORITHM` | | `HS256` |
| `JWT_EXPIRE_MINUTES` | | `60` |
| `AWS_ACCESS_KEY_ID` | ✅ | Your AWS IAM access key |
| `AWS_SECRET_ACCESS_KEY` | ✅ | Your AWS IAM secret key |
| `AWS_REGION` | | `ap-southeast-2` |
| `MODEL_ID` | | `amazon.nova-lite-v1:0` |
| `KNOWLEDGE_BASE_ID` | | Your Bedrock Knowledge Base ID |
| `KNOWLEDGE_BASE_MODEL_ARN` | | `arn:aws:bedrock:ap-southeast-2::foundation-model/amazon.nova-lite-v1:0` |
| `ALLOWED_ORIGINS` | | `https://your-app.vercel.app` (update after Vercel deploys) |
| `ENV` | | `production` |

After saving, trigger a redeploy from the dashboard so the new values take effect.

#### 2.4 Run migrations

Migrations are not run automatically. Run them once from your local machine after the environment variables are set (with the Neon `DATABASE_URL` in your local `.env`):

```bash
cd backend
python migrate.py
```

#### 2.5 Redeploy after changes

Push changes to the connected GitHub branch. FastAPI Cloud automatically triggers a new deployment on every push, with zero downtime.

---

### 3. Frontend — Vercel

#### 3.1 Push to GitHub

Make sure your latest code is pushed to the main branch.

#### 3.2 Import project on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → import the repository.
2. Set **Root Directory** to `frontend`.
3. Framework preset: **Next.js** (auto-detected).

#### 3.3 Add environment variable

In the Vercel project dashboard → **Settings → Environment Variables**, add:

```
NEXT_PUBLIC_API_BASE_URL=https://your-app.fastapicloud.dev
```

Replace the value with your actual backend URL from step 2.2.

#### 3.4 Deploy

Click **Deploy**. Vercel builds and deploys automatically on every push to `main` from this point on.

#### 3.5 Update CORS on the backend

Once Vercel assigns your frontend URL (e.g. `https://your-app.vercel.app`), go to the FastAPI Cloud dashboard → your app → **Environment Variables** and update `ALLOWED_ORIGINS` to your Vercel URL:

```
ALLOWED_ORIGINS=https://your-app.vercel.app
```

Then trigger a redeploy from the dashboard so the new value takes effect.

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret key used to sign JWTs |
| `JWT_ALGORITHM` | Yes | Signing algorithm, e.g. `HS256` |
| `JWT_EXPIRE_MINUTES` | Yes | Token lifetime in minutes |
| `AWS_ACCESS_KEY_ID` | Yes | AWS IAM access key |
| `AWS_SECRET_ACCESS_KEY` | Yes | AWS IAM secret key |
| `AWS_REGION` | Yes | AWS region for Bedrock, e.g. `ap-southeast-2` |
| `MODEL_ID` | Yes | Bedrock model ID |
| `KNOWLEDGE_BASE_ID` | Yes | Bedrock Knowledge Base ID |
| `KNOWLEDGE_BASE_MODEL_ARN` | Yes | ARN of the model used for RAG retrieval |
| `ALLOWED_ORIGINS` | Yes | Comma-separated list of allowed CORS origins |
| `ENV` | No | Set to `production` to disable API docs. Defaults to `development` |
| `FRONTEND_API_KEY` | No | Shared secret header value to block direct API access. Must match the frontend `NEXT_PUBLIC_FRONTEND_API_KEY` |
| `AWS_BEARER_TOKEN_BEDROCK` | No | Bearer token if using Bedrock gateway |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Base URL of the backend API |
| `NEXT_PUBLIC_FRONTEND_API_KEY` | No | Shared secret sent as `X-Frontend-Key` header. Must match the backend `FRONTEND_API_KEY` |

---

## Useful Commands

```bash
# Backend: run with auto-reload (dev)
uvicorn main:app --reload

# Backend: run migrations
python migrate.py

# Backend: check installed packages
pip list

# Frontend: dev server
npm run dev

# Frontend: production build
npm run build

# Frontend: start production server
npm run start

# Frontend: lint
npm run lint
```
