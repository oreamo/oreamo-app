# Oreamo Application

Workspace for shared configuration across Oreamo services.

## Repositories

| Directory          | Description                               | Repository                                |
| ------------------ | ----------------------------------------- | ----------------------------------------- |
| `oreamo-frontend/` | Web client (React, TypeScript, Vite)      | https://github.com/oreamo/oreamo-frontend |
| `oreamo-backend/`  | API server (Spring Boot, MyBatis, MySQL)  | https://github.com/oreamo/oreamo-backend  |
| `oreamo-agent/`    | Agent server (FastAPI, SQLAlchemy, MySQL) | https://github.com/oreamo/oreamo-agent    |

Each service is an independent git repository and is excluded from this repository via `.gitignore`.

## Docker

`docker-compose.yml` runs the services and their infrastructure (MySQL, Redis, LocalStack) for local development.

| Service    | URL                   |
| ---------- | --------------------- |
| `frontend` | http://localhost:3000 |
| `backend`  | http://localhost:8080 |
| `agent`    | http://localhost:8000 |

```bash
# Start all services
docker compose up -d

# Rebuild and restart after source changes
docker compose up -d --build

# Rebuild and restart a single service
docker compose up -d --build backend

# Show logs of a service
docker compose logs -f backend

# Stop and remove all containers
docker compose down
```
