## ステップ 5: Copy All（全フレーズを改行区切り）

設計書:

- **Copy All** で全フレーズを改行区切りでコピー
- メモアプリなどへの簡易バックアップ想定
- Easy Import は **同じ形式**（改行区切り）で戻せる前提

### やること

1. `lib/join-phrases-for-copy-all.ts` を `frontend/lib/` にコピー。
2. 一覧の上（ヘッダやテーブル直前）に **Copy All** ボタン。
3. 成功時: `showCopied("all")` + ボタン横に `Copied!`（ステップ 3 と同じフック）。
4. **0 件**のときはボタン無効またはメッセージ（サンプル参照）。

### コピー先（例）

```text
frontend/lib/join-phrases-for-copy-all.ts
frontend/components/copy-all-button.tsx
frontend/components/phrase-manager.tsx  … または app/page.tsx の header
```

### 改行コード — 知っておくとよいこと

| 記号 | 名前 | よくある環境 |
|------|------|----------------|
| `\n` | LF | Unix / macOS / Linux、多くの Web API |
| `\r\n` | CRLF | Windows の一部エディタ |

**実装の推奨**

```ts
phrases.map(getPhraseCopyText).join("\n")
```

- JavaScript では **`"\n"` 1 種類で結合**して問題ないことがほとんどです。
- `navigator.clipboard.writeText` に渡したあと、貼り付け先（Notepad、VS Code、Slack 等）が好みの改行に合わせることが多いです。
- **無理に `\r\n` にしなくてよい**ケースが多いです。Windows 専用メモで行がつながる等の不具合が出たときだけ `\r\n` を検討。

**もっと重要なのは「区切り」ではなく「1 行 = 1 フレーズ」**

設計書（`02_screen-design.md`）:

> 登録できるフレーズに改行は想定していない。改行を許容すると、改行区切りでインポートする、という仕様の前提が崩れてしまう。

つまり:

- Copy All は **フレーズとフレーズの間**にだけ `\n` を入れる。
- **各 `content` の中に `\n` が入っていると**、貼り付け → Easy Import で **行が増えてしまう**。
- DB / フォーム側で「内容に改行不可」を入れるのが、Copy All より先の防御線になる（将来のインポート実装とセット）。

**表示順**

- Copy All の並びは **画面の一覧順**（`phrases` 配列の順）に合わせる。
- ログイン後に並び替え API ができたら、その順序と一致させる。

### 動作確認

1. フレーズが 3 件ある状態で Copy All。
2. テキストエディタに貼り付け → **3 行**になること。
3. 各行が各フレーズの `content` と一致すること。
4. メモアプリに貼って保存 → 再度アプリの Easy Import（将来）で戻せる形か、目視で確認。

### 次のステップ

`step-06-permissions-and-fallback` で失敗時・非 HTTPS の話を整理。
