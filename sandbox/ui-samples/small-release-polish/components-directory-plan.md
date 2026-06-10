# Components Directory Plan

## 結論

リリース前に `components/` 全体を大きく移動する必要はありません。

理由:

- import 修正が多くなり、UI polish 以上の差分になる
- 動いている Phrase 一覧まわりに影響しやすい
- 今は挙動修正とリリース前確認を優先したい

## やるなら段階的に分ける

まずは Phrase 関連だけをまとめるのが安全です。

```text
frontend/components/
  auth/
    confirm-account-creation-alert-dialog.tsx
    login-form.tsx
  layout/
    app-footer.tsx
    app-header.tsx
    app-header-client-actions.tsx
    app-shell-server.tsx
  phrase/
    phrase-manager.tsx
    phrase-action-bar.tsx
    guest-notice-banner.tsx
    guest-phrase-list.tsx
    user-phrase-list.tsx
    actions/
      delete-phrase-alert-dialog.tsx
      icon-action-button.tsx
      phrase-edit-actions.tsx
      phrase-row-actions.tsx
    list/
      phrase-card.tsx
      phrase-list.tsx
      phrase-content-cell.tsx
      phrase-edit-cell.tsx
  ui/
```

## 移動順

1. `components/phrase-actions/` と `components/phrase-list/` は既に分かれているので維持する。
2. `phrase-manager.tsx`, `phrase-action-bar.tsx`, `guest-notice-banner.tsx` を `components/phrase/` へ寄せる。
3. `login-form.tsx` と `confirm-account-creation-alert-dialog.tsx` を `components/auth/` へ寄せる。
4. `app-shell-server.tsx` など共通レイアウトを `components/layout/` へ寄せる。

## 今回の Phase での推奨

この Phase では、ディレクトリ移動はしない方がよいです。

代わりに、次のどちらかに留めます。

- README に分割方針だけ残す
- 新規コンポーネントを作る時だけ、将来の配置案に合わせる

リリース前は「小さい挙動修正」と「ファイル移動」を混ぜない方が確認しやすいです。
