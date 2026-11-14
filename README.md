# Oreamo Application

Workspace for shared configuration across Oreamo services.

## Repositories

| Directory          | Description                                    | Repository                                |
| ------------------ | ---------------------------------------------- | ----------------------------------------- |
| `oreamo-web/`      | Web client (React, TypeScript, Vite)           | https://github.com/oreamo/oreamo-web      |
| `oreamo-api/`      | API server (Spring Boot, MyBatis, PostgreSQL)  | https://github.com/oreamo/oreamo-api      |
| `oreamo-agent/`    | Agent server (FastAPI, SQLAlchemy, PostgreSQL) | https://github.com/oreamo/oreamo-agent    |

Each service is an independent git repository and is excluded from this repository via `.gitignore`.

## Start Application

```bash
# Clone repositories and install dependencies
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
