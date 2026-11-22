import os

from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import URL


class Settings(BaseSettings):
    db_host: str
    db_port: int = 5432
    db_name: str
    db_username: str
    db_password: str
    db_clean_on_error: bool = False

    redis_host: str
    redis_port: int = 6379
    redis_database: int = 0

    oreamo_server_key: str

    debug: bool = False

    model_config = SettingsConfigDict(env_file=f".env.{os.getenv('APP_ENV', 'local')}")

    @property
    def database_url(self) -> URL:
        return URL.create(
            "postgresql+asyncpg",
            username=self.db_username,
            password=self.db_password,
            host=self.db_host,
            port=self.db_port,
            database=self.db_name,
        )


settings = Settings()
