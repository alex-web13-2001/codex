import type { ID } from './common';

export type UserRole = 'owner' | 'collaborator' | 'member' | 'viewer';

export interface User {
  id: ID;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  locale?: string;
}
