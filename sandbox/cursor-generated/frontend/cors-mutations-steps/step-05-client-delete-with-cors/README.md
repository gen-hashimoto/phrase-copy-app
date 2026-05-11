## ステップ 5: ブラウザから DELETE — CORS 済み

### 目的

**DELETE はボディが無いことが多い**が、オリジンが違えば CORS の対象になる。Network で **DELETE** を確認する。

### 事前条件

- ステップ2の CORS 有効。
- 削除してよい `id` を用意する（誤削除に注意）。

### やること

1. 見本 `components/browser-direct-delete-demo.tsx` をコピー。
2. `id` を入れて **DELETE** 実行。
3. 一覧や GET で消えたことを確認。

### 次のステップ

`step-06-nextjs-route-handler-no-browser-cors` で、**ブラウザは Next の `/api/...` だけ**に向け、**FastAPI の CORS を「ブラウザ向けには」不要に近づける**パターンを試す。
