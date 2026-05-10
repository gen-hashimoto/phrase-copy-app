from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.phrase import Phrase


class PhraseRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_all(self) -> list[Phrase]:
        stmt = select(Phrase).order_by(Phrase.id.asc())
        return list(self.db.scalars(stmt).all())

    def get_by_id(self, phrase_id: int) -> Phrase | None:
        row = self.db.get(Phrase, phrase_id)
        return row

    def create(self, title: str, content: str) -> Phrase:
        row = Phrase(title=title, content=content)
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row

    def update(self, row: Phrase, title: str | None, content: str | None) -> Phrase:
        if title is not None:
            row.title = title
        if content is not None:
            row.content = content

        self.db.commit()
        self.db.refresh(row)
        return row

    def delete(self, row: Phrase) -> None:
        self.db.delete(row)
        self.db.commit()
