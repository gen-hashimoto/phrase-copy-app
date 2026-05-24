from collections.abc import Generator

from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.core.jwt_cookie import read_user_id_from_request
from app.db.session import SessionLocal
from app.models.user import User
from app.settings import settings


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> User:
    # The JWT is stored in an HttpOnly cookie, so routes use the request cookie.
    user_id = read_user_id_from_request(request, settings.jwt_secret)
    user = db.get(User, user_id)
    if user is None:
        # A valid token can still point to a user that was deleted.
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user
