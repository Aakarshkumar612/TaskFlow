# TASKFLOW - Docker Setup Guide

Quick start guide for running TASKFLOW with Docker.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [Git](https://git-scm.com/) (optional, for cloning)

## Quick Start

### 1. Clone the repository (if not already done)

```bash
cd C:\Users\Lenovo\OneDrive\Desktop\T-M
```

### 2. Configure environment variables

Copy the Docker environment template and add your Clerk keys:

```bash
cp .env.docker .env
```

Edit `.env` and add your Clerk API keys from [dashboard.clerk.com](https://dashboard.clerk.com):

```env
CLERK_SECRET_KEY=sk_test_your_actual_key_here
CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

### 3. Build and start all services

```bash
docker compose up -d --build
```

This command will:
- Build the backend image (Node.js + Express)
- Build the frontend image (React + Nginx)
- Start PostgreSQL database
- Run database migrations
- Start all containers

### 4. Access the application

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | React application |
| **Backend API** | http://localhost:5000 | REST API |
| **API Health** | http://localhost:5000/health | Health check endpoint |
| **PostgreSQL** | localhost:5432 | Database (for external tools) |

## Commands Reference

### View logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

### Stop services

```bash
docker compose down
```

### Stop and remove volumes (deletes database)

```bash
docker compose down -v
```

### Rebuild after code changes

```bash
docker compose up -d --build
```

### Run Prisma Studio (database GUI)

```bash
docker compose exec backend npx prisma studio
```

### Run database migrations manually

```bash
docker compose exec backend npx prisma db push
docker compose exec backend npx prisma generate
```

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│  Frontend   │────▶│   Backend   │
│             │     │  (Nginx)    │     │  (Node.js)  │
│ localhost   │     │  Port 3000  │     │  Port 5000  │
└─────────────┘     └─────────────┘     └──────┬──────
                                               │
                                        ┌──────▼──────┐
                                        │  PostgreSQL │
                                        │  Port 5432  │
                                        └─────────────┘
```

## Services

### PostgreSQL (`postgres:16-alpine`)
- Lightweight Alpine-based PostgreSQL 16
- Persistent data stored in Docker volume `postgres_data`
- Health check enabled for reliable startup ordering

### Backend (`node:20-alpine`)
- Multi-stage build for minimal image size
- TypeScript compiled to JavaScript
- Prisma ORM for database access
- Clerk authentication middleware
- Runs as non-root user for security

### Frontend (`nginx:1.25-alpine`)
- React app built with Vite
- Served by Nginx for optimal performance
- SPA routing configured
- Gzip compression enabled
- Security headers configured

## Troubleshooting

### Container won't start

```bash
# Check logs for errors
docker compose logs backend

# Restart a specific service
docker compose restart backend
```

### Database connection issues

```bash
# Check PostgreSQL is running
docker compose ps postgres

# Check PostgreSQL logs
docker compose logs postgres
```

### Clerk authentication not working

Verify your `.env` file has correct Clerk keys:
```bash
cat .env | grep CLERK
```

### Port already in use

If port 3000, 5000, or 5432 is already in use, edit `docker-compose.yml`:

```yaml
ports:
  - "8080:80"    # Change 3000 to 8080
  - "5001:5000"  # Change 5000 to 5001
```

### Reset everything

```bash
# Stop, remove containers, and delete all data
docker compose down -v
docker compose up -d --build
```

## Production Deployment

For production, update `docker-compose.yml`:

1. Use production Clerk keys (not `sk_test_...`)
2. Change PostgreSQL password to a strong one
3. Add SSL/TLS termination (use a reverse proxy like Traefik or Caddy)
4. Set up proper backup for the PostgreSQL volume
5. Use Docker secrets instead of environment variables for sensitive data

## File Structure

```
T-M/
├── docker-compose.yml       # Orchestrates all services
├── .env.docker              # Environment template
├── .env                     # Your actual environment (gitignored)
├── backend/
│   ├── Dockerfile           # Backend build instructions
│   ├── .dockerignore        # Files to exclude from Docker
│   ├── src/                 # Source code
│   └── prisma/              # Database schema
└── frontend/
    ├── Dockerfile           # Frontend build instructions
    ├── .dockerignore        # Files to exclude from Docker
    ├── nginx.conf           # Nginx configuration
    └── src/                 # Source code
```
