from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.repositories.phrase_repository import PhraseRepository
from app.schemas.phrase import PhraseCreate, PhraseUpdate
from app.models.phrase import Phrase
from app.core.phrase_limits import FREE_USER_PHRASE_LIMIT


class PhraseService:
    def __init__(self, db: Session):
        self.repo = PhraseRepository(db)

    def list_phrases(self, user_id: str) -> list[Phrase]:
        return self.repo.list_by_user(user_id)

    def create_phrase(self, user_id: str, body: PhraseCreate) -> Phrase:
        current_count = self.repo.count_by_user(user_id)

        if current_count >= FREE_USER_PHRASE_LIMIT:
            raise HTTPException(
                status_code=409,
                detail=f"上限は{FREE_USER_PHRASE_LIMIT}件です。",
            )
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
