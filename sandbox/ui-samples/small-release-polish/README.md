# Phase 4: Small Release Polish

## 目的

リリース前に気になった小さなUI調整をまとめます。

本番コードは変更せず、ここでは導入用スニペットとして次の4つに分けます。

1. ボタンサイズを Desktop / Mobile で切り替える
2. スマホ表示では Tooltip を出さない
3. コピー時の発光時間を短くする
4. `components/` のディレクトリ分け方針を決める

## Step 1: ボタンサイズを見直す

参照スニペット:

- `responsive-button-size-snippet.tsx`

対象:

- Add Phrase
- Send Magic Link

方針:

- Add Phrase は Mobile でタップしやすいサイズを維持し、Desktop では高さを抑える
- Send Magic Link は Mobile で画面幅いっぱい、Desktop では画面いっぱいにしない
- shadcn/ui `Button` の `size` だけでは breakpoint ごとの切り替えが難しいため、`className` で調整する

Send Magic Link:

```tsx
className="w-full sm:w-auto"
```

Add Phrase:

```tsx
className="size-11 sm:size-8"
```

## Step 2: スマホでは Tooltip を出さない

参照スニペット:

- `responsive-icon-action-button-snippet.tsx`

スマホでは hover がなく、Tooltip が長押しやタップ操作と相性が悪いため、`(hover: hover) and (pointer: fine)` の時だけ Tooltip を有効にします。

Mobile / touch device では Tooltip で包まず、`aria-label` 付きの icon button だけを返します。

## Step 3: コピー時の発光時間を短くする

参照スニペット:

- `short-copied-feedback-snippet.ts`

現在の `useCopiedFeedback` はデフォルト `1000ms` です。発光が長く感じる場合は `600ms` 程度にします。

推奨:

```tsx
const { showCopied, isCopied } = useCopiedFeedback(600)
```

全体で統一したい場合は hook のデフォルト値を `600` に変更します。画面ごとに調整したい場合は、呼び出し側で duration を渡します。

## Step 4: components ディレクトリ分け

参照:

- `components-directory-plan.md`

結論として、リリース前に大きな移動はしなくてよいです。

ただし、今後の見通しをよくするなら、まずは Phrase 関連だけ段階的にまとめるのが安全です。

推奨:

```text
frontend/components/
  auth/
  layout/
  phrase/
    actions/
    list/
  ui/
```

今すぐ全移動すると import 修正の差分が増えるため、機能修正が落ち着いてから別PRまたは別Phaseで行うのがよいです。
