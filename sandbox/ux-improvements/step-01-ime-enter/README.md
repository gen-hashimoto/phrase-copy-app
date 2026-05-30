## ステップ 1: IME 変換中の Enter を保存扱いにしない

日本語入力中に変換候補を Enter で確定しようとすると、textarea の `onKeyDown` が先に保存処理を実行してしまう問題を防ぐ。

### 目的

- IME 変換中の Enter はフレーズ登録 / 更新に使わない。
- 変換確定後、通常の Enter だけで登録 / 更新する。
- Shift + Enter は従来どおり改行として残す。
- 編集状態に入った瞬間、textarea に focus を当てて Enter / Escape がすぐ効くようにする。

### なぜ必要か

日本語入力では、文字入力の途中に IME が「変換中」の状態を持つ。

例:

1. `よろしく` と入力する。
2. 変換候補が表示される。
3. Enter で候補を確定する。

この 3 の Enter は「フォーム送信」ではなく「IME の変換確定」の意味を持つ。しかし React の `onKeyDown` には Enter キーイベントとして届くため、単純に `e.key === "Enter"` だけを見ていると保存処理が動いてしまう。

現状の確認ポイント:

```tsx
onKeyDown={(e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault()
    handleSaveEdit(content)
  }
}}
```

### 実装方針

React / Next.js では、keyboard event の `isComposing` を見て IME 変換中かどうかを判定するのが一般的。

基本方針:

- `e.nativeEvent.isComposing` が `true` の間は Enter 保存を無視する。
- `e.key === "Process"` も一部ブラウザ / IME での保険として扱う。
- `preventDefault()` は保存すると決めた後にだけ呼ぶ。
- 編集開始時は state 更新後に textarea が描画されるため、`useRef` と `useEffect` で focus する。

### 差分コード

対象例:

```text
frontend/components/phrase-manager.tsx
```

差分の考え方:

```tsx
onKeyDown={(e) => {
  if (e.key === "Escape") {
    // Escape is an app shortcut, so prevent the browser default first.
    e.preventDefault()
    cancelEdit()
    return
  }

  // Ignore shortcut handling while the user is confirming IME conversion.
  const isComposing =
    e.nativeEvent.isComposing || e.key === "Process"

  if (isComposing) {
    return
  }

  if (e.key === "Enter" && !e.shiftKey) {
    // Plain Enter saves; Shift + Enter remains a normal textarea newline.
    e.preventDefault()
    void handleSaveEdit(content)
  }
}}
```

小さな helper に分ける場合:

```tsx
function isImeComposing(e: React.KeyboardEvent<HTMLTextAreaElement>) {
  // Some browser / IME combinations report "Process" during composition.
  return e.nativeEvent.isComposing || e.key === "Process"
}
```

その場合は JSX 側を読みやすくできる。

```tsx
if (isImeComposing(e)) return
```

### 編集開始時に textarea へ focus する

今回の UX では、行が編集状態に変わってもカーソルが textarea に入らないため、直後に Enter / Escape を押しても `textarea` の `onKeyDown` が発火しない。

理由は、`startEdit()` や `startDraft()` が `editingId` を更新しても、その瞬間にはまだ textarea DOM が存在しないから。React が次の render で textarea を描画した後に focus する必要がある。

最小対応なら textarea に `autoFocus` を付ける方法もある。

```tsx
<textarea
  autoFocus
  // Keep the existing keyboard shortcuts on the focused textarea.
  onKeyDown={(e) => {
    // ...
  }}
/>
```

ただし、教材としては `useRef` + `useEffect` の方が、focus のタイミングを明示できる。

import の例:

```tsx
import { useCallback, useEffect, useRef, useState, useTransition } from "react"
```

ref を用意する。

```tsx
const editTextareaRef = useRef<HTMLTextAreaElement | null>(null)
```

`editingId` が入った後に focus する。

