from typing import Annotated

from fastapi import Depends
from redis.asyncio import Redis

from app.core.config import settings

redis = Redis(
    host=settings.redis_host,
    port=settings.redis_port,
    db=settings.redis_database,
    decode_responses=True,
)


async def get_redis() -> Redis:
    return redis


RedisClient = Annotated[Redis, Depends(get_redis)]
