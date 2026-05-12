#!/bin/bash

# Meeting Intelligence Backend - Setup & Test Script

echo "🚀 Starting setup..."

# 1. Update .env if not exists
if [ ! -f .env ]; then
    echo "📄 Creating .env from .env.example..."
    cp .env.example .env
fi

# 2. Rebuild and restart containers
echo "🐳 Restarting Docker containers..."
docker-compose down
docker-compose up -d --build

# 3. Wait for DB to be ready and run migrations
echo "⏳ Waiting for services to start..."
sleep 10

echo "🗄️ Running migrations..."
docker-compose exec web python manage.py migrate

# 4. Run Tests
echo "🧪 Running tests..."
docker-compose exec web python manage.py test

echo "✅ Setup and Testing complete!"
echo "🔗 Swagger Documentation: http://localhost:8000/swagger/"
