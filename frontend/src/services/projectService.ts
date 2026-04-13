/**
 * Project Service
 * 
 * Handles all project-related API calls.
 */

import api from './api';
import { ApiResponse, PaginatedResponse, QueryParams } from '@model/api.types';
import { Project, ProjectMember, Section } from '@model/project.types';

/**
 * Get all projects
 */
export async function getProjects(
  params?: QueryParams & { team_id?: string },
  signal?: AbortSignal,
): Promise<ApiResponse<PaginatedResponse<Project>>> {
  const { data } = await api.get<ApiResponse<PaginatedResponse<Project>>>('/projects', {
    params,
    signal,
  });
  return data;
}

/**
 * Get single project
 */
export async function getProject(
  id: string,
  signal?: AbortSignal,
): Promise<ApiResponse<Project>> {
  const { data } = await api.get<ApiResponse<Project>>(`/projects/${id}`, { signal });
  return data;
}

/**
 * Create project
 */
export async function createProject(
  payload: {
    name: string;
    description?: string;
    team_id: string;
    color?: string;
    start_date?: string;
    due_date?: string;
  },
  signal?: AbortSignal,
): Promise<ApiResponse<Project>> {
  const { data } = await api.post<ApiResponse<Project>>('/projects', payload, { signal });
  return data;
}

/**
 * Update project
 */
export async function updateProject(
  id: string,
  payload: Partial<Pick<Project, 'name' | 'description' | 'status' | 'color' | 'start_date' | 'due_date'>>,
  signal?: AbortSignal,
): Promise<ApiResponse<Project>> {
  const { data } = await api.put<ApiResponse<Project>>(`/projects/${id}`, payload, { signal });
  return data;
}

/**
 * Delete project
 */
export async function deleteProject(
  id: string,
  signal?: AbortSignal,
): Promise<ApiResponse<void>> {
  const { data } = await api.delete<ApiResponse<void>>(`/projects/${id}`, { signal });
  return data;
}

/**
 * Get project members
 */
export async function getProjectMembers(
  projectId: string,
  params?: QueryParams,
  signal?: AbortSignal,
): Promise<ApiResponse<PaginatedResponse<ProjectMember>>> {
  const { data } = await api.get<ApiResponse<PaginatedResponse<ProjectMember>>>(
    `/projects/${projectId}/members`,
    { params, signal },
  );
  return data;
}

/**
 * Get project sections
 */
export async function getProjectSections(
  projectId: string,
  signal?: AbortSignal,
): Promise<ApiResponse<Section[]>> {
  const { data } = await api.get<ApiResponse<Section[]>>(
    `/projects/${projectId}/sections`,
    { signal },
  );
  return data;
}

/**
 * Create section
 */
export async function createSection(
  projectId: string,
  payload: { name: string; position?: number },
  signal?: AbortSignal,
): Promise<ApiResponse<Section>> {
  const { data } = await api.post<ApiResponse<Section>>(
    `/projects/${projectId}/sections`,
    payload,
    { signal },
  );
  return data;
}

/**
 * Update section
 */
export async function updateSection(
  sectionId: string,
  payload: { name?: string; position?: number },
  signal?: AbortSignal,
): Promise<ApiResponse<Section>> {
  const { data } = await api.put<ApiResponse<Section>>(
    `/sections/${sectionId}`,
    payload,
    { signal },
  );
  return data;
}

/**
 * Delete section
 */
export async function deleteSection(
  sectionId: string,
  signal?: AbortSignal,
): Promise<ApiResponse<void>> {
  const { data } = await api.delete<ApiResponse<void>>(`/sections/${sectionId}`, { signal });
  return data;
}
