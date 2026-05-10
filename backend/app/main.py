from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import select, text
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.db.base import Base
from app.db.session import engine
from app.models import phrase  # noqa: F401 # Base.metadata に登録するため
from app.schemas.phrase import PhraseCreate, PhraseRead, PhraseUpdate
from app.repositories.phrase_repository import PhraseRepository

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
    repo = PhraseRepository(db)
    return repo.list_all()


@app.post("/phrases", response_model=PhraseRead)
def create_phrase(body: PhraseCreate, db: Session = Depends(get_db)):
    repo = PhraseRepository(db)
    return repo.create(body.title, body.content)


@app.get("/phrases/{phrase_id}", response_model=PhraseRead)
def get_phrase(phrase_id: int, db: Session = Depends(get_db)):  # todo: id はuuidの予定
    repo = PhraseRepository(db)
    row = repo.get_by_id(phrase_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Phrase not found")
    return row


@app.delete("/phrases/{phrase_id}")
def delete_phrase(phrase_id: int, db: Session = Depends(get_db)):
    repo = PhraseRepository(db)
    row = repo.get_by_id(phrase_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Phrase not found")

    repo.delete(row)
    return {"deleted": True}


@app.put("/phrases/{phrase_id}", response_model=PhraseRead)
def update_phrase(phrase_id: int, body: PhraseUpdate, db: Session = Depends(get_db)):
    repo = PhraseRepository(db)
    row = repo.get_by_id(phrase_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Phrase not found")
    if body.title is None and body.content is None:
        raise HTTPException(status_code=400, detail="title or content is required")

    row = repo.update(row, body.title, body.content)
    return row
