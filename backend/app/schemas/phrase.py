from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class PhraseCreate(BaseModel):
    content: str = Field(..., min_length=1)


class PhraseUpdate(BaseModel):
    content: str = Field(..., min_length=1)


class PhraseRead(PhraseCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    content: str
    created_at: datetime
