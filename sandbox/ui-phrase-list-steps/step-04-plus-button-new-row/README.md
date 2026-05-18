## ステップ 4: + ボタンで最下行を新規編集

設計書: フレーズ追加ボタン（+）で **最下部に行が追加され編集状態**になる。Card「新規作成」フォームは廃止。

### やること

1. `phrase-manager.tsx` から **Card「新規作成」**ブロック全体を削除する。
2. 一覧の下（テーブル直後）に **+** ボタンを置く。サンプル: `components/add-phrase-row-snippet.tsx`。
3. 押下時:
   - `lib/draft-phrase.ts` の **仮 ID**（例: `-1`）でクライアント専用の draft 行を state に追加。
   - `editingId` をその仮 IDにし、`editContent` を `""` に。
4. テーブル描画: `displayPhrases = [...phrases, draftRow?]` のように **最後に draft 行**を足して表示。
5. OK 時:
   - 仮 ID なら **POST** `/api/phrases`（step-05 前は `{ title: "—", content }` など暫定 title でも可。step-05 後は `{ content }` のみ）。
   - 成功したら draft を消し `router.refresh()`。
6. Cancel 時: draft 行だけ state から削除。

### コピー先

```text
frontend/lib/draft-phrase.ts
frontend/components/phrase-manager.tsx
```

### 仮 ID の扱い（重要）

| 概念 | 推奨 |
|------|------|
| 定数 | `DRAFT_PHRASE_ID = -1`（負の数は DB に存在しない） |
| 型 | `editingId: number \| null` のまま。`editingId < 0` で新規 draft と判定 |
| 削除 | draft 行に削除ボタンは **出さない**か、Cancel と同じ扱い |
| 複数 draft | Phase1 では **同時に 1 件だけ**（+ を押したら既存 draft があれば先に Cancel 促す） |

将来の「10 件上限」は `phrases.length + (hasDraft ? 1 : 0) >= 10` で + を `disabled` にすればよい（本ステップでは任意）。

### ポイント

- Copy All は **DB 上の `phrases` のみ**（draft の空行は含めない）。
- コピー lib は変更しない。

### 動作確認

1. + で最下行に空の textarea と OK / Cancel が出る。
2. OK で POST 成功 → 一覧に 1 件増える。
3. Cancel で行が消える。
4. 上部に「新規作成」Card が無い。

### 次のステップ

`step-05-remove-title-backend` で title を API / DB から削除。
