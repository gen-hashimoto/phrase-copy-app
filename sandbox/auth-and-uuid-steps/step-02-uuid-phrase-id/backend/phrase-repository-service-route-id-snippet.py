from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.phrase import Phrase
from app.schemas.phrase import PhraseCreate, PhraseRead, PhraseUpdate


class PhraseRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_all(self) -> list[Phrase]:
        # This is temporary. Step 06 changes ordering to Phrase.position.
        stmt = select(Phrase).order_by(Phrase.created_at.asc())
        return list(self.db.scalars(stmt).all())

    def get_by_id(self, phrase_id: str) -> Phrase | None:
        return self.db.get(Phrase, phrase_id)

    def create(self, content: str) -> Phrase:
        row = Phrase(content=content)
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row


class PhraseService:
    def __init__(self, db: Session) -> None:
        self.repo = PhraseRepository(db)

    def get_phrase(self, phrase_id: str) -> Phrase:
        row = self.repo.get_by_id(phrase_id)
        if row is None:
            raise HTTPException(status_code=404, detail="Phrase not found")
        return row


router = APIRouter()


@router.get("/{phrase_id}", response_model=PhraseRead)
def get_phrase(phrase_id: str, db: Session = Depends(get_db)):
    service = PhraseService(db)
    return service.get_phrase(phrase_id)
