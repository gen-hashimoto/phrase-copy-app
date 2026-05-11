## ステップ 4: ブラウザから PUT（更新）— CORS 済み

### 目的

**部分更新**の `PUT /phrases/{id}` をブラウザから叩く。ID は既存レコードのものを使う。

### 事前条件

- ステップ2の CORS 有効。
- 更新対象の `id` が分かっている（一覧・POST のレスポンスなど）。

### やること

1. 見本 `components/browser-direct-put-demo.tsx` をコピー。
2. 実験ページに載せ、`id` と更新したい `title` / `content` を入れて実行。
3. Network で **PUT** を確認。

### 次のステップ

`step-05-client-delete-with-cors` で **DELETE**。
