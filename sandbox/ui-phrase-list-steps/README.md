# フレーズ一覧 UI — ステップ別サンプル（手で取り込む用）

設計書（`docs/design-docs/02_screen-design.md`）に寄せて、一覧の操作 UX と **title 廃止（content のみ）** を進める手順です。

| ステップ | フォルダ | 内容 |
|----------|-----------|------|
| 1 | `step-01-hide-columns` | ID・作成日時・タイトル列を UI から外す（API はまだ title ありでも可） |
| 2 | `step-02-double-click-edit` | 編集ボタン削除、ダブルクリック / ダブルタップで編集 |
| 3 | `step-03-edit-mode-copy-to-ok-cancel` | 編集時: Copy → OK / Cancel |
| 4 | `step-04-plus-button-new-row` | + で最下行を編集状態の新規行として追加 |
| 5 | `step-05-remove-title-backend` | DB・FastAPI・Next から title を削除 |
| 6 | `step-06-polish` | Enter / Esc、aria、改行バリデーション、スマホ向けメモ |

**前提:** [`copy-phrases-steps`](../copy-phrases-steps/) のコピー機能（`copy-to-clipboard`, `phrase-copy-text`, `use-copied-feedback`, `join-phrases-for-copy-all`）は本トピックでもそのまま使う。壊さないこと。

**スコープ外（別ステップ可）:** 未ログイン時の `useState`、8 / 10 used、Easy Import、ログイン。

### 設計ドラフトとの差分

実装判断を優先する。気づいた差分は各 step の README か [`DESIGN-NOTES.md`](./DESIGN-NOTES.md) にメモする。

### 推奨の進め方

1. ステップ 1〜4 は **frontend の `phrase-manager.tsx` だけ**で完結できる（title は API に残し、固定値や `content` のみ送るなどの暫定でも可）。
2. ステップ 5 で **backend と frontend の型・API を同時に**揃える。
3. ステップ 6 で仕上げ。

### 参照

- 画面: `docs/design-docs/images/top-screen.png`
- 要件: `docs/design-docs/01_requirements.md`
- 将来 DB: `docs/design-docs/05_db-design.md`（`phrase` 1 列）
