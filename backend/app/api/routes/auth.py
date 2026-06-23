from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.auth_tokens import (
    create_magic_link_token,
    hash_magic_link_token,
    magic_link_expires_at,
)
from app.core.jwt_cookie import (
    clear_auth_cookie,
    create_access_token,
    read_user_id_from_request,
    set_auth_cookie,
)
from app.models.user import User
from app.settings import settings
from app.services.email_service import send_magic_link_email
from app.core.rate_limit import check_rate_limit, client_ip

router = APIRouter(prefix="/auth", tags=["auth"])


class MagicLinkRequest(BaseModel):
    email: EmailStr


class MagicLinkResponse(BaseModel):
    ok: bool
    message: str
    # Development only. Production should send the email and return None here.
    dev_link: str | None = None


class MagicLinkVerifyRequest(BaseModel):
    token: str


# The frontend checks this stable code instead of parsing human-readable text.
TOKEN_INVALID = "TOKEN_INVALID"
TOKEN_EXPIRED = "TOKEN_EXPIRED"
TOKEN_USED = "TOKEN_USED"

RATE_LIMITED = "RATE_LIMITED"

MAGIC_LINK_IP_LIMIT = 5
MAGIC_LINK_IP_WINDOW_SECONDS = 15 * 60
MAGIC_LINK_EMAIL_LIMIT = 3
MAGIC_LINK_EMAIL_WINDOW_SECONDS = 15 * 60


def ensure_utc(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


@router.post("/magic-link", response_model=MagicLinkResponse)
def request_magic_link(
    body: MagicLinkRequest, request: Request, db: Session = Depends(get_db)
):
    ip = client_ip(request)
    if not check_rate_limit(
        f"ip:{ip}",
        max_count=MAGIC_LINK_IP_LIMIT,
        window_seconds=MAGIC_LINK_IP_WINDOW_SECONDS,
    ):
        raise HTTPException(
            status_code=429,
            detail={
                "code": RATE_LIMITED,
                "message": "Too many requests. Please try again later.",
            },
        )

    email = body.email.lower()

    if not check_rate_limit(
        f"email:{email}",
        max_count=MAGIC_LINK_EMAIL_LIMIT,
        window_seconds=MAGIC_LINK_EMAIL_WINDOW_SECONDS,
    ):
        raise HTTPException(
            status_code=429,
            detail={
                "code": RATE_LIMITED,
                "message": "Too many requests for this email. Please try again later.",
            },
        )

    user = db.scalar(select(User).where(User.email == email))
    is_new_user = user is None  # For email body only; omit from API response

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

    # Same message for new and existing users (prevents enumeration)
    success_message = "メールを確認してください。届いたリンクからログインできます。"

    # Development only. Production should send email and return no token-bearing URL.
    if settings.is_development:
        return MagicLinkResponse(
            ok=True, message=success_message, dev_link=f"/auth/verify?token={token}"
        )

    # For production, send magic link here.
    verify_url = f"{settings.app_origin}/auth/verify?token={token}"
    send_magic_link_email(email, verify_url, is_new_user=is_new_user)
    return MagicLinkResponse(ok=True, message=success_message, dev_link=None)


@router.post("/magic-link/verify")
def verify_magic_link(
    body: MagicLinkVerifyRequest, response: Response, db: Session = Depends(get_db)
):
    # Compare the hashed token because only the hash is stored in the database.
    token_hash = hash_magic_link_token(body.token)
    user = db.scalar(select(User).where(User.magic_link_token_hash == token_hash))
    now = datetime.now(timezone.utc)

    # Treat missing, expired, or already-used links as failed authentication.
    if user is None:
        raise HTTPException(
            status_code=401,
            detail={"code": TOKEN_INVALID, "message": "Invalid magic link"},
        )

    expires_at = user.magic_link_expires_at
    if expires_at is None or ensure_utc(expires_at) <= now:
        raise HTTPException(
            status_code=401,
            detail={"code": TOKEN_EXPIRED, "message": "Magic link expired"},
        )

    if user.magic_link_used_at is not None:
        raise HTTPException(
            status_code=401,
            detail={"code": TOKEN_USED, "message": "Magic link already used"},
        )

    # Mark the link consumed before issuing the session cookie.
    user.magic_link_used_at = now
    db.commit()

    # The JWT is returned only as an HttpOnly cookie; the JSON body is UI data.
    jwt_token = create_access_token(user.id, settings.jwt_secret)
    set_auth_cookie(response, jwt_token, secure=settings.cookie_secure)
    return {"ok": True, "user": {"id": user.id, "email": user.email}}


@router.post("/logout")
def logout(response: Response):
    clear_auth_cookie(response, secure=settings.cookie_secure)
    return {"ok": True}


@router.get("/me")
def get_me(request: Request, db: Session = Depends(get_db)):
    # Reload the user from the signed JWT subject stored in the cookie.
    user_id = read_user_id_from_request(request, settings.jwt_secret)
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {"user": {"id": user.id, "email": user.email}}
