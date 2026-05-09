FROM python:3.12-slim

WORKDIR /app

# 依存関係のみ先にコピーしてレイヤーキャッシュを効かせる
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

# 開発用: ホットリロードは省略し、本番寄りの単一プロセス起動
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
