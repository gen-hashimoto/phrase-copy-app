## ステップ 2: `phrases.id` を UUID にする

`phrases.id` を integer autoincrement から UUID 文字列に変更する。MySQL ではまず `CHAR(36)` で扱う。

### やること

#### A. Database

`sql/alter-phrases-id-char36.sql` は方針メモ付きの SQL 例。外部キーがまだ無い開発 DB を想定している。

開発 DB を消してよい段階なら、テーブルを作り直す方が簡単。既存データを残すなら、backup table を作ってから UUID を埋める。

#### B. Backend

| ファイル | 変更 |
| ---------- | ------ |
| `backend/app/models/phrase.py` | `id` を `String(36)` にし、Python 側で `uuid4()` を入れる |
| `backend/app/schemas/phrase.py` | `PhraseRead.id: str` |
| `backend/app/repositories/phrase_repository.py` | `phrase_id: str` |
| `backend/app/services/phrase_service.py` | `phrase_id: str` |
| `backend/app/api/routes/phrases.py` | path param `phrase_id: str` |

#### C. Frontend

| ファイル | 変更 |
| ---------- | ------ |
| `frontend/types/phrase.ts` | `id: string` |
| `frontend/components/phrase-manager.tsx` | `editingId`、delete/copy 引数、draft id を string にする |
| `frontend/app/api/phrases/[id]/route.ts` | すでに `id: string` なので変更不要なことが多い |

### `id: number` から `id: string` になる影響

- React の `key` は number / string どちらでも動くが、比較対象の state はすべて string に揃える。
- draft row 用の仮 ID は `-1` ではなく `"__draft__"` のような衝突しない文字列にする。
- backend の path param を `int` のままにすると、UUID が FastAPI の validation で落ちる。
- `id` 順は作成順ではなくなる。並び順は step-06 の `position` で扱う。

### コピー先

```text
backend/app/models/phrase.py
backend/app/schemas/phrase.py
backend/app/repositories/phrase_repository.py
backend/app/services/phrase_service.py
backend/app/api/routes/phrases.py
frontend/types/phrase.ts
frontend/components/phrase-manager.tsx
```

### 動作確認

1. 新規作成した phrase の JSON に UUID 文字列の `id` が入る。
2. 編集 / 削除の URL が `/api/phrases/<uuid>` になる。
3. `GET /api/phrases` が `id: string` の配列を返す。
4. draft row の追加、編集、削除、Copy が壊れていない。

### 次のステップ

`step-03-users-table` で `users` テーブルを追加する。
