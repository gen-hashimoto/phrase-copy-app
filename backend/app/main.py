from fastapi import FastAPI
from sqlalchemy import select, text
from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models import phrase  # noqa: F401 # Base.metadata に登録するため
from app.schemas.phrase import PhraseCreate, PhraseUpdate
from fastapi import FastAPI, HTTPException

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


@app.get("/phrases/{phrase_id}")
def get_phrase(phrase_id: int):  # todo: id はuuidの予定
    db = SessionLocal()
    try:
        row = db.get(phrase.Phrase, phrase_id)
        if row is None:
            raise HTTPException(status_code=404, detail="Phrase not found")
        return row
    finally:
        db.close()


@app.delete("/phrases/{phrase_id}")
def delete_phrase(phrase_id: int):
    db = SessionLocal()
    try:
        row = db.get(phrase.Phrase, phrase_id)
        if row is None:
            raise HTTPException(status_code=404, detail="Phrase not found")

        db.delete(row)
        db.commit()
        return {"deleted": True}
    finally:
        db.close()


@app.put("/phrases/{phrase_id}")
def update_phrase(phrase_id: int, body: PhraseUpdate):
    db = SessionLocal()
    try:
        row = db.get(phrase.Phrase, phrase_id)
        if row is None:
            raise HTTPException(status_code=404, detail="Phrase not found")
        if body.title is None and body.content is None:
            raise HTTPException(status_code=400, detail="title or content is required")

        if body.title is not None:
            row.title = body.title
        if body.content is not None:
            row.content = body.content

        db.commit()
        db.refresh(row)
        return row
    finally:
        db.close()
