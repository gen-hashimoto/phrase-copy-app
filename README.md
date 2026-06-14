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

- `frontend/.env.example` contains example values for the frontend.
- `infra/.env.example` contains example values for Docker, the database, and the backend.
- Local `.env` files are ignored by Git.

For local development, copy the example files and update the values.

```bash
# Frontend
cp frontend/.env.example frontend/.env.local

# Backend and database
cp infra/.env.example infra/.env
```

Do not commit real secrets or local passwords.

## Getting Started

In the local development environment, the backend and database run with Docker Compose.  
The frontend runs with npm.

```bash
# Backend and database
# Run from the project root
cd infra
docker compose up --build
```

```bash
# Frontend
# Run from the project root
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

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
