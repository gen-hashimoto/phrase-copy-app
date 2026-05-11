## ステップ 3: Server Component で `GET /phrases` を取得して一覧表示

### やること

- `app/page.tsx` を **async** の Server Component にする。
- `process.env.API_BASE_URL` と **ステップ1の型**を使い、`/phrases` を `fetch` する。
- 見た目は **まずシンプル**（`<ul>` や `<div>` でタイトルだけでもよい）。テーブルはステップ4。

### コピー先（例）

```text
frontend/app/page.tsx
```

（既存のプレースホルダ内容は、このサンプルで置き換える。）

### ポイント

- **`cache: "no-store"`** … 開発中は毎回最新に近い挙動にしやすい。
- **`API_BASE_URL` に末尾 `/` があっても動くよう**、サンプルでは結合前に潰している。
- **CORS は不要**（サーバー同士の `fetch` のため）。
- 型は `@/types/phrase` の `PhraseRead` を import（`import type` でよい）。

### 動作確認

1. `infra/docker-compose.yml` 等でバックエンドが **`http://localhost:8000`** で動いていること。
2. `frontend/.env.local` に `API_BASE_URL=http://localhost:8000` があること。
3. `npm run dev` でフロントを開き、一覧またはエラーメッセージを確認。

### 次のステップ

`step-04-table-ui` で shadcn の `Table` に差し替える（`step-04-table-ui/README.md` を参照）。
