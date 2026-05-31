# Phase1: アイコンボタン + Tooltip

## 目的

Phrase一覧の操作を、PC・スマホともに「アイコンのみ」のボタンへ統一するための設計サンプルです。対象操作は Copy / Delete / Save / Cancel です。

本番コードは変更せず、導入時に `frontend/components/` や Phrase一覧へ移す前提のサンプルとして残します。

## サンプル画面

- `icon-actions-sample.tsx`

想定配置:

```tsx
<PhraseIconActionsSample />
```

## 追加する shadcn/ui

既存の `Button` は利用できます。Tooltip が未追加の場合だけ追加します。

```bash
cd frontend
npx shadcn@latest add tooltip
```

## 推奨コンポーネント構成

```text
frontend/components/phrase-actions/
  icon-action-button.tsx       共通のアイコンボタン
  phrase-row-actions.tsx       表示モード: Copy / Delete
  phrase-edit-actions.tsx      編集モード: Save / Cancel
```

最初は `phrase-row-actions.tsx` に直接書いてもよいですが、Copy / Delete / Save / Cancel で同じ Tooltip / size / aria-label を使うため、`IconActionButton` を1つ作るのが扱いやすいです。

## 実装手順

1. `tooltip` を shadcn/ui で追加する。
2. `IconActionButton` を作り、`Button size="icon"` に統一する。
3. `lucide-react` から操作に合うアイコンを選ぶ。
4. すべてのアイコンボタンに `aria-label` を付ける。
5. `TooltipTrigger asChild` で `Button` を包む。
6. 表示モードは Copy / Delete、編集モードは Save / Cancel に分ける。

## 設計理由

- 操作列の幅が安定するため、一覧の可読性が上がります。
- PCとスマホで表示方針を変えないため、実装分岐が少なくなります。
- 視覚的な意味はアイコンで示し、読み上げや意味補完は `aria-label` と Tooltip に任せます。
- shadcn/ui の `Button` にある `size="icon"` を使うことで、ボタンサイズとフォーカスリングを揃えられます。

## Tooltipをモバイルでどう扱うべきか

Tooltipはモバイルの主要な説明手段にしない方が安全です。スマホでは hover がなく、長押しやタップで Tooltip を出す挙動も端末・ブラウザ・実装により分かれます。

このプロジェクトでは、モバイルでもアイコンのみ表示にする代わりに次を守ります。

- よく使われる操作だけをアイコン化する。
- 危険操作の Delete は AlertDialog で確認する。
- 初見で分かりにくい操作は画面内の補助テキストや空状態メッセージで説明する。
- TooltipはPC向けの補助、`aria-label` はアクセシビリティ上の必須情報として扱う。

## aria-labelの付け方

アイコンだけのボタンでは、ボタン内の SVG は読み上げ対象にせず、ボタンに操作名を付けます。

```tsx
<Button aria-label="Copy phrase" size="icon" type="button" variant="ghost">
  <ClipboardCopy aria-hidden="true" />
</Button>
```

ラベルは画面上の意味と一致させます。たとえば `Delete phrase` は「行を削除する」意味に限定し、`Remove` や `Trash` など揺れた表現を混ぜない方がよいです。

## アクセシビリティ上の注意点

- アイコンのみのボタンには必ず `aria-label` を付ける。
- SVGには `aria-hidden="true"` を付け、読み上げが二重にならないようにする。
- Delete は `variant="destructive"` と AlertDialog を併用する。
- キーボード操作でフォーカスリングが見える状態を保つ。
- ボタンサイズは `size="icon"` に統一し、タップ対象が小さくなりすぎないようにする。
- Tooltipにしか存在しない重要情報を置かない。

## このPhaseでの推奨

Phrase一覧では「表示モード: Copy / Delete」「編集モード: Save / Cancel」に分け、操作ボタンはすべて `IconActionButton` から描画します。Copy成功は Toast ではなく、短時間だけ `Check` アイコンへ変える方針にします。
