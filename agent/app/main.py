from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.common.app_router import router
from app.common.exception_handler import register_exception_handlers
from app.core.database import engine
from app.core.middleware import (
    ServerKeyMiddleware,
    UnhandledExceptionMiddleware,
)
from app.core.redis import redis


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await redis.aclose()
    await engine.dispose()


app = FastAPI(
    title="Oreamo Agent API",
    description="Oreamo Agent API Documentation",
    version="V1.0",
    lifespan=lifespan,
)

app.add_middleware(UnhandledExceptionMiddleware)
app.add_middleware(ServerKeyMiddleware)

register_exception_handlers(app)

app.include_router(router)
