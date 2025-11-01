import apiClient from './client';
import type { Project } from '@/types/project';
import type { Column } from '@/types/column';

type ProjectsResponse = { projects: Project[] };
type ProjectResponse = { project: Project };
type ColumnsResponse = { columns: Column[] };

export const fetchProjects = async (): Promise<Project[]> => {
  const { data } = await apiClient.get<ProjectsResponse>('/projects');
  return data.projects;
};

export const fetchProject = async (id: string): Promise<Project> => {
  const { data } = await apiClient.get<ProjectResponse>(`/projects/${id}`);
  return data.project;
};

export const fetchProjectColumns = async (id: string): Promise<Column[]> => {
  const { data } = await apiClient.get<ColumnsResponse>(`/projects/${id}/columns`);
  return data.columns;
};

export const upsertProject = async (payload: Partial<Project>): Promise<Project> => {
  if (payload.id) {
    const { data } = await apiClient.patch<ProjectResponse>(`/projects/${payload.id}`, payload);
    return data.project;
  }
  const { data } = await apiClient.post<ProjectResponse>('/projects', payload);
  return data.project;
};
