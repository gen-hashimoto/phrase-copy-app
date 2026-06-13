# Phase3-1: Card Only Responsive Layout

## 目的

Phase3では「DesktopはTable、MobileはCard」を推奨案としていましたが、Phase3-1では方針を変更し、Phrase一覧の描画単位を **Cardコンポーネント1種類** に統一します。

狙いは、実装と保守の対象を1つに絞りながら、`sm` 以上ではTable風、Mobileでは縦積みの読みやすい見た目にすることです。

この資料は本番コードへ直接反映するものではなく、実装方針・コンポーネント構成・導入手順を整理するためのsandbox資料です。

## 採用方針

採用する方針:

- Phrase一覧は `Table` と `Card` の2系統に分けない。
- 1件のPhraseを `PhraseCard` として描画する。
- `sm` 以上では `PhraseCard` 内を `flex` または `grid` で横並びにし、Tableライクに見せる。
- Mobileでは同じ `PhraseCard` を縦積みにし、本文を読みやすくする。
- Copy / Edit / Delete などの操作は、Card内の共通アクションコンポーネントに寄せる。
- 将来のドラッグ&ドロップでは、`PhraseCard` 1つを並び替え単位にする。

イメージ:

```tsx
<PhraseList>
  {phrases.map((phrase) => (
    <PhraseCard key={phrase.id} phrase={phrase} />
  ))}
</PhraseList>
```

## 方針を変える理由

### 保守対象を1つにする

Desktop用TableとMobile用Cardを別々に持つと、表示内容・編集状態・操作ボタン・エラー表示・アクセシビリティ属性を2箇所で保守する必要があります。

Cardを唯一の描画単位にすると、Phraseの見た目と振る舞いを `PhraseCard` 周辺に集約できます。レイアウト差分はコンポーネント分岐ではなく、CSSのレスポンシブ指定で吸収します。

### ドラッグ&ドロップに備える

将来的に並び替えを入れる場合、1件のPhraseを「移動できるアイテム」として扱える構造が重要です。

Table行とMobile Cardを別々に持つより、`PhraseCard` を1つのSortable Itemとして扱う方が自然です。DesktopでもMobileでも同じDOM構造に近づくため、ドラッグハンドル、キーボード並び替え、選択状態の表現も共通化しやすくなります。

### Phraseは読むデータに近い

Phraseは数値や短い属性を比較する表形式データというより、文章を読んで選ぶデータです。

そのため、厳密なTableよりも、本文を主役にしたCardの方がUIの意味に合います。`sm` 以上では横幅に余裕が出始めるため、Card内部を横並びにして、一覧性を補う形にします。

## `sm` 以上 / Mobile の見え方

### `sm` 以上

`sm` 以上では、Cardを横長にし、内部をTableの行のように並べます。

配置イメージ:

```text
[drag] [phrase text                       ] [updated at] [actions]
[drag] [long phrase text wraps if needed  ] [updated at] [actions]
```

方針:

- リスト全体に見出し行を置く場合でも、各行は `PhraseCard` のままにする。
- 本文領域を `flex-1` にし、操作領域は右側に固定する。
- 更新日時などの補助情報は、必要なら `sm` 以上で横並び、Mobileで本文下に置く。
- Cardの余白は控えめにし、Tableに近い密度を保つ。

### Mobile

Mobileでは、同じ `PhraseCard` を縦積みにします。

配置イメージ:

```text
[phrase text]
[updated at]
[copy] [edit] [delete]
```

方針:

- 本文を最上部に置く。
- 操作ボタンは本文の後にまとめる。
- Tooltipに依存せず、`aria-label` と必要な補助テキストで意味を補う。
- DeleteはPhase4の `AlertDialog` 方針を引き継ぐ。

## コンポーネント構成

推奨構成:

```text
frontend/components/phrase-list/
  phrase-list.tsx              Phrase一覧の親。並び順・空状態・追加行を扱う
  phrase-card.tsx              1件のPhraseを表示/編集する唯一のCard
  phrase-card-content.tsx      本文表示、編集入力、保存/キャンセルの分岐
  phrase-list-header.tsx       Desktop向けの任意ヘッダー
  phrase-empty-state.tsx       Phraseがないときの表示

frontend/components/phrase-actions/
  icon-action-button.tsx
  phrase-row-actions.tsx       表示モード: Copy / Edit / Delete
  phrase-edit-actions.tsx      編集モード: Save / Cancel
  delete-phrase-alert-dialog.tsx
```

