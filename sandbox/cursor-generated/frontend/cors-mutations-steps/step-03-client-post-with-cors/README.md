## ステップ 3: ブラウザから POST（作成）— CORS 済みで通す

### 目的

**「読む GET」だけでなく、「書き込む POST」でも CORS が効く**ことを確認する。  
`Content-Type: application/json` があると **プリフライト（OPTIONS）** が増えることがある。ステップ2で `allow_methods` / `allow_headers` を広めに取っておくと詰まりにくい。

### 事前条件

- ステップ2まで完了（`CORSMiddleware` 有効、オリジンに `http://localhost:3000`）。

### やること

1. 見本 `components/browser-direct-post-demo.tsx` を `frontend/components/` にコピー。
2. 実験用ページ（例: `app/cors-lab/page.tsx`）で表示し、タイトル・本文を入れて **作成 POST** を実行。
3. Network で **POST** と（あれば）**OPTIONS** を確認。
4. 一覧ページや `GET /phrases` でレコードが増えたことを確認。

### 次のステップ

`step-04-client-put-with-cors` で **PUT**。
