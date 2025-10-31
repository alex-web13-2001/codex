import type { ID } from './common';

export type UserRole = 'owner' | 'admin' | 'member' | 'guest';

export interface User {
  id: ID;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  locale: string;
}
