from fastapi import HTTPException

from app.core.phrase_limits import FREE_USER_PHRASE_LIMIT
from app.models.phrase import Phrase
from app.schemas.phrase import PhraseCreate


class PhraseService:
    # ...

    def create_phrase(self, user_id: str, body: PhraseCreate) -> Phrase:
        current_count = self.repo.count_by_user(user_id)

        if current_count >= FREE_USER_PHRASE_LIMIT:
            raise HTTPException(
                status_code=409,
                detail=f"上限は{FREE_USER_PHRASE_LIMIT}件です。",
            )

        return self.repo.create_for_user(user_id, body)

