import { create } from 'zustand';
import type { Task, TaskHistoryEntry, TaskStatus } from '@/types/task';
import type { ID } from '@/types/common';

interface TaskState {
  tasks: Task[];
  filter: TaskStatus | 'all';
  setTasks: (tasks: Task[]) => void;
  upsertTask: (task: Task) => void;
  removeTask: (id: ID) => void;
  setFilter: (status: TaskStatus | 'all') => void;
  appendHistory: (taskId: ID, entry: TaskHistoryEntry) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  filter: 'all',
  setTasks: (tasks) => set({ tasks }),
  upsertTask: (task) =>
    set((state) => {
      const exists = state.tasks.some((item) => item.id === task.id);
      return {
        tasks: exists
          ? state.tasks.map((item) => (item.id === task.id ? task : item))
          : [...state.tasks, task]
      };
    }),
  removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
  setFilter: (status) => set({ filter: status }),
  appendHistory: (taskId, entry) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, history: [entry, ...task.history] }
          : task
      )
    }))
}));
