# FixMyText

FixMyText is a full-stack text manipulation tool built with **React** (frontend) and **Python FastAPI** (backend). All text transformations are processed server-side by the API — the React frontend is a pure UI layer that calls the backend for every operation.

---

## Features

- **Case conversions** — UPPERCASE, lowercase, Inverse Case, Sentence Case, UpperCamelCase, lowerCamelCase
- **Whitespace tools** — Remove extra spaces, remove all spaces
- **Text analysis** — Word count, sentence count, character count, estimated reading time
- **Text-to-Speech** — Browser native speech synthesis
- **Dark / Light mode** — Toggle via navbar switch
- **Interactive API docs** — Swagger UI at `/docs`, ReDoc at `/redoc`

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 18, React Router v6, Bootstrap 5          |
| Backend   | Python 3.12, FastAPI, Pydantic v2, Uvicorn      |
| DevOps    | Docker, Docker Compose, Nginx                   |
| Testing   | Pytest, pytest-asyncio, HTTPX                   |

---

## Project Structure

```
FixMyText/
├── backend/                       # FastAPI application
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── endpoints/
│   │   │   │   └── text.py        # /api/v1/text/* routes
│   │   │   └── router.py          # v1 router aggregator
│   │   ├── core/
│   │   │   └── config.py          # Settings via pydantic-settings
│   │   ├── models/
│   │   │   └── text.py            # Pydantic request/response schemas
│   │   └── services/
│   │       └── text_service.py    # Pure business logic
│   ├── tests/                     # Pytest suite
│   ├── main.py                    # ASGI entry point
│   ├── requirements.txt
│   ├── Dockerfile                 # Production image (multi-stage)
│   ├── Dockerfile.dev             # Development image (single-stage, minimal)
│   └── .env.example
│
├── frontend/                      # React application
│   ├── public/
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Page-level components
│   │   ├── services/
│   │   │   └── textService.js     # Fetch wrappers for every API endpoint
│   │   ├── hooks/                 # useAlert, useTheme
│   │   ├── constants/             # Routes, app name, etc.
│   │   └── assets/css/            # Stylesheets
│   ├── nginx.conf                 # Production nginx config
│   ├── Dockerfile                 # Production image (multi-stage, nginx)
│   ├── Dockerfile.dev             # Development image (single-stage, CRA dev server)
│   └── .env.example
│
├── docker-compose.yml             # Unified compose — profiles: fixmytext-dev / fixmytext-prod
├── package.json                   # Monorepo helper scripts
└── README.md
```

---

## Getting Started

### Prerequisites

| Tool    | Version | Notes                              |
|---------|---------|------------------------------------|
| Node.js | 18+     | For the React frontend             |
| Python  | 3.12+   | For the FastAPI backend            |
| Docker  | any     | Optional — for containerised setup |

---

### Option A — Local Development

Both services must run simultaneously. Open two terminals.

#### 1. Backend

```bash
cd backend

# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy env file and adjust if needed
cp .env.example .env

# Start the dev server (auto-reloads on file changes)
uvicorn main:app --reload --port 8000
```

API available at `http://localhost:8000` — interactive docs at `http://localhost:8000/docs`.

#### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy env file (points Vite at the local backend)
cp .env.example .env

# Start the dev server
npm run dev
```

App opens at `http://localhost:3000`.

#### 3. Run both at once (from repo root)

```bash
# Install root tooling (concurrently)
npm install

# Start frontend + backend simultaneously
npm run dev
```

---

### Option B — Docker

Both dev and prod stacks live in a single `docker-compose.yml`, separated by profiles:

| Profile | Services | Use case |
|---|---|---|
| `fixmytext-dev` | `backend-dev`, `frontend-dev` | Hot reload, source volumes |
| `fixmytext-prod` | `backend-prod`, `frontend-prod` | Multi-stage builds, nginx |

#### Development (profile: `fixmytext-dev`)

Source code is mounted as a volume — **no rebuild needed on file changes**.

```bash
npm run docker:dev
# or directly:
docker compose --profile fixmytext-dev up --build
```

