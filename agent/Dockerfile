FROM python:3.14-slim AS builder

WORKDIR /app

# Step 1. Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Step 2. Install dependencies
COPY pyproject.toml uv.lock .python-version ./
RUN uv sync --frozen --no-dev --no-install-project

# Step 3. Copy the dependencies and source
FROM python:3.14-slim

WORKDIR /app

COPY --from=builder /app/.venv .venv
COPY alembic.ini ./
COPY alembic alembic
COPY app app

# Step 4. Run the server
ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
