"""環境変数ベースの設定（.env 対応）。"""
from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# backend/app/core/config.py から見て parents[2] が backend ルート、その親がサンプルルート
_BACKEND_ROOT = Path(__file__).resolve().parents[2]
_SAMPLE_ROOT = _BACKEND_ROOT.parent
# 先にサンプルルートの .env（compose と同じ置き場）、必要なら backend/.env で上書き
_ENV_CANDIDATES = (_SAMPLE_ROOT / ".env", _BACKEND_ROOT / ".env")
_ENV_FILES = tuple(str(p) for p in _ENV_CANDIDATES if p.is_file())


class Settings(BaseSettings):
    """アプリ全体で参照する設定。"""

    model_config = SettingsConfigDict(
        env_file=_ENV_FILES if _ENV_FILES else None,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # SQLAlchemy が解釈する URL（例: mysql+pymysql://user:pass@db:3306/dbname）
    database_url: str

    # カンマ区切りで複数オリジンを指定可能
    cors_origins: str = "http://localhost:3000"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    """設定はプロセス内で1インスタンスにまとめる。"""
    return Settings()
