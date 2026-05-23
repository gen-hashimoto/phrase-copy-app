## ステップ 3: `users` テーブルを追加する

Magic Link とログイン済み phrase の所有者を扱うため、`users` テーブルを追加する。

### やること

#### A. Database

`sql/create-users-table.sql` を参考に、`users` テーブルを追加する。

| 列 | 用途 |
| ---- | ------ |
| `id` | UUID。`CHAR(36)` |
| `email` | ログイン用メール。unique |
| `magic_link_token_hash` | Magic Link token の hash。平文 token は保存しない |
| `magic_link_expires_at` | token の有効期限 |
| `magic_link_used_at` | one-time use 判定 |
| `created_at` | 作成日時 |
| `updated_at` | 更新日時 |

#### B. Backend model

`backend/user-model-snippet.py` を `backend/app/models/user.py` の雛形として使う。

この時点では endpoint はまだ作らず、`users` を DB と SQLAlchemy model に追加するだけでよい。

### コピー先

```text
backend/app/models/user.py
backend/app/models/__init__.py など model import を集約している場所
```

### 動作確認

1. backend 起動時に `users` テーブルを作れる。
2. `email` に unique index がある。
3. token 関連列が nullable で、未ログイン user を作れる。

### 次のステップ

`step-04-dev-magic-link` で email を受け取り、user upsert と token 発行を行う。
