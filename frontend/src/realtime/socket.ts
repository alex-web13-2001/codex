import { io, Socket } from 'socket.io-client';
import { useProjectStore } from '@/store/projectStore';
import type { Project } from '@/types/project';
import type { Task } from '@/types/task';

let socket: Socket | null = null;

type TaskMovedPayload = {
  projectId: string;
  taskId: string;
  status: Task['status'];
  index: number;
};

type ProjectPayload = Project;

type TaskPayload = {
  projectId: string;
  task: Task;
};

export const getSocket = () => {
  if (!socket) {
    socket = io('/', {
      transports: ['websocket']
    });

    socket.on('task:moved', ({ projectId, taskId, status, index }: TaskMovedPayload) => {
      useProjectStore.getState().moveTask(projectId, taskId, status, index);
    });

    socket.on('project:updated', (project: ProjectPayload) => {
      useProjectStore.getState().upsertProject(project);
    });

    socket.on('task:updated', ({ projectId, task }: TaskPayload) => {
      const store = useProjectStore.getState();
      const project = store.projects.find((item) => item.id === projectId);
      if (!project) return;
      const existingTasks = project.tasks ?? [];
      const tasks = existingTasks.some((item) => item.id === task.id)
        ? existingTasks.map((item) => (item.id === task.id ? task : item))
        : [...existingTasks, task];
      store.upsertProject({ ...project, tasks });
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
