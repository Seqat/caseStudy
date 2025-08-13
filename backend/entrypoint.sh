#!/bin/bash
set -e

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 10

# Check if we can connect to database
until pg_isready -h postgres -p 5432 -U postgres; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is ready!"

# Run migrations using the bundled executable
echo "Running database migrations..."
if [ -f "./efbundle" ]; then
    ./efbundle --connection "Host=postgres;Database=authdb;Username=postgres;Password=postgres123"
    echo "Migrations completed successfully!"
else
    echo "EF bundle not found, skipping migrations"
fi

# Start the application
echo "Starting application..."
exec dotnet AuthApp.dll