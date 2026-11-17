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
make up
```

## Docker

`docker-compose.yml` runs the services and their infrastructure (PostgreSQL, Redis, LocalStack) for local development.

| Service    | URL                   |
| ---------- | --------------------- |
| `web`      | http://localhost:3000 |
| `api`      | http://localhost:8080 |
| `agent`    | http://localhost:8000 |

```bash
# Start all services (rebuilds after source changes)
make up

# Start only the infrastructure
make up infra

# Rebuild and restart a single service
make run api

# Show logs of a service
docker compose logs -f api

# Stop and remove all containers
make down
```
