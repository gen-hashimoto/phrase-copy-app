# current map checklist

## integer id

- [ ] `backend/app/models/phrase.py`
- [ ] `backend/app/schemas/phrase.py`
- [ ] `backend/app/repositories/phrase_repository.py`
- [ ] `backend/app/services/phrase_service.py`
- [ ] `backend/app/api/routes/phrases.py`
- [ ] `frontend/types/phrase.ts`
- [ ] `frontend/components/phrase-manager.tsx`
- [ ] `frontend/app/api/phrases/[id]/route.ts`

## auth gap

- [ ] `users` table does not exist.
- [ ] Magic Link request endpoint does not exist.
- [ ] Magic Link verify endpoint does not exist.
- [ ] JWT issuing and verification do not exist.
- [ ] httpOnly auth cookie does not exist.
- [ ] `/phrases` returns all rows without user scope.
- [ ] frontend login and logout flow do not exist.

## DB changes

- [ ] Change `phrases.id` to UUID string.
- [ ] Add `users`.
- [ ] Add `phrases.user_id`.
- [ ] Add `phrases.position`.
