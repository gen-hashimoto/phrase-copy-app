# 01 ER Basic

以下は、今回のアプリ構成に寄せた Mermaid ER図の見本です。
そのままコピペするより、1行ずつ意味を確認しながら書き換えるのがおすすめです。

```mermaid
erDiagram
  users ||--o{ phrases : owns

  users {
    uuid id PK
    string email UNIQUE
    string auth_link
    datetime created_at
    datetime updated_at
  }

  phrases {
    uuid id PK
    uuid user_id FK
    string phrase "NOT NULL"
    int position
    datetime created_at
    datetime updated_at
  }
```

## 記法の分解

- `erDiagram`: ER図の開始宣言
- `users ||--o{ phrases : owns`: リレーション定義
  - `||`: ちょうど1
  - `o{`: 0以上の複数
  - `owns`: 関係名（日本語でもOK）
- `users { ... }`: テーブル定義ブロック
  - `型 カラム名 注釈` の順で書くと統一しやすい

## 練習メニュー

1. `phrases.position` を `sort_order` に変更してみる
2. `phrases.user_id` に `"NOT NULL"` 注釈を追加してみる
3. 新しい `tags` テーブルを作って `phrases` と関連付けてみる

## 注意点

- Mermaid の型名は厳密なDB型ではなく、説明用ラベルとして使う
- 実際の制約（UNIQUE, NOT NULL, FK制約名）は、最終的にマイグレーションSQLで確定する

