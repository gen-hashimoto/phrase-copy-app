## ステップ 6: 権限・環境・フォールバック（任意だが推奨）

コピーはフロントのみだが、**ブラウザと実行環境**の制約だけはある。

### チェックリスト

| 状況 | 挙動 | 対応の例 |
|------|------|----------|
| `http://localhost` / `https` | Clipboard API が使えることが多い | そのまま |
| 平文 `http://192.168.x.x` など | `navigator.clipboard` が無いことがある | 開発は localhost にする / 本番は HTTPS |
| ユーザーがクリップボード拒否 | `writeText` が reject | `catch` でバナー表示（既存の `setBanner`） |
| フレーズ 0 件で Copy All | 空文字をコピーしない | ボタン `disabled` またはメッセージ |
| 超長文 | まれに失敗 | 現 Phase では想定外でよい |

### レガシー fallback（必要になったら）

Clipboard API が使えないときだけ、一時的な `<textarea>` を作って `document.execCommand("copy")` する方法がある。  
**新規コードではまず Clipboard API** でよい。fallback は実機で問題が出てからで十分。

### 本番に足すとよい UX（最小）

```tsx
try {
  await copyTextToClipboard(text)
  showCopied(id)
} catch (err) {
  setBanner(`コピーに失敗しました: ${…}`)
}
```

CRUD のエラー表示と同じ `banner` に揃えると画面が統一される。

### ここまでで設計書のコピー要件

- [x] クリックでクリップボードにコピー
- [x] Copied!（約 1 秒）
- [x] 行ハイライト
- [x] Copy All（改行区切り）

残り（別トピック）: ダブルクリック編集、Easy Import、未ログイン時の useState など。
