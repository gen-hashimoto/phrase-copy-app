## ステップ 2: 未ログイン時のデータ消失警告

未ログイン状態ではフレーズをブラウザ上の React state だけで保持している。リロード、タブを閉じる、別ページへ移動すると消えるため、未保存データがあるときだけ離脱警告を出す。

### 目的

- 未ログイン時かつフレーズが 1 件以上ある場合、ページ離脱時に警告を出す。
- ログイン済みの永続化済みデータでは警告しない。
- 空の状態では警告しない。

### なぜ必要か

未ログイン時の `GuestPhraseList` は `useState` でフレーズを持つ。

```tsx
const [phrases, setPhrases] = useState<PhraseRead[]>([])
```

これは手軽だが、ブラウザを閉じると失われる。ユーザーから見ると「画面に入力済みの内容がある」のに、保存済みではない。そこで、消える直前にブラウザ標準の離脱警告を出す。

### 実装方針

`beforeunload` を使う。

- `phrases.length > 0` のときだけ listener を登録する。
- listener 内で `event.preventDefault()` を呼ぶ。
- 互換性のため `event.returnValue = ""` も設定する。
- 表示文言はブラウザが制御するため、任意の文章を必ず表示できるわけではない。

### 差分コード

対象例:

```text
frontend/components/guest-phrase-list.tsx
```

import に `useEffect` を追加する。

```tsx
import { useEffect, useState } from "react"
```

未保存データの有無を作る。

```tsx
const hasUnsavedGuestPhrases = phrases.length > 0
```

`beforeunload` を登録する。

```tsx
useEffect(() => {
  // Register the browser warning only when guest data can be lost.
  if (!hasUnsavedGuestPhrases) return

  function handleBeforeUnload(event: BeforeUnloadEvent) {
    // Modern browsers require preventDefault to trigger the confirmation UI.
    event.preventDefault()
    // Some browsers still require returnValue for compatibility.
    event.returnValue = ""
  }

  window.addEventListener("beforeunload", handleBeforeUnload)
  return () => {
    // Always clean up the listener when the warning is no longer needed.
    window.removeEventListener("beforeunload", handleBeforeUnload)
  }
}, [hasUnsavedGuestPhrases])
```

必要なら画面内にも補助文を出す。

```tsx
{hasUnsavedGuestPhrases ? (
  <p className="text-sm text-muted-foreground">
    保存されていない内容があります。ログインまたはコピーしてから移動してください。
  </p>
) : null}
```

### Next.js App Router での実装例

`beforeunload` は `window` を使うため Client Component でしか使えない。今回なら `GuestPhraseList` はすでに `"use client"` なので置き場所として自然。

Server Component の `app/page.tsx` に直接書かない。

```tsx
// Server Components cannot access window.
export default async function Page() {
  window.addEventListener("beforeunload", ...)
}
```

Client Component に閉じ込める。

```tsx
"use client"

export function GuestPhraseList() {
  // Register beforeunload from a Client Component.
}
```

App Router の `Link` によるページ内遷移まで独自に完全制御したい場合は、各リンククリック時に `window.confirm()` を挟む設計もある。ただしまずはブラウザ離脱、リロード、タブ閉じを守る `beforeunload` から扱う。

### ブラウザ制約

`beforeunload` には強い制約がある。

- 表示される文言は多くのブラウザで固定。`"保存されていない内容があります"` をそのまま出せるとは限らない。
- ユーザー操作がないページでは警告が出ないことがある。
- モバイルブラウザでは動作が限定的な場合がある。
- SPA 内の client side navigation は、ブラウザや Next.js の挙動によって `beforeunload` だけでは拾えないことがある。

そのため、`beforeunload` は最後の安全網として扱う。重要な UX では画面内にも「未保存です」と表示する。

### 注意点

- `phrases.length > 0` だけだと「Copy All 済み」かどうかは分からない。今回の最小実装では、未ログインの state は永続保存されていないので警告対象にする。
- draft の空行だけを警告対象にするかは別途設計が必要。まずは保存済み guest phrase の有無を見る。
- ログイン導線へ進むときにも警告が出る可能性がある。気になる場合は、Login ボタンだけ別途 `confirm()` で説明する。

### 実運用での注意点

将来的には警告だけでなく、次のいずれかを検討する。

- 未ログインデータを `localStorage` に一時保存する。
- ログイン後に guest phrase を user phrase へ移行する。
- Copy All 済み、または明示的に破棄した場合は warning を解除する。
- 「ログインすると保存できます」という導線を usage 表示の近くに出す。

### 本番反映手順

1. `frontend/components/guest-phrase-list.tsx` に `useEffect` を追加する。
2. `phrases.length > 0` から `hasUnsavedGuestPhrases` を作る。
3. `beforeunload` listener を追加する。
4. 空の状態では警告が出ないことを確認する。
5. 未ログインで 1 件追加し、リロード時に警告が出ることを確認する。

### 動作確認

1. 未ログインでフレーズが 0 件のままリロードする。警告は出ない。
2. 未ログインでフレーズを 1 件追加してリロードする。警告が出る。
3. 警告でキャンセルすると画面に残る。
4. 警告で離脱するとデータは消える。
5. ログイン済み画面ではこの警告が出ない。
