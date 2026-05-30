## ステップ 4: `phrases.updated_at` を追加する

`phrases` に作成日時 `created_at` だけでなく、更新日時 `updated_at` を持たせる。

### 目的

- 編集日時を API response で返せるようにする。
- 将来の「更新順ソート」「最近編集したフレーズ」「最終更新表示」に備える。
- DB、SQLAlchemy model、Pydantic schema、frontend 型の影響範囲を理解する。

### なぜ必要か

`created_at` は「いつ作ったか」だけを表す。フレーズ管理アプリでは、ユーザーがよく編集するため「いつ最後に変えたか」も重要になる。

`updated_at` がないと、次のような機能で困る。

- 最近編集したフレーズを上に出す。
- 一覧に「最終更新: 2026-05-30」を表示する。
- 同期や import の競合解決で、どちらが新しいか判断する。

### 実装方針

`updated_at` は DB だけでなく API response と frontend 型にも影響する。小さく安全に進めるため、次の順番で扱う。

1. DB に `updated_at` カラムを追加する。
2. SQLAlchemy model に `updated_at` を追加する。
3. Pydantic schema の `PhraseRead` に `updated_at` を追加する。
4. frontend の `PhraseRead` 型に `updated_at` を追加する。
5. guest phrase の create / update でも `updated_at` を作る。

`created_at` は作成時刻、`updated_at` は最終更新時刻として役割を分ける。

### DB 変更手順

本番反映前に、まず現在の DB 管理方法を確認する。

確認ポイント:

```text
backend/sql/
backend/app/models/
alembic/
```

このリポジトリは現状 `backend/sql/*.sql` の手動 SQL が中心で、Alembic ディレクトリはまだ無い可能性がある。その場合は、学習用として Alembic の migration 例を作りつつ、既存の手動 SQL 運用とどちらで進めるか決める。

### 差分コード

この step の差分は、単一ファイルではなく DB から frontend 型まで横断する。以下の各セクションに、手で取り込むための最小コード例を分けて置く。

### Alembic Migration

Alembic を導入済み、または導入する場合の migration 例。

ファイル例:

```text
backend/alembic/versions/20260530_add_updated_at_to_phrases.py
```

差分コード例:

```py
"""add updated_at to phrases

Revision ID: 20260530_add_updated_at
Revises: <previous_revision_id>
Create Date: 2026-05-30
"""

from alembic import op
import sqlalchemy as sa


revision = "20260530_add_updated_at"
down_revision = "<previous_revision_id>"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add a non-null timestamp so existing and new rows always have a value.
    op.add_column(
        "phrases",
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=False),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
    )


def downgrade() -> None:
    # Roll back only the column added by this migration.
    op.drop_column("phrases", "updated_at")
```

MySQL で DB 側に自動更新させたい場合は、`ON UPDATE CURRENT_TIMESTAMP` も検討する。ただし Alembic / SQLAlchemy の抽象 API だけでは書きづらいことがあるため、必要なら生 SQL を使う。

```py
def upgrade() -> None:
    # Use raw SQL when the database-specific ON UPDATE clause is required.
    op.execute(
        """
        ALTER TABLE phrases
        ADD COLUMN updated_at DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
        """
    )
```

学習用の最初の実装では、Python 側の `onupdate=func.now()` と DB 側 default の組み合わせでもよい。

### 手動 SQL の例

既存の `backend/sql/` 方針に合わせるなら、SQL ファイルを追加する。

```text
backend/sql/add-updated-at-to-phrases.sql
```

MySQL 例:

```sql
ALTER TABLE phrases
ADD COLUMN updated_at DATETIME NOT NULL
DEFAULT CURRENT_TIMESTAMP
ON UPDATE CURRENT_TIMESTAMP;
```

SQLite や PostgreSQL では書き方が変わる。教材では MySQL 前提の例として扱う。

### SQLAlchemy Model 修正

対象例:

```text
backend/app/models/phrase.py
```

差分コード例:

```py
updated_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=False),
    # Let the database set the initial timestamp.
    server_default=func.now(),
    # Let SQLAlchemy update the timestamp on ORM-managed updates.
    onupdate=func.now(),
    nullable=False,
)
```

配置例:

