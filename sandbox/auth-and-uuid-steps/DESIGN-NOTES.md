# 設計ドラフトと auth / UUID 実装のメモ

| 項目 | 設計ドラフト | 本 sandbox の扱い |
| ------ | -------------- | ------------------- |
| Phrase ID | `uuid` | step-02 で `CHAR(36)` / API 文字列に変更 |
| User ID | `uuid` | step-03 で `users.id CHAR(36)` を追加 |
| 認証ヘッダー | `Authorization: Bearer <JWT>` | ブラウザから扱いやすい httpOnly cookie を優先。backend 内部では JWT を検証する |
| Magic Link request path | `POST /auth/magic-link/request` | 教材では短く `POST /auth/magic-link`。本番前に API 設計へ反映する |
| Magic Link verify | body 形式は未確定 | callback URL の `token` query を frontend proxy が backend に渡す形を例示 |
| 未ログイン時 | frontend `useState`、最大 10 件 | step-06 / step-07 で「未ログインは DB API を呼ばない」境界として整理 |
| Phrase 所有者 | `users ||--o{ phrases` | step-06 で `phrases.user_id` を追加し、全 API を user scope にする |
| 並び順 | `phrases.position` | step-06 で列だけ追加。reorder UI / API は今回広げない |
| メール送信 | Magic Link を送る | step-04 は開発用に `dev_link` を返す。本番では返さない |
| migration | 未確定 | 学習用 SQL を置く。複雑な Alembic 導入は扱わない |

### 本番実装前に決めること

- Cookie 名、`SameSite`、`Secure`、ドメイン、期限。
- JWT の claim: 最低限 `sub` に `users.id`、必要なら `email`。
- Magic Link token の保存方式: 教材では token hash を保存する。
- 既存 phrase を誰に紐づけるか: 開発では seed user、本番では移行方針が必要。
- API 設計書を Bearer token 前提のままにするか、cookie session 前提に更新するか。
