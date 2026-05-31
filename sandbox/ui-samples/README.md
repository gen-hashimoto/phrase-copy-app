# UI Samples

PhrasesプロジェクトのUI改善を段階的に検討するためのsandboxです。本番コードは変更せず、各Phaseごとにサンプル画面、推奨コンポーネント構成、実装手順、設計理由を残します。

## 各Phaseの目的

| Phase | ディレクトリ | 目的 |
| --- | --- | --- |
| Phase1 | `icon-buttons` | Copy / Delete / Save / Cancel をアイコンボタンへ統一し、Tooltipとアクセシビリティを整理する |
| Phase2 | `dark-mode` | `next-themes` と shadcn/ui のCSS変数を使ってLight / Dark / Systemを切り替える |
| Phase3 | `responsive-layout` | Phrase一覧のDesktop/Mobile表示案を比較し、推奨レイアウトを決める |
| Phase4 | `dialog` | Phrase削除を `AlertDialog` で確認する方針にする |
| Phase5 | `toast` | 操作成功・認証状態の通知方針を決め、sonnerとshadcn/ui toastを比較する |
| Phase6 | `layout` | Header / Footer、ログイン前後表示、Server/Client責務を整理する |

## 実装順序

学習と導入の両方を考えると、次の順序が理解しやすいです。

1. Phase1: アイコンボタン + Tooltip
2. Phase4: Delete確認のAlertDialog
3. Phase5: Toast通知方針
4. Phase3: レスポンシブ一覧
5. Phase2: ダークモード
6. Phase6: Header / Footer 共通化

理由は、まず既存のPhrase一覧に近い操作UIから改善し、その後に通知・レイアウト・全体テーマへ広げる方が、変更範囲を小さく保てるためです。

## 推奨導入順

実際にPhrasesへ反映するなら、次の順序を推奨します。

1. `button`, `tooltip`, `alert-dialog` を揃え、操作ボタンをアイコン化する。
2. Deleteだけ `AlertDialog` を通す。
3. Copy成功はアイコン変化、作成/更新/削除/認証はToastに分ける。
4. Desktop Table / Mobile Card の案Aへ移行する。
5. `next-themes` の `ThemeProvider` と `ThemeToggle` を入れる。
6. Header / Footer を `AppShell` として共通化する。

## Phrasesプロジェクトへの反映方法

### 追加候補のshadcn/ui

```bash
cd frontend
npx shadcn@latest add tooltip
npx shadcn@latest add alert-dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add sonner
```

Toastは **shadcn の sonner** を使います（`npm install sonner` 単体より、CLI経由の方が `components/ui/sonner.tsx` とテーマ連動が揃います）。

### コンポーネント配置案

```text
frontend/components/
  app-shell.tsx
  app-header.tsx
  app-footer.tsx
  theme-provider.tsx
  theme-toggle.tsx
  phrase-actions/
    icon-action-button.tsx
    phrase-row-actions.tsx
    phrase-edit-actions.tsx
    delete-phrase-alert-dialog.tsx
  phrase-list/
    phrase-table.tsx
    phrase-card-list.tsx
```

### 反映時の考え方

- Server Componentは認証状態と初期データ取得を担当する。
- Client Componentはクリック操作、Dialog、Toast、Theme Toggle、Clipboard操作を担当する。
- shadcn/ui の色は `bg-background`, `text-foreground`, `bg-card` のようなトークンを使う。
- アイコンボタンは `size="icon"` と `aria-label` を必須にする。
- Deleteは必ず `AlertDialog` を通す。
- Copy成功はToastではなくアイコン変化で伝える。

## このプロジェクトなら実際にはどのUI案を採用するか

最終提案は次の構成です。

| 領域 | 採用案 |
| --- | --- |
| 操作ボタン | PC・スマホともアイコンのみ。Tooltip + `aria-label` を必須にする |
| Delete確認 | `AlertDialog` を採用する |
| Toast | shadcn の `sonner`（`npx shadcn add sonner`）を採用する |
| Copy成功 | Toastなし。Checkアイコンへの一時変化のみ |
| レスポンシブ | 案A: DesktopはTable、MobileはCard |
| ダークモード | `next-themes` の `class` 切り替え。初期値はSystem |
| Header/Footer | Server Componentの `AppShell` に集約し、Theme ToggleとLogoutだけClient Componentにする |

この構成がPhrasesに合う理由は、Phrase一覧がアプリの中心であり、PCでは一覧性、スマホでは読みやすさが重要だからです。操作は頻繁に行うためアイコンで省スペース化しつつ、Deleteのような危険操作だけは確認を挟みます。通知は必要な場面に絞り、Copyのような高頻度操作では画面を邪魔しない軽いフィードバックにします。

## 最終的な導入イメージ

まず一覧の操作UIをPhase1/4/5で整え、次にPhase3でMobile Cardを追加します。その後、Phase2とPhase6でアプリ全体のテーマと共通レイアウトを整えると、学習しながら安全に本番へ反映できます。