既存の `phrase-actions/` はPhase1とPhase4の方針をそのまま活かします。Phase3-1で新しく決める中心は、TableとCardを分けず、`phrase-card.tsx` を唯一の行表示として扱うことです。

## 責務分担

### `PhraseList`

担当すること:

- Phrase配列の受け取り
- 空状態の表示
- 新規追加フォームまたは追加行の配置
- 並び替え導入時のSortable Context
- `PhraseCard` へのイベントハンドラ受け渡し

担当しないこと:

- 1件分の細かいレイアウト
- Copy / Edit / Deleteボタンの見た目
- 編集フォーム内部の見た目

### `PhraseCard`

担当すること:

- 1件のPhraseの表示単位
- `sm` 以上では横並び、Mobileでは縦積みのレスポンシブレイアウト
- 表示モードと編集モードの切り替え
- 将来のドラッグハンドル配置

担当しないこと:

- API呼び出しの詳細
- Toastの発火条件
- Delete確認Dialogの中身

### `PhraseActions`

担当すること:

- Copy / Edit / Delete の表示モード操作
- Save / Cancel の編集モード操作
- Tooltip、`aria-label`、アイコンサイズの統一
- Delete時に `AlertDialog` を呼び出す入口

## レイアウト実装メモ

`PhraseCard` は、DesktopとMobileで別コンポーネントに分けず、classNameだけで見た目を切り替えます。

例:

```tsx
<Card className="rounded-lg border bg-card">
  <CardContent className="flex min-w-0 flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:py-3">
    <div className="min-w-0 flex-1">
      {/* phrase text or edit input */}
    </div>
    <div className="shrink-0 text-sm text-muted-foreground">
      {/* updated at */}
    </div>
    <PhraseRowActions />
  </CardContent>
</Card>
```

この形なら、`sm` 以上では横並びのTable風、Mobileでは自然な縦積みになります。

このプロジェクトでは実機確認時に `sm:flex-row` で意図した切り替えになったため、Phase3-1の基準は `sm` にします。`md:flex-row` が十分な画面幅でも効かない場合は、Tailwindの読み込み設定や生成CSSの状態も確認します。

## 実装ステップ

1. Phase1の方針に沿って、Copy / Edit / Delete / Save / Cancel をアイコンボタンへ寄せる。
2. DeleteはPhase4の `AlertDialog` 経由にする。
3. 既存のTableから操作部分を `phrase-actions/` へ切り出す。
4. `phrase-list/phrase-card.tsx` を作り、1件分の表示と編集状態を移す。
5. `PhraseList` で `phrases.map()` から `PhraseCard` だけを描画する。
6. `sm` 以上向けに任意の `PhraseListHeader` を追加し、見出しだけTable風にする。
7. Mobile表示を確認し、本文、補助情報、操作ボタンの縦積み順を調整する。
8. Table専用コンポーネントが不要になったら削除する。
9. 将来の並び替えに備え、`PhraseCard` の左側または右上にドラッグハンドルを置ける余白を残す。

## 将来のドラッグ&ドロップを見据えた注意点

最初からドラッグ&ドロップを実装する必要はありません。ただし、後から入れやすくするために次を意識します。

- `PhraseCard` の最上位要素に安定した `phrase.id` を紐づける。
- 行全体を複雑に分割せず、1件のPhraseが1つのまとまりに見える構造にする。
- 操作ボタンとドラッグハンドルのクリック領域を近づけすぎない。
- Mobileではドラッグ操作が誤タップになりやすいため、ハンドルを明示する。
- 並び替え中の見た目は、Cardの影、枠線、背景色で表現する。

## このPhaseで採用する結論

Phase3-1では、Phrase一覧を **Cardコンポーネント1種類** で実装する方針にします。

`sm` 以上ではCard内部を横並びにしてTable風に見せ、Mobileでは同じCardを縦積みにします。これにより、読みやすさ、保守性、将来の並び替え実装のしやすさを優先します。

Phase3の「Desktop Table / Mobile Card」案は比較検討として残しつつ、本番反映時の新しい推奨はPhase3-1のCard Only Responsive Layoutとします。
