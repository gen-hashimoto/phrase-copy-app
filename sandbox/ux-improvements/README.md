# UX improvements - ステップ別教材（手で取り込む用）

MVP を実際に触って見つかった UX 上の違和感を、いきなり本番実装せずに小さな単位で確認するための sandbox です。

| ステップ | フォルダ | 内容 |
| ---------- | ----------- | ------ |
| 1 | `step-01-ime-enter` | IME 変換中の Enter で保存処理が走る問題を防ぐ |
| 2 | `step-02-unsaved-warning` | 未ログイン時のローカルデータ消失を `beforeunload` で警告する |
| 3 | `step-03-usage-duplicate` | 未ログイン時の `0 / 10 used` 重複表示を調査する |
| 4 | `step-04-updated-at` | `phrases.updated_at` を追加し、更新日時を扱えるようにする |

## 前提

- 本番コードはこの教材では直接変更しない。
- auth / UUID 教材を取り込んだ後の状態を想定する。特に `phrases.id` は UUID 文字列、未ログイン時は `GuestPhraseList` でローカル state を持つ前提。
- 差分コードは「そのまま貼る完成版」ではなく、手で取り込むときの最小例として読む。
- UI の細部よりも「なぜその修正が必要か」と「どこを確認すればよいか」を優先する。

## 推奨の進め方

1. `step-01-ime-enter` で Enter キー保存処理のイベント条件を狭める。
2. `step-02-unsaved-warning` でゲスト状態の未保存データを守る。
3. `step-03-usage-duplicate` で重複表示の原因を自分で特定してから修正方針を決める。
4. `step-04-updated-at` で DB、model、schema、API response の影響を確認する。

## 参照しやすい本番側ファイル

```text
frontend/components/phrase-manager.tsx
frontend/components/guest-phrase-list.tsx
frontend/components/add-phrase-control.tsx
frontend/types/phrase.ts
backend/app/models/phrase.py
backend/app/schemas/phrase.py
backend/app/repositories/phrase_repository.py
backend/app/services/phrase_service.py
backend/app/api/routes/phrases.py
```

## 学習上のゴール

- 「入力中」「未保存」「表示責務」「DB の監査カラム」のような UX と設計の境界を意識できるようにする。
- React / Next.js のイベント処理とブラウザ制約を、コード断片だけでなく理由から理解する。
- DB 変更時に backend、schema、frontend 型まで影響範囲を追えるようにする。
