# 06 Infrastructure

## Overview

本アプリはAWS EC2上でDocker Composeを利用して構築予定。

現時点ではシンプルな構成で実装し、
将来的に必要に応じてスケールアップを検討する。

---

## Current Architecture

```text
Internet
   ↓
EC2
 ├─ Docker Compose
 │   ├─ nginx
 │   ├─ fastapi
 │   └─ postgres
```

---

## Components

| Component      | Description                      |
| -------------- | -------------------------------- |
| nginx          | Reverse proxy / frontend hosting |
| fastapi        | Backend API server               |
| postgres       | Database                         |
| Docker Compose | Container management             |
| EC2            | Application hosting              |

---

## Future Considerations

- HTTPS対応
- Route53 / ドメイン設定
- S3画像保存
- CI/CD
- RDS化
- ECS化
- CloudFront導入
