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
    aws_region: str
    ses_from_email: str
    app_origin: str
    is_development: bool
    email_backend: str
    smtp_host: str
    smtp_port: int


settings = Settings(
    jwt_secret=os.environ["JWT_SECRET"],
    cookie_secure=env_bool("AUTH_COOKIE_SECURE", False),
    aws_region=os.environ["AWS_REGION"],
    ses_from_email=os.environ["SES_FROM_EMAIL"],
    app_origin=os.environ["APP_ORIGIN"],
    is_development=env_bool("IS_DEVELOPMENT", False),
    email_backend=os.environ["EMAIL_BACKEND"],
    smtp_host=os.getenv("SMTP_HOST", "mailpit"),
    smtp_port=int(os.getenv("SMTP_PORT", "1025")),
)
