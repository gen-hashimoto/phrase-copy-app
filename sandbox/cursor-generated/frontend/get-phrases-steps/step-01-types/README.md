## ステップ 1: 型だけ書く

### やること

- FastAPI が返す JSON の形に合わせて、フロント用の型を 1 ファイルにまとめる。
- この時点では **`fetch` もページも書かない**。

### コピー先（例）

プロジェクトのルートが `frontend/` のとき:

```text
frontend/types/phrase.ts
```

（`types/` が無ければ作成。既に `lib/types/` など決めているならそこへ。）

### ポイント

- `created_at` は API の JSON では **ISO 8601 の文字列**になる（Python の `datetime` がそう serialize される）。
- 名前は `PhraseRead` のままでも、`Phrase` だけでもよい。

### 次のステップ

`step-02-env` が追加されたら、環境変数の例をプロジェクトに取り込む。
