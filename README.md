# Oreamo Application

Monorepo of the Oreamo services and their shared configuration.

## Services

| Directory       | Description                                    |
| --------------- | ---------------------------------------------- |
| `oreamo-web/`   | Web client (React, TypeScript, Vite)           |
| `oreamo-api/`   | API server (Spring Boot, MyBatis, PostgreSQL)  |
| `oreamo-agent/` | Agent server (FastAPI, SQLAlchemy, PostgreSQL) |

All services are managed in this repository as a monorepo.

## Start Application

```bash
# Install dependencies and git hooks
bash scripts/init.sh

# Start all services
docker compose up -d
```

## Docker

`docker-compose.yml` runs the services and their infrastructure (PostgreSQL, Redis, LocalStack) for local development.

| Service    | URL                   |
| ---------- | --------------------- |
| `web`      | http://localhost:3000 |
| `api`      | http://localhost:8080 |
| `agent`    | http://localhost:8000 |

```bash
# Start all services
docker compose up -d

# Rebuild and restart after source changes
docker compose up -d --build

# Rebuild and restart a single service
docker compose up -d --build api

# Show logs of a service
docker compose logs -f api

# Stop and remove all containers
docker compose down
```
