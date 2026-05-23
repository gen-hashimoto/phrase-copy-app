from datetime import datetime

from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.auth_tokens import (
    create_magic_link_token,
    hash_magic_link_token,
    magic_link_expires_at,
)
from app.models.user import User


router = APIRouter(prefix="/auth", tags=["auth"])


class MagicLinkRequest(BaseModel):
    email: EmailStr


class MagicLinkResponse(BaseModel):
    ok: bool
    dev_link: str | None = None


@router.post("/magic-link", response_model=MagicLinkResponse)
def request_magic_link(body: MagicLinkRequest, db: Session = Depends(get_db)):
    email = body.email.lower()
    user = db.scalar(select(User).where(User.email == email))
    if user is None:
        user = User(email=email)
        db.add(user)

    token = create_magic_link_token()
    user.magic_link_token_hash = hash_magic_link_token(token)
    user.magic_link_expires_at = magic_link_expires_at()
    user.magic_link_used_at = None
    user.updated_at = datetime.utcnow()

    db.commit()

    # Development only. Production should send email and return no token-bearing URL.
    return MagicLinkResponse(ok=True, dev_link=f"/auth/verify?token={token}")
