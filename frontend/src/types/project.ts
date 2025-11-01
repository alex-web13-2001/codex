import type { ID } from './common';
import type { User } from './user';
import type { Category } from './category';

export type ProjectStatus = 'active' | 'archived';

export interface ProjectLink {
  title: string;
  url: string;
}

export interface ProjectFile {
  id: ID;
  originalName: string;
  url: string;
  size: number;
  createdAt: string;
}

export interface Project {
  id: ID;
  title: string;
  description?: string;
  color: string;
  status: ProjectStatus;
  owner: Pick<User, 'id' | 'name' | 'email' | 'avatarUrl'>;
  categories: Category[];
  tags: string[];
  links: ProjectLink[];
  files: ProjectFile[];
  members?: User[];
  tasks?: import('./task').Task[];
  createdAt?: string;
  updatedAt?: string;
}
