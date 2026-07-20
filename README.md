# Phrase Copy App

This app is a lightweight tool for managing and copying your frequently used phrases.

## Features

- Save and edit phrases
- Copy one phrase or all phrases
- Magic Link authentication
- Guest mode with a phrase limit
- Saves phrases to the database after login
- Responsive UI with dark mode

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui
- Backend: FastAPI, MySQL
- Auth: Magic Link, HttpOnly cookie
- Ops: Docker Compose, Makefile (`prod` / `dev` / ECR targets), Amazon ECR, GitHub Actions (CI + CD)

## Environment Variables

Environment variables are managed with example files.

- `infra/.env.local.example`, `infra/.env.prod.example` contain example values for Docker, the database, and the backend.
- Local `.env` files are ignored by Git.

For local development, copy the example files and update the values.

```bash
# Backend and database
cp infra/.env.local.example infra/.env.local
```

Do not commit real secrets or local passwords.

## Getting Started

```bash
# Run from the project root (after creating infra/.env.local)
make deploy-dev
```

Open `http://localhost:3000` in your browser.

Useful follow-ups:

```bash
make ps-dev
make logs-dev
make restart-dev
make down-dev
```

### Local Magic Link Email (Mailpit)

With `EMAIL_BACKEND=smtp` in `infra/.env.local`, magic link emails are delivered to [Mailpit](https://github.com/axllent/mailpit) instead of AWS SES. Request a link at `/login`, then open `http://localhost:8025` to read the message and click the login link. Set `APP_ORIGIN=http://localhost:3000` so links in the email point to your local frontend. To skip email and show a dev link on the login page instead, use `EMAIL_BACKEND=dev`.

## Production / CI / CD

Production runs on **EC2** with **Docker Compose**. App images (`frontend` / `backend`) are built in GitHub Actions, stored in **Amazon ECR** (`phrases/frontend`, `phrases/backend`), and pulled on the server. Caddy and MySQL stay as public images on the host.

```text
Push / merge to main
  → GitHub Actions (quality → build & push to ECR → SSH deploy)
  → EC2: docker compose pull & up (no image build on the server)
```

### Production start (server)

```bash
# On EC2, from the project root
cp infra/.env.prod.example infra/.env.prod
# Edit .env.prod (include ECR_REGISTRY, IMAGE_TAG, secrets, etc.)

# Preferred: pull images from ECR (after Actions has pushed them)
export AWS_REGION=ap-northeast-1
export ECR_REGISTRY=<account>.dkr.ecr.ap-northeast-1.amazonaws.com
export IMAGE_TAG=latest   # or a commit sha
make deploy-prod-ecr

# Fallback (build on the server — older path, still available)
make deploy-prod
```

Compose for ECR: [`infra/docker-compose.prod.ecr.yml`](infra/docker-compose.prod.ecr.yml).  
Deploy helper: [`scripts/ec2-deploy.sh`](scripts/ec2-deploy.sh) (used by Actions SSH and for manual runs).

### Operations

Day-to-day tools:

- **Makefile** — local / production Compose commands, including ECR pull deploy
- **GitHub Actions** — CI on PRs; CD (ECR + EC2) on `main`

#### Makefile

| Target                         | Purpose                                              |
| ------------------------------ | ---------------------------------------------------- |
| `deploy-prod-ecr`              | ECR login → pull app images → up → prune             |
| `login-ecr` / `pull-prod`      | ECR auth / pull only                                 |
| `deploy-prod`                  | `git pull` → build & up on server (legacy fallback)  |
| `deploy-dev`                   | Build & up for local development                     |
| `logs-prod` / `logs-dev`       | Follow container logs                                |
| `down-prod` / `down-dev`       | Stop containers                                      |
| `restart-prod` / `restart-dev` | Recreate containers (see note below)                 |
| `ps-prod` / `ps-dev`           | Show running services                                |

Design choices worth noting:

- **Separate `prod` / `dev` / ECR variables and targets** — compose files and env files stay explicit.
- **Build in CI, run on EC2** — the server pulls tagged images instead of compiling on every deploy.
- **`restart-*` uses `up -d --force-recreate`, not `docker compose restart`** — plain `restart` ignores Compose healthchecks; recreate keeps `depends_on` / healthcheck ordering.

#### GitHub Actions

| Workflow | File | When | What it does |
| -------- | ---- | ---- | ------------ |
| **CI** | [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | PR / push to `main` | Lint, typecheck, Docker build check (`push: false`) |
| **Deploy (CD)** | [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) | Push to `main` (or `workflow_dispatch`) | Quality → build & push to ECR → SSH to EC2 → `ec2-deploy.sh` |

Learning notes and IAM / ECR setup steps live under [`sandbox/ecr-ec2/`](sandbox/ecr-ec2/).

## Design Process

### 1. Interaction Flow

![Interaction Flow](assets/images/interaction_flow.png)

### 2. Screen Rough

![Screen Rough](assets/images/screen_rough_phase1.png)

### Notes

- “Copy All” copies all phrases as newline-separated text.
- Backup and import are text-based to allow easy use on mobile devices
  (e.g., saving to a notes app).

## Screenshots

![Screenshot1](assets/images/screenshot_1.png)
![Screenshot2](assets/images/screenshot_2.png)
![Screenshot3](assets/images/screenshot_3.png)

## Why I Built This

I often work with Linux commands during system maintenance.
I wanted a simple way to prepare and copy frequently used commands without mistakes.

This app was built to make copying commands easier, faster, and safer.

## Future Improvements

User features:

- Search phrases
- Reorder phrases
- Add genres and tags
- Import and export phrases with plain text or CSV
- Support multiple languages
- Add account deletion

Development and operations:

- Extend Makefile ops (`help`, backups, per-service logs)
- Add external storage integration, such as S3
- Add an admin page
- Replace long-lived AWS access keys with GitHub Actions OIDC
- Harden SSH access (e.g. SSM Session Manager instead of opening port 22)
