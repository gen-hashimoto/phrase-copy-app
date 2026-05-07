# API Design (Sample / Rough)

このファイルは「実装しながら更新する」前提のたたき台です。  
`docs/design-docs/04_api-design.md` の見出し・エンドポイント構成を下敷きにし、未確定は `TODO` で残します。

---

## 0. このドキュメントの目的

- 実装時に迷わない最低限のAPI仕様を揃える
- フロントとバックで認識を合わせる
- 変更が出たらこのファイルに追記する（履歴はGitで管理）

---

## 1. 共通仕様（最小）

- Base URL: `TODO`（例: `/api/v1`）
- 認証方式: `Authorization: Bearer <JWT>`
- 日時フォーマット: ISO 8601（UTC）
- エラーフォーマット（共通）
  - `{"error":{"code":"...","message":"...","details":{}}}`
- 一覧取得の基本
  - MVPは一覧をまとめて返し、検索・絞り込みは実装しない（下記「フロント側の処理」参照）
  - 件数増加時のみ `limit` / `offset` を検討（`TODO`）
- 未ログイン時の状態管理（件数上限・UI表示など）はフロントで完結させる想定（サーバに載せる場合は別途サーバ側制限が必要）

---

## 1-A. フロント側の処理（この見本ではAPIに載せない）

- **検索（リアルタイム）**: React で保持している一覧を、入力に応じてクライアント側でフィルタする。
  - 要件どおり大小文字無視・部分一致はフロントのロジックで対応してよい。
  - API に検索クエリ（`q` など）は載せない想定。
- **未ログイン時の件数上限（例: 10件）**: 追加操作の可否・画面上の「8 / 10」表示はフロントで完結させる想定。
  - ゲストのデータが **ブラウザ内ストレージのみ**でサーバを経由しないなら、この考え方に無理はない。
  - ゲストからも **Phrase API で永続保存**するときは、検証だけフロントだと迂回しやすい。本番想定ではサーバ側チェックも入れる、`TODO`。

---

## 2. API一覧（MVP）

パス末尾の `/` はバックエンドのルーティングに合わせて統一する（本紙では `GET/POST /phrases/` 表記）。

### 2-1. auth

#### POST `/auth/magic-link/request`

- 概要: メールアドレスにログインリンクを送信
- Auth: not required
- Request（JSON）: `{ "email": "user@example.com" }`
- Response（本紙04）: `201 Created`、body `null`
- **方針メモ**: 共通の「`202` = 非同期受付（メール送信など）」と揃えるなら **`202 Accepted` + 本文なし or 最小JSON** の方が自然。どちらにするか `TODO`
- `TODO`: 再送制限（rate limit）、同一メールへの連打

#### POST `/auth/magic-link/verify`

- 概要: トークンを検証してアクセストークン発行
- Auth: not required
- Request（本紙04）:
  - `Content-Type`: `application/x-www-form-urlencoded`（本紙では `application/x-www-formurlencoded` と typo になっているので修正すること）
  - Body（form）: 本紙04では `email` のみの例だが、Magic Link の検証では通常 **メール内リンクの `token`**（および必要なら `email`）が必須。実装に合わせて本紙04の Request を直す、`TODO`
  - FastAPI の `OAuth2PasswordRequestForm` を使う場合は、フィールド名を `username` / `password` に寄せるか、独自フォームにするかを先に決める
- Response: `{ "access_token": "...", "token_type": "bearer" }`（`token_type` の大文字小文字はクライアントで許容するか決める）
- `TODO`: 有効期限切れ・使い回し時の `error.code` 定義
- Note（本紙04より）: アクセストークン有効期限は例として1週間、など

#### GET `/auth/me`

