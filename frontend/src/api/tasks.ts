import apiClient from './client';
import type { Task, TaskPriority } from '@/types/task';

type TaskListResponse = { tasks: Task[] };
type TaskResponse = { task: Task };

type UpsertTaskPayload = {
  projectId: string;
  id?: string;
  title?: string;
  description?: string;
  dueDate?: string;
  deadline?: string;
  column?: string;
  tags?: string[];
  priority?: TaskPriority;
  assignee?: string;
  category?: string;
  order?: number;
};

export const fetchProjectTasks = async (projectId: string): Promise<Task[]> => {
  const { data } = await apiClient.get<TaskListResponse>(`/projects/${projectId}/tasks`);
  return data.tasks;
};

export const upsertTask = async ({ projectId, id, ...payload }: UpsertTaskPayload): Promise<Task> => {
  if (id) {
    const { data } = await apiClient.patch<TaskResponse>(`/projects/${projectId}/tasks/${id}`, payload);
    return data.task;
  }
  const { data } = await apiClient.post<TaskResponse>(`/projects/${projectId}/tasks`, payload);
  return data.task;
};

export const moveTask = async (projectId: string, taskId: string, columnId: string, order: number) => {
  await apiClient.post(`/projects/${projectId}/tasks/${taskId}/move`, { column: columnId, order });
};
