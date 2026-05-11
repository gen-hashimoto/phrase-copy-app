## ステップ 6: Next.js Route Handler でプロキシ — ブラウザは CORS の相手にならない

### 覚え方

- **ブラウザ** → `http://localhost:3000/api/...`（**Next と同じオリジン**）  
- **Next のサーバー**（Route Handler）→ `http://localhost:8000/...`（**サーバー間**、CORS なしでよい）

つまり **「ブラウザが FastAPI のオリジンを直接見ない」** 形にすると、**ブラウザ用の CORS 設定は理屈上いらない**（※本番では認可・レート制限・信頼できるバックエンド通信などは別問題）。

### やること

1. `app/api/phrases/route.ts` と `app/api/phrases/[id]/route.ts` を **`frontend/app/api/` 配下にコピー**（フォルダ構造どおり）。
2. `.env.local` の **`API_BASE_URL`** はそのまま使える（Route Handler はサーバー側で読む）。
3. 見本 `components/via-next-api-demo.tsx` をコピーし、実験ページで表示。
4. **GET / POST / PUT / DELETE** がすべて **`fetch("/api/...")` 相対パス**になっていることを確認。
5. （任意の確認）FastAPI から **`CORSMiddleware` を一時的に外す**。  
   - **このステップ6の UI**（`/api` 経由）は動き続ける。  
   - **ステップ1〜5の「localhost:8000 直」**は再び失敗する。  
   → **どちらの経路かで CORS が要るかが切り替わる**のを体感できる。

### 補足

- これはよく **BFF / リバースプロキシ** と呼ばれるパターンのミニ版。
- `rewrites` で `next.config` からバックエンドへ流す方法もあるが、**認証ヘッダの付け替えやエラー整形**をしたいときは Route Handler の方が扱いやすいことが多い。

### この教材シリーズの終わり

ここまでで「CORSが要る場面」と「Next側で避ける場面」の両方をトレースできている。
