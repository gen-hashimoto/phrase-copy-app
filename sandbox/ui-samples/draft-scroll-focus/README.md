# Phase 3: Draft Scroll Focus

## 目的

追加ボタン押下後、新規ドラフトを末尾へ追加し、自動で末尾へスクロールして編集欄へフォーカスします。

本番コードは変更せず、ここでは導入用スニペットとして次の2段階に分けます。

1. `PhraseEditCell` の input に親から `ref` を渡せるようにする
2. `PhraseManager` でドラフト行へ `scrollIntoView()` し、編集欄へ `focus()` する

## 要件

- 新規ドラフトを末尾へ追加
- 自動で末尾へスクロール
- 編集欄へフォーカス
- `ref` を利用
- `scrollIntoView`
- `focus()`

## Step 1: 編集欄に ref を渡す

参照スニペット:

- `phrase-edit-cell-focus-ref-snippet.tsx`

既存の `PhraseEditCell` は内部で input ref を持ち、編集状態になると `input.focus()` しています。

この `focus()` によって、ブラウザがフォーカス対象まで即スクロールすることがあります。追加ボタン押下時に「勝手に対象まで移動する」ように見える主な理由はこれです。

Phase 3 では、親の `PhraseManager` からも `focus()` したいので、次の2つの props を追加します。

- `inputRef`: 親から編集欄の input を参照する
- `autoFocusOnEdit`: 子コンポーネント側の自動フォーカスを使うか切り替える

通常の編集では自動フォーカスを残し、ドラフト追加時だけ `autoFocusOnEdit={false}` にして、親側でスムーズスクロールを制御します。

## Step 2: 追加後にスクロールしてフォーカス

参照スニペット:

- `phrase-manager-draft-scroll-focus-snippet.tsx`

導入ポイント:

- `draftRowRef`: 新規ドラフト行の位置を保持
- `draftInputRef`: 新規ドラフトの編集欄を保持
- `shouldFocusDraftRef`: 追加ボタン押下直後だけスクロール・フォーカスするためのフラグ

`startDraft()` では次の順序で状態を更新します。

1. `shouldFocusDraftRef.current = true`
2. `draftRow` を作成
3. `editingId` を `DRAFT_PHRASE_ID` にする
4. `content` を空にする

その後、React がドラフト行を描画したタイミングで `useEffect` が動きます。

```tsx
draftInputRef.current?.focus({ preventScroll: true })
draftRowRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
```

## なぜ requestAnimationFrame を使うか

ドラフト行の DOM と input ref が揃ったあとに、フォーカスとスクロールを実行したいためです。

`focus({ preventScroll: true })` を先に呼ぶことで、フォーカスによる即スクロールを抑えます。そのうえで `scrollIntoView({ behavior: "smooth" })` を呼ぶと、末尾までアニメーションで移動できます。

## Phase 2 との関係

Phase 2 の `PhraseActionBar` から `onAdd={startDraft}` を呼ぶ構成のままで使えます。

Sticky Action Bar が上部に固定されるため、`scrollIntoView({ block: "end" })` にすると、追加された末尾のドラフトがバーに隠れにくくなります。
