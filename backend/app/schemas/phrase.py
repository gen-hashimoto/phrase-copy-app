from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class PhraseCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)


class PhraseUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    content: str | None = Field(default=None, min_length=1)


class PhraseRead(PhraseCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
