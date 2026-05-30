from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class PhraseCreate(BaseModel):
    content: str = Field(..., min_length=1)


class PhraseUpdate(BaseModel):
    content: str = Field(..., min_length=1)


class PhraseRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    content: str
    created_at: datetime
    # Expose the last edit time in every phrase response.
    updated_at: datetime
