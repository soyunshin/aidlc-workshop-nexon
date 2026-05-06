"""Application configuration using Pydantic BaseSettings."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    database_url: str = "sqlite+aiosqlite:///./table_order.db"

    # Security
    secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_hours: int = 16

    # Rate Limiting
    max_login_attempts: int = 5
    login_lockout_minutes: int = 15

    # CORS
    cors_origins: list[str] = ["http://localhost:3000"]

    # Application
    debug: bool = False
    app_name: str = "TableOrder"
    app_version: str = "0.1.0"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


# Singleton settings instance
_settings: Settings | None = None


def get_settings() -> Settings:
    """Get cached settings instance."""
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings
