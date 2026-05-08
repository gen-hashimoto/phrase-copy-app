"""FastAPI の依存性: DB セッションなど。"""
from collections.abc import Generator

from sqlalchemy.orm import Session

from app.db.session import get_db as _get_db


def get_db() -> Generator[Session, None, None]:
    """ルーターから Depends(get_db) で注入。"""
    yield from _get_db()
