# syntax=docker/dockerfile:1

# Shared stage: install dependencies once.
FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Dev stage: run FastAPI with auto reload.
FROM base AS dev

COPY app ./app

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# Prod stage: run FastAPI behind Caddy.
FROM base AS prod

RUN addgroup --system app \
  && adduser --system --ingroup app app

COPY app ./app

USER app

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers","--forwarded-allow-ips=*"]

# python:3.12-slim
#         │
#         ▼
# +----------------+
# |      base      |
# | pip install    |
# +----------------+
#       │
#       ├────────────┐
#       ▼            ▼
#
# +----------+   +----------+
# |   dev    |   |   prod   |
# | reload   |   | 本番実行 |
# +----------+   +----------+
