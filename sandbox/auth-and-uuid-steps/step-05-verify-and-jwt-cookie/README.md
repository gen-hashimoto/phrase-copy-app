## ステップ 5: Magic Link 検証と JWT cookie

Magic Link token を検証し、有効なら JWT を発行して httpOnly cookie に保存する。logout では cookie を削除する。

### やること

#### A. Backend

| ファイル | 変更 |
| ---------- | ------ |
| `backend/app/api/routes/auth.py` | `POST /auth/magic-link/verify`, `GET /auth/me`, `POST /auth/logout` |
| `backend/app/core/auth_tokens.py` | JWT encode/decode、cookie 設定 |
| `backend/app/api/deps.py` | cookie から current user を取得する dependency |

#### B. token 検証ルール

1. request token を hash 化して `users.magic_link_token_hash` と照合する。
2. `magic_link_expires_at` が現在時刻より後であることを確認する。
3. `magic_link_used_at` が `NULL` であることを確認する。
4. 成功したら `magic_link_used_at` を現在時刻に更新する。
5. JWT を発行し、httpOnly cookie に保存する。

#### C. `GET /auth/me`

JWT cookie が有効なとき、現在ログイン中の user を返す確認用 endpoint を追加する。

- cookie が無い、または JWT が不正なら `401`。
- JWT の `sub` から `users.id` を取り出し、DB の user を返す。
- frontend は token を直接読まず、この endpoint でログイン状態を確認できる。

### cookie 方針

- `HttpOnly`: JavaScript から読めないようにする。
- `SameSite=Lax`: Magic Link callback の通常遷移と相性がよい。
- `Secure`: production では `true`、local http では `false`。
- frontend は token を localStorage に保存しない。

### コピー先

```text
backend/app/api/routes/auth.py
backend/app/core/auth_tokens.py
backend/app/api/deps.py
frontend/app/api/auth/verify/route.ts
.env.example
```

### 動作確認

1. step-04 の `dev_link` から token を取り出す。
2. `POST /auth/magic-link/verify` で cookie が返る。
3. 同じ token をもう一度使うと失敗する。
4. 期限切れ token は失敗する。
5. cookie 付きの `GET /auth/me` が user を返す。
6. cookie 無しの `GET /auth/me` は `401` になる。
7. `POST /auth/logout` で cookie が削除される。

### 次のステップ

`step-06-user-phrases` で cookie から current user を解決し、phrase API を user scope にする。
