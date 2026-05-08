# Phrase Copy — 見本スタック（FastAPI + MySQL 8 + Docker Compose）

このディレクトリは **学習・参考用のサンプル** です。本番用の phrase-copy-app 本体とは別に、`sandbox/cursor-generated/` 配下に置いています。

## 前提

- Docker / Docker Compose v2
- （ローカル単体起動する場合）Python 3.12

## 起動方法

### 1. 環境変数ファイルを用意

サンプルのルート（この `README.md` と同じ階層）で:

```bash
cp .env.example .env
```

必要に応じて `.env` のパスワードや DB 名を変更してください。`docker compose` 実行時はこの `.env` が `infra/docker-compose.yml` から参照されます。

### 2. Docker Compose で起動

サンプルルートで:

```bash
cd sandbox/cursor-generated
docker compose -f infra/docker-compose.yml up --build
```

- API: http://127.0.0.1:8000  
- MySQL（ホストから）: `127.0.0.1:3307` → コンテナ内 3306（ローカルで既に 3306 を使っている場合の衝突を避けるため。`infra/docker-compose.yml` の `ports` で変更可能）

停止は `Ctrl+C` のあと:

```bash
docker compose -f infra/docker-compose.yml down
```

データを消したい場合は `down -v` でボリュームも削除できます。

### 3. バックエンドのみローカルで動かす例

MySQL が既に起動していて、`DATABASE_URL` が接続できる状態なら:

```bash
cd sandbox/cursor-generated/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# サンプルルートの .env を読む（config が自動で ../.env を探します）
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## docker compose 実行方法（要点）

- 定義ファイル: `infra/docker-compose.yml`
- サービス: `db`（MySQL 8）、`backend`（FastAPI）
- `db` サービスは **`env_file: ../.env`** で MySQL に必要な変数を渡します（compose ファイルが `infra/` にある場合でも、ホスト側の `${}` 補間に依存しません）。
- バックエンドの環境変数も同じ `../.env` を参照します。

## API 確認方法

### API ドキュメント（Swagger / ReDoc）とは

FastAPI は **OpenAPI**（JSON で API の一覧・パラメータを定義した仕様）を自動生成します。ブラウザで見やすくする UI が次の2つです。

| URL | 名前 | ざっくりした違い |
|-----|------|------------------|
| http://127.0.0.1:8000/docs | **Swagger UI** | 画面上から試し打ちしやすい（Execute ボタンなど） |
| http://127.0.0.1:8000/redoc | **ReDoc** | 読み物としてのレイアウトが好まれることが多い |

どちらも **同じ API の説明** を別デザインで見ているだけです。片方が使えれば十分なことが多いです。

**注意:** バックエンドが起動しているときだけ開けます（`docker compose ... up` 中、または `uvicorn` 実行中）。止まっていると接続できません。

**ReDoc が真っ白になる場合:** ページ本体はローカルですが、表示用の JavaScript を **インターネット上の CDN** から読み込みます。広告ブロッカー・社内プロキシ・オフラインなどで CDN がブロックされると画面が出ません。そのときは **Swagger UI（`/docs`）** を試すか、仕様そのものを **http://127.0.0.1:8000/openapi.json** で確認してください。

1. ブラウザで上記の **Swagger UI** / **ReDoc** を開く（推奨はまず `/docs`）。

2. ヘルスチェック  

```bash
curl -s http://127.0.0.1:8000/health
```

3. Phrase CRUD の例  

```bash
# 一覧
curl -s http://127.0.0.1:8000/phrases

# 作成
curl -s -X POST http://127.0.0.1:8000/phrases \
  -H "Content-Type: application/json" \
  -d '{"title":"挨拶","content":"おはようございます"}'

# 更新（例: id=1）
curl -s -X PUT http://127.0.0.1:8000/phrases/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"挨拶（更新）","content":"おはようございます"}'

# 削除
curl -s -o /dev/null -w "%{http_code}\n" -X DELETE http://127.0.0.1:8000/phrases/1
```

## ディレクトリ構成の説明

```
sandbox/cursor-generated/
├── README.md                 # 本ファイル
├── .env.example              # 環境変数テンプレート
├── .gitignore
├── frontend/                 # フロントは見本の枠のみ（将来の SPA 用）
├── backend/                  # FastAPI アプリ
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py           # アプリ生成・CORS・ルータ登録
│       ├── api/              # HTTP 層（ルート・依存性）
│       ├── models/           # SQLAlchemy モデル
│       ├── schemas/          # Pydantic スキーマ
│       ├── services/         # ユースケース
│       ├── repositories/     # DB アクセスの集約
│       ├── db/               # エンジン・セッション
│       └── core/             # 設定など横断関心事
├── infra/
│   └── docker-compose.yml    # MySQL + backend
└── docs/                     # 補足メモ（任意）
```

レイヤーの流れ（簡略）: **ルート → Service → Repository → SQLAlchemy**。過度な抽象化は避け、読みやすさ優先の構成にしています。

## 備考

- テーブル作成は **起動時の `create_all`** です。本番運用では **Alembic** などのマイグレーションを推奨します。
- CORS 許可オリジンは `.env` の `CORS_ORIGINS`（カンマ区切り）で指定します。
- MySQL 8 の既定認証（`caching_sha2_password`）で PyMySQL を使う場合、`cryptography` が必要なため `requirements.txt` に含めています。
