import type { ID } from './common';
import type { User } from './user';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface TaskComment {
  id: ID;
  author: User;
  message: string;
  createdAt: string;
}

export interface TaskHistoryEntry {
  id: ID;
  actor: User;
  action: string;
  createdAt: string;
}

export interface TaskFile {
  id: ID;
  name: string;
  url?: string;
  progress?: number;
  size: number;
}

export interface Task {
  id: ID;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
  assignees: User[];
  comments: TaskComment[];
  history: TaskHistoryEntry[];
  files: TaskFile[];
  category?: string;
  projectId?: ID;
}
