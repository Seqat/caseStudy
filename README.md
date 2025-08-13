# 🔐 Auth App - Login & Register System

A full-stack authentication application built with .NET 8 Web API backend and React frontend, designed to run entirely in Docker containers.

## 🚀 Quick Start

**Single command to run everything:**

```bash
docker compose up --build
```

After containers are running:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5050
- **Swagger UI**: http://localhost:5050/swagger

## 📋 Requirements

- Docker & Docker Compose
- No local .NET SDK or Node.js required (everything runs in containers)

## 🏗️ Architecture Overview

### Backend (.NET 8 Web API)
- **Framework**: .NET 8 Web API
- **Database**: PostgreSQL with Entity Framework Core
- **Authentication**: JWT-based authentication
- **Password Security**: BCrypt hashing
- **API Documentation**: Swagger/OpenAPI
- **Testing**: xUnit with integration tests

### Frontend (React + Vite)
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **State Management**: Context API
- **HTTP Client**: Axios with interceptors
- **Testing**: Vitest + Playwright E2E

### Database
- **Type**: PostgreSQL 16 (Alpine)
- **Schema**: Users table with email uniqueness constraint
- **Migrations**: Automatic on container startup

## 🧪 Testing

### Backend Tests
```bash
# Run backend unit/integration tests
docker compose exec backend dotnet test
```

### Frontend Tests
```bash
# Run frontend component tests
docker compose exec frontend npm test

# Run E2E tests (requires app to be running)
docker compose exec frontend npm run test:e2e
```


## 🔑 Key Features

### Core Functionality
- ✅ User registration with email validation
- ✅ User login with password verification
- ✅ JWT token-based authentication
- ✅ Protected dashboard route
- ✅ Password strength validation (min 6 chars)
- ✅ Email format validation
- ✅ Automatic token refresh handling

### Security Features
- 🔒 BCrypt password hashing
- 🔒 JWT token expiration (60 minutes)
- 🔒 CORS configuration for frontend
- 🔒 Input validation on both frontend and backend
- 🔒 Protected routes with proper authorization

### Development Features
- 🧪 Comprehensive test coverage
- 📝 API documentation with Swagger
- 🐳 Complete Docker containerization
- 📊 Request logging and monitoring
- 🔄 Auto-reload in development mode

## 🎯 Test Scenarios Covered

### Backend Tests (Integration)
1. ✅ **Valid Registration**: Correct email + password → 200 + JWT token
2. ✅ **Invalid Email Format**: Malformed email → 400 Bad Request
3. ✅ **Valid Login**: Correct credentials → 200 + JWT token
4. ✅ **Invalid Login**: Wrong credentials → 401 Unauthorized
5. ✅ **Protected Endpoint**: Valid token → 200 + user profile
6. ✅ **Unauthorized Access**: No token → 401 Unauthorized

### Frontend Tests (Component + E2E)
1. ✅ **Component Rendering**: Login/Register forms render correctly
2. ✅ **Form Validation**: Password mismatch, invalid email handled
3. ✅ **E2E Happy Path**: Register → Login → Protected Dashboard
4. ✅ **Route Protection**: Unauthenticated access redirects to login

## 🔧 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/profile` | Get user profile | ✅ |
| POST | `/api/auth/logout` | Logout user | ✅ |

## 🛠️ Development Commands

### Starting the Application
```bash
# Start all services
docker compose up --build

# Start in detached mode
docker compose up -d --build

# View logs
docker compose logs -f [service_name]
```

### Testing
```bash
# Backend tests
docker compose exec backend dotnet test --verbosity normal

# Frontend unit tests
docker compose exec frontend npm test

# Frontend E2E tests
docker compose exec frontend npm run test:e2e
```

### Database Management
```bash
# Access PostgreSQL
docker compose exec postgres psql -U postgres -d authdb

# View database logs
docker compose logs postgres
```

### Cleanup
```bash
# Stop and remove containers
docker compose down

# Remove volumes (resets database)
docker compose down -v
```

## 🎨 Design Decisions

### Authentication Strategy
**Choice**: JWT tokens over session-based auth
**Reasoning**: Stateless, scalable, works well with SPA architecture and allows for easy API consumption.

### Database Design
**Choice**: PostgreSQL with simple normalized schema
**Reasoning**: Reliable, supports constraints, good performance for auth operations. Single Users table with unique email constraint.

### Frontend Architecture
**Choice**: Context API over Redux
**Reasoning**: Simple state requirements, built-in React solution, less boilerplate for this use case.

### Testing Approach
**Choice**: Integration tests for backend, Component + E2E for frontend
**Reasoning**: Integration tests catch real-world API behavior, E2E tests verify complete user flows.

## 🚀 Production Considerations (TODOs)

- [ ] **Environment Variables**: Secure secret management
- [ ] **Rate Limiting**: Prevent brute force attacks
- [ ] **Email Verification**: Confirm email addresses
- [ ] **Password Reset**: Forgot password functionality
- [ ] **Refresh Tokens**: Long-term session management
- [ ] **Audit Logging**: Detailed security logs
- [ ] **Health Checks**: Application monitoring
- [ ] **HTTPS**: SSL/TLS configuration
- [ ] **Database Migrations**: Production-ready migration strategy

## 🐛 Troubleshooting

### Common Issues

**Containers won't start:**
```bash
# Check if ports are available
lsof -i :3000 -i :5000 -i :5432

# Rebuild containers
docker compose down && docker compose up --build
```

**Database connection issues:**
```bash
# Check if PostgreSQL is healthy
docker compose ps
docker compose logs postgres
```

**Frontend can't reach backend:**
- Verify `VITE_API_URL` environment variable
- Check CORS configuration in backend
- Ensure all services are in the same Docker network

## 📊 Performance Notes

- Database uses connection pooling via EF Core
- Frontend uses React.StrictMode for development debugging
- JWT tokens are validated on every protected request
- PostgreSQL uses volume persistence for data durability

---

**Development Time**: ~4-6 hours for complete implementation  
**Test Coverage**: Backend (6 scenarios), Frontend (4 scenarios)  
**Container Startup**: ~30-60 seconds for full stack
