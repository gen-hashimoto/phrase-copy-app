## ステップ 6: 仕上げ（キーボード・バリデーション・アクセシビリティ）

設計書の共通仕様と Phase1 の細部を足す。**必須ではないが推奨**。

### やること

1. **Enter** で編集確定（OK）、**Esc** で Cancel。  
   サンプル: `components/edit-textarea-keyboard-snippet.tsx`。
2. **改行禁止**: フレーズ本文に `\n` / `\r` を含めない。  
   `lib/validate-phrase-content.ts` をコピーし、OK 前にチェック。エラーは `banner` や `aria-invalid` で表示。
3. **aria**: 編集 textarea に `aria-label`、+ ボタンに `aria-label="フレーズを追加"`（step-04 で既に付けていれば確認のみ）。
4. **スマホ**: step-02 のダブルタップ間隔（300ms）を実機で確認。ボタンは `size="sm"` 以上でタップしやすく。
5. **（任意）使用数表示**: `8 / 10 used` は未ログイン機能とセット。レイアウトだけ先に置くなら一覧下に `<p>` で `phrases.length / 10` を表示。

### コピー先

```text
frontend/lib/validate-phrase-content.ts
frontend/components/phrase-manager.tsx
```

### ポイント

- Enter は **Ctrl+Enter で改行したい**要件が無い限り、textarea では `e.preventDefault()` して save に回す。
- Copy All / Easy Import 前提のため、バリデーションは **保存時** と **貼り付け時（将来）** で共通化するとよい。
- コピー hooks / lib は変更しない。

### 動作確認

1. 編集中に Enter → 保存、Esc → キャンセル。
2. 内容に改行を入れて OK → エラー表示、保存されない。
3. スマホ実機または DevTools のモバイルでダブルタップ編集。

### 完了後

- 設計差分があれば `DESIGN-NOTES.md` を更新。
- 未ログイン `useState`・Easy Import・ログインは別トピック。

### 関連 sandbox

コピー機能の細部は引き続き [`copy-phrases-steps`](../../copy-phrases-steps/) を参照。
