from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.repositories.phrase_repository import PhraseRepository
from app.schemas.phrase import PhraseCreate, PhraseUpdate
from app.models.phrase import Phrase


class PhraseService:
    def __init__(self, db: Session):
        self.repo = PhraseRepository(db)

    def list_phrases(self) -> list[Phrase]:
        return self.repo.list_all()

    def create_phrase(self, body: PhraseCreate) -> Phrase:
        return self.repo.create(body.content)

    def get_phrase(self, phrase_id: int) -> Phrase:  # todo: id はuuidの予定
        row = self.repo.get_by_id(phrase_id)
        if row is None:
            raise HTTPException(status_code=404, detail="Phrase not found")
        return row

    def delete_phrase(self, phrase_id: int) -> None:
        row = self.repo.get_by_id(phrase_id)
        if row is None:
            raise HTTPException(status_code=404, detail="Phrase not found")
        self.repo.delete(row)

    def update_phrase(self, phrase_id: int, body: PhraseUpdate) -> Phrase:
        row = self.repo.get_by_id(phrase_id)
        if row is None:
            raise HTTPException(status_code=404, detail="Phrase not found")
        return self.repo.update(row, body.content)
