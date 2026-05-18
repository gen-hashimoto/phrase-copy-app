## ステップ 1: 列の整理（UI のみ）

設計の一覧に合わせ、**画面上から** ID・作成日時・タイトル列を外す。バックエンドの `title` 列はまだ残してよい。

### やること

1. `phrase-manager.tsx` のテーブルヘッダから ID / タイトル / 作成日時の `<TableHead>` を削除する。
2. 表示行から対応する `<TableCell>` を削除し、**内容**と**操作**だけにする。
3. サンプル: `components/table-layout-snippet.tsx` を参考にマージ。
4. 上部の Card「新規作成」は **このステップでは触らなくてよい**（step-04 で + ボタンに置き換え）。

### コピー先

```text
frontend/components/phrase-manager.tsx   … テーブル部分のみ
```

### ポイント

- `PhraseRead` 型や GET レスポンスはまだ `title` / `created_at` を含んでよい。**表示しないだけ**。
- 編集モードの `colSpan` は列数が減るので **2 → 1** などに直す（内容列 + 操作列 = 2 列想定）。
- コピー関連（`handleCopy`, `useCopiedFeedback`, Copy All）は **変更しない**。

### 動作確認

1. 一覧に **内容**と**操作**（Copy / 編集 / 削除）だけが見える。
2. コピー・編集・削除が従来どおり動く。

### 次のステップ

`step-02-double-click-edit` で「編集」ボタンをやめ、ダブルクリックで編集開始。
