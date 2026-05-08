"""Phrase のユースケース層（HTTP からはサービス経由で呼ぶ）。"""
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.phrase_repository import PhraseRepository
from app.schemas.phrase import PhraseCreate, PhraseRead, PhraseUpdate


class PhraseService:
    def __init__(self, db: Session) -> None:
        self._repo = PhraseRepository(db)

    def list_phrases(self) -> list[PhraseRead]:
        rows = self._repo.list_all()
        return [PhraseRead.model_validate(r) for r in rows]

    def create_phrase(self, body: PhraseCreate) -> PhraseRead:
        row = self._repo.create(title=body.title, content=body.content)
        return PhraseRead.model_validate(row)

    def update_phrase(self, phrase_id: int, body: PhraseUpdate) -> PhraseRead:
        row = self._repo.get_by_id(phrase_id)
        if row is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Phrase not found")
        if body.title is None and body.content is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least one of title or content is required",
            )
        row = self._repo.update(row, title=body.title, content=body.content)
        return PhraseRead.model_validate(row)

    def delete_phrase(self, phrase_id: int) -> None:
        row = self._repo.get_by_id(phrase_id)
        if row is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Phrase not found")
        self._repo.delete(row)
