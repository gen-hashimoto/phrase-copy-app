from fastapi import APIRouter, Depends
from app.schemas.phrase import PhraseCreate, PhraseRead, PhraseUpdate
from app.services.phrase_service import PhraseService
from sqlalchemy.orm import Session
from app.api.deps import get_db

router = APIRouter()


@router.get("", response_model=list[PhraseRead])
def list_phrases(db: Session = Depends(get_db)):
    service = PhraseService(db)
    return service.list_phrases()


@router.post("", response_model=PhraseRead)
def create_phrase(body: PhraseCreate, db: Session = Depends(get_db)):
    service = PhraseService(db)
    return service.create_phrase(body)


@router.get("/{phrase_id}", response_model=PhraseRead)
def get_phrase(phrase_id: int, db: Session = Depends(get_db)):  # todo: id はuuidの予定
    service = PhraseService(db)
    return service.get_phrase(phrase_id)


@router.delete("/{phrase_id}")
def delete_phrase(phrase_id: int, db: Session = Depends(get_db)):
    service = PhraseService(db)
    service.delete_phrase(phrase_id)
    return {"deleted": True}


@router.put("/{phrase_id}", response_model=PhraseRead)
def update_phrase(phrase_id: int, body: PhraseUpdate, db: Session = Depends(get_db)):
    service = PhraseService(db)
    return service.update_phrase(phrase_id, body)
