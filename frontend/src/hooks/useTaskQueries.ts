/**
 * React Query Hooks for Tasks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getTaskComments,
  createComment,
  updateComment,
  deleteComment,
} from '@services/taskService';
import { Task, Comment, CreateTaskRequest, UpdateTaskRequest } from '@model/task.types';
import { QueryParams } from '@model/api.types';
import toast from 'react-hot-toast';

export const useTasks = (params?: QueryParams & {
  project_id?: string;
  section_id?: string;
  assignee_id?: string;
  status?: string;
  priority?: string;
}) => {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: ({ signal }) => getTasks(params, signal).then(res => res.data.data),
    refetchOnMount: 'always',
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: ({ signal }) => getTask(id, signal).then(res => res.data),
    enabled: !!id,
    refetchOnMount: 'always',
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskRequest) =>
      createTask(payload).then(res => res.data),
    onSuccess: (_task: Task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'], exact: false });
      queryClient.refetchQueries({ queryKey: ['tasks'], exact: false });
      toast.success('Task created successfully');
    },
    onError: (error: any) => {
      const message = error?.message || 'Failed to create task';
      console.error('[Create Task] Error:', error);
      toast.error(message);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTaskRequest }) =>
      updateTask(id, payload).then(res => res.data),
    onSuccess: (_task: Task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'], exact: false });
      queryClient.refetchQueries({ queryKey: ['tasks'], exact: false });
      toast.success('Task updated successfully');
    },
    onError: (error: any) => {
      const message = error?.message || 'Failed to update task';
      console.error('[Update Task] Error:', error);
      toast.error(message);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTask(id).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'], exact: false });
      queryClient.refetchQueries({ queryKey: ['tasks'], exact: false });
      toast.success('Task deleted successfully');
    },
    onError: (error: any) => {
      const message = error?.message || 'Failed to delete task';
      console.error('[Delete Task] Error:', error);
      toast.error(message);
    },
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Task['status'] }) =>
      updateTaskStatus(id, status).then(res => res.data),
    onSuccess: (_task: Task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'], exact: false });
      queryClient.refetchQueries({ queryKey: ['tasks'], exact: false });
      toast.success('Task status updated');
    },
    onError: (error: any) => {
      const message = error?.message || 'Failed to update task status';
      console.error('[Update Task Status] Error:', error);
      toast.error(message);
    },
  });
};

// Comments
export const useTaskComments = (taskId: string) => {
  return useQuery({
    queryKey: ['comments', taskId],
    queryFn: ({ signal }) => getTaskComments(taskId, undefined, signal).then(res => res.data.data),
    enabled: !!taskId,
    refetchOnMount: 'always',
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: { content: string; parent_comment_id?: string } }) =>
      createComment(taskId, payload).then(res => res.data),
    onSuccess: (_comment: Comment) => {
      queryClient.invalidateQueries({ queryKey: ['comments'], exact: false });
      queryClient.refetchQueries({ queryKey: ['comments'], exact: false });
      toast.success('Comment added');
    },
    onError: (error: any) => {
      const message = error?.message || 'Failed to add comment';
      console.error('[Create Comment] Error:', error);
      toast.error(message);
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, payload }: { commentId: string; payload: { content: string } }) =>
      updateComment(commentId, payload).then(res => res.data),
    onSuccess: (_comment: Comment) => {
      queryClient.invalidateQueries({ queryKey: ['comments'], exact: false });
      queryClient.refetchQueries({ queryKey: ['comments'], exact: false });
      toast.success('Comment updated');
    },
    onError: (error: any) => {
      const message = error?.message || 'Failed to update comment';
      console.error('[Update Comment] Error:', error);
      toast.error(message);
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'], exact: false });
      queryClient.refetchQueries({ queryKey: ['comments'], exact: false });
      toast.success('Comment deleted');
    },
    onError: (error: any) => {
      const message = error?.message || 'Failed to delete comment';
      console.error('[Delete Comment] Error:', error);
      toast.error(message);
    },
  });
};
