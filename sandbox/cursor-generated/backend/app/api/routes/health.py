"""ヘルスチェック（ロードバランサや compose の依存確認用）。"""
from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict[str, str]:
    """アプリが応答するかだけを返す簡易チェック。"""
    return {"status": "ok"}
