from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.db.base import Base
from app.db.session import engine
from app.schemas.phrase import PhraseCreate, PhraseRead, PhraseUpdate
from app.services.phrase_service import PhraseService

app = FastAPI()
Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/db-health")
def db_health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"db": "ok"}


@app.get("/phrases", response_model=list[PhraseRead])
def list_phrases(db: Session = Depends(get_db)):
    service = PhraseService(db)
    return service.list_phrases()


@app.post("/phrases", response_model=PhraseRead)
def create_phrase(body: PhraseCreate, db: Session = Depends(get_db)):
    service = PhraseService(db)
    return service.create_phrase(body)


@app.get("/phrases/{phrase_id}", response_model=PhraseRead)
def get_phrase(phrase_id: int, db: Session = Depends(get_db)):  # todo: id はuuidの予定
    service = PhraseService(db)
    return service.get_phrase(phrase_id)


@app.delete("/phrases/{phrase_id}")
def delete_phrase(phrase_id: int, db: Session = Depends(get_db)):
    service = PhraseService(db)
    service.delete_phrase(phrase_id)
    return {"deleted": True}


@app.put("/phrases/{phrase_id}", response_model=PhraseRead)
def update_phrase(phrase_id: int, body: PhraseUpdate, db: Session = Depends(get_db)):
    service = PhraseService(db)
    return service.update_phrase(phrase_id, body)
