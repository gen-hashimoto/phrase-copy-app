# API Design

実装と往復しながら追記する前提のメモです。
未確定はセクション末尾の「実装で埋める項目」に集約し、
コードとOpenAPIができたらそちらを正とします。

---

## 1. 共通（いま決めていること）

|項目|内容|
|---|---|
|Base URL|未確定（`/api` 等）。ルーター決定後に書く|
|認証|`Authorization: Bearer <JWT>`|
|日時|ISO 8601（UTC）。JSONでは日時は文字列|
|エラー（目安）|`error.code` / `message` / `details`。形は実装時に確定|

**一覧**: Phase1 はフレーズをまとめて返す。検索・絞り込み用のクエリは載せない（
[01_requirements](./01_requirements.md) のとおり検索はフロント）。

**ゲスト**: 画面設計上、未ログイン時のデータはフロント保持想定（
[02_screen-design](./02_screen-design.md)）。
その場合、一覧取得などの Phrase API は
「ログイン後」から使う形にしやすい。

---

## 2. HTTPステータス（目安）

|コード|用途の例|
|---|---|
|200|取得・更新成功|
|201|リソース作成成功|
|202|受付のみ（メール送信等）。最終ステータスは実装で決定|
|400|バリデーションエラー|
|401|認証できない・トークン無効|
|403|認証はあるが操作不可|
|404|リソースなし|
|409|競合（並び順の不整合など）|
|429|レート制限（入れる場合）|

---

## 3. Phraseオブジェクト（レスポンスの形）

[05_db-design](./05_db-design.md) に合わせたい項目:

- `id` … uuid（文字列として返す想定）
- `phrase` … 文字列
- `position` … 整数（表示順）
- `created_at` / `updated_at` … 日時文字列

※ リクエストに `user_id` を載せるかは設計しない（サーバがJWTから解決）。

---

## 4. エンドポイント一覧

パス末尾の `/` は FastAPI のルートに合わせて統一する。

### 4-1. auth

#### `POST /auth/magic-link/request`

- **概要**: 指定メールへ Magic Link を送る
- **Auth**: 不要
- **Body（JSON）**: `email`（文字列）
- **成功**: `202 Accepted`（非同期扱い）または `201 Created` など。
  バックエンドで統一

#### `POST /auth/magic-link/verify`

- **概要**: メールのトークン等を検証し、アクセストークンを返す
- **Auth**: 不要
- **Body**: OAuth2 なら `application/x-www-form-urlencoded` が多い。
  フィールド名は実装で確定
- **成功**: `200`、`access_token`、`token_type`（例: `"bearer"`）。
  期限は実装で決定

#### `GET /auth/me`

- **概要**: JWT から現在ユーザーを返す（再起動後の表示用。必須ではない）
- **Auth**: 必須
- **成功**: `200`、例: `id`, `email`, `plan`（あれば）

---

### 4-2. phrases

ログイン後の永続データ用。ゲストのみなら呼ばない想定でよい。

#### `GET /phrases/`

- **概要**: 自分のフレーズ一覧
- **Auth**: 必須（方針として）
- **成功**: `200`、Phraseオブジェクトの配列

#### `POST /phrases/`

- **概要**: 1件作成
- **Auth**: 必須
- **Body**: `phrase`（必須）、`position`（任意。未指定はサーバ規約）
- **成功**: `201` + 作成された Phrase オブジェクト（推奨）

#### `PATCH /phrases/{phrase_id}`

- **概要**: テキストや `position` の部分更新（片方だけでも可）
- **Auth**: 必須
- **成功**: `200` + 更新後オブジェクト、または `204`。実装で統一

#### `DELETE /phrases/{phrase_id}`

- **概要**: 削除
- **Auth**: 必須
- **Body**: なし
- **成功**: `204 No Content` または `200` + メッセージ。実装で統一

#### `PATCH /phrases/reorder`

- **概要**: 並び順の一括更新
- **Auth**: 必須
- **Body（例）**: `{ "orders": [{ "id": "<uuid>", "position": 1 }, ...] }`
- **成功**: `200`（本文の要否は実装で）。`409` を使うかも実装で

#### `POST /phrases/import`

- **概要**: 改行区切りテキストから一括登録（Append / Overwrite）
- **Auth**: 必須
- **Body（例）**: `mode`: `append` \| `overwrite`、`text`: 複数行文字列
- **成功**: `200` など + `imported` / `skipped` 件数（キー名は実装で）

---

## 5. JSON例（動く形の参考）

一覧の1件・作成レスポンスのイメージ（`id` は uuid 文字列、日時は ISO 8601）。

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "phrase": "今日は散歩に行きました。",
  "position": 2,
  "created_at": "2026-05-07T22:35:00Z",
  "updated_at": "2026-05-07T22:35:00Z"
}
```

作成リクエストの例:

```json
{
  "phrase": "This is an important command!",
  "position": 3
}
```

部分更新は、例えば本文だけ:

```json
{
  "phrase": "今日は散歩に行きましたよ。"
}
```

または順序だけ:

```json
{
  "position": 1
}
```

---

## 6. 実装で埋める項目（チェックリスト）

実装・OpenAPIを書くときに、ここを潰して本文に反映していく。

- Base URL・APIバージョン（`/v1` の有無）
- Magic Link `request` の最終ステータス（201 / 202）とレスポンス本文
- `verify` の Content-Type・フィールド名・エラー時の `error.code`
- JWT の有効期限・リフレッシュの要否
- `GET /auth/me` を入れるか、`verify` のレスポンスだけで足りるか
- Phrase 系をゲストAPIに広げるか（現状はログイン後想定）
- `reorder` / `import` のトランザクション・上限・バリデーション（
  空行・最大件数）
- レート制限の有無（特に Magic Link 再送）
