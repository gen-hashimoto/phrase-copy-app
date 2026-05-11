## ステップ 2: FastAPI に `CORSMiddleware` を入れて成功させる

### 目的

ブラウザからの **直接 fetch** が通るように、バックエンドが **`Access-Control-Allow-Origin`** などを返す。

### やること

1. 見本: `patch-for-main.md` のコードを **`backend/app/main.py` に手で取り込む**（import の重複に注意）。
2. バックエンドを再起動。
3. **ステップ1と同じ** Client コンポーネントで、もう一度 **GET** を実行。
4. **JSON が `log` に表示される**（または Network でレスポンス本文が読める）ことを確認。

### POST / PUT / DELETE を後で試すなら

プリフライト（`OPTIONS`）が飛ぶので、ミドルウェアで次も許可しておくと安全:

- `allow_methods=["*"]` または `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- `allow_headers=["*"]` または少なくとも `Content-Type`, `Authorization` など実際に送るもの

### 期待される結果

- ステップ1で失敗していたのが、**同じ URL・同じフロント**で成功する。

### 次のステップ

`step-03-client-post-with-cors` で **POST** をブラウザから試す。
