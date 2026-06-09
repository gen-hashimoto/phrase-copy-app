# Phase 2: Phrase Action Bar

## 目的

フレーズ一覧の上部操作エリアを `PhraseActionBar` としてまとめ、スクロール時も上部に固定します。

本番コードは変更せず、ここでは導入用スニペットとして次の2段階に分けます。

1. `PhraseActionBar` を作る
2. 既存の `PhraseManager` に組み込む

## 対象

- 全コピー
- 追加
- 件数表示

## Step 1: 操作バーコンポーネント

参照スニペット:

- `phrase-action-bar-snippet.tsx`

`PhraseActionBar` は Client Component です。親から操作関数と状態を受け取ります。

主な props:

- `phraseCount`: 現在の保存件数
- `limit`: ゲストモードの上限。ログイン時は未指定でよい
- `mode`: `guest` または `user`
- `canCopyAll`: 全コピー可能か
- `isCopyAllCopied`: 全コピー後の一時フィードバック
- `canAdd`: 追加可能か
- `onCopyAll`: 全コピー押下時
- `onAdd`: 追加押下時

## Step 2: 既存UIへ統合

参照スニペット:

- `phrase-manager-integration-snippet.tsx`

既存の `PhraseManager` では、全コピーがリスト上、追加と件数表示がリスト下に分かれています。

導入時は次のように整理します。

- `PhraseManager` の先頭に `PhraseActionBar` を配置
- 既存の全コピー `Button` を削除
- 下部の `AddPhraseControl` と件数表示を削除
- 追加可否は既存と同じく、編集中・下書き中・ゲスト上限到達時に無効化

## Sticky 設計

`PhraseActionBar` は次の指定で上部固定します。

- `sticky top-0`
- `z-20`
- `bg-background/95`
- `backdrop-blur`
- `supports-[backdrop-filter]:bg-background/75`

Header も sticky にする場合は、実装時に `top-0` を `top-14` などに調整します。

## モバイル対応

モバイルでも操作は横並びを維持します。

- 左側: 全コピー
- 中央: 追加
- 右側: 件数表示

幅が狭い場合でも崩れにくいように、件数表示は `ml-auto` で右寄せし、長い説明文は置かず短い表示にします。
