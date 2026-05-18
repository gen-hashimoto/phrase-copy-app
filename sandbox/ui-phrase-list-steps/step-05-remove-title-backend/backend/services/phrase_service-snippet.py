"""Snippet: backend/app/services/phrase_service.py (excerpt)."""
def create_phrase(self, body: PhraseCreate) -> Phrase:
    return self.repo.create(body.content)


def update_phrase(self, phrase_id: int, body: PhraseUpdate) -> Phrase:
    row = self.repo.get_by_id(phrase_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Phrase not found")
    return self.repo.update(row, body.content)
