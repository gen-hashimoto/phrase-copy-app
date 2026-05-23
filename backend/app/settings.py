import os
from dataclasses import dataclass


def env_bool(name: str, default: bool) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.lower() in {"1", "true", "yes", "on"}


@dataclass(frozen=True)
class Settings:
    jwt_secret: str
    cookie_secure: bool


settings = Settings(
    jwt_secret=os.getenv("JWT_SECRET", "dev-only-change-me"),
    cookie_secure=env_bool("AUTH_COOKIE_SECURE", False),
)
