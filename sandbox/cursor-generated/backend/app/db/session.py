"""DB エンジンとセッション（同期 SQLAlchemy）。"""
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import get_settings

_settings = get_settings()

# 見本: プール設定は最小限。本番では pool_pre_ping 等を検討。
engine = create_engine(
    _settings.database_url,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """リクエスト単位でセッションを開閉するジェネレータ。"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
