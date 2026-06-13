# Authenticated Phrase Limit

## 目的

ログイン前は既存どおり `10件`、ログイン後の無料ユーザーは `50件` までフレーズを作成できるようにします。

これは見た目だけの polish ではなく、フロントエンドとバックエンドの両方に影響する機能制限です。本番コードはここでは変更せず、導入用スニペットとしてステップごとに分けます。

## 前提

- ゲストモードのフレーズはフロントエンドの状態で保持する
- ゲストモードの上限は `10件` のまま変えない
- ログイン後のフレーズはクラウドDBに保存する
- ログイン後の無料ユーザー上限は `50件` とする
- 未ログイン時のフレーズをログイン後へ移行する想定は置かない
- 上限はフロントのUI制御だけでなく、バックエンドAPIでも強制する

## Step 1: 上限定数を分ける

参照スニペット:

- `frontend/phrase-limits-snippet.ts`
- `backend/phrase_limits_snippet.py`

方針:

- `GUEST_PHRASE_LIMIT = 10`
- `FREE_USER_PHRASE_LIMIT = 50`
- フロントとバックエンドで同じ意味の定数を持つ
- 数値を画面やサービス内に直書きしない

ゲスト上限はフロントだけで完結します。ログイン後上限はフロント表示にも使いますが、最終的な強制はバックエンドで行います。

## Step 2: ログイン後の画面にも50件上限を渡す

参照スニペット:

- `frontend/user-phrase-list-limit-snippet.tsx`
- `frontend/user-limit-notice-snippet.tsx`

対象:

- `frontend/components/user-phrase-list.tsx`

現在の `UserPhraseList` は `PhraseManager` に `limit` を渡していません。ログイン後も件数表示と追加ボタン制御を使うため、`FREE_USER_PHRASE_LIMIT` を渡します。

ゲストモードの「ログインすると10件を超えて保存できます。」と同じように、ログイン後は50件到達時に「上限は50件です。」と表示します。

## Step 3: PhraseManager の上限判定をモード共通にする

参照スニペット:

- `frontend/phrase-manager-limit-snippet.tsx`

対象:

- `frontend/components/phrase-manager.tsx`

現在は `mode === "guest"` の時だけ `isAtLimit` を判定しています。ログイン後にも `limit` を渡すため、`limit` が指定されていればモードに関係なく上限判定します。

ただし、これはUI上の補助です。ブラウザ操作や直接API呼び出しを考えると、バックエンド側の上限チェックが必須です。

## Step 4: 件数表示をログイン後にも対応させる

参照スニペット:

- `frontend/phrase-action-bar-count-snippet.tsx`

対象:

- `frontend/components/phrase-action-bar.tsx`

現在はゲストモードだけ `8 / 10 used` のように表示し、ログイン後は `8 items` になります。ログイン後も `8 / 50 used` のように表示するなら、`limit` がある時は共通で上限付き表示にします。

表示文言をゲストとログイン後で変えたい場合は、ここで `mode` を見て分岐します。

## Step 5: バックエンドで現在件数を数える

参照スニペット:

- `backend/phrase_repository_count_snippet.py`

対象:

- `backend/app/repositories/phrase_repository.py`

ログイン後の上限はDBに保存されるフレーズ数で判定します。作成前に対象ユーザーの件数を数え、50件以上なら作成しないようにします。

## Step 6: 作成APIで50件上限を強制する

参照スニペット:

- `backend/phrase_service_limit_snippet.py`

対象:

- `backend/app/services/phrase_service.py`

`create_phrase` の入口で現在件数を確認し、無料ユーザーが50件に達している場合は `HTTPException` を返します。

推奨ステータス:

- `409 Conflict`: 現在のリソース状態では追加できない

レスポンス例:

```json
{
  "detail": "上限は50件です。"
}
```

将来プレミアムを入れる場合は、ここで `current_user.plan` のような値を見て `FREE_USER_PHRASE_LIMIT` を適用するか分岐します。

## Step 7: フロントでAPIエラーを分かりやすく表示する

参照スニペット:

- `frontend/phrase-manager-api-error-snippet.tsx`

対象:

- `frontend/components/phrase-manager.tsx`

バックエンドが `409` を返した場合、現在の実装でもエラー toast は出ます。ただし `detail` を取り出して「上限は50件です。」を表示すると、上限に達したことが伝わりやすくなります。

## 確認ポイント

- 未ログインで9件の状態では追加できる
- 未ログインで10件の状態では追加できない
- ログイン後に49件の状態では追加できる
- ログイン後に50件の状態では追加できない
- 直接 `POST /phrases` を呼んでも50件を超えて作成できない
- 50件到達時に「上限は50件です。」と表示される

## 実装順のおすすめ

1. バックエンドの件数カウントを追加する
2. バックエンドの `create_phrase` で50件上限を強制する
3. フロントの `UserPhraseList` にログイン後上限を渡す
4. `PhraseManager` の上限判定を `limit` 共通にする
5. 件数表示とエラーメッセージを整える
6. 49件 / 50件の境界を手動確認する