```py
created_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=False), server_default=func.now(), nullable=False
)
updated_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=False),
    # created_at stays fixed; updated_at changes when the row is edited.
    server_default=func.now(),
    onupdate=func.now(),
    nullable=False,
)
```

### Create / Update 時の扱い

Create 時:

- `created_at` と `updated_at` は同じ時刻で入る。
- application code から明示的に値を渡さず、DB / SQLAlchemy に任せる。

Update 時:

- `content` を変更したときに `updated_at` が更新される。
- SQLAlchemy の `onupdate=func.now()` は ORM 経由の update で効く。
- 生 SQL や bulk update を使う場合は、`updated_at` が更新されるか別途確認する。

現在の repository では update 時に `row.content = content` して commit しているため、ORM の `onupdate` と相性がよい。

```py
def update(self, row: Phrase, content: str) -> Phrase:
    # Mutating the ORM object allows onupdate to run during commit.
    row.content = content
    self.db.commit()
    # Refresh so the returned object includes the new updated_at value.
    self.db.refresh(row)
    return row
```

### FastAPI 側での変更点

Pydantic schema に `updated_at` を追加する。

対象例:

```text
backend/app/schemas/phrase.py
```

差分コード例:

```py
class PhraseRead(PhraseCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    content: str
    created_at: datetime
    # Expose the last edit time in every phrase response.
    updated_at: datetime
```

API route は `response_model=PhraseRead` を使っているため、schema に追加すると response に含まれる。

確認する route:

```text
GET /phrases
POST /phrases
GET /phrases/{phrase_id}
PUT /phrases/{phrase_id}
```

### Frontend 型の変更点

API response に `updated_at` が増えるので frontend 型も合わせる。

対象例:

```text
frontend/types/phrase.ts
```

差分コード例:

```ts
export type PhraseRead = {
  id: string
  content: string
  created_at: string
  // Keep the frontend type aligned with the API response.
  updated_at: string
}
```

未ログイン guest phrase を frontend で作る箇所も `updated_at` を埋める必要がある。

```tsx
// Use one timestamp so created_at and updated_at match on guest create.
const now = new Date().toISOString()

const nextPhrase: PhraseRead = {
  id: crypto.randomUUID(),
  content: nextContent,
  created_at: now,
  updated_at: now,
}
```

guest の編集時も、編集したタイミングで `updated_at` を更新する。

```tsx
phrases.map((p) =>
  p.id === editingId
    // Guest edits happen in local state, so update the timestamp manually.
    ? { ...p, content: nextContent, updated_at: new Date().toISOString() }
    : p
)
```

### 将来的な活用例

- 一覧を `updated_at desc` で並べる。
- 「最近編集したフレーズ」セクションを作る。
- phrase row に「最終更新: 5分前」を表示する。
- import 時に同じ content / id の競合を `updated_at` で判断する。
- sync 機能を追加するときの差分判定に使う。

### 注意点

- DB の timezone 方針を決める。学習用では naive datetime でもよいが、本番では UTC 統一が扱いやすい。
- `server_default=func.now()` だけでは update 時に変わらない。`onupdate` または DB の `ON UPDATE` が必要。
- 既存データには migration 実行時点の時刻が入る。過去の正確な更新時刻は復元できない。
- `updated_at` を response に追加すると frontend 型、テスト、snapshot に影響する。

### 本番反映手順

1. DB migration 方針を決める。Alembic を使うか、既存の `backend/sql/` に合わせるかを選ぶ。
2. `phrases.updated_at` を `NOT NULL` で追加し、既存行にも値が入るよう default を設定する。
3. `backend/app/models/phrase.py` に `updated_at` を追加する。
4. `backend/app/schemas/phrase.py` の `PhraseRead` に `updated_at` を追加する。
5. `frontend/types/phrase.ts` に `updated_at` を追加する。
6. guest phrase の create / update でも `updated_at` を埋める。
7. 作成時と更新時の API response を確認する。

### 動作確認

1. migration 後、既存 phrase に `updated_at` が入っている。
2.  新規作成した phrase は `created_at` と `updated_at` が入っている。
3. phrase を編集すると `updated_at` が変わる。
4. `GET /phrases` の JSON に `updated_at` が含まれる。
5. frontend の型エラーが出ない。

