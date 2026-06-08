#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

copy_env_file() {
  local target_dir="$1"

  if [ ! -f "$target_dir/.env" ] && [ -f "$target_dir/.env.example" ]; then
    cp "$target_dir/.env.example" "$target_dir/.env"
  fi
}

load_backend_env() {
  set -a
  # shellcheck disable=SC1090
  source "$BACKEND_DIR/.env"
  set +a
}

echo "Installing backend dependencies..."
cd "$BACKEND_DIR"
npm install
copy_env_file "$BACKEND_DIR"
load_backend_env

echo "Installing frontend dependencies..."
cd "$FRONTEND_DIR"
npm install
copy_env_file "$FRONTEND_DIR"

echo "Checking PostgreSQL database..."
if command -v psql >/dev/null 2>&1; then
  export PGPASSWORD="${POSTGRES_PASSWORD:-postgres}"
  DB_EXISTS="$(psql -h "${POSTGRES_HOST:-localhost}" -p "${POSTGRES_PORT:-5432}" -U "${POSTGRES_USERNAME:-postgres}" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${POSTGRES_DATABASE:-notes_app}'")"

  if [ "$DB_EXISTS" != "1" ]; then
    psql -h "${POSTGRES_HOST:-localhost}" -p "${POSTGRES_PORT:-5432}" -U "${POSTGRES_USERNAME:-postgres}" -d postgres -c "CREATE DATABASE \"${POSTGRES_DATABASE:-notes_app}\";"
  fi
else
  echo "psql was not found. Skipping automatic database creation."
fi

echo "Running database migrations..."
cd "$BACKEND_DIR"
npm run migration:run

echo "Seeding demo data..."
npm run seed

cleanup() {
  kill "${BACKEND_PID:-0}" "${FRONTEND_PID:-0}" 2>/dev/null || true
}

trap cleanup EXIT INT TERM

echo "Starting backend on http://localhost:3001 ..."
npm run start:dev &
BACKEND_PID=$!

echo "Starting frontend on http://localhost:5173 ..."
cd "$FRONTEND_DIR"
npm run dev -- --host 0.0.0.0 &
FRONTEND_PID=$!

echo "App is running."
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:3001"

wait "$BACKEND_PID" "$FRONTEND_PID"
