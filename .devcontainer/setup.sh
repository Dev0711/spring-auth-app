#!/bin/bash
set -e

echo "====================================="
echo " Setting up Spring Boot Auth App"
echo "====================================="

# --- Java version check ---
echo "Java version:"
java -version

# --- Start PostgreSQL via Docker ---
echo "Starting PostgreSQL container..."
docker run -d \
  --name authdb-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=authdb \
  -p 5432:5432 \
  postgres:16-alpine

# Wait for Postgres to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# --- Install frontend dependencies ---
echo "Installing frontend dependencies..."
cd /workspaces/spring-auth-app/frontend
npm install

echo ""
echo "====================================="
echo " Setup complete!"
echo ""
echo " To start the backend:"
echo "   cd backend && mvn spring-boot:run"
echo ""
echo " To start the frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo " PostgreSQL is running on port 5432"
echo "   DB: authdb | User: postgres | Password: password"
echo "====================================="
