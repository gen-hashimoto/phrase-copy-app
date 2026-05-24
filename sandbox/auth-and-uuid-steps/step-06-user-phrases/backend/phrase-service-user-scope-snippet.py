from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.phrase import Phrase
from app.models.user import User
from app.repositories.phrase_repository import PhraseRepository
from app.schemas.phrase import PhraseCreate, PhraseRead, PhraseUpdate


class PhraseService:
    def __init__(self, db: Session):
        self.repo = PhraseRepository(db)

    def list_phrases(self, user_id: str) -> list[Phrase]:
        return self.repo.list_by_user(user_id)

    def create_phrase(self, user_id: str, body: PhraseCreate) -> Phrase:
        return self.repo.create_for_user(user_id, body)

    def get_phrase(self, user_id: str, phrase_id: str) -> Phrase:
        row = self.repo.get_by_user_and_id(user_id, phrase_id)
        if row is None:
            raise HTTPException(status_code=404, detail="Phrase not found")
        return row

    def update_phrase(self, user_id: str, phrase_id: str, body: PhraseUpdate) -> Phrase:
        row = self.repo.get_by_user_and_id(user_id, phrase_id)
        if row is None:
            raise HTTPException(status_code=404, detail="Phrase not found")
        return self.repo.update(row, body.content)

    def delete_phrase(self, user_id: str, phrase_id: str) -> None:
        row = self.repo.get_by_user_and_id(user_id, phrase_id)
        if row is None:
            raise HTTPException(status_code=404, detail="Phrase not found")
        self.repo.delete(row)


router = APIRouter()


@router.put("/{phrase_id}", response_model=PhraseRead)
def update_phrase(
    phrase_id: str,
    body: PhraseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = PhraseService(db)
    return service.update_phrase(current_user.id, phrase_id, body)


@router.delete("/{phrase_id}")
def delete_phrase(
    phrase_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = PhraseService(db)
    service.delete_phrase(current_user.id, phrase_id)
    return {"deleted": True}
