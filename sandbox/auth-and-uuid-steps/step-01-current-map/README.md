## ステップ 1: 現状調査

auth と UUID 化の前に、いまのコードがどこで integer id と未認証 API に依存しているかを確認する。

### やること

#### A. integer id 依存箇所

| ファイル | 現状 | step-02 での変更 |
| ---------- | ------ | ------------------ |
| `backend/app/models/phrase.py` | `id: int`, autoincrement | `id: str`, `CHAR(36)`, UUID default |
| `backend/app/schemas/phrase.py` | `PhraseRead.id: int` | `id: str` |
| `backend/app/repositories/phrase_repository.py` | `get_by_id(phrase_id: int)`, `order_by(Phrase.id)` | `str` id。並び順は step-06 で `position` へ |
| `backend/app/services/phrase_service.py` | `phrase_id: int` | `phrase_id: str` |
| `backend/app/api/routes/phrases.py` | path param `phrase_id: int` | `phrase_id: str` |
| `frontend/types/phrase.ts` | `id: number` | `id: string` |
| `frontend/components/phrase-manager.tsx` | `editingId: number \| null`, delete/copy ids | `string \| null`。draft id も文字列にする |

#### B. auth 未実装箇所

| 領域 | 現状 | 後続 step |
| ------ | ------ | ----------- |
| backend route | `/phrases` は誰でも全件取得できる | step-05 / step-06 |
| users table | なし | step-03 |
| Magic Link token | なし | step-03 / step-04 |
| JWT | なし | step-05 |
| cookie | なし | step-05 / step-07 |
| frontend login | なし | step-07 |
| 未ログイン useState | まだ境界が曖昧 | step-06 / step-07 |

#### C. DB の変更対象

1. `phrases.id`: integer autoincrement から UUID 文字列へ。
2. `users`: email と Magic Link token 情報を持つテーブルを追加。
3. `phrases.user_id`: ログインユーザーの phrase だけを返すため追加。
4. `phrases.position`: `id` 順ではなく表示順で並べるため追加。

### コピー先

このステップは調査用なのでコピーするコードはない。`current-map.md` はチェックリストとして使う。

### 動作確認

- `id: int` / `id: number` の場所をすべて説明できる。
- `/phrases` が未認証で全件返ることを理解している。
- `DESIGN-NOTES.md` の差分が今回の実装方針と一致している。

### 次のステップ

`step-02-uuid-phrase-id` で `phrases.id` を UUID 文字列に変更する。
