# Phase 1: Guest Notice Banner

## 目的

未ログインユーザーにだけ表示する通知UIを、shadcn/ui `Alert` で実装します。

本番コードは変更せず、ここでは導入用スニペットとして次の2段階に分けます。

1. `GuestNoticeBanner` を作る
2. 既存の `GuestPhraseList` に組み込む

## 追加するshadcn/ui

`Alert` が未追加の場合は、実装前に frontend 側で追加します。

```bash
cd frontend
npx shadcn@latest add alert
```

`Button` と `lucide-react` は既存UIと同じ使い方です。

## Step 1: 通知コンポーネント

参照スニペット:

- `guest-notice-banner-snippet.tsx`

通知の種類は2つです。

- `first-guest-phrase`: 未ログインで最初のフレーズ登録時
- `guest-limit-reached`: 保存件数が10件に到達した時

`GuestNoticeBanner` は `notices` 配列を受け取ります。閉じる状態はコンポーネント内の local state で通知ごとに管理します。

そのため、最初の注意を閉じていなければ、10件到達時には次の2つが同時に残ります。

- 未ログイン中はフレーズが保存されない注意
- ログインすると10件を超えて保存できる案内

## Step 2: 既存UIへ統合

参照スニペット:

- `guest-phrase-list-integration-snippet.tsx`

配置はページ上部です。既存の `GuestPhraseList` の先頭、`PhraseManager` より前に置きます。

表示条件:

- `phrases.length > 0` の時は `first-guest-phrase` を追加
- `phrases.length >= GUEST_LIMIT` の時は `guest-limit-reached` を追加
- どちらでもない時は空配列にする

10件到達時は条件が重なるため、閉じていない通知が複数表示されます。

## 本番反映時の配置案

```text
frontend/components/
  guest-notice-banner.tsx
  guest-phrase-list.tsx
```

`GuestNoticeBanner` は Client Component です。`useState` を使うため、ファイル先頭に `"use client"` を付けます。
