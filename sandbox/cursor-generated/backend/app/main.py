"""FastAPI エントリポイント。"""
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_redoc_html

from app.api.routes import health, phrases
from app.core.config import get_settings
from app.db.base import Base
from app.db.session import engine

# create_all でメタデータに載せるためモデルを import
from app.models import phrase as _phrase_model  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    """起動時にテーブル作成（見本。本番は Alembic 推奨）。"""
    Base.metadata.create_all(bind=engine)
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    # 既定の ReDoc は CDN の redoc@next を参照しており、環境によっては真っ白になることがある。
    # そのため redoc_url=None にし、下で安定版 redoc@2 のスクリプトを明示する。
    app = FastAPI(
        title="Phrase Sample API",
        description="FastAPI + MySQL + SQLAlchemy の見本（sandbox）",
        lifespan=lifespan,
        redoc_url=None,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router)
    app.include_router(phrases.router, prefix="/phrases")

    @app.get("/redoc", include_in_schema=False)
    async def redoc_html(request: Request):
        """ReDoc（OpenAPI の読み物向け UI）。ブラウザが CDN から JS を取れる必要がある。"""
        root_path = request.scope.get("root_path", "").rstrip("/")
        openapi_url = root_path + app.openapi_url
        return get_redoc_html(
            openapi_url=openapi_url,
            title=f"{app.title} - ReDoc",
            redoc_js_url="https://cdn.jsdelivr.net/npm/redoc@2.1.5/bundles/redoc.standalone.js",
        )

    return app


app = create_app()
