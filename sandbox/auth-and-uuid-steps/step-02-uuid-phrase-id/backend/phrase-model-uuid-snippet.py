from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


def new_uuid() -> str:
    # Store UUID as a plain string first; BINARY(16) can be optimized later.
    return str(uuid4())


class Phrase(Base):
    __tablename__ = "phrases"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    content: Mapped[str] = mapped_column(Text(), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False), server_default=func.now(), nullable=False
    )
