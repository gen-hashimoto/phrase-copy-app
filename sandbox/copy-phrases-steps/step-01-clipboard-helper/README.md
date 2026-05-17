## ステップ 1: クリップボード用ヘルパー

### やること

- `lib/copy-to-clipboard.ts` を本番 `frontend/lib/` にコピーする。
- まだ UI は触らない。DevTools のコンソールで試すか、次ステップでボタンから呼ぶ。

### コピー先

```text
frontend/lib/copy-to-clipboard.ts
```

### ポイント

| 項目 | 説明 |
|------|------|
| **フロントのみ** | サーバーは関与しない。DB も更新しない。 |
| **Clipboard API** | `navigator.clipboard.writeText(text)` が標準。 |
| **セキュアコンテキスト** | `https://` または `http://localhost` でないと使えないことがある。 |
| **ユーザー操作** | クリックなどのジェスチャー内で呼ぶ（ボタン `onClick` で OK）。 |

### 動作確認（任意）

`phrase-manager` にまだ繋がない場合、一時的にボタンを 1 つ足して:

```ts
import { copyTextToClipboard } from "@/lib/copy-to-clipboard"

// onClick 内
await copyTextToClipboard("hello")
```

貼り付けで `hello` になれば OK。

### 次のステップ

`step-02-single-copy-button` で各行に「コピー」ボタンを付ける。
