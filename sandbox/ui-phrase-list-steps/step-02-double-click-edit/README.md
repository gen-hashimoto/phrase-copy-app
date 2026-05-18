## ステップ 2: ダブルクリック / ダブルタップで編集

設計書: フレーズをダブルクリックで編集。スマホはダブルタップ。

### やること

1. 操作列の **「編集」ボタンを削除**する。
2. 表示モードの **内容セル**（または行）に `onDoubleClick` で `startEdit(p)` を呼ぶ。
3. モバイル向け: `lib/double-tap.ts` をコピーし、内容セルに `onTouchEnd` を付ける（300ms 以内の 2 回タップ）。
4. サンプル: `components/phrase-content-cell-snippet.tsx`, `hooks/use-double-tap-edit-snippet.ts`。

### コピー先

```text
frontend/lib/double-tap.ts
frontend/components/phrase-manager.tsx
```

### ポイント

- 編集中の行 (`editingId === p.id`) ではダブルクリックを無効にする（textarea 内の選択と競合しないよう、編集 UI は別セル）。
- `startEdit` は既存の state（`editingId`, `editTitle`, `editContent`）をそのまま使える。
- コピーボタンの `onClick` がダブルクリックで誤発火しないよう、**内容セル側**に編集トリガーを置くのが安全。
- step-01 済みなら列は「内容 + 操作」の 2 列。

### 動作確認

1. デスクトップ: 内容をダブルクリック → 編集 UI が開く。
2. 「編集」ボタンが無いこと。
3. コピー・削除は従来どおり。

### 本番への実装（途中まで進めた場合）

詳細は同フォルダの **[IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md)** を参照。

- 済みになりやすい: `lib/double-tap.ts`, `phrase-content-cell.tsx`（要: `<td>` → div）
- 残り: `phrase-display-row` の props 配線、`phrase-manager` で **編集行分支を map に戻す**、「編集」ボタン削除

### 次のステップ

`step-03-edit-mode-copy-to-ok-cancel` で編集時のボタンを OK / Cancel に差し替え。
