## ステップ 4: shadcn の `Table` で一覧を表示

### やること

- ステップ3の **`fetch` ロジックはそのまま**（`apiOrigin` / `fetchPhrases` / エラー処理）。
- 一覧部分だけを **`<ul>` から `Table` 系コンポーネント**に差し替える。
- `@/components/ui/table` から import（プロジェクトに `npx shadcn@latest add table` 済みであること）。

### コピー先（例）

```text
frontend/app/page.tsx
```

ステップ3の `page.tsx` をベースに、**このフォルダの `app/page.tsx` 全体**で置き換えてよい。

### ポイント

- **`content` 列**は長文になりやすいので、`TableCell` に `whitespace-normal` などを付けて、デフォルトの `whitespace-nowrap` を上書きしている。
- `Table` は shadcn 実装によって **`"use client"`** になっていることがあるが、**Server Component から import して使う**のは Next.js で問題ない（子が Client の境界になる）。

### 前ステップとの差分

- 表示レイアウトのみ変更。型・環境変数・`fetch` の URL はステップ3と同じ。
