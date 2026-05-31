# Phase4: Dialog

## 目的

Phrase削除の確認UIを、shadcn/ui の `AlertDialog` で実装するためのサンプルです。

## サンプル

- `delete-phrase-alert-dialog-snippet.tsx`

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
- AlertDialog内には削除対象のPhrase本文を短く表示する。

## このPhaseでの推奨

DeleteボタンはPhase1のアイコンボタン方針を維持し、クリック後に `AlertDialog` を開きます。削除成功時の通知はDialog内ではなく、Phase5のToastに任せます。
