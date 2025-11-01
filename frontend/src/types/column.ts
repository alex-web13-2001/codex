import type { ID } from './common';

export type ColumnScope = 'project' | 'personal';

export interface Column {
  id: ID;
  title: string;
  key?: string;
  order: number;
  scope: ColumnScope;
  project?: ID;
  owner?: ID;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}
