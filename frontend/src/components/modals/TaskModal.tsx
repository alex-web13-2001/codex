import { FormEvent, useEffect, useMemo, useState } from 'react';
import Modal from './Modal';
import TextField from '@/components/common/TextField';
import Button from '@/components/common/Button';
import useFileManager from '@/hooks/useFileManager';
import { useProjectStore } from '@/store/projectStore';
import { upsertTask } from '@/api/tasks';
import toast from 'react-hot-toast';
import FileUploader from '@/components/files/FileUploader';
import { useTaskStore } from '@/store/taskStore';
import { fetchProjectColumns } from '@/api/projects';
import type { Column } from '@/types/column';
import type { TaskStatus } from '@/types/task';

const DEFAULT_STATUSES: TaskStatus[] = ['assigned', 'in_progress', 'done'];

const TaskModal = () => {
  const { isTaskModalOpen, toggleTaskModal, activeProjectId, projects, upsertProject } =
    useProjectStore();
  const { files, dropzone, removeFile } = useFileManager();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [columns, setColumns] = useState<Column[]>([]);
  const [columnId, setColumnId] = useState('');
  const upsertTaskInStore = useTaskStore((state) => state.upsertTask);

  const selectedColumn = useMemo(() => columns.find((column) => column.id === columnId), [columns, columnId]);
  const fallbackStatus = useMemo(() => {
    const key = selectedColumn?.key?.toLowerCase();
    return DEFAULT_STATUSES.find((status) => status === key) ?? 'assigned';
  }, [selectedColumn]);

  useEffect(() => {
    if (!isTaskModalOpen) {
      setTitle('');
      setDescription('');
      setDueDate('');
      setColumns([]);
      setColumnId('');
    }
  }, [isTaskModalOpen]);

  useEffect(() => {
    let isCancelled = false;
    const loadColumns = async () => {
      if (!isTaskModalOpen || !activeProjectId) {
        return;
      }
      try {
        const data = await fetchProjectColumns(activeProjectId);
        if (isCancelled) {
          return;
        }
        setColumns(data);
        setColumnId((current) => {
          if (current && data.some((column) => column.id === current)) {
            return current;
          }
          return data[0]?.id ?? '';
        });
      } catch (error) {
        if (!isCancelled) {
          console.error('Unable to load project columns', error);
          toast.error('Failed to load columns');
        }
      }
    };
    void loadColumns();
    return () => {
      isCancelled = true;
    };
  }, [activeProjectId, isTaskModalOpen]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeProjectId) {
      toast.error('Choose a project first');
      return;
    }
    if (!columnId) {
      toast.error('Choose a column');
      return;
    }
    setIsSubmitting(true);
    try {
      const task = await upsertTask({
        title,
        description,
        dueDate: dueDate || undefined,
        projectId: activeProjectId,
        column: columnId
      });
      upsertTaskInStore(task);
      const project = projects.find((item) => item.id === activeProjectId);
      if (project) {
        const existingTasks = project.tasks ?? [];
        upsertProject({
          ...project,
          tasks: [...existingTasks.filter((item) => item.id !== task.id), task]
        });
      }
      toast.success(`Task ${task.title} saved`);
      toggleTaskModal(false);
    } catch (error) {
      console.error(error);
      const project = projects.find((item) => item.id === activeProjectId);
      if (project) {
        const column = columns.find((item) => item.id === columnId) ?? columns[0];
        const fallbackTask = {
          id: crypto.randomUUID(),
          title,
          description,
          status: fallbackStatus,
          dueDate,
          assignee: project.members?.[0],
          history: [],
          files: [],
          projectId: activeProjectId,
          priority: 'medium' as const,
          tags: [],
          columnId: column?.id ?? columnId ?? 'assigned'
        };
        upsertProject({ ...project, tasks: [...(project.tasks ?? []), fallbackTask] });
        upsertTaskInStore(fallbackTask);
        toast.success('Task saved (offline mode)');
        toggleTaskModal(false);
      } else {
        toast.error('Failed to save task');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={isTaskModalOpen} title="Create task" onClose={() => toggleTaskModal(false)}>
      <form onSubmit={handleSubmit} className="form-grid">
        <TextField
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        <label className="textarea-field">
          <span>Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
          />
        </label>
        <TextField
          label="Due date"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />
        <label className="select-field">
          <span>Column</span>
          <select value={columnId} onChange={(event) => setColumnId(event.target.value)} required>
            <option value="" disabled>
              Select column
            </option>
            {columns.map((column) => (
              <option key={column.id} value={column.id}>
                {column.title}
              </option>
            ))}
          </select>
        </label>
        <FileUploader files={files} dropzone={dropzone} onRemove={removeFile} />
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting || !title.trim() || !columnId}
        >
          Save task
        </Button>
      </form>
    </Modal>
  );
};

export default TaskModal;
