# GET /phrases 一覧表示 — ステップ別サンプル（真似用）

本番の `frontend/` にコピーしながら進める前提の、**途中経過ファイル**です。  
**一度に全部コピーしないでください。** フォルダ名の `step-01` → `step-02` … の順に取り込むと理解しやすいです。

| ステップ | フォルダ | 内容（予定） |
|----------|-----------|----------------|
| 1 | `step-01-types` | API レスポンス用の型だけ |
| 2 | `step-02-env` | `.env.local` の例（`.env.example`） |
| 3 | `step-03-fetch-page` | Server Component で `fetch` して一覧 |
| 4 | `step-04-table-ui` | shadcn Table で整形 |

バックエンドの `PhraseRead`（`app/schemas/phrase.py`）と対応しています。
