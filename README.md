# Notes Studio - Full-Stack React Application

A comprehensive full-stack note management application. The frontend is a modern, responsive Single Page Application (SPA) built entirely with **React**, designed to provide a seamless user experience. It consumes a robust REST API powered by NestJS and PostgreSQL.

Live Demo: https://notes-app-frontend-bice.vercel.app/

## Screenshots

<p align="center">
  <img src="./frontend/screenshots/login.png" alt="Login View" width="48%" />
  &nbsp;
  <img src="./frontend/screenshots/dashboard.png" alt="Dashboard View" width="48%" />
</p>

## Technology Stack

### Frontend (React SPA)
- **React 18**: Core library for building the dynamic, component-based user interface.
- **Vite 5**: Next-generation frontend tooling for rapid development and optimized builds.
- **TypeScript 5**: Static typing across the entire codebase.
- **Tailwind CSS 3**: Utility-first CSS framework for highly responsive and modern styling.
- **lucide-react**: Clean and consistent iconography.
- **Architecture**: Pure SPA with API logic strictly isolated within a dedicated service layer (`src/services/api.ts`).

### Backend
- **NestJS 10**: Progressive Node.js framework maintaining a strict layered architecture (Controllers, Services, Repositories, DTOs, Entities, Guards).
- **Node.js**: 18+ required.
- **npm**: 9+ required.
- **Database**: PostgreSQL 14+ integrated via **TypeORM 0.3** for persistent relational data, migrations, and schema management.

## Key Features

- **React-Powered UI**: Fast, responsive, and dynamic interface ensuring smooth navigation without page reloads.
- **Responsive Mobile & Desktop Layout**: Desktop 3-column equal-width layout with internal scrolling (no page scroll overflow) and a mobile bottom tab navigation bar.
- **Comprehensive Note Management**: Full CRUD operations (Create, Read, Update, Delete) for notes.
- **Organizational Tools**: Create custom categories and apply multiple tags per note with efficient filtering via SQL subqueries.
- **Archiving System**: Distinct views for active and archived notes to maintain a clean workspace.
- **Relational Backend**: Persistent data storage utilizing TypeORM migrations, relations, and aggregated SQL `GROUP BY` counts.
- **API Protection**: Global `ApiKeyGuard` validating incoming requests via `x-api-key`.

## Project Structure

```text
.
├── backend
│   ├── src
│   │   ├── auth              # API key guard (global route authorization)
│   │   ├── categories        # Categories module (controller, service, entity, DTOs)
│   │   ├── config            # TypeORM configuration (dynamic SSL / synchronize)
│   │   ├── database
│   │   │   ├── migrations    # TypeORM migration files
│   │   │   └── seeds         # Demo data seed script
│   │   └── notes             # Notes module (controller, service, entity, DTOs)
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── frontend
│   ├── src
│   │   ├── components        # UI components (NoteEditor, NotesList, CategorySidebar, etc.)
│   │   ├── hooks             # Custom hooks (useNotesApp, useAuth, useNotifications)
│   │   ├── lib               # Auth constants and environment configuration
│   │   ├── services          # API service layer with typed endpoints and auth headers
│   │   └── types             # TypeScript types
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── setup.sh
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** 9+
- **PostgreSQL** 14+ running locally (or a connection URL for a remote instance)

### Automated Setup (recommended)

A bash script is provided to streamline the local environment setup:

```bash
bash setup.sh
```

The automated setup script will:
1. Install dependencies for both the React frontend and NestJS backend.
2. Copy `.env.example` to active `.env` files (if they don't already exist).
3. Create the PostgreSQL database automatically (if `psql` is available).
4. Execute TypeORM database migrations to set up the schema.
5. Seed the PostgreSQL database with realistic English demo content.
6. Spin up the NestJS API and the Vite development server concurrently.

*Note: The backend expects a running PostgreSQL instance. If `psql` is available, the setup script will automatically create the target database when missing.*

### Manual Setup

**Backend:**
```bash
cd backend
npm install
cp .env.example .env       # Then edit .env with your PostgreSQL credentials
npm run migration:run
npm run seed
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env       # Then edit .env if needed
npm run dev
```

## Environment Configuration

### Backend (`backend/.env`)

Copy from `backend/.env.example` and adjust as needed:

```env
NODE_ENV=development

PORT=3001

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DATABASE=notes_app

# For production: full connection URL (overrides individual vars above)
# DATABASE_URL=postgresql://user:pass@host:port/dbname

# API key — must match VITE_API_KEY in the frontend .env
API_KEY=notes-studio-demo-key
```

### Frontend (`frontend/.env`)

Copy from `frontend/.env.example` and adjust as needed:

```env
VITE_API_URL=http://localhost:3001

# Must match API_KEY in the backend .env
VITE_API_KEY=notes-studio-demo-key

# Demo user credentials (pre-seeded)
VITE_DEMO_EMAIL=demo@notesstudio.app
VITE_DEMO_PASSWORD=NotesDemo123!
```

## Default Local URLs

- React Frontend: `http://localhost:5173`
- NestJS Backend API: `http://localhost:3001`

## Demo Access

To test the live application or your local deployment, use the following pre-seeded credentials:

- **Email**: `demo@notesstudio.app`
- **Password**: `NotesDemo123!`

> The login is a demo flow that validates against the credentials configured in the frontend `.env`. It persists the session in `localStorage`.

## API Reference

All endpoints require the `x-api-key` header matching the `API_KEY` environment variable.

### Notes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/notes` | List active notes (supports `?categoryId=uuid&page=1&limit=100`) |
| `GET` | `/notes/archived` | List archived notes (supports `?categoryId=uuid`) |
| `GET` | `/notes/counts` | Get note counts per category + total (`?archived=true\|false`) |
| `GET` | `/notes/:id` | Retrieve a specific note |
| `POST` | `/notes` | Create a new note |
| `PUT` | `/notes/:id` | Fully update an existing note (title, content, categories) |
| `PATCH` | `/notes/:id/archive` | Move a note to the archive |
| `PATCH` | `/notes/:id/unarchive` | Restore a note from the archive |
| `DELETE` | `/notes/:id` | Permanently delete a note |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/categories` | List all categories (alphabetical order) |
| `POST` | `/categories` | Create a new category |
| `DELETE` | `/categories/:id` | Delete a category (detaches from all linked notes) |