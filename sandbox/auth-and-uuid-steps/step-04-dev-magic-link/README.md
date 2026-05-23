## ステップ 4: 開発用 Magic Link を作る

`POST /auth/magic-link` で email を受け取り、user を upsert し、Magic Link token を発行する。開発中はメール送信せず `dev_link` を返してよい。

### やること

#### A. Backend

| ファイル | 変更 |
| ---------- | ------ |
| `backend/app/api/routes/auth.py` | `POST /auth/magic-link` を追加 |
| `backend/app/core/auth_tokens.py` など | token 生成、hash、期限を切り出す |
| `backend/app/main.py` または router 集約 | auth router を include |

サンプルは `backend/` 配下。

#### B. Frontend proxy

frontend から直接 backend origin を叩かず、Next.js の `/api/auth/magic-link` で proxy する。開発時の origin 差分と cookie 処理を後続 step でまとめやすくするため。

### 本番注意

- `dev_link` は開発専用。本番では絶対に返さない。
- token 平文は DB に保存しない。DB には hash のみ保存する。
- Magic Link request にはレート制限が必要。本教材では詳細実装しない。

### コピー先

```text
backend/app/api/routes/auth.py
backend/app/core/auth_tokens.py
frontend/app/api/auth/magic-link/route.ts
.env.example
```

### 動作確認

1. `POST /auth/magic-link` に `{ "email": "test@example.com" }` を送る。
2. `users` に user が作成または更新される。
3. response の `dev_link` に token が含まれる。
4. DB には token 平文ではなく hash が入る。
5. 不正な email は `422` または `400` になる。

### 次のステップ

`step-05-verify-and-jwt-cookie` で `dev_link` の token を検証し、JWT cookie を発行する。
