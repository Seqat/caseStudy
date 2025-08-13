.PHONY: up down build test test-backend test-frontend clean logs

# Start all services
up:
	docker compose up --build

# Start in detached mode
up-detached:
	docker compose up -d --build

# Stop all services
down:
	docker compose down

# Stop and remove volumes
down-clean:
	docker compose down -v

# Build without starting
build:
	docker compose build

# Run all tests
test: test-backend test-frontend

# Run backend tests
test-backend:
	docker compose exec backend dotnet test --verbosity normal

# Run frontend unit tests
test-frontend:
	docker compose exec frontend npm test

# Run E2E tests
test-e2e:
	docker compose exec frontend npm run test:e2e

# View logs
logs:
	docker compose logs -f

# View specific service logs
logs-backend:
	docker compose logs -f backend

logs-frontend:
	docker compose logs -f frontend

logs-db:
	docker compose logs -f postgres

# Clean up everything
clean:
	docker compose down -v --remove-orphans
	docker system prune -f

# Setup seed data (TODO)
seed:
	echo "TODO: Implement seed script"