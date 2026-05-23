## ステップ 7: frontend の認証フロー

login form、Magic Link request、verify callback、logout、API proxy の cookie 転送をつなぐ。

### やること

#### A. 画面

| ファイル例 | 役割 |
| ------------ | ------ |
| `frontend/app/login/page.tsx` | email 入力と Magic Link request |
| `frontend/app/auth/verify/page.tsx` | URL の `token` を `/api/auth/verify` に渡す |
| `frontend/app/page.tsx` | 未ログイン top とログイン済み phrase list を切り替える |
| `frontend/components/logout-button.tsx` | logout |

#### B. API proxy

| route | backend |
| ------- | --------- |
| `POST /api/auth/magic-link` | `POST /auth/magic-link` |
| `POST /api/auth/verify` | `POST /auth/magic-link/verify` |
| `POST /api/auth/logout` | `POST /auth/logout` |
| `/api/phrases` | cookie を backend に転送して `/phrases` |

### cookie を扱うポイント

- Browser は frontend origin の cookie を持つ。
- Next.js API route は request の `cookie` header を backend に転送する。
- backend が返した `Set-Cookie` は Next.js response に転送する。
- Client component で JWT を読む必要はない。

### 未ログイン top とログイン済み phrase list の切り替え

- `GET /api/auth/me` または `GET /api/phrases` の `401` で未ログイン扱いにする。
- 未ログイン時は `GuestPhraseList` のような `useState` UI を出す。
- ログイン済みは server fetch で phrase を読み、`PhraseManager` に渡す。

### コピー先

```text
frontend/app/login/page.tsx
frontend/app/auth/verify/page.tsx
frontend/app/api/auth/magic-link/route.ts
frontend/app/api/auth/verify/route.ts
frontend/app/api/auth/logout/route.ts
frontend/app/api/phrases/route.ts
frontend/app/api/phrases/[id]/route.ts
frontend/components/logout-button.tsx
```

### 動作確認

1. email を入力して Magic Link request が成功する。
2. 開発用 `dev_link` を開くと verify callback が動く。
3. verify 成功後に phrase list へ遷移する。
4. `/api/phrases` が cookie 付きで backend に転送される。
5. logout 後は未ログイン top に戻る。

### 次のステップ

`step-08-polish-notes` で本番化前の設定・移行・テスト観点を確認する。
