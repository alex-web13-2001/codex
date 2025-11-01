import type { ID } from './common';
import type { User } from './user';
import type { Category } from './category';

export type TaskStatus = 'assigned' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskHistoryEntry {
  id: ID;
  type: string;
  actor?: User;
  createdAt: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
}

export interface TaskFile {
  id: ID;
  name: string;
  url: string;
  size: number;
}

export interface Task {
  id: ID;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  deadline?: string;
  assignee?: User;
  author?: User;
  category?: Category;
  tags: string[];
  projectId?: ID;
  columnId: ID;
  archived?: boolean;
  files: TaskFile[];
  history?: TaskHistoryEntry[];
}
