## ステップ 5: title 廃止（DB・API・フロント）

将来の DB 設計（`phrase` 1 列）に合わせ、**title をやめ content のみ**にする。ステップ 1〜4 の UI と合わせて **一括で** backend / frontend を更新する。

### やること（順序の目安）

#### A. データベース（MySQL）

1. 既存データのバックアップを取る。
2. `sql/drop-title-column.sql` を参考に `title` 列を削除する。  
   開発環境でデータを捨ててよいなら、テーブル drop + `Base.metadata.create_all` でも可（`backend/app/main.py`）。

#### B. Backend（FastAPI）

| ファイル | 変更 |
|----------|------|
| `backend/app/models/phrase.py` | `title` 列を削除 |
| `backend/app/schemas/phrase.py` | `PhraseCreate` / `PhraseUpdate` / `PhraseRead` から `title` 削除 |
| `backend/app/repositories/phrase_repository.py` | `create(content)`, `update(row, content)` |
| `backend/app/services/phrase_service.py` | `body.content` のみ。400 メッセージを `content is required` に |
| `backend/app/api/routes/phrases.py` | 変更不要なことが多い（スキーマ経由） |

サンプル断片: このフォルダの `backend/` 配下。

#### C. Frontend

| ファイル | 変更 |
|----------|------|
| `frontend/types/phrase.ts` | `title` を型から削除 |
| `frontend/components/phrase-manager.tsx` | `createTitle` / `editTitle` state 削除。POST/PUT は `{ content }` |
| `frontend/lib/phrase-copy-text.ts` | 既に `content` のみなら **変更不要** |
| `frontend/app/api/phrases/route.ts` | プロキシのみなら **変更不要**（body をそのまま転送） |

サンプル: `frontend/types/phrase-snippet.ts`。

#### D. 動作確認

1. `GET /api/phrases` の JSON に `title` が無い。
2. + で新規 → POST 成功。
3. ダブルクリック編集 → PUT 成功。
4. Copy / Copy All が `content` で動く。

### コピー先一覧

```text
backend/app/models/phrase.py
backend/app/schemas/phrase.py
backend/app/repositories/phrase_repository.py
backend/app/services/phrase_service.py
frontend/types/phrase.ts
frontend/components/phrase-manager.tsx
```

### ポイント

- **PUT** は `content` 必須にするか、部分更新をやめるか方針を決める（現行は title or content のどちらか必須 → **content 必須**に単純化）。
- 列名を将来 `phrase` にリネームする場合は **別 PR** でよい（API フィールド名 `content` のままでも設計意図に近い）。
- 既存行に title だけ入っていたデータは、マイグレーション前に `content` へ移すか破棄する。

### 次のステップ

`step-06-polish` で Enter / Esc、改行禁止、aria の仕上げ。