| Service  | URL                        | Notes                       |
|----------|----------------------------|-----------------------------|
| Frontend | http://localhost:3000      | CRA dev server, HMR enabled |
| Backend  | http://localhost:8000      | uvicorn --reload            |
| API docs | http://localhost:8000/docs |                             |

```bash
npm run docker:dev:down     # stop
npm run docker:dev:logs     # tail logs
```

> **How hot reload works**
> - Backend: `uvicorn --reload` watches `/app` (mounted from `./backend`); host `.venv` is masked by an anonymous volume
> - Frontend: CRA polls for changes via `CHOKIDAR_USEPOLLING=true`; HMR websocket fixed with `WDS_SOCKET_PORT=0`
> - Only `src/` and `public/` are mounted for the frontend — `node_modules` stays inside the container

#### Production (profile: `fixmytext-prod`)

Multi-stage builds, nginx for frontend, no `--reload`.

```bash
npm run docker:up
# or directly:
docker compose --profile fixmytext-prod up --build
```

| Service  | URL                        | Notes                               |
|----------|----------------------------|-------------------------------------|
| Frontend | http://localhost:3000      | nginx serving optimised React build |
| Backend  | http://localhost:8000      | uvicorn, DEBUG=false                |
| API docs | http://localhost:8000/docs |                                     |

```bash
npm run docker:down     # stop
npm run docker:logs     # tail logs
```

---

## Environment Variables

### Backend — `backend/.env` (copy from `backend/.env.example`)

```env
HOST=0.0.0.0
PORT=8000
DEBUG=true
ALLOWED_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]
```

### Frontend — `frontend/.env` (copy from `frontend/.env.example`)

```env
VITE_API_URL=http://localhost:8000
```

---

## API Reference

All transformation endpoints accept `POST` with `Content-Type: application/json` and body `{ "text": "..." }`.

Base path: `/api/v1/text`

| Method | Endpoint                  | Description                                  |
|--------|---------------------------|----------------------------------------------|
| POST   | `/uppercase`              | Convert to UPPERCASE                         |
| POST   | `/lowercase`              | Convert to lowercase                         |
| POST   | `/inversecase`            | Invert every character's case                |
| POST   | `/sentencecase`           | Convert to Sentence case                     |
| POST   | `/upper-camel-case`       | Convert to UpperCamelCase (PascalCase)        |
| POST   | `/lower-camel-case`       | Convert to lowerCamelCase                    |
| POST   | `/remove-extra-spaces`    | Collapse multiple spaces into one            |
| POST   | `/remove-all-spaces`      | Strip all whitespace                         |
| POST   | `/analyze`                | Word/sentence/character count + reading time |
| GET    | `/health`                 | Liveness probe                               |

**Transformation response:**
```json
{ "original": "Hello World", "result": "HELLO WORLD", "operation": "uppercase" }
```

Full docs: `http://localhost:8000/docs`

---

## Running Tests

```bash
# From repo root
npm run test:be

# Or directly
cd backend && source .venv/bin/activate && pytest -v
```

---

## Root npm Scripts

**Local development**

| Script                | Description                             |
|-----------------------|-----------------------------------------|
| `npm run dev`         | Start frontend + backend concurrently   |
| `npm run frontend`    | Start React dev server only             |
| `npm run backend`     | Start FastAPI dev server only           |
| `npm run install:all` | Install frontend npm dependencies       |
| `npm run build`       | Build the React app for production      |
| `npm run test:be`     | Run backend Pytest suite                |

**Docker** (`docker-compose.yml` — profile-based)

| Script                    | Profile           | Description                          |
|---------------------------|-------------------|--------------------------------------|
| `npm run docker:dev`      | `fixmytext-dev`   | Build + start dev stack (hot reload) |
| `npm run docker:dev:down` | `fixmytext-dev`   | Stop dev stack                       |
| `npm run docker:dev:logs` | `fixmytext-dev`   | Tail dev container logs              |
| `npm run docker:up`       | `fixmytext-prod`  | Build + start prod stack (nginx)     |
| `npm run docker:down`     | `fixmytext-prod`  | Stop prod stack                      |
| `npm run docker:logs`     | `fixmytext-prod`  | Tail prod container logs             |

---

## License

This project is licensed under the MIT License.
