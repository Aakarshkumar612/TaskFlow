# TASKFLOW

> A modern, full-stack task management application built with React, Express, PostgreSQL, and Clerk authentication.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20-green.svg)
![PostgreSQL](https://img.shields.io/badge/postgresql-16-blue.svg)
![React](https://img.shields.io/badge/react-18-blue.svg)

## Features

- **Authentication** - Secure sign-up/sign-in with Clerk (email, Google, GitHub)
- **Teams** - Create and manage teams for collaboration
- **Projects** - Organize work into projects with custom colors and statuses
- **Tasks** - Full task management with priorities, deadlines, and assignments
- **Real-time Updates** - WebSocket-powered live notifications and task updates
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Docker Ready** - Production-ready Docker configuration

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for client-side routing
- **TanStack Query** for server state management
- **Redux Toolkit** for client state management
- **Clerk** for authentication
- **Axios** for API communication

### Backend
- **Node.js 20** with Express 5
- **TypeScript** for type safety
- **Prisma ORM** for database access
- **PostgreSQL 16** for data persistence
- **Clerk Backend SDK** for token verification
- **WebSocket** for real-time communication

### Infrastructure
- **Docker** + **Docker Compose** for containerization
- **Nginx** for frontend serving
- **pg_isready** for database health checks

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│  Frontend   │────▶│   Backend   │────▶│ PostgreSQL  │
│             │     │  (Nginx)    │     │  (Node.js)  │     │   (Prisma)  │
│ localhost   │     │  Port 3000  │     │  Port 5000  │     │  Port 5432  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

## Quick Start

### Prerequisites

- **Node.js** 20+ installed
- **PostgreSQL** 16+ running locally
- **npm** or **pnpm** package manager
- **Clerk** account (for authentication)

### Option 1: Local Development

**1. Clone and install dependencies**

```bash
cd backend
npm install

cd ../frontend
npm install
```

**2. Configure environment variables**

Backend (`backend/.env`):
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/taskflow"
PORT=5000
FRONTEND_URL=http://localhost:3000
CLERK_SECRET_KEY=sk_test_your_key_here
CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

Frontend (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

**3. Set up the database**

```bash
cd backend
npx prisma generate
npx prisma db push
```

**4. Start development servers**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

**5. Open in browser**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Option 2: Docker (Recommended)

**1. Clone the repository**

```bash
cd T-M
```

**2. Configure environment**

```bash
copy .env.docker .env
```

Edit `.env` and add your Clerk API keys.

**3. Build and start**

```bash
docker compose up -d --build
```

**4. Access the application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
T-M/
├── docker-compose.yml          # Docker orchestration
├── .env.docker                 # Environment template
├── DOCKER_SETUP.md             # Docker documentation
├── README.md                   # This file
│
├── backend/
│   ├── Dockerfile              # Backend container build
│   ├── .dockerignore           # Docker exclusions
│   ├── package.json            # Dependencies & scripts
│   ├── tsconfig.json           # TypeScript config
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   └── src/
│       ├── server.ts           # Express app entry point
│       ├── config/
│       │   └── database.ts     # Prisma client instance
│       ├── middleware/
│       │   ├── auth.ts         # Clerk authentication
│       │   ├── error.ts        # Error handler
│       │   └── logger.ts       # Request logger
│       ├── controllers/
│       │   ├── task.controller.ts
│       │   ├── project.controller.ts
│       │   ├── team.controller.ts
│       │   └── notification.controller.ts
│       ├── routes/
│       │   ├── task.routes.ts
│       │   ├── project.routes.ts
│       │   ├── team.routes.ts
│       │   └── notification.routes.ts
│       ├── websocket/
│       │   └── websocket.service.ts
│       └── utils/
│           └── helpers.ts
│
└── frontend/
    ├── Dockerfile              # Frontend container build
    ├── .dockerignore           # Docker exclusions
    ├── nginx.conf              # Nginx SPA configuration
    ├── package.json            # Dependencies & scripts
    ├── tsconfig.json           # TypeScript config
    ├── vite.config.ts          # Vite configuration
    ├── index.html              # HTML entry point
    └── src/
        ├── main.tsx            # React entry point
        ├── App.tsx             # Router & auth logic
        ├── components/
        │   ├── auth/
        │   │   └── AuthProvider.tsx
        │   ├── layout/
        │   │   ├── AppLayout.tsx
        │   │   ├── Header.tsx
        │   │   └── Sidebar.tsx
        │   └── ui/
        │       ├── Button.tsx
        │       ├── Input.tsx
        │       ├── Modal.tsx
        │       ├── Avatar.tsx
        │       └── ...
        ├── features/
        │   ├── auth/           # Login & registration
        │   ├── dashboard/      # Dashboard page
        │   ├── landing/        # Landing page
        │   ├── notifications/  # Notifications feature
        │   ├── projects/       # Projects feature
        │   ├── settings/       # Settings page
        │   ├── tasks/          # Tasks feature
        │   └── teams/          # Teams feature
        ├── hooks/
        │   ├── useAuth.ts
        │   ├── useTaskQueries.ts
        │   ├── useProjectQueries.ts
        │   ├── useTeamQueries.ts
        │   └── useNotificationQueries.ts
        ├── services/
        │   ├── api.ts
        │   ├── taskService.ts
        │   ├── projectService.ts
        │   ├── teamService.ts
        │   └── notificationService.ts
        ├── store/
        │   └── store.ts
        ├── types/
        │   ├── api.types.ts
        │   ├── task.types.ts
        │   └── project.types.ts
        └── styles/
            └── tokens.css
```

## API Endpoints

All endpoints require authentication via Bearer token.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api/v1/tasks` | List all tasks |
| `POST` | `/api/v1/tasks` | Create a task |
| `GET` | `/api/v1/tasks/:id` | Get task by ID |
| `PUT` | `/api/v1/tasks/:id` | Update a task |
| `DELETE` | `/api/v1/tasks/:id` | Delete a task |
| `GET` | `/api/v1/projects` | List all projects |
| `POST` | `/api/v1/projects` | Create a project |
| `GET` | `/api/v1/projects/:id` | Get project by ID |
| `PUT` | `/api/v1/projects/:id` | Update a project |
| `DELETE` | `/api/v1/projects/:id` | Delete a project |
| `GET` | `/api/v1/teams` | List all teams |
| `POST` | `/api/v1/teams` | Create a team |
| `GET` | `/api/v1/teams/:id` | Get team by ID |
| `PUT` | `/api/v1/teams/:id` | Update a team |
| `DELETE` | `/api/v1/teams/:id` | Delete a team |
| `GET` | `/api/v1/notifications` | List notifications |
| `PUT` | `/api/v1/notifications/:id/read` | Mark notification read |
| `PUT` | `/api/v1/notifications/read-all` | Mark all read |

## Available Scripts

### Backend

```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript
npm run start        # Start production server
npm run db:generate  # Generate Prisma client
npm run db:push      # Sync schema to database
npm run db:studio    # Open Prisma Studio (database GUI)
```

### Frontend

```bash
npm run dev          # Start Vite development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## Database Schema

The application uses PostgreSQL with the following main entities:

- **User** - Application users (auto-provisioned from Clerk)
- **Team** - Collaborative teams owned by users
- **Project** - Projects belonging to teams
- **Section** - Kanban-style sections within projects
- **Task** - Tasks within projects with status, priority, and assignees
- **Comment** - Comments on tasks
- **Notification** - User notifications

## Environment Variables

### Backend

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `PORT` | No | Server port (default: 5000) |
| `FRONTEND_URL` | No | CORS origin (default: http://localhost:3000) |
| `CLERK_SECRET_KEY` | Yes | Clerk backend API key |
| `CLERK_PUBLISHABLE_KEY` | No | Clerk frontend key |
| `NODE_ENV` | No | Environment (development/production) |

### Frontend

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | Yes | Backend API URL |
| `VITE_CLERK_PUBLISHABLE_KEY` | Yes | Clerk frontend key |
| `VITE_APP_NAME` | No | Application name |

## Docker Commands

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Stop and remove volumes (deletes database)
docker compose down -v

# Rebuild after code changes
docker compose up -d --build

# Run Prisma migrations
docker compose exec backend npx prisma db push

# Open database GUI
docker compose exec backend npx prisma studio
```

## Getting Clerk API Keys

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com)
2. Create a new application
3. Navigate to **API Keys** in the sidebar
4. Copy the **Publishable Key** and **Secret Key**
5. Add them to your `.env` files

## Troubleshooting

### Database connection fails
- Ensure PostgreSQL is running: `pg_isready -h localhost -p 5432`
- Verify `DATABASE_URL` credentials in `.env`
- Check if the `taskflow` database exists

### Clerk authentication errors
- Verify both publishable and secret keys match
- Check Clerk dashboard for any instance warnings
- Ensure keys are not expired

### Port already in use
- Change ports in `docker-compose.yml` or `.env` files
- Check what's using the port: `netstat -ano | findstr :5000`

### Docker build fails
- Clear Docker cache: `docker system prune -a`
- Rebuild without cache: `docker compose build --no-cache`

## License

MIT © TASKFLOW
