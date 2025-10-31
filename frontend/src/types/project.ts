import type { ID } from './common';
import type { User } from './user';
import type { Task } from './task';

export type ProjectStatus = 'active' | 'archived' | 'completed';

export interface Project {
  id: ID;
  name: string;
  description?: string;
  status: ProjectStatus;
  dueDate?: string;
  members: User[];
  categories: string[];
  tasks: Task[];
}
