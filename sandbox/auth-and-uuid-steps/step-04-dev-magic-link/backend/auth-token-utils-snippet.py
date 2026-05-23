from datetime import datetime, timedelta
from hashlib import sha256
from secrets import token_urlsafe


MAGIC_LINK_TOKEN_BYTES = 32
MAGIC_LINK_TTL_MINUTES = 15


def create_magic_link_token() -> str:
    return token_urlsafe(MAGIC_LINK_TOKEN_BYTES)


def hash_magic_link_token(token: str) -> str:
    # Hash the token before storing it in the database.
    return sha256(token.encode("utf-8")).hexdigest()


def magic_link_expires_at(now: datetime | None = None) -> datetime:
    current = now or datetime.utcnow()
    return current + timedelta(minutes=MAGIC_LINK_TTL_MINUTES)
