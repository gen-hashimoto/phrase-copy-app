# Phase 5: Browser Title and Favicon

## 目的

Next.js App Router の `metadata` を使って、ブラウザタブのタイトルと favicon を設定する方法を学びます。

この教材では本番コードを変更しません。実装前に仕組みと反映手順を理解するための sandbox です。

作成するもの:

- `README.md`: Metadata と favicon の説明
- `sample-layout.tsx`: `app/layout.tsx` に置くイメージ
- `sample-metadata.ts`: Metadata 定義を分離する場合のイメージ
- `sample-icon.svg`: favicon デザイン案

---

## Step1: App Router の Metadata

### layout.tsx の役割

Next.js App Router では、`app/layout.tsx` がアプリ全体の共通レイアウトを担当します。

主な役割:

- 全ページ共通の HTML 構造を定義する
- `<html>` や `<body>` を返す
- Provider、Toaster、共通 CSS などを読み込む
- ページ全体に適用する `metadata` を export できる

`app/layout.tsx` は各ページの外側に必ず適用されるため、アプリ名や共通 description の設定場所として自然です。

### metadata export とは何か

App Router では、`Metadata` 型のオブジェクトを `export const metadata` として定義できます。

```tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Phrases",
  description: "A simple phrase copy app.",
}
```

Next.js はこの `metadata` を読み取り、HTML の `<head>` に必要なタグを生成します。

自分で `<head>` を直接書くより、Next.js の仕組みに任せる方が App Router らしい書き方です。

### title 設定方法

もっとも基本的な title は文字列で指定します。

```tsx
export const metadata = {
  title: "Phrases",
}
```

ブラウザタブには `Phrases` と表示されます。

ページごとにタイトルを変えたい場合は、`title.template` と `title.default` を使う方法もあります。

```tsx
export const metadata = {
  title: {
    default: "Phrases",
    template: "%s | Phrases",
  },
}
```

この設定にしておくと、子ページで `title: "Login"` を設定した時に `Login | Phrases` のように表示できます。

### description 設定方法

`description` はページの説明文です。

```tsx
export const metadata = {
  description: "Save and copy frequently used phrases quickly.",
}
```

`description` はブラウザタブには直接表示されませんが、検索エンジンや SNS プレビューの情報として使われます。

---

## Step2: favicon の仕組み

### favicon とは何か

favicon は、ブラウザタブやブックマークに表示される小さなアイコンです。

Phrases のような小さなアプリでも favicon があると、タブを複数開いた時に見分けやすくなります。

### ブラウザはどこを探すのか

昔ながらの仕組みでは、ブラウザはサイトのルートにある `/favicon.ico` を探します。

例:

```text
https://example.com/favicon.ico
```

一方、HTML 側で次のような link タグがあれば、その指定を見ます。

```html
<link rel="icon" href="/icon.svg" />
```

Next.js App Router では、この link タグを手書きしなくても、特定の場所に favicon ファイルを置くことで自動管理できます。

### Next.js App Router での管理方法

App Router では、`app/` 配下に次のようなファイルを置けます。

```text
frontend/app/icon.svg
frontend/app/icon.png
frontend/app/favicon.ico
```

たとえば `frontend/app/icon.svg` を置くと、Next.js が favicon として扱います。

今回の学習では、シンプルに `frontend/app/icon.svg` へ反映する想定にします。

---

## Step3: サンプルコード

参照ファイル:

- `sample-layout.tsx`
- `sample-metadata.ts`

### なぜ metadata を使うのか

App Router では、ページのタイトルや description は `metadata` で宣言するのが標準的です。

メリット:

- `<head>` を直接管理しなくてよい
- layout や page ごとに metadata を分けられる
- Next.js が必要な meta tag を生成してくれる
- SEO や OGP などへ拡張しやすい

### SEO との関係

`title` と `description` は SEO の基本情報です。

- `title`: 検索結果やブラウザタブで使われる
- `description`: 検索結果の説明文として使われることがある

必ず検索順位が上がるものではありませんが、アプリの内容を正しく伝えるために設定しておく価値があります。

### ブラウザタブへの反映

`metadata.title` を設定すると、ブラウザタブの表示に反映されます。

```tsx
export const metadata = {
  title: "Phrases",
}
```

反映後、タブには `Phrases` と表示されます。

---

## Step4: favicon デザイン案

今回のサービス名は `Phrases` です。

favicon 案:

- 丸の中に `Ph`
- シンプルなモノクロ
- ダークモードでも視認しやすい
- 16x16 でも読めること

参照ファイル:

- `sample-icon.svg`

デザイン方針:

- 背景は黒に近い円
- 文字は白
- `Ph` を太めに配置
- 小さいサイズでも形がつぶれにくいように装飾を減らす

---

## Step5: 本番適用ガイド

この教材では実装しません。実際に反映する場合の手順だけ整理します。

### どのファイルへ反映するか

タイトルと description:

```text
frontend/app/layout.tsx
```

favicon:

```text
frontend/app/icon.svg
```

### どの順番で作業するか

1. `frontend/app/layout.tsx` に `Metadata` import を追加する。
2. `export const metadata` を追加する。
3. `title` と `description` を設定する。
4. `frontend/app/icon.svg` を追加する。
5. 開発サーバーを再起動、またはブラウザを hard refresh する。
6. ブラウザタブのタイトルと favicon を確認する。

### 確認ポイント

- ブラウザタブに `Phrases` と表示される
- タブのアイコンに `Ph` の favicon が表示される
- `view-source` や DevTools の `<head>` に title / meta description が出ている

favicon はブラウザにキャッシュされやすいため、反映されない場合は hard refresh や別ブラウザで確認します。
