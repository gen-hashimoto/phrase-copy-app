# コピー機能 — ステップ別サンプル（手で取り込む用）

CRUD が動いている `frontend/components/phrase-manager.tsx` に、設計書どおりのコピー体験を足していく手順です。

| ステップ | フォルダ | 内容 |
|----------|-----------|------|
| 1 | `step-01-clipboard-helper` | `navigator.clipboard` の薄いラッパー |
| 2 | `step-02-single-copy-button` | 1 件コピー（行ごとのボタン） |
| 3 | `step-03-copied-feedback` | 「Copied!」を約 1 秒表示 |
| 4 | `step-04-row-highlight` | コピーした行のハイライト |
| 5 | `step-05-copy-all` | 全件を改行区切りで一括コピー |
| 6 | `step-06-permissions-and-fallback` | HTTPS / 権限拒否・空一覧など |

**バックエンド API は不要**です。すでに画面にある `phrases` 配列をブラウザのクリップボードに載せるだけです。

### コピーする文字列はどれか？

設計書では 1 フレーズ = 1 行（**内容に改行は入れない**）です。  
現在のデータモデルでは **`content` をコピー対象**とする想定です（`title` は管理用ラベル）。  
仕様を変えるならステップ 2 の `getPhraseCopyText` だけ直せば足ります。

### 改行コード（Copy All で重要）

- JavaScript の **`"\n"`（LF）** で結合するのが無難です。
- クリップボード API は OS / 貼り付け先が必要なら CRLF に変換することが多く、**多くの場合は意識しなくてよい**です。
- **各フレーズの中に改行を入れない**ことの方が重要です（Easy Import と Copy All の往復仕様のため）。詳しくは `step-05-copy-all/README.md`。
