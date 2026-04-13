/**
 * TASKFLOW Backend Server
 * Express + PostgreSQL + WebSocket
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import http from 'http';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/error';
import { wsService } from './websocket/websocket.service';

// Import routes
import taskRoutes from './routes/task.routes';
import projectRoutes from './routes/project.routes';
import teamRoutes from './routes/team.routes';
import notificationRoutes from './routes/notification.routes';
import { requireAuth } from './middleware/auth';

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
  credentials: true,
}));
app.use(compression()); // Compress responses
app.use(express.json({ limit: '10mb' })); // Limit request size
app.use(logger);

// Add caching headers for GET requests
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'GET') {
    // Cache for 5 minutes for GET requests
    res.set('Cache-Control', 'public, max-age=300');
  }
  next();
});

// Health check
app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'TASKFLOW API is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'healthy',
    wsClients: wsService.getClientCount(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes (with authentication)
app.use('/api/v1/tasks', requireAuth, taskRoutes);
app.use('/api/v1/projects', requireAuth, projectRoutes);
app.use('/api/v1/teams', requireAuth, teamRoutes);
app.use('/api/v1/notifications', requireAuth, notificationRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: 'The requested route does not exist',
      timestamp: new Date().toISOString(),
    },
  });
});

// Error handler
app.use(errorHandler);

// Initialize WebSocket
wsService.initialize(server);

// Start server
server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   TASKFLOW Backend Server                                ║
║   🚀 Running on http://localhost:${PORT}                  ║
║   📡 API: http://localhost:${PORT}/api/v1                 ║
║   🔌 WebSocket: ws://localhost:${PORT}                    ║
║   🏥 Health: http://localhost:${PORT}/health              ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
