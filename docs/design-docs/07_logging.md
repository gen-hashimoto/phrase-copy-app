# Logging

## Purpose

- 障害調査
- APIリクエスト確認
- エラー解析

---

## Current Policy

現時点ではシンプルなログ運用とする。

- FastAPI logger を利用
- nginx 標準ログを利用
- Docker logs で確認
- 必要に応じて logger.error を実装

---

## Planned Logging

将来的には以下を検討。

- request id
- structured logging
- CloudWatch
- Sentry
- access log の改善

---

## Notes

機密情報（password / token 等）はログに出力しない。
