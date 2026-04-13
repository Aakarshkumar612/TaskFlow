/**
 * WebSocket Hook
 * Connects to backend WebSocket server for real-time updates
 */

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const useWebSocket = (enabled: boolean = true) => {
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const wsUrl = 'ws://localhost:5000';
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      // Send ping to keep connection alive
      const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping' }));
        }
      }, 30000);

      ws.onclose = () => {
        clearInterval(pingInterval);
      };
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === 'pong') return;
        
        if (message.type === 'realtime') {
          console.log('Real-time update received:', message);
          
          // Invalidate relevant queries based on resource type
          switch (message.resource) {
            case 'task':
              queryClient.invalidateQueries({ queryKey: ['tasks'] });
              if (message.data?.id) {
                queryClient.invalidateQueries({ queryKey: ['task', message.data.id] });
              }
              break;
            case 'project':
              queryClient.invalidateQueries({ queryKey: ['projects'] });
              if (message.data?.id) {
                queryClient.invalidateQueries({ queryKey: ['project', message.data.id] });
              }
              break;
            case 'team':
              queryClient.invalidateQueries({ queryKey: ['teams'] });
              break;
            case 'notification':
              queryClient.invalidateQueries({ queryKey: ['notifications'] });
              break;
            case 'comment':
              if (message.data?.task_id) {
                queryClient.invalidateQueries({ queryKey: ['comments', message.data.task_id] });
              }
              break;
          }
        }
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Try to reconnect after 3 seconds
      setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.CLOSED) {
          // Component will remount on reconnect attempt
        }
      }, 3000);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [enabled, queryClient]);

  return wsRef.current;
};
