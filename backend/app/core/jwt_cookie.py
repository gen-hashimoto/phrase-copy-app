from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from fastapi import HTTPException, Request, Response

MAGIC_LINK_TOKEN_BYTES = 32
MAGIC_LINK_TTL_MINUTES = 15

AUTH_COOKIE_NAME = "phrase_copy_session"
JWT_ALGORITHM = "HS256"
JWT_TTL_MINUTES = 60 * 24


def create_access_token(user_id: str, secret: str) -> str:
    now = datetime.now(timezone.utc)
    # Keep the JWT payload small: the user id is enouth to reload the user later.
    payload: dict[str, Any] = {
        "sub": user_id,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=JWT_TTL_MINUTES)).timestamp()),
    }
    return jwt.encode(payload, secret, algorithm=JWT_ALGORITHM)


def read_user_id_from_request(request: Request, secret: str) -> str:
    # The browser sends this cookie automatically; frontend JavaScript does not read it.
    token = request.cookies.get(AUTH_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        # Decode also verifies the signature and expiration.
        payload = jwt.decode(token, secret, algorithms=[JWT_ALGORITHM])
    except jwt.PyJWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid token") from exc
    user_id = payload.get("sub")
    if not isinstance(user_id, str):
        raise HTTPException(status_code=401, detail="Invalid token")
    return user_id


def set_auth_cookie(response: Response, token: str, secure: bool) -> None:
    # Store the JWT in an HttpOnly cookie so it is not exposed to document.cookie.
    response.set_cookie(
        AUTH_COOKIE_NAME,
        token,
        httponly=True,
        secure=secure,
        samesite="lax",
        max_age=JWT_TTL_MINUTES * 60,
        path="/",
    )


def clear_auth_cookie(response: Response, secure: bool) -> None:
    # Use the same cookie attributes when deleting so the browser matches it.
    response.delete_cookie(AUTH_COOKIE_NAME, secure=secure, samesite="lax", path="/")
