"""Phrase の永続化層（Repository パターンの最小例）。"""
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.phrase import Phrase


class PhraseRepository:
    """DB アクセスをこのクラスに閉じる。"""

    def __init__(self, db: Session) -> None:
        self._db = db

    def list_all(self) -> list[Phrase]:
        stmt = select(Phrase).order_by(Phrase.id.asc())
        return list(self._db.scalars(stmt).all())

    def get_by_id(self, phrase_id: int) -> Phrase | None:
        return self._db.get(Phrase, phrase_id)

    def create(self, *, title: str, content: str) -> Phrase:
        row = Phrase(title=title, content=content)
        self._db.add(row)
        self._db.commit()
        self._db.refresh(row)
        return row

    def update(self, row: Phrase, *, title: str | None, content: str | None) -> Phrase:
        if title is not None:
            row.title = title
        if content is not None:
            row.content = content
        self._db.commit()
        self._db.refresh(row)
        return row

    def delete(self, row: Phrase) -> None:
        self._db.delete(row)
        self._db.commit()
