## ステップ 3: 「Copied!」フィードバック（約 1 秒）

設計書（`02_screen-design.md` 共通仕様）:

- ボタン横に **「Copied!」**（1 秒程度）
- その後、表示を元に戻す

### やること

1. `hooks/use-copied-feedback.ts` を `frontend/hooks/` にコピー（`hooks` が無ければ作成）。
2. コピーボタンの横に、`isCopied(p.id)` のときだけ `Copied!` を表示。
3. `copyTextToClipboard` 成功後に `showCopied(p.id)` を呼ぶ。

### コピー先（例）

```text
frontend/hooks/use-copied-feedback.ts
frontend/components/phrase-copy-button.tsx   … showCopied を props で受け取る形でも可
```

### 実装の型（例）

```tsx
const { showCopied, isCopied } = useCopiedFeedback()

// コピー成功後
showCopied(phrase.id)

// JSX（ボタン横）
{isCopied(phrase.id) ? (
  <span className="text-xs text-muted-foreground" aria-live="polite">
    Copied!
  </span>
) : null}
```

### ポイント

- **`aria-live="polite"`** … スクリーンリーダーに成功を伝えられる。
- Copy All 用に `showCopied("all")` も使える（ステップ 5）。
- `setTimeout` は `useEffect` のクリーンアップで解除（フック内で実施済み）。

### 次のステップ

`step-04-row-highlight` でフレーズ表示部分を光らせる。
