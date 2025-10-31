import type { Project } from '@/types/project';
import type { Task } from '@/types/task';
import type { User } from '@/types/user';

const users: User[] = [
  {
    id: '1',
    email: 'sarah.connor@example.com',
    fullName: 'Sarah Connor',
    role: 'owner',
    locale: 'en'
  },
  {
    id: '2',
    email: 'ivan.petrov@example.com',
    fullName: 'Ivan Petrov',
    role: 'member',
    locale: 'ru'
  },
  {
    id: '3',
    email: 'amelia.pond@example.com',
    fullName: 'Amelia Pond',
    role: 'member',
    locale: 'en'
  }
];

const createTask = (overrides: Partial<Task>): Task => ({
  id: crypto.randomUUID(),
  title: 'Design landing page',
  description: 'Revise hero section and add pricing tiers',
  status: 'todo',
  dueDate: new Date().toISOString(),
  assignees: [users[1]],
  comments: [],
  history: [],
  files: [],
  ...overrides
});

export const mockProjects: Project[] = [
  {
    id: 'p-1',
    name: 'Marketing website redesign',
    description: 'Improve conversions and refresh the brand',
    status: 'active',
    dueDate: new Date().toISOString(),
    members: users,
    categories: ['Design', 'Marketing'],
    tasks: [
      createTask({ status: 'todo', title: 'Collect inspiration shots' }),
      createTask({ status: 'in_progress', title: 'Implement new hero section' }),
      createTask({ status: 'review', title: 'QA the about page' }),
      createTask({ status: 'done', title: 'Set up analytics goals' })
    ]
  },
  {
    id: 'p-2',
    name: 'Mobile app launch',
    description: 'Prepare onboarding flow and release assets',
    status: 'active',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    members: users,
    categories: ['Development'],
    tasks: [
      createTask({ status: 'todo', title: 'Beta test feedback review' }),
      createTask({ status: 'in_progress', title: 'Integrate push notifications' })
    ]
  }
];
