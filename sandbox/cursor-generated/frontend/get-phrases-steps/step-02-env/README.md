## ステップ 2: API のベース URL を環境変数にする

### やること

- バックエンドのオリジンを **1 か所**にまとめる（ハードコードしない）。
- **Server Component** から `fetch` するだけなら、ブラウザに公開しない名前でよい。

### コピー先（例）

リポジトリの `frontend/` 直下:

1. このフォルダの `.env.example` を参考にする。
2. **`frontend/.env.local`** を新規作成し、同じ変数を書く（値は自分の環境に合わせる）。
3. `.env.local` は通常 **Git にコミットしない**（Next の既定どおり）。

### 変数の意味

| 変数名 | 用途 |
|--------|------|
| `API_BASE_URL` | `fetch(\`${API_BASE_URL}/phrases\`)` のように **サーバー側**から叩くときのオリジン（末尾スラッシュなし推奨） |

Docker Compose でバックエンドを `8000:8000` にしている場合の例:

```bash
API_BASE_URL=http://localhost:8000
```

### `NEXT_PUBLIC_` は付けない？

付けない想定です。**付けると**クライアントの JS にも埋め込まれます。  
一覧取得だけ Server Component で済ませるなら **サーバー専用**で十分です。

### 次のステップ

`step-03-fetch-page` が追加されたら、`app/page.tsx` で `fetch` と一覧表示を足す。
