from fastapi import FastAPI

from app.api.routes import health, phrases
from app.db.base import Base
from app.db.session import engine

app = FastAPI()

app.include_router(phrases.router, prefix="/phrases")
app.include_router(health.router)

Base.metadata.create_all(bind=engine)
