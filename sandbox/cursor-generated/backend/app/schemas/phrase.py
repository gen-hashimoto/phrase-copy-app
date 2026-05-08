"""Phrase 用 Pydantic スキーマ。"""
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class PhraseBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)


class PhraseCreate(PhraseBase):
    """POST /phrases 用。"""


class PhraseUpdate(BaseModel):
    """PUT /phrases/{id} 用（部分更新も可能にする見本）。"""

    title: str | None = Field(default=None, min_length=1, max_length=255)
    content: str | None = Field(default=None, min_length=1)


class PhraseRead(PhraseBase):
    """レスポンス用。"""

    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
