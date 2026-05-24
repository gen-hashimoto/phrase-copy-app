from fastapi import APIRouter, Depends
from app.schemas.phrase import PhraseCreate, PhraseRead, PhraseUpdate
from app.services.phrase_service import PhraseService
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User

router = APIRouter()


@router.get("", response_model=list[PhraseRead])
def list_phrases(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    service = PhraseService(db)
    return service.list_phrases(current_user.id)


@router.post("", response_model=PhraseRead)
def create_phrase(
    body: PhraseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = PhraseService(db)
    return service.create_phrase(current_user.id, body)


@router.get("/{phrase_id}", response_model=PhraseRead)
def get_phrase(
    phrase_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = PhraseService(db)
    return service.get_phrase(current_user.id, phrase_id)


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
