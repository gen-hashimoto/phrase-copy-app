# Phase2: ダークモード

## 目的

`next-themes` と shadcn/ui のCSS変数構成を使い、Light / Dark / System を切り替えられる設計サンプルです。

## サンプル

- `theme-provider-snippet.tsx`
- `theme-toggle-snippet.tsx`
- `header-theme-snippet.tsx`

## 追加する shadcn/ui

`Button` は既存です。Theme選択をメニューにする場合は `dropdown-menu` を追加します。

```bash
cd frontend
npx shadcn@latest add dropdown-menu
```

`next-themes` は既に `frontend/package.json` にあります。未導入環境なら次を追加します。

```bash
npm install next-themes
```

## ThemeProvider設定例

`frontend/app/layout.tsx` の `body` 内でProviderを包む想定です。

```tsx
<html lang="ja" suppressHydrationWarning>
  <body>
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </body>
</html>
```

サンプルでは次の設定にしています。

```tsx
<NextThemesProvider
  attribute="class"
  defaultTheme="system"
  disableTransitionOnChange
  enableSystem
  storageKey="phrases-theme"
>
  {children}
</NextThemesProvider>
```

## ThemeToggle

`ThemeToggle` は Client Component です。`useTheme()` を使うため、ファイル先頭に `"use client"` が必要です。

切り替え候補:

- Light
- Dark
- System

## next-themes採用理由

- Next.js App Router で実績があり、Server Component中心の構成に組み込みやすいです。
- `class` 属性による dark mode 切り替えができ、shadcn/ui の推奨構成と合います。
- `system` を扱えるため、OS設定に追従できます。
- 選択状態を localStorage に保存してくれるため、自前で保存処理を書く必要がありません。
- hydration mismatch を避けるための実装パターンが確立しています。

## shadcn推奨構成との関係

このプロジェクトの `globals.css` は `.dark` クラスとCSS変数で色を切り替える構成です。`next-themes` で `attribute="class"` を指定すると、html要素に `class="dark"` が付き、shadcn/ui の色トークンが自動でDark用に切り替わります。

つまり、各コンポーネントでは `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground` のようなトークンを使い、直接 `bg-white dark:bg-black` のような指定を増やさないのが基本です。

## localStorage保存の仕組み

`setTheme("dark")` を呼ぶと、`next-themes` が localStorage に選択値を保存します。サンプルでは `storageKey="phrases-theme"` を指定しているため、保存キーは `phrases-theme` です。

保存される値の例:

```text
phrases-theme = light
phrases-theme = dark
phrases-theme = system
```

次回アクセス時はこの値を読み、`light` / `dark` / `system` の状態を復元します。`system` の場合はOSの `prefers-color-scheme` を見て実際の表示を決めます。

## Headerへの組み込み方

Header自体はServer Componentでも構いませんが、`ThemeToggle` はClient Componentとして分離します。

```tsx
<header>
  <AppName />
  <div>
    <ThemeToggle />
    <LoginOrLogout />
  </div>
</header>
```

この分け方にすると、認証情報の取得はServer Component側に残し、テーマ切り替えのようなブラウザ状態だけをClient Componentに閉じ込められます。

## このPhaseでの推奨

Phrasesでは `defaultTheme="system"` を初期値にし、Header右側に `ThemeToggle` を置くのがよいです。ユーザー設定画面がない小規模アプリなので、Theme切り替えはドロップダウン1つで十分です。
