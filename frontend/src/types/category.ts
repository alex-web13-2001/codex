import type { ID } from './common';

export interface Category {
  id: ID;
  title: string;
  color: string;
  description?: string;
  usageCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
