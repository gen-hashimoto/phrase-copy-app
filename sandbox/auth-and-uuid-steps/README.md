# auth / UUID — ステップ別サンプル（手で取り込む用）

ログイン機能（Magic Link / JWT）と `phrases.id` の UUID 化を、いきなり本番実装せずに小さな段階で確認するための sandbox です。

| ステップ | フォルダ | 内容 |
| ---------- | ----------- | ------ |
| 1 | `step-01-current-map` | 現状調査: integer id 依存、auth 未実装、変更対象の整理 |
| 2 | `step-02-uuid-phrase-id` | `phrases.id` を `CHAR(36)` UUID に変更 |
| 3 | `step-03-users-table` | Magic Link 用の `users` テーブル追加 |
| 4 | `step-04-dev-magic-link` | 開発用 Magic Link 発行。メール送信せず `dev_link` を返す |
| 5 | `step-05-verify-and-jwt-cookie` | Magic Link 検証、JWT 発行、httpOnly cookie 保存、logout |
| 6 | `step-06-user-phrases` | `phrases` をログインユーザーに紐づける |
| 7 | `step-07-frontend-auth-flow` | frontend のログイン、検証 callback、logout、cookie proxy |
| 8 | `step-08-polish-notes` | env、secret、有効期限、rollback、既存データ、テスト観点 |

## 前提

- UI 改修は `sandbox/ui-phrase-list-steps/` の step 6 まで取り込み済みの想定。
- 本番コードはここでは大きく変更しない。各 step の README と断片を読んで、必要な箇所だけ手でコピーする。
- MySQL では学習しやすさ優先で UUID を `CHAR(36)` として扱う。`BINARY(16)` 最適化は扱わない。
- API 設計書は `Authorization: Bearer <JWT>` の記述が残っているが、この教材ではブラウザ実装に合わせて httpOnly cookie を優先する。差分は `DESIGN-NOTES.md` に記録する。

## 推奨の進め方

1. `step-01-current-map` で現状の依存箇所を確認する。
2. `step-02-uuid-phrase-id` で `id: number` を `id: string` に揃える。
3. `step-03-users-table` から `step-05-verify-and-jwt-cookie` で auth の最小 backend を作る。
4. `step-06-user-phrases` で phrase API をログインユーザーのデータだけにする。
5. `step-07-frontend-auth-flow` で frontend と API proxy を接続する。
6. `step-08-polish-notes` を見ながら、本番化前の確認項目を潰す。

## 参照

- 要件: `docs/design-docs/01_requirements.md`
- 画面: `docs/design-docs/02_screen-design.md`
- API: `docs/design-docs/04_api-design.md`
- DB: `docs/design-docs/05_db-design.md`
