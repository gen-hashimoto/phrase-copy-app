"""Snippet: backend/app/repositories/phrase_repository.py (excerpt)."""
from app.models.phrase import Phrase


def create(self, content: str) -> Phrase:
    row = Phrase(content=content)
    self.db.add(row)
    self.db.commit()
    self.db.refresh(row)
    return row


def update(self, row: Phrase, content: str) -> Phrase:
    row.content = content
    self.db.commit()
    self.db.refresh(row)
    return row
