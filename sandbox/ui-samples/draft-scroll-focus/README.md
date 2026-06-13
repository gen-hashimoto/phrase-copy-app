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

## 空ドラフトのまま他行を編集した時の注意

既存の流れでは、他のフレーズをダブルクリックすると `startEdit()` が動き、`editingId` だけが別のフレーズIDへ切り替わります。

この時、空の新規ドラフトは `phrases` には保存されていません。ただし `draftRow` state には残っているため、編集状態だけ外れて、画面上は空の行が確定したように見えます。

バリデーションが効かない理由は、バリデーションが `handleSaveEdit()` の中だけで実行されるためです。ダブルクリックによる編集対象の切り替えは保存処理ではないので、`validatePhraseContent()` を通りません。

この Phase では、ドラフト編集中に他行を編集しようとした場合、入力状態によって分けます。

- 空ドラフト: 先に空ドラフトを破棄してから編集対象を切り替える
- 入力済みドラフト: 切り替えを止めて、保存またはキャンセルを促す

```tsx
if (editingId === DRAFT_PHRASE_ID) {
  if (content.trim().length === 0) {
    setDraftRow(null)
  } else {
    setEditError("新規フレーズを保存またはキャンセルしてください。")
    draftInputRef.current?.focus({ preventScroll: true })
    return
  }
}
```

入力済みドラフトを自動保存しない理由は、他行のダブルクリックが保存操作ではないためです。暗黙保存にすると、ユーザーがまだ入力途中の内容まで確定してしまう可能性があります。

本番反映時に `startEdit` を `useCallback` で包む場合は、依存配列に注意します。

```tsx
const startEdit = useCallback((phrase: PhraseRead) => {
  if (editingId === DRAFT_PHRASE_ID && content.trim().length === 0) {
    setDraftRow(null)
  }

  setEditingId(phrase.id)
  setEditContent(phrase.content)
  setEditError(null)
}, [editingId, content])
```

`useCallback(..., [])` にすると、初回レンダー時の `editingId` と `content` を見続けます。そのため、画面上ではドラフト編集中でも、コールバック内では `editingId === null` のままになり、空ドラフト破棄の条件が通りません。

確認ダイアログを出したい場合は、この `return` の前に `AlertDialog` を挟み、「保存せず破棄して切り替える」操作だけ明示的に許可します。

## Phase 2 との関係

Phase 2 の `PhraseActionBar` から `onAdd={startDraft}` を呼ぶ構成のままで使えます。

Sticky Action Bar が上部に固定されるため、`scrollIntoView({ block: "end" })` にすると、追加された末尾のドラフトがバーに隠れにくくなります。
