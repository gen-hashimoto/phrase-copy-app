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
# Run from the project root
docker compose -f infra/docker-compose.local.yml --env-file infra/.env.local up --build
```

Open `http://localhost:3000` in your browser.

## Production Start

```bash
# Run from the project root
cp infra/.env.prod.example infra/.env.prod

# Edit .env.prod before starting.
docker compose -f infra/docker-compose.prod.yml --env-file infra/.env.prod up -d --build
```

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

- Add external storage integration, such as S3
- Add an admin page
- Add CI/CD
