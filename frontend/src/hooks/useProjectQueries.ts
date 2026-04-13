/**
 * React Query Hooks for Projects
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectSections,
  createSection,
  updateSection,
  deleteSection,
} from '@services/projectService';
import { Project } from '@model/project.types';
import { QueryParams } from '@model/api.types';
import toast from 'react-hot-toast';

export const useProjects = (params?: QueryParams & { team_id?: string }) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: ({ signal }) => getProjects(params, signal).then(res => res.data.data),
    refetchOnMount: 'always',
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: ({ signal }) => getProject(id, signal).then(res => res.data),
    enabled: !!id,
    refetchOnMount: 'always',
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name: string; description?: string; team_id: string; color?: string; start_date?: string; due_date?: string }) =>
      createProject(payload).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'], exact: false });
      queryClient.refetchQueries({ queryKey: ['projects'], exact: false });
      toast.success('Project created successfully');
    },
    onError: (error: any) => {
      const message = error?.message || 'Failed to create project';
      console.error('[Create Project] Error:', error);
      toast.error(message);
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Pick<Project, 'name' | 'description' | 'status' | 'color' | 'start_date' | 'due_date'>> }) =>
      updateProject(id, payload).then(res => res.data),
    onSuccess: (_project: Project) => {
      queryClient.invalidateQueries({ queryKey: ['projects'], exact: false });
      queryClient.refetchQueries({ queryKey: ['projects'], exact: false });
      toast.success('Project updated successfully');
    },
    onError: (error: any) => {
      const message = error?.message || 'Failed to update project';
      console.error('[Update Project] Error:', error);
      toast.error(message);
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProject(id).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'], exact: false });
      queryClient.refetchQueries({ queryKey: ['projects'], exact: false });
      toast.success('Project deleted successfully');
    },
    onError: (error: any) => {
      const message = error?.message || 'Failed to delete project';
      console.error('[Delete Project] Error:', error);
      toast.error(message);
    },
  });
};

export const useProjectSections = (projectId: string) => {
  return useQuery({
    queryKey: ['sections', projectId],
    queryFn: ({ signal }) => getProjectSections(projectId, signal).then(res => res.data),
    enabled: !!projectId,
    refetchOnMount: 'always',
  });
};

export const useCreateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, payload }: { projectId: string; payload: { name: string; position?: number } }) =>
      createSection(projectId, payload).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'], exact: false });
      queryClient.refetchQueries({ queryKey: ['sections'], exact: false });
      toast.success('Section created successfully');
    },
    onError: (error: any) => {
      const message = error?.message || 'Failed to create section';
      console.error('[Create Section] Error:', error);
      toast.error(message);
    },
  });
};

export const useUpdateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionId, payload }: { sectionId: string; payload: { name?: string; position?: number } }) =>
      updateSection(sectionId, payload).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'], exact: false });
      queryClient.refetchQueries({ queryKey: ['sections'], exact: false });
      toast.success('Section updated successfully');
    },
    onError: (error: any) => {
      const message = error?.message || 'Failed to update section';
      console.error('[Update Section] Error:', error);
      toast.error(message);
    },
  });
};

export const useDeleteSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sectionId: string) => deleteSection(sectionId).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'], exact: false });
      queryClient.refetchQueries({ queryKey: ['sections'], exact: false });
      toast.success('Section deleted successfully');
    },
    onError: (error: any) => {
      const message = error?.message || 'Failed to delete section';
      console.error('[Delete Section] Error:', error);
      toast.error(message);
    },
  });
};
