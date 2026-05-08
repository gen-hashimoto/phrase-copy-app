"""Phrase CRUD ルート。"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.phrase import PhraseCreate, PhraseRead, PhraseUpdate
from app.services.phrase_service import PhraseService

router = APIRouter()


def get_service(db: Session = Depends(get_db)) -> PhraseService:
    return PhraseService(db)


@router.get("", response_model=list[PhraseRead])
def list_phrases(service: PhraseService = Depends(get_service)) -> list[PhraseRead]:
    return service.list_phrases()


@router.post("", response_model=PhraseRead, status_code=status.HTTP_201_CREATED)
def create_phrase(
    body: PhraseCreate,
    service: PhraseService = Depends(get_service),
) -> PhraseRead:
    return service.create_phrase(body)


@router.put("/{phrase_id}", response_model=PhraseRead)
def update_phrase(
    phrase_id: int,
    body: PhraseUpdate,
    service: PhraseService = Depends(get_service),
) -> PhraseRead:
    return service.update_phrase(phrase_id, body)


@router.delete("/{phrase_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_phrase(
    phrase_id: int,
    service: PhraseService = Depends(get_service),
) -> None:
    service.delete_phrase(phrase_id)