- 概要: Bearer トークンからログイン中ユーザーを返す
- Auth: required
- Request: body なし（GET）
- Response（例）: `{ "id": "...", "email": "...", "plan": "guest|user" }`（フィールドはDB・JWTクレームに合わせる）
- **本紙04との差**: 本紙では `POST /auth/me` になっているが、取得系は GET が適切。設計書・実装は GET に揃えることを推奨。
- **必須か**: 必須ではない。`verify` のレスポンスに `user` を含めれば、ログイン直後はそれだけでよい。
- **あると便利**: ページ再読み込み後に LocalStorage の JWT だけ残っているときのユーザー情報復元、サーバ側の正としてのメール等取得、`401` でセッション切れを検知しやすい。
- **なくす場合**: フロントは `verify` の `user` を保存する／JWT をデコードして表示する（クレーム設計が必要、`TODO`）。

---

### 2-2. phrases

#### GET `/phrases/`

- 概要: フレーズ一覧取得（クライアントがこの結果を使ってリアルタイム検索）
- Auth: required（本紙04）／未ログインも許可するかは `TODO`
- Request: GET のため body なし（本紙04の空 JSON 例は削除してよい）
- Query: なし（MVP）。将来、件数が増えたらページネーション用を追加する想定
- Response（例）: `[{ "id": "...", "phrase": "...", "position": 1, "created_at": "...", "updated_at": "..." }, ...]`

#### POST `/phrases/`

- 概要: フレーズ作成
- Auth: required（本紙04）／ゲスト永続をAPIに載せるなら別設計、`TODO`
- Request（例）:
  - `phrase` (string, required)
  - `position` (number, optional) - 未指定なら末尾など、サーバ規約で決める
- Response: `201 Created` + 作成された Phrase オブジェクト（推奨）または `id` のみ、`TODO`
- 備考: 未ログイン10件上限を APIで返さない 方針なら、このエンドポイントはログイン済み専用に寄せやすい

#### PATCH `/phrases/{phrase_id}`

- 概要: フレーズ更新
- Auth: required（所有者チェック）
- Request（部分更新）: `{ "phrase": "..." }` および／または `{ "position": 3 }`

#### DELETE `/phrases/{phrase_id}`

- 概要: フレーズ削除
- Auth: required（所有者チェック）

#### PATCH `/phrases/reorder`

- 概要: 並び順をまとめて更新
- Auth: required
- Request（例）: `{ "orders": [{ "id": "...", "position": 1 }, ...] }`（キー名は実装で統一）
- `TODO`: 部分失敗時の扱い（all-or-nothing か）、`409` の扱い

#### PATCH `/phrases/import`（本紙04のメソッドに合わせる）

- 概要: テキストから一括登録
- Auth: required
- Request（例）:
  - `mode`: `append | overwrite`
  - `text`: 複数行テキスト
- Response（例）: `{ "imported": 12, "skipped": 2 }`
- **方針メモ**: 「大量に新規リソースを作る」操作は慣習的に POST のことが多い。本紙は PATCH。OpenAPI・クライアント生成の観点で POST に寄せるか実装前に決める、`TODO`
- `TODO`: バリデーション方針（空行、重複、上限）

---

## 3. データ項目（最小）

### Phrase（DB設計 05 と整合）

- `id`: uuid
- `phrase`: string（NOT NULL）
- `position`: number（int）
- `created_at`: datetime
- `updated_at`: datetime
- （ログインユーザー紐付け時）`user_id` / `users_id`: uuid FK

### User

- `id`: uuid
- `email`: string（UNIQUE）

---

## 4. ステータスコード方針（ラフ）

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

## 5. 先に決めるTODO（実装前）

- `TODO`: 未ログインデータは「ローカルのみ」と「APIに載せる」のどちらか（載せるならサーバ側の上限も検討）
- `TODO`: `GET/POST/PATCH... /phrases/` をログインユーザー専用にするか
- `TODO`: import時の上限件数
- `TODO`: token期限・refreshの要否
- `TODO`: APIバージョン規約（`/v1` を使うか）
- `TODO`: `magic-link/request` の HTTP ステータス（`201` vs `202`）を共通方針と整合させる
- `TODO`: `magic-link/verify` の request 形（form / JSON、必須フィールド名）
