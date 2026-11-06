# Oreamo Agent

Agent server for Oreamo, built with FastAPI, SQLAlchemy and MySQL.

## Tech Stack

| Category     | Library                                             |
| ------------ | --------------------------------------------------- |
| Framework    | FastAPI, Uvicorn                                    |
| Language     | Python 3.14                                         |
| Package      | uv, make                                            |
| Database     | MySQL, Alembic                                      |
| Persistence  | SQLAlchemy 2.0 (asyncio, aiomysql)                  |
| Cache        | Redis                                               |
| Storage      | AWS S3, boto3 (LocalStack for local)                |
| Auth         | JWT (PyJWT) with cookie-based access/refresh tokens |
| API Docs     | OpenAPI (Swagger UI)                                |
| Code Quality | Ruff, ty, pre-commit                                |

## Requirements

- Python 3.14
- uv, make
- Docker

## Getting Started

```bash
docker compose up -d
make sync
make migrate
make run
```

The server runs on `http://localhost:8080`.

- Swagger UI: `http://localhost:8080/docs`
- Alembic creates tables and inserts mock data.
- Default accounts: `oreamo-system`, `oreamo-admin`, `oreamo-user`

## Environment

| `APP_ENV` | Config File  | Description                            |
| --------- | ------------ | -------------------------------------- |
| `local`   | `.env.local` | Local development with Docker services |
| `dev`     | `.env.dev`   | Development server                     |

| Variable            | Description                               |
| ------------------- | ----------------------------------------- |
| `JWT_SECRET`        | Secret key for JWT signing                |
| `DB_CLEAN_ON_ERROR` | Clean database on migration error (local) |

See `.env.example` for all variables.

## Scripts

| Script           | Description                       |
| ---------------- | --------------------------------- |
| `make sync`      | Install dependencies & hooks      |
| `make run`       | Run the server                    |
| `make migrate`   | Run database migrations           |
| `make lint`      | Lint with Ruff                    |
| `make format`    | Format with Ruff                  |
| `make typecheck` | Type check with ty                |
| `make check`     | Lint, format check and type check |
