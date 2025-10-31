import apiClient from './client';
import type { Task } from '@/types/task';
import type { PaginatedResponse } from '@/types/common';

export const fetchTasks = async (page = 1, status?: string): Promise<PaginatedResponse<Task>> => {
  const { data } = await apiClient.get<PaginatedResponse<Task>>('/tasks', {
    params: { page, status }
  });
  return data;
};

export const upsertTask = async (payload: Partial<Task>): Promise<Task> => {
  const { data } = await apiClient.post<Task>('/tasks', payload);
  return data;
};

export const moveTask = async (taskId: string, status: string, position: number) => {
  await apiClient.post(`/tasks/${taskId}/move`, { status, position });
};
