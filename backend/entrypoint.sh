#!/bin/sh

echo "⏳ Waiting for Postgres..."

while ! nc -z postgres_db 5432; do
  sleep 1
done

echo "✔ Postgres is ready"

echo "📦 Running migrations..."
alembic upgrade head


echo "🚀 Starting FastAPI..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload