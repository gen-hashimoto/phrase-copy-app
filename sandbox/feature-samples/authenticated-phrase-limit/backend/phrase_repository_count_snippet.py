from sqlalchemy import func, select

from app.models.phrase import Phrase
from app.schemas.phrase import PhraseCreate


class PhraseRepository:
    # ...

    def count_by_user(self, user_id: str) -> int:
        stmt = select(func.count()).select_from(Phrase).where(Phrase.user_id == user_id)
        return int(self.db.scalar(stmt) or 0)

    def create_for_user(self, user_id: str, body: PhraseCreate) -> Phrase:
        next_position = self.count_by_user(user_id) + 1
        row = Phrase(user_id=user_id, content=body.content, position=next_position)
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row

