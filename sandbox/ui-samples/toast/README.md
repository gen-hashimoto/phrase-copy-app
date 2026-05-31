# Phase5: Toast

## 目的

Phrase操作や認証操作の完了・制限を、画面遷移を邪魔しない形で通知する設計サンプルです。

## サンプル

- `sonner-toast-sample.tsx`
- `shadcn-toast-sample.tsx`

## 候補比較

| 候補 | 良い点 | 注意点 | このプロジェクトでの評価 |
| --- | --- | --- | --- |
| 旧 shadcn/ui toast (`toast` + `use-toast`) | 昔の公式例として資料が多い | 現在のshadcn公式はsonner推奨。Provider/フックの構成がやや重い | 新規導入は非推奨 |
| shadcn sonner (`npx shadcn add sonner`) | `sonner` 本体 + `@/components/ui/sonner` が入る。`next-themes` と色トークンが揃う | CLI実行が必要 | **推奨** |

## 推奨

このプロジェクトでは **shadcn CLI 経由の sonner** を推奨します。

```bash
cd frontend
npx shadcn@latest add sonner
```

`npm install sonner` だけでも動きますが、shadcn 経由だと次が揃います。

- `sonner` パッケージの追加
- `components/ui/sonner.tsx`（テーマ連動した `Toaster` ラッパー）
- 既存の `globals.css` / CSS変数との見た目の整合

理由:

- `toast.success("Phrase created")` のように操作結果を短く書ける。
- `layout` には `@/components/ui/sonner` の `Toaster` を1つ置くだけでよい。
- Phase2のダークモードと組み合わせやすい（ラッパー内で `useTheme()` を使う構成が一般的）。
- 他の shadcn コンポーネントと同じ導入フロー（`tooltip`, `alert-dialog` など）に揃えられる。

## 追加手順

1. shadcn で sonner を追加する。

```bash
cd frontend
npx shadcn@latest add sonner
```

2. `frontend/app/layout.tsx` など、全体で一度だけ `Toaster` を配置する。

```tsx
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
```

3. 通知を出す側は `toast` を `sonner` から import する（shadcn 公式と同じ）。

```tsx
import { toast } from "sonner"

toast.success("Phrase created")
```

`Toaster` は `@/components/ui/sonner`、`toast()` は `sonner` という分担が一般的です。

## 対象ケース

Toastを出すケース:

- Phrase作成成功: `toast.success("Phrase created")`
- Phrase更新成功: `toast.success("Phrase updated")`
- Phrase削除成功: `toast.success("Phrase deleted")`
- Login成功: `toast.success("Logged in")`
- Logout成功: `toast.success("Logged out")`
- 未ログイン制限: `toast.warning("Login is required")`

## Copy成功はアイコン変化のみとする理由

Copyは高頻度で繰り返す操作です。毎回Toastを出すと、画面右下に通知が積まれて邪魔になりやすく、ユーザーの作業テンポを落とします。

Copy成功は次のような軽いフィードバックが向いています。

- Copyアイコンを短時間だけCheckアイコンに変える。
- `aria-live` で必要最小限の成功メッセージを読み上げる。
- ボタンのTooltipを一時的に `Copied` に変える。

## Toastを出すべきケース

Toastは「操作結果が画面上で明確に見えないが、ユーザーに伝える価値がある」場面で使います。

- 作成、更新、削除の成功
- Login / Logout の成功
- 未ログインのため保存できない
- 通信エラー
- 保存済みかどうか分かりにくい非同期操作

## 出さない方が良いケース

次のケースではToastを出しすぎない方がよいです。

- Copyのように頻繁に押す操作
- ボタン状態や画面変化だけで結果が明らかな操作
- 入力中の軽微なバリデーション
- AlertDialog内で既に十分に説明している確認文
- ユーザーが連続操作する可能性が高い場面

## このPhaseでの推奨

Phrasesでは shadcn 経由の `sonner` を採用し、CRUDと認証の成功・警告に限定してToastを使います。Copy成功はToastではなく、Phase1のアイコン変化で伝える方針にします。
