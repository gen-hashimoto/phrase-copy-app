# Phase4: Dialog

## 目的

Phrase削除の確認UIを、shadcn/ui の `AlertDialog` で実装するためのサンプルです。

## サンプル

- `delete-phrase-alert-dialog-snippet.tsx`
- `phrase-row-layout-adjustment-snippet.tsx`

## 追加する shadcn/ui

```bash
cd frontend
npx shadcn@latest add alert-dialog
```

## Delete確認UI

構成:

- Trigger: ゴミ箱アイコンボタン
- Title: `Delete this phrase?`
- Description: 元に戻せないことを明記
- Preview: 削除対象のPhrase本文
- Footer: `Cancel` / `Delete`

## 実装手順

1. `alert-dialog` を shadcn/ui で追加する。
2. Phase1のDeleteアイコンボタンを `AlertDialogTrigger asChild` で包む。
3. 削除対象の本文をDialog内に表示する。
4. `Cancel` と `Delete` を明確に分ける。
5. `Delete` 実行中は二重送信を避けるためボタンをdisabledにする。
6. 削除成功後はPhase5のToastで成功を通知する。

## Dialogとの違い

通常の `Dialog` は、フォーム編集、詳細表示、補助的な入力など、ユーザーが自由に閉じてもよいUIに向いています。

`AlertDialog` は、削除や破壊的変更など、ユーザーに確認を求める必要がある操作に向いています。初期フォーカスや読み上げ上の意味付けも、警告・確認の用途に合わせやすいです。

## AlertDialogを選ぶ理由

Phrase削除は元に戻せない操作です。誤タップが起きやすいスマホでは、アイコンのみのDeleteボタンを直接実行にすると危険です。

`AlertDialog` を挟むことで、次の安全性を確保できます。

- 削除対象を再確認できる。
- Cancelが明確に用意される。
- Deleteが破壊的操作として視覚的に区別される。
- キーボード操作やスクリーンリーダーでも確認UIとして扱いやすい。

## 本プロジェクトでの推奨方針

Phrasesでは次のルールを推奨します。

- Deleteは必ず `AlertDialog` を通す。
- Copyは確認不要。
- Saveはフォーム上の明示操作なので確認不要。
- Cancelは未保存変更がある場合だけ、将来的に確認を検討する。
- AlertDialog内には削除対象のPhrase本文を表示し、長い場合もスクロールして確認できるようにする。

## Phase4内で合わせておく調整

### 入力UI

最初の実装では、Phrase入力・編集は `textarea` ではなく `input` でよいです。

理由:

- まずは単一行の短いPhraseを主対象にする。
- Enter保存などのキーボード操作をシンプルに保てる。
- 複数行入力が明確に必要になった時点で `textarea` に拡張する。

将来的に長文や改行を扱う場合は、Phase3のレスポンシブ調整と合わせて `textarea` 化を検討します。

### 表示モードと編集モードの列幅

表示モードと編集モードで、内容カラムと操作カラムの幅が変わらないようにします。

方針:

- Table全体は横幅いっぱいに使う。
- 内容カラムは残り幅を使う。
- 操作カラムは Copy / Delete / Save / Cancel ボタンの幅に合わせて固定寄りにする。
- 表示モード・編集モードのどちらでも、操作ボタンは右寄せにする。
- 編集中だけ入力欄やボタン位置が大きくずれないようにする。

実装例は `phrase-row-layout-adjustment-snippet.tsx` を参照します。

### 長いPhraseの表示

一覧表示でも削除確認Dialog内でも、長いPhraseは折り返さず、横スクロールして確認できる形を優先します。

推奨:

- 一覧の内容セルは `overflow-x-auto` を使い、セル内で横スクロールできるようにする。
- 削除確認Dialog内のPreviewも、3点リーダーだけで隠さず、横スクロールして全文を確認できるようにする。
- 折り返しを避けるため、`whitespace-pre` を使う。
- 3点リーダーは省スペースには有効だが、削除確認のように内容確認が目的のUIでは使わない。

例:

```tsx
<div className="overflow-x-auto whitespace-pre">
  {phrase.content}
</div>
```

```tsx
<blockquote className="overflow-x-auto whitespace-pre rounded-lg border bg-muted p-3 text-sm">
  {phrasePreview}
</blockquote>
```

## このPhaseでの推奨

DeleteボタンはPhase1のアイコンボタン方針を維持し、クリック後に `AlertDialog` を開きます。削除成功時の通知はDialog内ではなく、Phase5のToastに任せます。
