# Oreamo Agent

Agent server for Oreamo, built with FastAPI, SQLAlchemy and PostgreSQL.

## Tech Stack

| Category     | Library                                             |
| ------------ | --------------------------------------------------- |
| Framework    | FastAPI, Uvicorn                                    |
| Language     | Python 3.14                                         |
| Package      | uv, make                                            |
| Database     | PostgreSQL, Alembic                                 |
| Persistence  | SQLAlchemy 2.0 (asyncio, asyncpg)                   |
| Cache        | Redis                                               |
| API Docs     | OpenAPI (Swagger UI)                                |
| Code Quality | Ruff, ty                                            |

## Requirements

- Python 3.14
- uv, make
- Docker

## Getting Started

Run all services with Docker at the repository root.

```bash
make up
```

### Run Directly

Start the dependent services with Docker at the repository root, then run this service in this directory.

```bash
# Repository root
make up infra

# oreamo-agent
make sync
make migrate
make run
```

The server runs on `http://localhost:8000`.

- Swagger UI: `http://localhost:8000/docs`

## Environment

| `APP_ENV` | Config File  | Description                            |
| --------- | ------------ | -------------------------------------- |
| `local`   | `.env.local` | Local development with Docker services |
| `dev`     | `.env.dev`   | Development server                     |
| `prd`     | `.env.prd`   | Production server                      |

| Variable            | Description                               |
| ------------------- | ----------------------------------------- |
| `DB_CLEAN_ON_ERROR` | Clean database on migration error (local) |

See `.env.example` for all variables.

## Scripts

| Script           | Description                       |
| ---------------- | --------------------------------- |
| `make sync`      | Install dependencies              |
| `make run`       | Run the server                    |
| `make migrate`   | Run database migrations           |
| `make lint`      | Lint with Ruff                    |
| `make format`    | Format with Ruff                  |
| `make typecheck` | Type check with ty                |
| `make check`     | Lint, format check and type check |
