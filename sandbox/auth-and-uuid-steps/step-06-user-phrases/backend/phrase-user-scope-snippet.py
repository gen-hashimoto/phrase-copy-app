from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.phrase import Phrase
from app.models.user import User
from app.schemas.phrase import PhraseCreate, PhraseRead, PhraseUpdate


class PhraseRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

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


router = APIRouter()


@router.get("", response_model=list[PhraseRead])
def list_phrases(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = PhraseRepository(db)
    return repo.list_by_user(current_user.id)


@router.get("/{phrase_id}", response_model=PhraseRead)
def get_phrase(
    phrase_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = PhraseRepository(db)
    row = repo.get_by_user_and_id(current_user.id, phrase_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Phrase not found")
    return row


@router.put("/{phrase_id}", response_model=PhraseRead)
def update_phrase(
    phrase_id: str,
    body: PhraseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = PhraseRepository(db)
    row = repo.get_by_user_and_id(current_user.id, phrase_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Phrase not found")
    return repo.update(row, body.content)


@router.delete("/{phrase_id}")
def delete_phrase(
    phrase_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = PhraseRepository(db)
    row = repo.get_by_user_and_id(current_user.id, phrase_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Phrase not found")
    repo.delete(row)
    return {"deleted": True}
