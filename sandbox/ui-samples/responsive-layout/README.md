# Phase3: レスポンシブ

## 目的

現在のPhrase一覧はテーブル表示です。モバイルでの見やすさと実装量を比較し、Phrasesに合うレスポンシブ方針を決めます。

## サンプル

- `responsive-layout-samples.tsx`

含まれる案:

- 案A: DesktopはTable、MobileはCard
- 案B: DesktopはTable、Mobileは横スクロールTable
- 案C: Desktop/MobileともCard

## 比較表

| 案 | Desktop | Mobile | 良い点 | 注意点 | 評価 |
| --- | --- | --- | --- | --- | --- |
| 案A | Table | Card | PCでは一覧性が高く、スマホでは読みやすい | TableとCardの2表示を保守する必要がある | 最推奨 |
| 案B | Table | 横スクロールTable | 実装差分が少なく、shadcn/ui Tableの標準挙動に近い | スマホで横スクロールに気づきにくく、操作列が見切れやすい | 短期なら可 |
| 案C | Card | Card | 実装が単純で、スマホ体験が安定する | PCで行数が増えると一覧性が落ちる | 件数が少ないなら可 |

## 案A: Desktop Table / Mobile Card

```tsx
<div className="hidden md:block">
  <PhraseTable />
</div>
<div className="md:hidden">
  <PhraseCardList />
</div>
```

### 理由

Phraseは本文が主役で、スマホでは横幅が不足しやすいです。MobileではCardにして、本文・更新日時・操作を縦方向に整理すると読みやすくなります。

一方、Desktopでは複数件を比較しながらCopy / Delete / Editするため、Tableの一覧性が有利です。

### 注意点

同じデータをTableとCardの2箇所で描画するため、操作コンポーネントは共通化します。たとえば `PhraseActions` を作り、Tableの操作列とCard右上で同じものを使います。

## 案B: Desktop Table / Mobile 横スクロールTable

shadcn/ui の `Table` はコンテナに `overflow-x-auto` を持つため、横スクロールTableは最も導入しやすい案です。

### 理由

列構成を変えずに済むため、既存実装からの移行コストが小さいです。短期で崩れを直すだけなら有効です。

### 注意点

スマホでは操作列が画面外に出ることがあります。CopyやDeleteのような頻繁な操作が見切れると、ユーザーは機能に気づきにくくなります。

## 案C: Desktop/Mobile共通Card

画面サイズによらずCardだけで表示する案です。

### 理由

実装が単純で、同じマークアップを使えるため保守しやすいです。Phrase件数が少ない段階では十分に成立します。

### 注意点

PCで件数が増えると縦に長くなり、一覧性が落ちます。業務的に大量の定型文を扱うなら、DesktopではTableの方が向いています。

## 推奨案

このプロジェクトでは案Aを推奨します。

理由:

- Phrase本文はスマホではCardの方が読みやすい。
- PCではTableの一覧性と操作列の安定感が欲しい。
- Copy / Delete / Save / Cancel をアイコン化すると、TableでもCardでも共通コンポーネントで扱える。
- 将来、検索・並び替え・更新日時表示を足す場合、Desktop Tableの方が拡張しやすい。

## 実装順序

1. まず既存Tableの操作ボタンをPhase1のアイコンボタンへ置き換える。
2. `PhraseActions` をTableから切り出す。
3. `PhraseCardList` を追加する。
4. `hidden md:block` と `md:hidden` でDesktop/Mobileを切り替える。
5. データ更新処理は親コンポーネントに残し、Table/Cardは描画に寄せる。

## このPhaseでの推奨

最終的には案Aを採用します。ただし、最初の小さな改善として案Bの横スクロールTableだけを入れ、次の段階でMobile Cardへ移る進め方も現実的です。
