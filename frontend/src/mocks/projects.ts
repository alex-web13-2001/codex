import type { Project, ProjectFile } from '@/types/project';
import type { Task } from '@/types/task';
import type { User } from '@/types/user';

const users: User[] = [
  {
    id: '1',
    email: 'sarah.connor@example.com',
    name: 'Sarah Connor',
    role: 'owner'
  },
  {
    id: '2',
    email: 'ivan.petrov@example.com',
    name: 'Ivan Petrov',
    role: 'member'
  },
  {
    id: '3',
    email: 'amelia.pond@example.com',
    name: 'Amelia Pond',
    role: 'member'
  }
];

const createTask = (overrides: Partial<Task>): Task => ({
  id: crypto.randomUUID(),
  title: 'Design landing page',
  description: 'Revise hero section and add pricing tiers',
  status: 'assigned',
  priority: 'medium',
  dueDate: new Date().toISOString(),
  assignee: users[1],
  tags: [],
  files: [],
  columnId: 'col-1',
  history: [],
  ...overrides
});

const files: ProjectFile[] = [];

export const mockProjects: Project[] = [
  {
    id: 'p-1',
    title: 'Marketing website redesign',
    description: 'Improve conversions and refresh the brand',
    status: 'active',
    color: '#2563EB',
    owner: users[0],
    categories: [],
    tags: ['design'],
    links: [{ title: 'Brief', url: 'https://example.com/brief.pdf' }],
    files,
    members: users,
    tasks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'p-2',
    title: 'Mobile app launch',
    description: 'Prepare onboarding flow and release assets',
    status: 'active',
    color: '#22C55E',
    owner: users[0],
    categories: [],
    tags: ['mobile'],
    links: [{ title: 'Roadmap', url: 'https://example.com/roadmap' }],
    files,
    members: users,
    tasks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockTasks: Record<string, Task[]> = {
  'p-1': [
    createTask({ status: 'assigned', title: 'Collect inspiration shots', columnId: 'assigned' }),
    createTask({ status: 'in_progress', title: 'Implement new hero section', columnId: 'in_progress' }),
    createTask({ status: 'done', title: 'QA the about page', columnId: 'done' })
  ],
  'p-2': [createTask({ status: 'assigned', title: 'Beta test feedback review', columnId: 'assigned' })]
};

export const mockUsers = users;

mockProjects[0].tasks = mockTasks['p-1'];
mockProjects[1].tasks = mockTasks['p-2'];
