# API Design

---

## 1. 共通事項

---

- Base URL: `TODO`
- 認証方式: `Authorization: Bearer <JWT>`
- 日時フォーマット: ISO 8601(UTC)
- エラーフォーマット
  - `{"error": {"code": "...", "message": "...", "details": {...}}}`
- 一覧取得の基本
  - MVPは一覧をまとめて返し、検索・絞り込みは実装しない
  - 件数増加時のみ `limit` / `offset` を検討 `TODO`
- 未ログイン時の状態管理はフロントで完結させる想定

### ステータスコード方針（ラフ）

- `200`: 取得/更新成功
- `201`: 作成成功
- `202`: 非同期受付（メール送信など）
- `400`: バリデーションエラー
- `401`: 認証エラー
- `403`: 権限エラー
- `404`: 対象なし
- `409`: 競合（並び順更新など）
- `429`: レート制限

---

## 2. API一覧

---

### 2-1. auth

---

#### POST `/auth/magic-link/request`

- 概要: メールアドレスにログインリンクを送信
- Auth: not required

##### Request

- Body
  - `email`
- Example

  ```json
  {
    "email": "taro@example.com"
  }
  ```

##### Response

- Status: `201 Created`
- Schema: null
- Example

  ```json
  null
  ```

##### Error

`TODO`

##### Note

`TODO`

---

#### POST `/auth/magic-link/verify`

- 概要: トークンを検証してアクセストークン発行
- Auth: not required

##### Request

- Header
- `Content-Type`: `application/x-www-formurlencoded`
- Body
  - `email`
- Example

  ```text
  email=taro@example.com
  ```

##### Response

- Status: `200 OK`
- Schema: object
  - `access_token`: string
  - `token_type`: string
- Example

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

##### Error

- Auth error
  - Status: `401 Unauthorized`
  - Body

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Could not validate user.",
    "details": null
  }
}
```

##### Note

- FastAPI の `OAuth2PasswordRequestForm` を使っているため JSON ではなく form 形式で送る
- アクセストークンの有効期限は1週間

---

#### POST `/auth/me`

- 概要: Bearerトークンからログイン中ユーザーを返す
- Auth: required

##### Request

- Body
  - ``
- Example

  ```json
  {
    "": ""
  }
  ```

##### Response

- Status: ``
- Schema:
- Example

  ```json

  ```

##### Error

`TODO`

##### Note

`TODO`

---

### 2-2. phrases

---

#### GET `/phrases/`

- 概要: フレーズ一覧取得
- Auth: required (Bearer JWT)

##### Request

- Body
  - ``
- Example

  ```json
  {
    "": ""
  }
  ```

##### Response

- Status: ``
- Schema:
- Example

  ```json

  ```

##### Error

`TODO`

##### Note

`TODO`

---

#### POST `/phrases/`

- 概要: フレーズ作成
- Auth: required (Bearer JWT)

##### Request

- Body
  - ``
- Example

  ```json
  {
    "": ""
  }
  ```

##### Response

- Status: ``
- Schema:
- Example

  ```json

  ```

##### Error

`TODO`

##### Note

`TODO`

---

#### PATCH `/phrases/{phrase_id}`

- 概要: フレーズ更新
- Auth: required (Bearer JWT)

##### Request

- Body
  - ``
- Example

  ```json
  {
    "": ""
  }
  ```

##### Response

- Status: ``
- Schema:
- Example

  ```json

  ```

##### Error

`TODO`

##### Note

`TODO`

---

#### DELETE `/phrases/{phrase_id}`

- 概要: フレーズ削除
- Auth: required (Bearer JWT)

##### Request

- Body
  - ``
- Example

  ```json
  {
    "": ""
  }
  ```

##### Response

- Status: ``
- Schema:
- Example

  ```json

  ```

##### Error

`TODO`

##### Note

`TODO`

---

#### PATCH `/phrases/reorder`

- 概要: 並び順をまとめて更新
- Auth: required (Bearer JWT)

##### Request

- Body
  - ``
- Example

  ```json
  {
    "": ""
  }
  ```

##### Response

- Status: ``
- Schema:
- Example

  ```json

  ```

##### Error

`TODO`

##### Note

`TODO`

---

#### PATCH `/phrases/import`

- 概要: テキストから一括登録
- Auth: required (Bearer JWT)

##### Request

- Body
  - ``
- Example

  ```json
  {
    "": ""
  }
  ```

##### Response

- Status: ``
- Schema:
- Example

  ```json

  ```

##### Error

`TODO`

##### Note

`TODO`
