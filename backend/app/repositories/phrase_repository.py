from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.phrase import Phrase
from app.schemas.phrase import PhraseCreate


class PhraseRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_all(self) -> list[Phrase]:
        # This is temporary. Step 06 changes ordering to Phrase.position.
        stmt = select(Phrase).order_by(Phrase.created_at.asc())
        return list(self.db.scalars(stmt).all())

    def get_by_id(self, phrase_id: str) -> Phrase | None:
        row = self.db.get(Phrase, phrase_id)
        return row

    def create(self, content: str) -> Phrase:
        row = Phrase(content=content)
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row

    def list_by_user(self, user_id: str) -> list[Phrase]:
        stmt = (
            select(Phrase)
            .where(Phrase.user_id == user_id)
            .order_by(Phrase.position.asc(), Phrase.created_at.asc())
        )
        return list(self.db.scalars(stmt).all())

    def get_by_user_and_id(self, user_id: str, phrase_id: str) -> Phrase | None:
        stmt = select(Phrase).where(Phrase.user_id == user_id, Phrase.id == phrase_id)
        return self.db.scalar(stmt)

    def create_for_user(self, user_id: str, body: PhraseCreate) -> Phrase:
        next_position = len(self.list_by_user(user_id)) + 1
        row = Phrase(user_id=user_id, content=body.content, position=next_position)
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row

    def update(self, row: Phrase, content: str) -> Phrase:
        row.content = content
        self.db.commit()
        self.db.refresh(row)
        return row

    def delete(self, row: Phrase) -> None:
        self.db.delete(row)
        self.db.commit()
