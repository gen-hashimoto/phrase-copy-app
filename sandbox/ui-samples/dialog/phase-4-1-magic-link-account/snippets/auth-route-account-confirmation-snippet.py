from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
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
    # The frontend sends False for the first request.
    # It sends True only after the user confirms the AlertDialog.
    confirm_account_creation: bool = False


class MagicLinkResponse(BaseModel):
    ok: bool
    # Development only. Production should send the email and return None here.
    dev_link: str | None = None


# The frontend checks this stable code instead of parsing human-readable text.
ACCOUNT_CREATION_CONFIRMATION_REQUIRED = "ACCOUNT_CREATION_CONFIRMATION_REQUIRED"


@router.post("/magic-link", response_model=MagicLinkResponse)
def request_magic_link(body: MagicLinkRequest, db: Session = Depends(get_db)):
    # Normalize email before lookup so casing does not create separate accounts.
    email = body.email.lower()
    user = db.scalar(select(User).where(User.email == email))

    # Important invariant:
    # If this email is new, do not create a User until the user has explicitly
    # accepted the "an account will be created" dialog.
    if user is None and not body.confirm_account_creation:
        raise HTTPException(
            status_code=409,
            detail={
                "code": ACCOUNT_CREATION_CONFIRMATION_REQUIRED,
                "message": "Account creation confirmation is required.",
            },
        )

    # This branch runs only after confirmation for new users.
    # Existing users skip this branch and receive a normal magic link.
    if user is None:
        user = User(email=email)
        db.add(user)

    # From here on, both paths are identical:
    # store a one-time magic link token on the user record.
    token = create_magic_link_token()
    user.magic_link_token_hash = hash_magic_link_token(token)
    user.magic_link_expires_at = magic_link_expires_at(None)
    user.magic_link_used_at = None
    user.updated_at = datetime.now(timezone.utc)

    # The account creation and token update are committed together.
    # If the commit fails, the user should not receive a usable link.
    db.commit()

    # Development only. Production should send email and return no token-bearing URL.
    return MagicLinkResponse(ok=True, dev_link=f"/auth/verify?token={token}")
