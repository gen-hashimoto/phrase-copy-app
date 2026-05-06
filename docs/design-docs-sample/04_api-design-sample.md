# API Design (Sample / Rough)

このファイルは「実装しながら更新する」前提のたたき台です。  
最初から完全に決め切らず、未確定は `TODO` で残します。

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

### 2-1. auth

#### POST `/auth/magic-link/request`

- 概要: メールアドレスにログインリンクを送信
- Auth: not required
- Request: `{ "email": "user@example.com" }`
- Response: `202 Accepted`
- TODO: 再送制限（rate limit）

#### POST `/auth/magic-link/verify`

- 概要: トークンを検証してアクセストークン発行
- Auth: not required
- Request: `{ "token": "..." }`
- Response: `{ "access_token": "...", "token_type": "Bearer" }`（`TODO`: ユーザー表示用なら `{ "user": { ... } }` を同時に返すと `/auth/me` を省略できる）
- TODO: 有効期限切れ時のコード定義

#### GET `/auth/me`

- 概要: Bearer トークンからログイン中ユーザーを返す
- Auth: required
- Response: `{ "id": "...", "email": "...", "plan": "guest|user" }`
- **必須か**: **必須ではない**。`verify` のレスポンスに `user` を含めれば、ログイン直後はそれだけでよい。
- **あると便利**: ページ再読み込み後に LocalStorage の JWT だけ残っているときの **ユーザー情報の復元**、サーバ側の正としての **メール等の取得**、`401` で **セッション切れを検知**しやすい。
- **なくす場合**: フロントは `verify` の `user` を保存する／JWT をデコードして表示する（クレーム設計が必要、`TODO`）。

---

### 2-2. phrases

#### GET `/phrases`

- 概要: フレーズ一覧取得（クライアントがこの結果を使ってリアルタイム検索）
- Auth: `TODO`（ログインユーザーのみ / 未ログインも可、のどちらか）
- Query: なし（MVP）。将来、件数が増えたらページネーション用を追加する想定

#### POST `/phrases`

- 概要: フレーズ作成
- Auth: `TODO`（未ログインはAPIを使わずローカル保存のみ、なども可）
- Request:
  - `phrase` (string, required)
  - `position` (number, optional)
- 備考: 未ログイン10件上限のエラーは **APIでは返さず**、フロントでのみ扱う想定なら、このエンドポイントはログイン済み専用に寄せやすい

#### PATCH `/phrases/{phrase_id}`

- 概要: フレーズ更新
- Auth: required（または所有者チェック）
- Request: `{ "phrase": "...", "position": 3 }`

#### DELETE `/phrases/{phrase_id}`

- 概要: フレーズ削除
- Auth: required（または所有者チェック）

#### PATCH `/phrases/reorder`

- 概要: 並び順をまとめて更新
- Auth: required
- Request:
  - `{ "orders": [{ "id": "...", "position": 1 }, ...] }`
- TODO: 部分失敗時の扱い（all-or-nothing か）

#### POST `/phrases/import`

- 概要: テキストから一括登録
- Auth: required
- Request:
  - `mode`: `append | overwrite`
  - `text`: 複数行テキスト
- Response: `{ "imported": 12, "skipped": 2 }`
- TODO: バリデーション方針（空行、重複、上限）

---

## 3. データ項目（最小）

### Phrase

- `id`: uuid
- `phrase`: string
- `position`: number
- `created_at`: datetime
- `updated_at`: datetime

### User

- `id`: uuid
- `email`: string

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
- `TODO`: `GET/POST/PATCH… /phrases` をログインユーザー専用にするか
- `TODO`: import時の上限件数
- `TODO`: token期限・refreshの要否
- `TODO`: APIバージョン規約（`/v1` を使うか）
