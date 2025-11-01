import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Project } from '@/types/project';
import type { Task, TaskStatus } from '@/types/task';
import type { ID } from '@/types/common';

const STATUS_ORDER: TaskStatus[] = ['assigned', 'in_progress', 'done'];

interface ProjectState {
  projects: Project[];
  activeProjectId: ID | null;
  isProjectModalOpen: boolean;
  isTaskModalOpen: boolean;
  setProjects: (projects: Project[]) => void;
  upsertProject: (project: Project) => void;
  removeProject: (id: ID) => void;
  setActiveProject: (id: ID | null) => void;
  toggleProjectModal: (value?: boolean) => void;
  toggleTaskModal: (value?: boolean) => void;
  moveTask: (projectId: ID, taskId: ID, status: TaskStatus, index?: number) => void;
}

export const useProjectStore = create<ProjectState>()(
  devtools((set) => ({
    projects: [],
    activeProjectId: null,
    isProjectModalOpen: false,
    isTaskModalOpen: false,
    setProjects: (projects) => set({ projects }),
    upsertProject: (project) =>
      set((state) => {
        const exists = state.projects.some((p) => p.id === project.id);
        return {
          projects: exists
            ? state.projects.map((p) => (p.id === project.id ? project : p))
            : [...state.projects, project]
        };
      }),
    removeProject: (id) =>
      set((state) => ({ projects: state.projects.filter((project) => project.id !== id) })),
    setActiveProject: (id) => set({ activeProjectId: id }),
    toggleProjectModal: (value) =>
      set((state) => ({
        isProjectModalOpen: value ?? !state.isProjectModalOpen
      })),
    toggleTaskModal: (value) =>
      set((state) => ({
        isTaskModalOpen: value ?? !state.isTaskModalOpen
      })),
    moveTask: (projectId, taskId, status, index = 0) =>
      set((state) => ({
        projects: state.projects.map((project) => {
          if (project.id !== projectId) return project;

          const tasks = project.tasks ?? [];
          const task = tasks.find((item) => item.id === taskId);
          if (!task) return project;

          const withoutTask = tasks.filter((item) => item.id !== taskId);
          const updatedTask: Task = { ...task, status };

          const grouped = STATUS_ORDER.reduce<Record<TaskStatus, Task[]>>((acc, key) => {
            acc[key] = [];
            return acc;
          }, {} as Record<TaskStatus, Task[]>);

          withoutTask.forEach((item) => {
            grouped[item.status].push(item);
          });

          const column = grouped[status];
          const targetIndex = Math.min(Math.max(index, 0), column.length);
          column.splice(targetIndex, 0, updatedTask);

          const nextTasks = STATUS_ORDER.flatMap((key) => grouped[key]);

          return {
            ...project,
            tasks: nextTasks
          };
        })
      }))
  }))
);