```tsx
useEffect(() => {
  if (editingId === null) return

  const textarea = editTextareaRef.current
  if (textarea === null) return

  // Focus after React has rendered the edit textarea.
  textarea.focus()

  // Put the caret at the end so the user can keep typing immediately.
  const end = textarea.value.length
  textarea.setSelectionRange(end, end)
}, [editingId])
```

textarea に ref を付ける。

```tsx
<textarea
  ref={editTextareaRef}
  value={content}
  // Keyboard shortcuts only work when the textarea owns focus.
  onKeyDown={(e) => {
    // ...
  }}
/>
```

この対応により、編集ボタンや行のダブルクリックで編集状態に入った直後から、textarea が keyboard event を受け取れる。

### `isComposing` の扱い

`isComposing` は composition event の開始から終了まで `true` になる。IME 変換中の keydown を「アプリのショートカット」として扱わないために使う。

関連イベント:


| イベント                | 意味           |
| ------------------- | ------------ |
| `compositionstart`  | IME 入力が始まった  |
| `compositionupdate` | 変換中の文字が更新された |
| `compositionend`    | 変換が確定 / 終了した |
| `keydown`           | キーが押された      |


この step では `compositionstart/end` の state を自前で持たず、まず keyboard event の `nativeEvent.isComposing` を使う。理由は、今回の目的が「Enter 保存の条件を狭める」だけだから。

### Safari / Chrome の注意点

- Chrome では `e.nativeEvent.isComposing` で期待どおり判定できることが多い。
- Safari では IME 確定時の Enter まわりで `isComposing` のタイミング差が出ることがある。
- 一部環境では IME 変換中の key が `"Process"` になることがあるため、`e.key === "Process"` も見ると安全側に倒せる。
- それでも環境差が残る場合は、`compositionstart` / `compositionend` で `useRef(false)` を管理し、`onKeyDown` で ref も見る。

ref を使う発展形:

```tsx
const isComposingRef = useRef(false)

<textarea
  onCompositionStart={() => {
    // Track IME composition for browsers with unreliable keydown metadata.
    isComposingRef.current = true
  }}
  onCompositionEnd={() => {
    // Re-enable app shortcuts after IME conversion is committed.
    isComposingRef.current = false
  }}
  onKeyDown={(e) => {
    if (isComposingRef.current || e.nativeEvent.isComposing) return
    // Run Enter save handling only outside IME composition.
  }}
/>
```

ただし、最初から ref 方式にするとコードが少し増える。まずは `nativeEvent.isComposing` + `"Process"` で確認する。

### 注意点

- `preventDefault()` を先に呼ぶと、IME の変換確定自体を邪魔する可能性がある。
- `Enter` と `Shift + Enter` の分岐は残す。textarea では改行入力も自然な操作だから。
- `handleSaveEdit` が async の場合、イベントハンドラ内では `void handleSaveEdit(content)` のように意図を明示すると lint と相性がよい。
- focus は textarea が描画された後に当てる。`startEdit()` の中で直接 DOM を探すより、`useEffect` に寄せる方が React の render と噛み合う。

### 本番反映手順

1. `frontend/components/phrase-manager.tsx` の textarea `onKeyDown` を探す。
2. Escape の処理はそのまま残す。
3. Enter 保存処理の前に IME 変換中判定を追加する。
4. `useRef` と `useEffect` で、`editingId` が入った後に textarea へ focus する。
5. 日本語 IME で「変換候補表示中の Enter」と「確定後の Enter」をそれぞれ試す。
6. Chrome と Safari の両方で確認する。

### 動作確認

1. 日本語入力中に変換候補を表示する。
2. Enter を押しても保存されず、変換だけが確定する。
3. 変換確定後に Enter を押すと保存される。
4. Shift + Enter で改行できる。
5. Escape で編集キャンセルできる。
6. 編集状態に入った直後、クリックし直さなくても Enter / Escape が効く。

