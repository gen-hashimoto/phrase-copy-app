## ステップ 3: usage 表示重複の原因調査

未ログイン時に `0 / 10 used` が重複表示されている原因を、いきなり修正せずに調査する。

### 目的

- どのコンポーネントが usage 表示を出しているか特定する。
- 表示責務が親子で重複していないか確認する。
- 修正コードを書く前に、消すべき表示と残すべき表示を判断する。

### なぜ必要か

表示の重複は、ロジックのバグというより「同じ UI 責務を複数コンポーネントが持っている」ことで起きやすい。

今回のような構成では、親の `GuestPhraseList` と子の `PhraseManager` の両方が `phrases.length` と `limit` を知っているため、どちらも usage を表示できてしまう。

### 実装方針

この step では、修正を先に決めない。まず表示箇所、描画経路、props の流れを確認し、`0 / 10 used` をどのコンポーネントの責務にするか決める。

方針:

- 文言検索で候補を列挙する。
- `Page` から該当 UI までの親子関係を図にする。
- 親と子が同じ情報を表示している場合、どちらか一方に寄せる。
- 削除する前に、10 件上限の disabled 表示や説明文が失われないか確認する。

### 調査手順

#### 1. 画面上の文言で検索する

まず `used` という表示文言を探す。

```text
used
```

確認したいこと:

- 同じ文言が複数ファイルにないか。
- 同じファイル内に複数回ないか。
- `phrases.length` と `limit` を使った似た表示がないか。

#### 2. 未ログイン画面の入口を確認する

未ログイン時は `app/page.tsx` から `GuestPhraseList` が描画される。

確認する流れ:

```text
frontend/app/page.tsx
  -> frontend/components/guest-phrase-list.tsx
    -> frontend/components/phrase-manager.tsx
```

この親子関係を先に押さえると、どこで同じ表示が出ているか見つけやすい。

#### 3. props の受け渡しを見る

`GuestPhraseList` から `PhraseManager` に渡している props を確認する。

```tsx
<PhraseManager
  mode="guest"
  phrases={phrases}
  onGuestChange={setPhrases}
  // Passing limit means the child can also render usage text.
  limit={10}
/>
```

ここで `limit` を渡しているので、子の `PhraseManager` も usage 表示に必要な情報を持っている。

#### 4. 親側の表示を見る

`GuestPhraseList` 側に usage 表示がないか確認する。

```tsx
<p className="text-sm text-muted-foreground">
  {/* Parent-level guest usage display. */}
  {phrases.length} / {GUEST_LIMIT} used
</p>
```

#### 5. 子側の表示を見る

`PhraseManager` 側にも guest mode の表示がないか確認する。

```tsx
{mode === "guest" ? (
  <p className="text-sm text-muted-foreground">
    {/* Child-level guest usage display. */}
    {phrases.length} / {limit} used
  </p>
) : (
  <p className="text-sm text-muted-foreground">{phrases.length} 件</p>
)}
```

この 2 箇所が同時に描画されると、同じ `0 / 10 used` が重複する。

### 確認ポイント

| 観点 | 見る場所 | 判断 |
| ------ | ---------- | ------ |
| 表示文言 | `used` の検索結果 | 複数箇所なら重複候補 |
| 表示条件 | `mode === "guest"` | 未ログイン時だけ出るか |
| データ元 | `phrases.length`, `limit` | 同じ値を使っているか |
| コンポーネント責務 | 親 / 子の JSX | どちらが表示を持つべきか |
| レイアウト | usage の位置 | + ボタン横か、説明文エリアか |

### コンポーネント構成の整理方法

今回の構成は次のように読む。

```text
Page
  ログイン状態を判定する
  未ログインなら GuestPhraseList
  ログイン済みなら UserPhraseList

GuestPhraseList
  guest phrases を useState で持つ
  guest limit を知っている
  PhraseManager に phrases / limit を渡す
  未ログイン向けの説明文を出せる

PhraseManager
  phrase の追加、編集、削除、コピー操作を扱う
  mode によって guest / user の保存先を切り替える
  + ボタンやテーブル周辺の操作 UI を出す
```

整理のコツ:

- 「その表示は操作 UI の一部か」を考える。
- 「その表示は未ログイン専用の説明か」を考える。
- 同じ情報を親と子が両方表示しないようにする。

### 重複表示が起きやすいパターン

- 親が summary を表示し、子も同じ summary を表示している。
- props で `count` と `limit` を渡した後、子が表示まで担当するようになったが、親の古い表示を消していない。
- refactor で Card やフォームを移動したときに、補助テキストだけ元の場所に残った。
- `mode` による分岐を子に追加したあと、親の guest 専用 UI と重なった。

### 修正方針を決めるための問い

この step では修正コードを確定しない。先に次を決める。

1. `0 / 10 used` は + ボタンの近くに置きたいか。
2. 未ログイン向けの説明文と一緒に置きたいか。
3. `PhraseManager` は guest / user 共通コンポーネントとして usage まで持つべきか。
4. `GuestPhraseList` が guest 専用の文言をすべて持つべきか。

判断例:

- + ボタンの disabled 理由として見せたいなら、`PhraseManager` 側に残す。
- 未ログイン専用の説明として見せたいなら、`GuestPhraseList` 側に残す。
- 子コンポーネントをできるだけ再利用可能にしたいなら、`PhraseManager` から usage 表示を外す。

### 差分コード

この step では、完成修正コードは出さない。代わりに調査時に印をつけるための一時コメント例だけ示す。

```tsx
// Investigation note: usage display owned by GuestPhraseList.
// {phrases.length} / {GUEST_LIMIT} used
```

```tsx
// Investigation note: usage display owned by PhraseManager.
// {phrases.length} / {limit} used
```

調査が終わったら、この 2 箇所のどちらか一方だけを残す。どちらを残すかは上の問いに答えてから決める。

### 注意点

- 見た目だけで消すと、`limit` による disabled 表示の意味が分かりにくくなることがある。
- `GUEST_LIMIT` と `limit={10}` のように同じ値が別名で存在すると、将来片方だけ変更される危険がある。
- 表示を消しても `isAtLimit` の制御は残す必要がある。

### 本番反映手順

1. `used` で検索して表示箇所を列挙する。
2. `app/page.tsx` から `GuestPhraseList`、`PhraseManager` まで描画経路を確認する。
3. 親と子のどちらに usage 表示責務を置くか決める。
4. 片方の表示だけを削除または移動する。
5. 未ログインで 0 件、1 件、10 件の表示を確認する。

### 動作確認

1. 未ログインで `0 / 10 used` が 1 回だけ表示される。
2. 1 件追加すると `1 / 10 used` が 1 回だけ表示される。
3. 10 件到達時に + ボタンが disabled になる。
4. ログイン済み画面で guest 用 usage が表示されない。
