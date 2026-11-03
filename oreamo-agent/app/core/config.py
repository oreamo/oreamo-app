import os

from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import URL


class Settings(BaseSettings):
    # Database
    db_host: str
    db_port: int = 3306
    db_name: str
    db_username: str
    db_password: str
    db_clean_on_error: bool = False

    # Redis
    redis_host: str
    redis_port: int = 6379
    redis_database: int = 0

    # Security
    jwt_secret: str
    jwt_access_token_expire_seconds: int = 300
    jwt_refresh_token_expire_seconds: int = 3600
    access_token_cookie: str = "ACCESS_TOKEN"
    refresh_token_cookie: str = "REFRESH_TOKEN"
    cookie_secure: bool = True
    initial_password: str = "1q2w3e4r!"
    refresh_url: str = "/session/refresh"
    client_base_url: str

    # File
    upload_max_request_size_mb: int = 30

    # AWS
    aws_region: str
    aws_s3_endpoint: str
    aws_s3_bucket: str
    aws_s3_access_key: str
    aws_s3_secret_key: str

    # ETC
    debug: bool = False

    model_config = SettingsConfigDict(env_file=f".env.{os.getenv('APP_ENV', 'local')}")

    @property
    def database_url(self) -> URL:
        return URL.create(
            "mysql+aiomysql",
            username=self.db_username,
            password=self.db_password,
            host=self.db_host,
            port=self.db_port,
            database=self.db_name,
            query={"charset": "utf8mb4"},
        )


settings = Settings()  # ty: ignore[missing-argument]
