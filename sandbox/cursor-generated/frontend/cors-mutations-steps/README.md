# CORS とミューテーション（POST / PUT / DELETE）— 学習用ステップ

**覚え方（一言）:**  
**「CORSはブラウザのルール。サーバー同士の fetch には出番がない。」**

- **ブラウザ**が `http://localhost:3000` のページから **`http://localhost:8000` に直接 `fetch`** するとき → ブラウザが **別オリジン** とみなし、レスポンスを読む前に **CORS（`Access-Control-*` ヘッダ）** を要求する。FastAPI が返さないと **失敗**する。
- **Next の Server Component / Route Handler** が **`API_BASE_URL`（8000）へ `fetch`** するとき → それは **Node 上のサーバー → 8000** で、ブラウザの CORS は **関係しない**（だから一覧取得だけなら CORS なしでも動いていた）。

このフォルダは、上の違いを **手で再現**するための順序付きメモと見本コードです。  
**上から順に** `step-01` → … とトレースしてください。

---

## ステップ一覧

| 順番 | フォルダ | やること |
|------|-----------|----------|
| 1 | `step-01-browser-fetch-see-cors-fail` | **Client** から `localhost:8000` へ直接 `fetch`。**FastAPI に CORS なし**のとき、**失敗を確認** |
| 2 | `step-02-fastapi-cors-middleware` | FastAPI に `CORSMiddleware` を足し、**同じ Client fetch が成功**することを確認 |
| 3 | `step-03-client-post-with-cors` | ブラウザから **POST**（作成）。CORS 済み前提 |
| 4 | `step-04-client-put-with-cors` | ブラウザから **PUT**（更新） |
| 5 | `step-05-client-delete-with-cors` | ブラウザから **DELETE** |
| 6 | `step-06-nextjs-route-handler-no-browser-cors` | **Route Handler** でバックエンドにプロキシ。**ブラウザは `/api/...` のみ** → **FastAPI の CORS はブラウザ向けには不要**（※バックエンドのセキュリティは別途考慮） |

---

## 前提

- バックエンド: `GET/POST /phrases`、`GET/PUT/DELETE /phrases/{id}`（このリポジトリの FastAPI と同じ想定）。
- フロント: `http://localhost:3000`（`next dev`）。
- ステップ1をやるときは **意図的に** `CORSMiddleware` を外した状態にする（またはコメントアウト）。

---

## トラブル時の見え方

- **Chrome DevTools → Network** で、該当リクエストが **赤**、`CORS` / `blocked` / `preflight` などの文言 → ステップ1の「教科書どおり」。
- **Console** に `Access-Control-Allow-Origin` に関する説明が出ることが多い。

各 `step-*/README.md` に手順と見本ファイルへのパスを書いています。

---

## 実験ページの置き場所（任意）

**対象は `frontend/` の Next アプリ**（`sandbox/...` だけでは `next dev` しない想定）。

1. 各ステップの `step-*/components/*.tsx` を **`frontend/components/` にコピー**する（ファイル名は `example-cors-lab-page.tsx` の import と一致させる）。
2. ステップ6を使うなら、`step-06-.../app/api/phrases/**` を **`frontend/app/api/phrases/`** にコピーする。
3. `frontend/app/cors-lab/page.tsx` を作り、`example-cors-lab-page.tsx` と同じ import で並べる（未実施のデモは import と `<Section />` をコメントアウト）。

※ `example-cors-lab-page.tsx` は sandbox 内の見本なので、そのままでは `@/components/...` が解決されない。**必ず `frontend` 側にコンポーネントを置いてから**ページを追加する。
