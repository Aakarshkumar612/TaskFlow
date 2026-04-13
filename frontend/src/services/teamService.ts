/**
 * Team Service
 * 
 * Handles all team-related API calls.
 */

import api from './api';
import { ApiResponse, PaginatedResponse, QueryParams } from '@model/api.types';
import { Team, TeamMember } from '@model/project.types';

/**
 * Get all teams for current user
 */
export async function getTeams(
  params?: QueryParams,
  signal?: AbortSignal,
): Promise<ApiResponse<PaginatedResponse<Team>>> {
  const { data } = await api.get<ApiResponse<PaginatedResponse<Team>>>('/teams', {
    params,
    signal,
  });
  return data;
}

/**
 * Get single team by ID
 */
export async function getTeam(
  id: string,
  signal?: AbortSignal,
): Promise<ApiResponse<Team>> {
  const { data } = await api.get<ApiResponse<Team>>(`/teams/${id}`, { signal });
  return data;
}

/**
 * Create new team
 */
export async function createTeam(
  payload: { name: string; description?: string; visibility?: 'public' | 'private' },
  signal?: AbortSignal,
): Promise<ApiResponse<Team>> {
  const { data } = await api.post<ApiResponse<Team>>('/teams', payload, { signal });
  return data;
}

/**
 * Update team
 */
export async function updateTeam(
  id: string,
  payload: Partial<Pick<Team, 'name' | 'description' | 'visibility'>>,
  signal?: AbortSignal,
): Promise<ApiResponse<Team>> {
  const { data } = await api.put<ApiResponse<Team>>(`/teams/${id}`, payload, { signal });
  return data;
}

/**
 * Delete team
 */
export async function deleteTeam(
  id: string,
  signal?: AbortSignal,
): Promise<ApiResponse<void>> {
  const { data } = await api.delete<ApiResponse<void>>(`/teams/${id}`, { signal });
  return data;
}

/**
 * Get team members
 */
export async function getTeamMembers(
  teamId: string,
  params?: QueryParams,
  signal?: AbortSignal,
): Promise<ApiResponse<PaginatedResponse<TeamMember>>> {
  const { data } = await api.get<ApiResponse<PaginatedResponse<TeamMember>>>(
    `/teams/${teamId}/members`,
    { params, signal },
  );
  return data;
}

/**
 * Add member to team
 */
export async function addTeamMember(
  teamId: string,
  payload: { user_id: string; role?: 'admin' | 'member' },
  signal?: AbortSignal,
): Promise<ApiResponse<TeamMember>> {
  const { data } = await api.post<ApiResponse<TeamMember>>(
    `/teams/${teamId}/members`,
    payload,
    { signal },
  );
  return data;
}

/**
 * Remove member from team
 */
export async function removeTeamMember(
  teamId: string,
  userId: string,
  signal?: AbortSignal,
): Promise<ApiResponse<void>> {
  const { data } = await api.delete<ApiResponse<void>>(
    `/teams/${teamId}/members/${userId}`,
    { signal },
  );
  return data;
}
