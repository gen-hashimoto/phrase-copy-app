# 05 DB Design

---

## ER図

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
  uuid users_id FK
  string phrase "NOT NULL"
  int position
  datetime created_at
  datetime updated_at
}
```

---

## 将来追加予定の項目

- ログインモード（無料）とプレミアムモードを判定するため、`users` または別テーブルでプラン情報を持つ。
- ログインモードではジャンル数を無制限とするため、`genres` テーブルを追加し、`phrases` から参照できるようにする。
- フレーズ登録上限（無料50件、プレミアム無制限）は、DB制約ではなくAPIのバリデーションで判定する。
