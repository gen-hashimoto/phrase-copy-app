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
    from_email: str
    app_origin: str
    is_development: bool
    mail_provider: str  # "dev_smtp" / "dev_link" / "ses" / "resend"
    smtp_host: str
    smtp_port: int
    resend_api_key: str


settings = Settings(
    jwt_secret=os.environ["JWT_SECRET"],
    cookie_secure=env_bool("AUTH_COOKIE_SECURE", False),
    aws_region=os.environ["AWS_REGION"],
    from_email=os.environ["FROM_EMAIL"],
    app_origin=os.environ["APP_ORIGIN"],
    is_development=env_bool("IS_DEVELOPMENT", False),
    mail_provider=os.environ["MAIL_PROVIDER"],
    smtp_host=os.getenv("SMTP_HOST", "mailpit"),
    smtp_port=int(os.getenv("SMTP_PORT", "1025")),
    resend_api_key=os.getenv("RESEND_API_KEY", ""),
)
