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
| `GET /api/auth/me` | `GET /auth/me` |
| `POST /api/auth/logout` | `POST /auth/logout` |
| `GET /api/phrases` | cookie を backend に転送して `GET /phrases` |
| `POST /api/phrases` | cookie を backend に転送して `POST /phrases` |
| `PUT /api/phrases/[id]` | cookie を backend に転送して `PUT /phrases/{id}` |
| `DELETE /api/phrases/[id]` | cookie を backend に転送して `DELETE /phrases/{id}` |

#### C. 共通 helper

`API_BASE_URL` を読む `apiOrigin()` は各 route に毎回書かず、`frontend/lib/api-origin.ts` のような helper にまとめる。

```text
frontend/api-origin-snippet.ts -> frontend/lib/api-origin.ts
```

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
frontend/app/page.tsx
frontend/lib/api-origin.ts
frontend/app/api/auth/magic-link/route.ts
frontend/app/api/auth/verify/route.ts
frontend/app/api/auth/me/route.ts
frontend/app/api/auth/logout/route.ts
frontend/app/api/phrases/route.ts
frontend/app/api/phrases/[id]/route.ts
frontend/components/logout-button.tsx
```

### snippet 対応表

```text
frontend/api-origin-snippet.ts -> frontend/lib/api-origin.ts
frontend/auth-magic-link-route-snippet.ts -> frontend/app/api/auth/magic-link/route.ts
frontend/auth-verify-route-snippet.ts -> frontend/app/api/auth/verify/route.ts
frontend/auth-me-route-snippet.ts -> frontend/app/api/auth/me/route.ts
frontend/auth-logout-route-snippet.ts -> frontend/app/api/auth/logout/route.ts
frontend/phrases-route-snippet.ts -> frontend/app/api/phrases/route.ts
frontend/phrases-id-route-snippet.ts -> frontend/app/api/phrases/[id]/route.ts
frontend/login-form-snippet.tsx -> frontend/components/login-form.tsx
frontend/login-page-snippet.tsx -> frontend/app/login/page.tsx
frontend/verify-callback-page-snippet.tsx -> frontend/app/auth/verify/page.tsx
frontend/logout-button-snippet.tsx -> frontend/components/logout-button.tsx
frontend/home-page-auth-flow-snippet.tsx -> frontend/app/page.tsx
```

### 動作確認

1. email を入力して Magic Link request が成功する。
2. 開発用 `dev_link` を開くと verify callback が動く。
3. verify 成功後に phrase list へ遷移する。
4. `/api/phrases` が cookie 付きで backend に転送される。
5. logout 後は未ログイン top に戻る。

### 次のステップ

`step-08-polish-notes` で本番化前の設定・移行・テスト観点を確認する。
