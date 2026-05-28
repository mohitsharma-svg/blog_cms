#!/bin/sh
set -e

echo "⏳ Waiting for database..."

until nc -z postgres_db 5432; do
  sleep 1
done

echo "✅ Database started"

echo "📦 Running migrations..."
alembic upgrade head

if [ "$RUN_SEED" = "true" ]; then
  echo "🌱 Running seeders..."
  python -m app.seeds.run_seed
fi

echo "🚀 Starting server..."
uvicorn app.main:app --host 0.0.0.0 --port 8000