.PHONY: sync run run-dev lint lint-fix format typecheck check migrate migrate-dev

sync:
	uv sync

run:
	uv run uvicorn app.main:app --reload --port 8000

run-dev:
	APP_ENV=dev uv run uvicorn app.main:app --port 8000

lint:
	uv run ruff check .

lint-fix:
	uv run ruff check --fix .

format:
	uv run ruff format .

typecheck:
	uv run ty check

check:
	uv run ruff check .
	uv run ruff format --check .
	uv run ty check

migrate:
	uv run alembic upgrade head

migrate-dev:
	APP_ENV=dev uv run alembic upgrade head
