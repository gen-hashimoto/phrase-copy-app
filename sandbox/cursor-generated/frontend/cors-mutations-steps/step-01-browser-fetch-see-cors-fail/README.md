## ステップ 1: ブラウザから直接 `fetch` → CORS で失敗を見る

### 目的

**「同じ `fetch` でも、Server と Client で違う」** を体に入れる。  
一覧で使った **Server Component の `fetch`** は CORS なしで動くが、**`"use client"` 内の `fetch('http://localhost:8000/...')`** はブラウザが飛ばすので **CORS が効く**。

### 事前条件（重要）

- FastAPI の `main.py` から **`CORSMiddleware` を外す**（まだ入れていなければそのまま）。
- バックエンドは `http://localhost:8000` で起動。

### やること

1. 見本: `components/browser-direct-fetch-demo.tsx` を **`frontend/components/` にコピー**（名前は任意）。
2. 一時的に `app/page.tsx` などから **この Client コンポーネントを表示**する（または専用の `app/cors-lab/page.tsx` を作ってそこだけ表示）。
3. ブラウザで **「GET /phrases をブラウザから実行」** ボタンを押す。
4. **Network** と **Console** を開き、**CORS エラー**（レスポンスは 200 でも読めない、など）を確認する。

### 期待される結果

- 失敗するのが正解。ここで **「CORSはブラウザが跨いだときの話」** とセットで覚える。

### 次のステップ

`step-02-fastapi-cors-middleware` で FastAPI 側を直し、**同じボタンが成功**するか確認する。
