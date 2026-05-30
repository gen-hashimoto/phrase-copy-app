from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


def new_uuid() -> str:
    # Store UUID as a plain string first; BINARY(16) can be optimized later.
    return str(uuid4())


class Phrase(Base):
    """定型文(見本モデル)。"""

    __tablename__ = "phrases"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id"), nullable=False
    )
    content: Mapped[str] = mapped_column(Text(), nullable=False)
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        # Let the database set the initial timestamp.
        server_default=func.now(),
        # Let SQLAlchemy update the timestamp on ORM-managed updates.
        onupdate=func.now(),
        nullable=False,
    )
