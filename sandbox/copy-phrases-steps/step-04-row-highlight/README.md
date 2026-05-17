## ステップ 4: コピーした行のハイライト

設計書: コピーされたフレーズが **光るようにハイライト** → 約 1 秒で元に戻る。

### やること

ステップ 3 の `copiedId` / `isCopied` をそのまま使い、**内容のセル**（または行全体）にクラスを付ける。

### 例（Tailwind）

```tsx
<TableRow
  key={p.id}
  cj
  …
  <TableCell
    className={cn(
      "max-w-md text-xs whitespace-normal text-muted-foreground",
      isCopied(p.id) && "text-foreground"
    )}
  >
    {p.content}
  </TableCell>
</TableRow>
```

`cn` は既存の `@/lib/utils` を利用。

### ポイント

- ハイライトの ON/OFF は **コピー成功と同じタイマー**（`useCopiedFeedback`）に任せるとシンプル。
- 編集モードの行ではハイライト不要（コピーしていないため）。

### 次のステップ

`step-05-copy-all` で一覧上部に Copy All ボタン。