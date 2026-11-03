from collections.abc import AsyncIterator
from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings

engine = create_async_engine(
    settings.database_url, echo=settings.debug, pool_pre_ping=True
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncIterator[AsyncSession]:
    # One transaction per request: committed when the path operation succeeds, rolled back on any exception.
    async with AsyncSessionLocal() as session, session.begin():
        yield session


# scope="function" closes the transaction before the response is sent, so clients never read uncommitted results.
DbSession = Annotated[AsyncSession, Depends(get_db, scope="function")]
