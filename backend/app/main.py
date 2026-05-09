from fastapi import FastAPI
from sqlalchemy import text
from app.db.session import SessionLocal

app = FastAPI()


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
