from fastapi import FastAPI
from sqlalchemy import select, text
from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models import phrase  # noqa: F401 # Base.metadata に登録するため
from app.schemas.phrase import PhraseCreate

app = FastAPI()
Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/db-health")
def db_health():
    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
        return {"db": "ok"}
    finally:
        db.close()


@app.get("/phrases")
def list_phrases():
    db = SessionLocal()
    try:
        stmt = select(phrase.Phrase).order_by(phrase.Phrase.id.asc())
        return list(db.scalars(stmt).all())
    finally:
        db.close()


@app.post("/phrases")
def create_phrase(body: PhraseCreate):
    db = SessionLocal()
    try:
        row = phrase.Phrase(title=body.title, content=body.content)
        db.add(row)
        db.commit()
        db.refresh(row)
        return row
    finally:
        db.close()
