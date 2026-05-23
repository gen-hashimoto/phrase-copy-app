from fastapi import FastAPI

# from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health, phrases, auth
from app.db.base import Base
from app.db.session import engine

app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
#

app.include_router(phrases.router, prefix="/phrases")
app.include_router(health.router)
app.include_router(auth.router)

Base.metadata.create_all(bind=engine)
