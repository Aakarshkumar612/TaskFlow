/**
 * React Query Hooks for Teams
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTeams, createTeam, updateTeam, deleteTeam } from '@services/teamService';
import { Team } from '@model/project.types';
import { QueryParams } from '@model/api.types';
import toast from 'react-hot-toast';

export const useTeams = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['teams', params],
    queryFn: ({ signal }) => getTeams(params, signal).then(res => res.data.data),
    refetchOnMount: 'always',
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name: string; description?: string; visibility?: 'public' | 'private' }) =>
      createTeam(payload).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'], exact: false });
      queryClient.refetchQueries({ queryKey: ['teams'], exact: false });
      toast.success('Team created successfully');
    },
    onError: (error: any) => {
      const message = error?.message || 'Failed to create team';
      console.error('[Create Team] Error:', error);
      toast.error(message);
    },
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Pick<Team, 'name' | 'description' | 'visibility'>> }) =>
      updateTeam(id, payload).then(res => res.data),
    onSuccess: (_team: Team) => {
      queryClient.invalidateQueries({ queryKey: ['teams'], exact: false });
      queryClient.refetchQueries({ queryKey: ['teams'], exact: false });
      toast.success('Team updated successfully');
    },
    onError: (error: any) => {
      const message = error?.message || 'Failed to update team';
      console.error('[Update Team] Error:', error);
      toast.error(message);
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTeam(id).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'], exact: false });
      queryClient.refetchQueries({ queryKey: ['teams'], exact: false });
      toast.success('Team deleted successfully');
    },
    onError: (error: any) => {
      const message = error?.message || 'Failed to delete team';
      console.error('[Delete Team] Error:', error);
      toast.error(message);
    },
  });
};
