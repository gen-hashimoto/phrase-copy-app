## ステップ 6: ログイン済み user に phrases を紐づける

`phrases.user_id` と `phrases.position` を追加し、phrase API がログインユーザーのデータだけを返すようにする。

### やること

#### A. Database

`sql/add-user-id-position-to-phrases.sql` を参考に列を追加する。

| 列 | 用途 |
| ---- | ------ |
| `user_id` | `users.id` への外部キー |
| `position` | 表示順。UUID の辞書順や作成日時に頼らない |

既存データがある場合は、開発用 seed user を作って既存 phrase に `user_id` を埋めるか、開発 DB を作り直す。

#### B. Backend

| ファイル | 変更 |
| ---------- | ------ |
| `backend/app/models/phrase.py` | `user_id`, `position` を追加 |
| `backend/app/api/deps.py` | `get_current_user` を追加 |
| `backend/app/repositories/phrase_repository.py` | `list_by_user`, `get_by_user_and_id` |
| `backend/app/services/phrase_service.py` | すべての操作に `user_id` を渡す |
| `backend/app/api/routes/phrases.py` | `current_user` dependency を追加 |

### 未ログイン時 `useState` との境界

- 未ログイン top は DB API を呼ばず、frontend state だけで最大 10 件まで扱う。
- ログイン済み phrase list は DB API を呼び、件数制限なしにする。
- 未ログイン state をログイン時に自動 import するかは今回扱わない。必要なら別 step にする。
- `/api/phrases` が `401` を返したら、frontend はログイン画面または未ログイン top に戻す。

### コピー先

```text
backend/app/models/phrase.py
backend/app/api/deps.py
backend/app/repositories/phrase_repository.py
backend/app/services/phrase_service.py
backend/app/api/routes/phrases.py
frontend/app/page.tsx
frontend/components/phrase-manager.tsx
```

### 動作確認

1. 未ログインで backend `/phrases` を呼ぶと `401`。
2. ログイン後は自分の phrase だけ取得できる。
3. 別 user の UUID を URL に入れても取得 / 更新 / 削除できない。
4. 一覧は `position ASC` で並ぶ。

### 次のステップ

`step-07-frontend-auth-flow` で login form、verify callback、logout をつなぐ。
