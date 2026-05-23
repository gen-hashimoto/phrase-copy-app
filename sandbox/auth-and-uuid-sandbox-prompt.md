# auth / UUID ステップ教材作成プロンプト

## やりたいこと

phrase-copy-app の次フェーズとして、以下を進めたい。

- ログイン機能（auth / Magic Link / JWT）
- DB の `id` を UUID に変更

前回の UI 改修と同じように、まずは **本番実装ではなく sandbox にステップ別教材**を作ってほしい。

## 前提

- UI 改修は `sandbox/ui-phrase-list-steps/` の step6 まで完了した認識
- 既存 sandbox:
  - `sandbox/copy-phrases-steps/`
  - `sandbox/ui-phrase-list-steps/`
- 設計書:
  - `docs/design-docs/01_requirements.md`
  - `docs/design-docs/02_screen-design.md`
  - `docs/design-docs/04_api-design.md`
  - `docs/design-docs/05_db-design.md`

## 作ってほしいもの

新規フォルダを作る。

```text
sandbox/auth-and-uuid-steps/
```

構成は前回と同じ。

```text
sandbox/auth-and-uuid-steps/
  README.md
  DESIGN-NOTES.md
  step-01-...
    README.md
    ...
  step-02-...
    README.md
    ...
```

各 step には以下を入れる。

- 日本語の README
  - やること
  - コピー先
  - 動作確認
  - 次のステップ
- コピー用のサンプル断片
  - `.py`
  - `.ts`
  - `.tsx`
  - `.sql`
  - 必要なら `.env.example`
- コード内コメントは英語

`sandbox/README.md` にも新トピックへのリンクを追加する。

## 推奨ステップ

### step-01-current-map

現状調査。

- integer id 依存箇所
- auth 未実装箇所
- backend / frontend / DB の変更対象一覧

### step-02-uuid-phrase-id

`phrases.id` を UUID にする。

- backend model / schema / repository / service / routes
- frontend types / phrase-manager / api route
- MySQL ではまず `CHAR(36)` でよい
- `id: number` から `id: string` になる影響を README に書く

### step-03-users-table

`users` テーブルを追加する。

- `id` UUID
- `email` unique
- Magic Link 用 token 関連
- `created_at`
- `updated_at`

### step-04-dev-magic-link

開発用 Magic Link を作る。

- `POST /auth/magic-link`
- email validation
- user upsert
- token 発行
- 開発中はメール送信せず `dev_link` を返してよい
- 本番では `dev_link` を返さない注意を書く

### step-05-verify-and-jwt-cookie

Magic Link 検証と JWT 発行。

- token 検証
- 有効期限
- one-time use
- JWT 発行
- httpOnly cookie に保存
- logout で cookie 削除

### step-06-user-phrases

ログイン済み user に phrases を紐づける。

- `phrases.user_id`
- `phrases.position`
- phrases API はログインユーザーのデータだけ返す
- 未ログイン時 useState との境界を README に整理

### step-07-frontend-auth-flow

frontend の認証フロー。

- login form
- Magic Link request
- verify callback page
- logout
- API proxy で cookie を扱う
- 未ログイン top とログイン済み phrase list の切り替え

### step-08-polish-notes

仕上げメモ。

- env
- JWT secret
- token expiry
- SameSite / httpOnly
- migration rollback
- 既存データ移行
- テスト観点

## 今回は広げないこと

理解しやすさ優先で、以下は詳細実装しない。

- OAuth / Google Login
- 本番メール送信サービス連携
- refresh token
- パスワードログイン
- 複雑な Alembic 導入
- UUID の `BINARY(16)` 最適化
- Easy Import / reorder UI
- CSRF の詳細実装

## 方針

- まず UUID 化、次に dev Magic Link、最後に httpOnly cookie JWT
- 本番コードは大きく変更しない
- sandbox 教材を先に完成させる
- 設計書はドラフトなので、差分は `DESIGN-NOTES.md` にメモする
- git commit はユーザーが明示したときだけ

## 参考ファイル

- `backend/app/models/phrase.py`
- `backend/app/schemas/phrase.py`
- `backend/app/repositories/phrase_repository.py`
- `backend/app/services/phrase_service.py`
- `backend/app/api/routes/phrases.py`
- `frontend/types/phrase.ts`
- `frontend/app/page.tsx`
- `frontend/app/api/phrases/route.ts`
- `frontend/app/api/phrases/[id]/route.ts`
- `frontend/components/phrase-manager.tsx`
- `sandbox/ui-phrase-list-steps/`
- `sandbox/copy-phrases-steps/`
