/**
 * Task Service
 * 
 * Handles all task-related API calls.
 */

import api from './api';
import { ApiResponse, PaginatedResponse, QueryParams } from '@model/api.types';
import { Task, Comment, CreateTaskRequest, UpdateTaskRequest } from '@model/task.types';

/**
 * Get tasks with filtering
 */
export async function getTasks(
  params?: QueryParams & {
    project_id?: string;
    section_id?: string;
    assignee_id?: string;
    status?: string;
    priority?: string;
  },
  signal?: AbortSignal,
): Promise<ApiResponse<PaginatedResponse<Task>>> {
  const { data } = await api.get<ApiResponse<PaginatedResponse<Task>>>('/tasks', {
    params,
    signal,
  });
  return data;
}

/**
 * Get single task
 */
export async function getTask(
  id: string,
  signal?: AbortSignal,
): Promise<ApiResponse<Task>> {
  const { data } = await api.get<ApiResponse<Task>>(`/tasks/${id}`, { signal });
  return data;
}

/**
 * Create task
 */
export async function createTask(
  payload: CreateTaskRequest,
  signal?: AbortSignal,
): Promise<ApiResponse<Task>> {
  const { data } = await api.post<ApiResponse<Task>>('/tasks', payload, { signal });
  return data;
}

/**
 * Update task
 */
export async function updateTask(
  id: string,
  payload: UpdateTaskRequest,
  signal?: AbortSignal,
): Promise<ApiResponse<Task>> {
  const { data } = await api.put<ApiResponse<Task>>(`/tasks/${id}`, payload, { signal });
  return data;
}

/**
 * Delete task
 */
export async function deleteTask(
  id: string,
  signal?: AbortSignal,
): Promise<ApiResponse<void>> {
  const { data } = await api.delete<ApiResponse<void>>(`/tasks/${id}`, { signal });
  return data;
}

/**
 * Update task status
 */
export async function updateTaskStatus(
  id: string,
  status: Task['status'],
  signal?: AbortSignal,
): Promise<ApiResponse<Task>> {
  const { data } = await api.patch<ApiResponse<Task>>(
    `/tasks/${id}/status`,
    { status },
    { signal },
  );
  return data;
}

/**
 * Assign task to user
 */
export async function assignTask(
  id: string,
  assigneeId: string,
  signal?: AbortSignal,
): Promise<ApiResponse<Task>> {
  const { data } = await api.patch<ApiResponse<Task>>(
    `/tasks/${id}/assignee`,
    { assignee_id: assigneeId },
    { signal },
  );
  return data;
}

/**
 * Unassign task
 */
export async function unassignTask(
  id: string,
  signal?: AbortSignal,
): Promise<ApiResponse<Task>> {
  const { data } = await api.patch<ApiResponse<Task>>(
    `/tasks/${id}/assignee`,
    { assignee_id: null },
    { signal },
  );
  return data;
}

/**
 * Get task comments
 */
export async function getTaskComments(
  taskId: string,
  params?: QueryParams,
  signal?: AbortSignal,
): Promise<ApiResponse<PaginatedResponse<Comment>>> {
  const { data } = await api.get<ApiResponse<PaginatedResponse<Comment>>>(
    `/tasks/${taskId}/comments`,
    { params, signal },
  );
  return data;
}

/**
 * Add comment to task
 */
export async function createComment(
  taskId: string,
  payload: { content: string; parent_comment_id?: string },
  signal?: AbortSignal,
): Promise<ApiResponse<Comment>> {
  const { data } = await api.post<ApiResponse<Comment>>(
    `/tasks/${taskId}/comments`,
    payload,
    { signal },
  );
  return data;
}

/**
 * Update comment
 */
export async function updateComment(
  commentId: string,
  payload: { content: string },
  signal?: AbortSignal,
): Promise<ApiResponse<Comment>> {
  const { data } = await api.put<ApiResponse<Comment>>(
    `/comments/${commentId}`,
    payload,
    { signal },
  );
  return data;
}

/**
 * Delete comment
 */
export async function deleteComment(
  commentId: string,
  signal?: AbortSignal,
): Promise<ApiResponse<void>> {
  const { data } = await api.delete<ApiResponse<void>>(`/comments/${commentId}`, { signal });
  return data;
}
