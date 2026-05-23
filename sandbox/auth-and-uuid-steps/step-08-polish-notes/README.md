## ステップ 8: 仕上げメモ

auth / UUID を本番コードへ取り込む前に、設定・移行・セキュリティ・テスト観点を整理する。

### env

| 変数 | 用途 | local 例 |
| ------ | ------ | ---------- |
| `API_BASE_URL` | frontend proxy から backend へ接続 | `http://localhost:8000` |
| `FRONTEND_BASE_URL` | Magic Link URL の組み立て | `http://localhost:3000` |
| `JWT_SECRET` | JWT 署名 secret | 長いランダム文字列 |
| `AUTH_COOKIE_NAME` | cookie 名 | `phrase_copy_session` |
| `AUTH_COOKIE_SECURE` | HTTPS cookie | local は `false`、本番は `true` |
| `AUTH_DEV_RETURN_MAGIC_LINK` | dev_link を返すか | local のみ `true` |

### JWT secret

- repository に commit しない。
- 32 bytes 以上のランダム値にする。
- 漏洩したら全 session を無効化する前提で rotate する。

### token expiry

- Magic Link は短くする。例: 15 分。
- JWT は学習用なら 1 日程度でよい。
- refresh token は今回扱わない。

### SameSite / httpOnly

- `httpOnly=true`: XSS で token を直接読ませない。
- `SameSite=Lax`: 通常のメールリンク遷移で扱いやすい。
- `Secure=true`: 本番 HTTPS では必須。
- frontend と backend のドメインを分ける場合は cookie domain / reverse proxy 方針を先に決める。

### migration rollback

- UUID 化、`users` 追加、`phrases.user_id` 追加はそれぞれ rollback SQL を用意する。
- 開発 DB では drop / recreate でもよいが、本番データでは backup table を作る。
- `phrases.id` を integer に戻す rollback は難しいので、本番投入前に staging で必ず検証する。

### 既存データ移行

1. 既存 phrase をどの user に紐づけるか決める。
2. 開発では `test@example.com` の seed user に寄せてよい。
3. `position` は既存の `id` または `created_at` 順で採番する。
4. UUID 化後は old id を参照できないので、必要なら mapping table を一時保存する。

### テスト観点

- Magic Link request: email validation、user upsert、token hash 保存。
- Magic Link verify: 成功、期限切れ、不正 token、one-time use。
- Cookie: set-cookie、logout delete-cookie、未ログイン `401`。
- Phrase API: user scope、他 user の phrase を操作できないこと。
- Frontend: dev link callback、verify 失敗表示、logout 後の表示切り替え。
- UUID: create / update / delete / copy / draft row が string id で動くこと。

### 今回広げないこと

- OAuth / Google Login。
- 本番メール送信サービス連携。
- refresh token。
- パスワードログイン。
- 複雑な Alembic 導入。
- UUID の `BINARY(16)` 最適化。
- Easy Import / reorder UI。
- CSRF の詳細実装。
