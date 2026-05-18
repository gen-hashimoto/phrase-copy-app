# ステップ 2 本番実装ガイド

`phrase-copy-app` の **現状（途中までの作業）** を前提に、残りの配線だけを自分で仕上げる手順です。

## いま本番でできていること / 足りないこと

| ファイル | 状態 | メモ |
|----------|------|------|
| `frontend/lib/double-tap.ts` | 済 | sandbox からコピー済みで OK |
| `frontend/hooks/use-double-tap-edit.ts` | 済（任意） | 使わなくても `createDoubleTapHandler` をセル内で直接呼べる |
| `frontend/components/phrase-content-cell.tsx` | 要修正 | 中身が `<td>` のまま。本番は外側が `TableCell` なので **`<td>` は使わない** |
| `frontend/components/phrase-display-row.tsx` | 要修正 | props が壊れている（下記「よくあるつまずき」） |
| `frontend/components/phrase-manager.tsx` | 要修正 | 「編集」ボタンが残っている。**編集モード行の JSX が map から消えている** |

step-01 で `PhraseTableShell` / `PhraseDisplayRow` に分けたのは正しい方向です。step-02 は **「編集ボタン削除 + 内容セルにダブルクリック/タップ + 編集行 UI を map に戻す」** です。

---

## 全体のデータの流れ

```text
phrase-manager.tsx
  editingId, startEdit, cancelEdit, handleSaveEdit  … 既にある state / 関数をそのまま使う
       │
       ├─ editingId === p.id  →  編集用 TableRow（textarea + 保存/キャンセル）
       │
       └─ それ以外            →  PhraseDisplayRow
                                    └─ PhraseContentCell
                                          onDoubleClick / onTouchEnd → startEdit(p)
```

**編集の開始**は `startEdit(p)` だけ。トリガーを「編集ボタン」から「内容セル」に移すのが step-02 の本質です。

---

## 手順 1: `phrase-content-cell.tsx` を Table 構造に合わせる

sandbox の snippet は **素の `<table>` 用に `<td>`** になっています。本番は shadcn の `Table` なので、**セルは親の `TableCell` が担当**し、このコンポーネントは **中身だけ**返します。

### 変更方針

- ルート要素: `<td>` → `<div>`（または `<>...</>`）
- `className` の見た目（`cursor-text`, `whitespace-normal` など）はそのまま div に付ける
- `onDoubleClick`, `onTouchEnd`, `role`, `tabIndex`, `aria-label`, `onKeyDown` は div に付ける
- `isEditing === true` のとき `return null` はそのまま（編集行では別セルに textarea を出すため）

### 触らないもの

- `createDoubleTapHandler(() => onStartEdit(phrase))` のロジック
- `if (isEditing) return null`

---

## 手順 2: `phrase-display-row.tsx` の props を直す

現状（誤りの例）:

```tsx
<PhraseContentCell phrase={phrase} isEditing isCopied onStartEdit />
```

- `isEditing` だけ書くと JSX では **`isEditing={true}` 固定** → 常に `null` が返り、内容が一切表示されない
- `onStartEdit` に **関数が渡っていない** → 型エラー / 実行時エラー

### 正しい形

`phrase-display-row` の props に次を足す:

```ts
type RowProps = {
  phrase: PhraseRead
  isCopied: boolean
  isEditing: boolean
  onStartEdit: (phrase: PhraseRead) => void
  children: ReactNode
}
```

中身:

```tsx
<TableCell className="p-0 align-top">
  <PhraseContentCell
    phrase={phrase}
    isEditing={isEditing}
    isCopied={isCopied}
    onStartEdit={onStartEdit}
  />
</TableCell>
```

外側の `TableCell` に付けていた `text-muted-foreground` などは、**PhraseContentCell 側の div に任せる**か、どちらか一方にまとめる（二重指定しない）。

`children` は操作列（Copy / 削除）用のまま。

---

## 手順 3: `phrase-manager.tsx` の map を「表示 / 編集」で分岐

step-01 後の列は **内容 + 操作 = 2 列** です。コミット済みの 5 列版から編集分支を持ってくるときは **列数を 2 列用に縮める**こと。

### パターン A（おすすめ）: 編集時は別 `TableRow`

