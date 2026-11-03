import asyncio
import logging
from logging.config import fileConfig

from sqlalchemy import Connection, text

from alembic import context
from app.core.config import settings
from app.core.database import Base, engine

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

logger = logging.getLogger("alembic")
target_metadata = Base.metadata


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


async def clean_database() -> None:
    async with engine.connect() as connection:
        await connection.execute(text("SET FOREIGN_KEY_CHECKS = 0"))
        result = await connection.execute(text("SHOW TABLES"))
        for table in [row[0] for row in result]:
            await connection.execute(text(f"DROP TABLE IF EXISTS `{table}`"))
        await connection.execute(text("SET FOREIGN_KEY_CHECKS = 1"))
        await connection.commit()
    logger.info("Database cleaned successfully")


async def migrate() -> None:
    async with engine.connect() as connection:
        await connection.run_sync(do_run_migrations)


async def run_migrations() -> None:
    try:
        await migrate()
    except Exception as e:
        if not settings.db_clean_on_error:
            raise
        logger.warning(f"Migration failed: {e}. Cleaning database and retrying...")
        await clean_database()
        await migrate()
    finally:
        await engine.dispose()


asyncio.run(run_migrations())
