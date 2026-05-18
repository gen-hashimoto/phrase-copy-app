## ステップ 3: 編集時は Copy → OK / Cancel

設計書: 編集モードではコピーボタンの代わりに **OK**（確定）と **Cancel**（破棄）。

### やること

1. `editingId === p.id` のとき、操作列から **Copy ボタンを出さない**。
2. 代わりに **OK**（既存の `handleSaveEdit`）と **Cancel**（既存の `cancelEdit`）を置く。
3. ラベルを設計に合わせる: 「保存（PUT）」→ **OK**、「キャンセル」→ **Cancel**（英語表記は設計イメージに合わせる。日本語 UI なら「OK」「キャンセル」でも可）。
4. サンプル: `components/edit-mode-actions-snippet.tsx`。

### コピー先

```text
frontend/components/phrase-manager.tsx   … 編集分支の操作列
```

### ポイント

- **表示モード**の行だけ Copy / Copied! / 削除を表示。
- 編集モードの textarea は **内容のみ**（step-05 前は title 入力が残っていれば削除または非表示）。
- `useCopiedFeedback` や `handleCopy` は触らない。

### 動作確認

1. ダブルクリックで編集 → 操作列に OK と Cancel のみ（Copy なし）。
2. OK で PUT 成功、Cancel で編集が閉じて元の表示に戻る。
3. 表示モードでは Copy が使える。

### 次のステップ

`step-04-plus-button-new-row` で Card 新規作成をやめ、+ ボタンで最下行追加。
