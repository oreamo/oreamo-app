from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.common.app_router import router
from app.common.exception_handler import register_exception_handlers
from app.core.config import settings
from app.core.database import engine
from app.core.middleware import (
    ArrayQueryParamMiddleware,
    UnhandledExceptionMiddleware,
    UploadSizeLimitMiddleware,
)
from app.core.redis import redis


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await redis.aclose()
    await engine.dispose()


app = FastAPI(
    title="FastAPI API",
    description="FastAPI API Documentation",
    version="V1.0",
    lifespan=lifespan,
)

app.add_middleware(ArrayQueryParamMiddleware)
app.add_middleware(
    UploadSizeLimitMiddleware,
    max_request_size=settings.upload_max_request_size_mb * 1024 * 1024,
)
app.add_middleware(UnhandledExceptionMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.client_base_url],
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_credentials=True,
    allow_headers=["Content-Type", "Accept", "X-Requested-With"],
    expose_headers=["Set-Cookie"],
)

register_exception_handlers(app)

app.include_router(router)
