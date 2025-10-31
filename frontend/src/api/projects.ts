import apiClient from './client';
import type { Project } from '@/types/project';
import type { PaginatedResponse } from '@/types/common';

export const fetchProjects = async (page = 1): Promise<PaginatedResponse<Project>> => {
  const { data } = await apiClient.get<PaginatedResponse<Project>>('/projects', {
    params: { page }
  });
  return data;
};

export const fetchProject = async (id: string): Promise<Project> => {
  const { data } = await apiClient.get<Project>(`/projects/${id}`);
  return data;
};

export const upsertProject = async (payload: Partial<Project>): Promise<Project> => {
  const { data } = await apiClient.post<Project>('/projects', payload);
  return data;
};
