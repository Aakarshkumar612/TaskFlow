/**
 * React Query Hooks for Notifications
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@services/api';
import { Notification } from '@model/task.types';
import { ApiResponse, QueryParams } from '@model/api.types';
import toast from 'react-hot-toast';

export const useNotifications = (params?: QueryParams & { is_read?: string; type?: string }) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: async ({ signal }) => {
      const { data } = await api.get<ApiResponse<{ data: Notification[]; meta: any }>>('/notifications', {
        params,
        signal,
      });
      return data.data.data;
    },
    refetchOnMount: 'always',
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.put<ApiResponse<Notification>>(`/notifications/${id}/read`).then(res => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'], exact: false });
      queryClient.refetchQueries({ queryKey: ['notifications'], exact: false });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.put<ApiResponse<null>>('/notifications/read-all').then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'], exact: false });
      queryClient.refetchQueries({ queryKey: ['notifications'], exact: false });
      toast.success('All notifications marked as read');
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.delete<ApiResponse<null>>(`/notifications/${id}`).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'], exact: false });
      queryClient.refetchQueries({ queryKey: ['notifications'], exact: false });
      toast.success('Notification deleted');
    },
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ count: number }>>('/notifications/unread/count');
      return data.data.count;
    },
    refetchOnMount: 'always',
  });
};
