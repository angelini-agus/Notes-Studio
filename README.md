# Notes App Challenge

Minimal full-stack notes application built for a technical challenge with a strict `backend/` + `frontend/` split.

Live Demo: https://notes-app-frontend-bice.vercel.app/

## Screenshots

<p align="center">
  <img src="./frontend/screenshots/login.png" alt="Login View" width="48%" />
  &nbsp;
  <img src="./frontend/screenshots/dashboard.png" alt="Dashboard View" width="48%" />
</p>

## Stack

- Node.js `18+`
- npm `9+`
- PostgreSQL `14+`
- Backend: NestJS, TypeORM, PostgreSQL
- Frontend: React, Vite, Tailwind CSS, lucide-react

## Project Structure

```text
.
├── backend
│   ├── src
│   │   ├── categories
│   │   ├── config
│   │   ├── database/migrations
│   │   └── notes
│   ├── .env.example
│   └── package.json
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── hooks
│   │   ├── services
│   │   └── types
│   ├── .env.example
│   └── package.json
├── setup.sh
└── README.md
```

## Features

- CRUD for notes: create, list, update, delete
- Archive and unarchive notes
- Separate active and archived note views
- Multiple categories per note
- Category creation and filtering
- Persistent relational database with TypeORM
- SPA frontend consuming a REST API

## Getting Started

### Fast setup

```bash
bash setup.sh
```

That script will:

1. Install dependencies in `backend/` and `frontend/`
2. Copy `.env.example` to `.env` when missing
3. Run TypeORM migrations
4. Seed the database with English demo content
5. Start the NestJS API and Vite SPA

### Manual setup

```bash
cd backend
npm install
cp .env.example .env
npm run migration:run
npm run seed
npm run start:dev
```

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Default URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

## Demo Login

- Email: `demo@notesstudio.app`
- Password: `NotesDemo123!`

## Environment

Backend uses PostgreSQL only:

```env
PORT=3001
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DATABASE=notes_app
```

Frontend:

```env
VITE_API_URL=http://localhost:3001
```

## API Summary

- `GET /notes`
- `GET /notes/archived`
- `GET /notes/:id`
- `POST /notes`
- `PUT /notes/:id`
- `PATCH /notes/:id/archive`
- `PATCH /notes/:id/unarchive`
- `DELETE /notes/:id`
- `GET /categories`
- `POST /categories`

## Seed Data

Run the backend seed manually with:

```bash
cd backend
npm run seed
```

The seed is idempotent and creates realistic English notes across product, engineering, research, personal, and meeting-related categories.

## Notes

- The backend expects a running PostgreSQL instance. If `psql` is available, `setup.sh` will create the target database automatically when missing.
- The backend keeps a layered structure with controllers, services, entities, DTOs, and migrations.
- The frontend is a pure SPA and keeps API logic isolated in `src/services/api.ts`.
