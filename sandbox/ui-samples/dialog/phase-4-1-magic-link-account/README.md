# Phase4-1: Magic Link Account Creation AlertDialog

## 目的

初めてマジックリンクを作るメールアドレスでは、現状の実装だと **マジックリンク要求時にアカウントが作成されます**。この副作用をユーザーに明示し、同意後にだけアカウントを作るための仕様と実装案です。

Phrase削除と同じく「取り消しにくい意味のある操作」なので、Phase4の派生として `AlertDialog` を使います。

## 現状確認

現状は、バックエンドの `POST /auth/magic-link` 内でユーザーを検索し、存在しなければその場で `User(email=email)` を作成しています。

```py
user = db.scalar(select(User).where(User.email == email))
if user is None:
    user = User(email=email)
    db.add(user)
```

その後、同じリクエスト内でマジックリンクトークンを保存し、`db.commit()` しています。

つまり現状の作成タイミングは次です。

| 操作 | アカウント作成 |
| --- | --- |
| Loginフォームでメール入力 | まだ作られない |
| `Send Magic Link` 押下 | 未登録メールなら作られる |
| メール内リンクを開く | 既に作成済み。ここではログインCookieを発行する |

## 課題

ユーザーから見ると、`Send Magic Link` は「ログイン用メールを送る」操作に見えます。しかし未登録メールの場合は、実際にはアカウント作成も同時に起きています。

そのため、アカウントを作りたくないユーザーにとっては意図しない登録になり得ます。

## 推奨仕様

未登録メールアドレスでマジックリンクを要求した場合は、すぐにアカウントを作らず、確認を要求します。

### フロー

1. ユーザーがメールアドレスを入力する。
2. `POST /auth/magic-link` を `confirm_account_creation: false` で呼ぶ。
3. 既存ユーザーなら、そのままマジックリンクを送る。
4. 未登録ユーザーなら、アカウントを作らず `409 ACCOUNT_CREATION_CONFIRMATION_REQUIRED` を返す。
5. フロントエンドは `AlertDialog` を開く。
6. ユーザーが `Create account and send link` を押す。
7. `confirm_account_creation: true` で再送信する。
8. バックエンドがアカウントを作成し、マジックリンクを送る。

## なぜ `check-email` API にしないか

`GET /auth/check-email?email=...` のようなAPIを追加しても実装できますが、このプロジェクトではまず `POST /auth/magic-link` に確認フラグを持たせる方針を推奨します。

理由:

- 確認前にユーザーを作らない制約を、バックエンドの本処理で保証できる。
- 事前確認APIと本処理APIの間で状態が変わる問題を避けやすい。
- 「未登録なら確認が必要」という仕様がマジックリンク作成APIに閉じる。
- フロントエンドがメール存在確認APIを直接持たずに済む。

注意点として、この方式でも `409` の有無によりメールアドレスの登録有無は推測可能です。ログイン画面の性質上ある程度避けにくいですが、エラーメッセージは過度に詳細にせず、レート制限を入れる方針が必要です。

## AlertDialog文言

Title:

```text
Create an account?
```

Description:

```text
This email address is not registered yet.
If you continue, an account will be created and a magic link will be sent to this address.
```

Buttons:

```text
Cancel
Create account and send link
```

日本語UIにする場合:

```text
アカウントを作成しますか？

このメールアドレスはまだ登録されていません。
続行すると、このメールアドレスでアカウントを作成し、マジックリンクを送信します。

Cancel
アカウントを作成してリンクを送信
```

## 常時表示する補足文

Dialogだけだと、送信ボタンを押すまでユーザーが気づけません。フォーム下にも短い補足文を置くのが良いです。

```text
初めて利用するメールアドレスの場合、確認後にアカウントが作成されます。
```

## スニペット

`snippets/` 配下に、本番反映時の参考コードを分けて置きます。

- `login-form-account-confirmation-snippet.tsx`
- `auth-route-account-confirmation-snippet.py`
- `next-auth-magic-link-route-snippet.ts`

## 実装手順

1. shadcn/ui の `alert-dialog` を追加する。
2. バックエンドの `MagicLinkRequest` に `confirm_account_creation: bool = False` を追加する。
3. `user is None` かつ `confirm_account_creation` が `False` の場合は、ユーザーを作らず `409` を返す。
4. フロントエンドのログインフォームで `409` を受けたら `AlertDialog` を開く。
5. DialogのConfirmで `confirm_account_creation: true` を付けて再送信する。
6. 既存ユーザーの場合はDialogを出さず、これまで通りマジックリンク送信完了を表示する。

## 本プロジェクトでの推奨方針

- 未登録メールの初回マジックリンク要求では、アカウント作成確認を必須にする。
- 確認前に `users` レコードを作らない。
- AlertDialogは初回だけ出し、既存ユーザーの通常ログインでは出さない。
- 補足文はフォーム上に常時表示する。
- 将来の本番運用では、マジックリンク要求APIにレート制限を入れる。

## 導入後の期待動作

| 状態 | ユーザー操作 | 結果 |
| --- | --- | --- |
| 既存メール | Send Magic Link | Dialogなしでリンク送信 |
| 未登録メール | Send Magic Link | AlertDialog表示。まだアカウントは作らない |
| 未登録メール | Cancel | 何も作らない |
| 未登録メール | Create account and send link | アカウント作成 + リンク送信 |