```tsx
{phrases.map((p) =>
  editingId === p.id ? (
    <TableRow key={p.id}>
      <TableCell colSpan={1} className="align-top">
        {/* title は step-05 まで残してもよい。UI から隠すなら textarea は content のみ */}
        <textarea
          className={cn(fieldClass, "min-h-20 resize-y")}
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          aria-label="編集: 内容"
        />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex flex-wrap justify-end gap-2">
          <Button onClick={() => void handleSaveEdit()}>保存（PUT）</Button>
          <Button variant="outline" onClick={cancelEdit}>キャンセル</Button>
        </div>
      </TableCell>
    </TableRow>
  ) : (
    <PhraseDisplayRow
      key={p.id}
      phrase={p}
      isCopied={isCopied(p.id)}
      isEditing={false}
      onStartEdit={startEdit}
    >
      {/* Copy / 削除のみ。「編集」Button は削除 */}
    </PhraseDisplayRow>
  )
)}
```

ポイント:

- **編集行では `PhraseContentCell` を出さない**（`isEditing` で null にする設計と一致）
- 表示行では `isEditing={false}` を必ず渡す
- `onStartEdit={startEdit}` — `useCallback` は必須ではないが、将来 hook で memo するなら `useCallback` 化してもよい

### パターン B: 1 行の中でセルだけ差し替え

`PhraseDisplayRow` に `editingId === p.id` のとき textarea を内包させる方法もあるが、step-03（OK/Cancel）と step-05（title 削除）で操作列の分岐が増えるため、**編集は phrase-manager 側の別分支**の方が後が楽です。

---

## 手順 4: 「編集」ボタンを削除

`phrase-manager.tsx` の操作列から、次のブロックを **丸ごと削除**:

```tsx
<Button ... onClick={() => startEdit(p)}>編集</Button>
```

`startEdit` 関数自体は **残す**（内容セルから呼ぶため）。

---

## 手順 5: 動作確認チェックリスト

1. **デスクトップ**: 内容テキストをダブルクリック → 編集 textarea と保存/キャンセルが出る
2. **モバイル（または DevTools のタッチエミュレーション）**: 内容を 300ms 以内に 2 回タップ → 同じく編集開始
3. 操作列に **「編集」ボタンがない**
4. Copy / 削除は表示モードで従来どおり
5. 編集中の行で内容セルをダブルクリックしても変な動きをしない（編集 UI は別セルなので競合しにくい）
6. `npm run build`（または `tsc`）で型エラーがない

---

## よくあるつまずき（本番で実際に起きているもの）

### 1. `isEditing` を props なしで書いた

```tsx
<PhraseContentCell isEditing ... />  // 常に true 扱い → 常に null
```

必ず `isEditing={editingId === p.id}` または表示行では `isEditing={false}`。

### 2. `<td>` の入れ子

`TableCell`（中で `<td>`）のさらに内側に `PhraseContentCell` の `<td>` があると HTML が壊れます。**内側は div**。

### 3. 編集モード行を map から消した

`PhraseDisplayRow` に置き換えたとき、以前の `editingId === p.id ? ... : ...` を削除すると、**ダブルクリックしても UI が変わらない**（state は変わるが画面が出ない）。手順 3 の分支を必ず戻す。

### 4. コピーボタンに `onDoubleClick` を付けた

ダブルクリックの 1 回目が Copy の `click` として解釈されることがある。**編集トリガーは内容セルだけ**に置く（sandbox README のポイントどおり）。

### 5. `use-double-tap-edit` を使うか

- **使わない**: `PhraseContentCell` 内で `createDoubleTapHandler`（snippet どおり）で十分
- **使う**: 行ごとに hook を呼ぶと行数分の handler になる。`phrase-manager` で `useCallback` した `startEdit` を渡す

どちらでもよい。いまの本番はセル内直接呼び出しで問題ない。

---

## step-03 との境界

step-02 が終わった時点では、編集行のボタンは **「保存（PUT）」「キャンセル」** のままでよい。  
step-03 で操作列を **OK / Cancel** にし、編集時は Copy を出さない。

---

## 変更ファイル一覧（自分用チェック）

- [ ] `frontend/components/phrase-content-cell.tsx` — `<td>` → div、props 確認
- [ ] `frontend/components/phrase-display-row.tsx` — `isEditing`, `onStartEdit` を親から受け取る
- [ ] `frontend/components/phrase-manager.tsx` — map の編集分支復活、「編集」ボタン削除
- [ ] （任意）`frontend/hooks/use-double-tap-edit.ts` — 使うなら PhraseContentCell から差し替え

`frontend/lib/double-tap.ts` はこのステップでは触らなくてよい。
