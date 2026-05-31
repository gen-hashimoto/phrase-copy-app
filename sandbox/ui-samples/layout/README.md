# Phase6: Header / Footer

## 目的

Phrasesの共通レイアウトとして、Header / Footer の責務とログイン前後の表示差分を整理します。

## サンプル

- `app-shell-server-snippet.tsx`
- `app-header-client-actions-snippet.tsx`
- `login-state-samples.tsx`

## Header

表示するもの:

- App Name: `Phrases`
- Login
- Logout
- User Email
- Theme Toggle

ログイン前:

```text
Phrases
Guest mode
[Theme Toggle] [Login]
```

ログイン後:

```text
Phrases
user@example.com
[Theme Toggle] [Logout]
```

## Footer

表示するもの:

- Version
- Copyright

例:

```text
Version 0.0.1
Copyright © 2026 Phrases
```

## Server ComponentとClient Componentの責務

Server Componentに置くもの:

- Cookieを読む処理
- `/api/auth/me` で認証状態を取得する処理
- ログイン前後の大枠の出し分け
- 初期表示に必要なPhrase一覧取得

Client Componentに置くもの:

- Theme Toggle
- Logoutボタンのクリック処理
- Toast表示
- Dialog開閉
- CopyなどブラウザAPIを使う操作

この分け方にすると、認証情報や初期データはServer側で確定し、ブラウザ操作だけをClient側に閉じ込められます。

## 認証情報取得場所

現状のPhrasesでは、トップページのServer ComponentでCookieを読み、`/api/auth/me` を呼んでログイン状態を判定しています。この方針を維持し、Header用にも同じ場所で `user` を取得して渡すのが自然です。

推奨:

```tsx
const user = await fetchCurrentUser()

return (
  <AppShell user={user}>
    <PhraseList />
  </AppShell>
)
```

Headerの中でClient Componentが直接 `/api/auth/me` を呼ぶ構成は避けます。初期表示でログイン状態がちらつきやすく、Server Componentの利点も薄れます。

## HeaderへのTheme Toggle組み込み

`ThemeToggle` は `next-themes` の `useTheme()` を使うためClient Componentです。Header全体をClient Componentにする必要はありません。

```tsx
function AppHeader({ user }: { user: User | null }) {
  return (
    <header>
      <AppName user={user} />
      <HeaderClientActions isLoggedIn={Boolean(user)} />
    </header>
  )
}
```

`HeaderClientActions` の中で `ThemeToggle` と `Logout` を扱います。

## JWT導入時の拡張方針

JWTを導入する場合も、基本方針は変えません。

- JWTはHttpOnly Cookieに保存する。
- Server ComponentはCookieをAPIへ転送して認証状態を確認する。
- Client ComponentはJWTを直接読まない。
- LogoutはCookieを削除するAPIを呼ぶ。
- 将来的にRefresh Tokenを使う場合も、更新処理はAPI RouteまたはBackend側に寄せる。

ブラウザのlocalStorageにJWTを保存するとXSS時の影響が大きくなるため、このプロジェクトでは避ける方針を推奨します。

## このPhaseでの推奨

Phrasesでは `AppShell` をServer Componentとして作り、Header / Footer を共通化します。Header右側のTheme ToggleとLogoutだけをClient Componentに分ける構成が、現在のコードに最も自然に組み込めます。
