## ステップ 2: 1 件コピー（行ごとのボタン）

### やること

1. `lib/phrase-copy-text.ts` を `frontend/lib/` にコピー。
2. `phrase-manager.tsx` の各行「操作」にコピーボタンを追加。
   - サンプル: `components/phrase-copy-button-snippet.tsx`（独立コンポーネントにしても、インラインでも可）。
3. **編集中の行**ではコピーではなく「保存 / キャンセル」のまま（設計書: 編集時はコピーが OK/Cancel に変わる — それは UI 刷新時に合わせる）。

### コピー先（例）

```text
frontend/lib/phrase-copy-text.ts
frontend/components/phrase-copy-button.tsx   … 名前は任意
frontend/components/phrase-manager.tsx       … ボタンを配置
```

### ポイント

- コピー対象は **`phrase.content`**（`getPhraseCopyText` で一元化）。
- `fetch` や `/api` は **呼ばない**。
- 編集モード (`editingId === p.id`) のときはコピーボタンを出さない。

### 動作確認

1. 一覧で「コピー」を押す。
2. メモ帳やターミナルに貼り付け、**内容**が 1 行で入ること。

### 次のステップ

`step-03-copied-feedback` で「Copied!」表示を足す。
