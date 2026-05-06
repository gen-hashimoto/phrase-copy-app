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
