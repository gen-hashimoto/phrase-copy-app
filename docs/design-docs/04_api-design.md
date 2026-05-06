# API Design

---

## 1. 共通事項

- Base URL: `TODO`
- 認証方式: `Authorization: Bearer <JWT>`
- 日時フォーマット: ISO 8601(UTC)
- エラーフォーマット
  - `{"error": {"code": "...", "message": "...", "details": {...}}}`
- 一覧取得の基本
  - MVPは一覧をまとめて返し、検索・絞り込みは実装しない
  - 件数増加時のみ `limit` / `offset` を検討 `TODO`
- 未ログイン時の件数上限表示はフロントで完結させる想定。

---

## 2. API一覧

### 2-1. auth

### POST `/auth/magic-link/request`

- 概要: メールアドレスにログインリンクを送信
- Auth: not required

### POST `/auth/magic-link/verify`

- 概要: トークンを検証してアクセストークン発行
- Auth: not required

### POST `/auth/me`

- 概要: Bearerトークンからログイン中ユーザーを返す
- Auth: required

---

### 2-2. phrases

### GET `/phrases/`

- 概要: フレーズ一覧取得
- Auth: required (Bearer JWT)

### POST `/phrases/`

- 概要: フレーズ作成
- Auth: required (Bearer JWT)

### PATCH `/phrases/{phrase_id}`

- 概要: フレーズ更新
- Auth: required (Bearer JWT)

### DELETE `/phrases/{phrase_id}`

- 概要: フレーズ削除
- Auth: required (Bearer JWT)

### PATCH `/phrases/reorder`

- 概要: 並び順をまとめて更新
- Auth: required (Bearer JWT)

### PATCH `/phrases/import`

- 概要: テキストから一括登録
- Auth: required (Bearer JWT)
