# Oreamo Application

Monorepo of the Oreamo services and their shared configuration.

## Services

| Directory | Description                                    |
| --------- | ---------------------------------------------- |
| `web/`    | Web client (React, TypeScript, Vite)           |
| `api/`    | API server (Spring Boot, MyBatis, PostgreSQL)  |
| `agent/`  | Agent server (FastAPI, SQLAlchemy, PostgreSQL) |

All services are managed in this repository as a monorepo.

## Start Application

The commands run with `make` on macOS and Linux. On Windows, run them in WSL2 (Ubuntu).

```bash
# Install make if it is not installed (Ubuntu, WSL2)
sudo apt install make
```

```bash
# Install dependencies and git hooks
make init

# Start all services
make up
```

## Commands

Run `make {command} {targets}` at the repository root. Without a target, it runs all targets of the command.

| Command           | Targets                                                  | Description                                 |
|-------------------|----------------------------------------------------------|---------------------------------------------|
| `make init`       | -                                                        | Install dependencies and git hooks          |
| `make up`         | `web`, `api`, `agent`, `postgres`, `redis`, `localstack` | Build and start the containers with Docker  |
| `make down`       | `web`, `api`, `agent`, `postgres`, `redis`, `localstack` | Stop and remove the containers              |
| `make run`        | `web`, `api`, `agent`                                    | Run the services directly in the background |
| `make stop`       | `web`, `api`, `agent`                                    | Stop the services run directly              |
| `make logs`       | `web`, `api`, `agent`                                    | Show the logs of the containers             |
| `make status`     | `web`, `api`, `agent`, `postgres`, `redis`, `localstack` | Show whether the targets are running        |
| `make build`      | `web`, `api`, `agent`                                    | Build the services (`agent`: type check)    |
| `make lint`       | `web`, `agent`                                           | Check lint                                  |
| `make lint-fix`   | `web`, `agent`                                           | Fix lint                                    |
| `make format`     | `web`, `api`, `agent`                                    | Check format                                |
| `make format-fix` | `web`, `api`, `agent`                                    | Fix format                                  |
| `make help`       | -                                                        | Show the commands and their targets         |

`make up`, `make down` and `make status` also take `service` (`web`, `api`, `agent`) and `infra` (`postgres`, `redis`, `localstack`).

`make up` stops the services run directly first, and `make run` removes their containers first, so that each can use the ports.

```bash
# Start only the infrastructure
make up infra

# Rebuild and restart a single service
make up api

# Run the web directly with the others in Docker
make up infra api agent
make run web

# Fix lint and format of the web and agent
make lint-fix web agent
make format-fix web agent
```

## Services URL

| Service | URL                   |
| ------- | --------------------- |
| `web`   | http://localhost:3000 |
| `api`   | http://localhost:8080 |
| `agent` | http://localhost:8000 |
