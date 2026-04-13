/**
 * WebSocket Service for real-time updates
 * Broadcasts changes to connected clients
 */

import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';

type WSMessage = {
  type: string;
  resource: string;
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: string;
};

class WebSocketService {
  private wss: WebSocketServer | null = null;
  private clients: Set<WebSocket> = new Set();

  initialize(server: any) {
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      console.log(`WebSocket client connected. Total: ${this.clients.size + 1}`);
      this.clients.add(ws);

      ws.on('close', () => {
        this.clients.delete(ws);
        console.log(`WebSocket client disconnected. Total: ${this.clients.size}`);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });

      // Handle incoming messages (ping/pong, subscriptions)
      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message.toString());
          if (data.type === 'ping') {
            ws.send(JSON.stringify({ type: 'pong' }));
          }
        } catch (e) {
          // Ignore invalid messages
        }
      });
    });

    console.log('WebSocket server initialized');
  }

  broadcast(message: WSMessage, excludeWs?: WebSocket) {
    const messageStr = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  // Resource-specific broadcast helpers
  broadcastTaskUpdate(action: 'create' | 'update' | 'delete', data: any, excludeWs?: WebSocket) {
    this.broadcast({
      type: 'realtime',
      resource: 'task',
      action,
      data,
      timestamp: new Date().toISOString(),
    }, excludeWs);
  }

  broadcastProjectUpdate(action: 'create' | 'update' | 'delete', data: any, excludeWs?: WebSocket) {
    this.broadcast({
      type: 'realtime',
      resource: 'project',
      action,
      data,
      timestamp: new Date().toISOString(),
    }, excludeWs);
  }

  broadcastTeamUpdate(action: 'create' | 'update' | 'delete', data: any, excludeWs?: WebSocket) {
    this.broadcast({
      type: 'realtime',
      resource: 'team',
      action,
      data,
      timestamp: new Date().toISOString(),
    }, excludeWs);
  }

  broadcastNotificationCreate(data: any, excludeWs?: WebSocket) {
    this.broadcast({
      type: 'realtime',
      resource: 'notification',
      action: 'create',
      data,
      timestamp: new Date().toISOString(),
    }, excludeWs);
  }

  broadcastCommentCreate(data: any, excludeWs?: WebSocket) {
    this.broadcast({
      type: 'realtime',
      resource: 'comment',
      action: 'create',
      data,
      timestamp: new Date().toISOString(),
    }, excludeWs);
  }

  getClientCount() {
    return this.clients.size;
  }
}

export const wsService = new WebSocketService();
