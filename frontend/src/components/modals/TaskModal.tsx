import { FormEvent, useEffect, useState } from 'react';
import Modal from './Modal';
import TextField from '@/components/common/TextField';
import Button from '@/components/common/Button';
import useFileManager from '@/hooks/useFileManager';
import { useProjectStore } from '@/store/projectStore';
import { upsertTask } from '@/api/tasks';
import toast from 'react-hot-toast';
import FileUploader from '@/components/files/FileUploader';
import { useTaskStore } from '@/store/taskStore';

const TaskModal = () => {
  const { isTaskModalOpen, toggleTaskModal, activeProjectId, projects, upsertProject } =
    useProjectStore();
  const { files, dropzone, removeFile } = useFileManager();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const upsertTaskInStore = useTaskStore((state) => state.upsertTask);

  useEffect(() => {
    if (!isTaskModalOpen) {
      setTitle('');
      setDescription('');
      setDueDate('');
    }
  }, [isTaskModalOpen]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeProjectId) {
      toast.error('Choose a project first');
      return;
    }
    setIsSubmitting(true);
    try {
      const task = await upsertTask({
        title,
        description,
        dueDate,
        projectId: activeProjectId
      } as never);
      upsertTaskInStore(task);
      const project = projects.find((item) => item.id === activeProjectId);
      if (project) {
        upsertProject({ ...project, tasks: [...project.tasks.filter((item) => item.id !== task.id), task] });
      }
      toast.success(`Task ${task.title} saved`);
      toggleTaskModal(false);
    } catch (error) {
      console.error(error);
      const project = projects.find((item) => item.id === activeProjectId);
      if (project) {
        const fallbackTask = {
          id: crypto.randomUUID(),
          title,
          description,
          status: 'todo' as const,
          dueDate,
          assignees: project.members.slice(0, 1),
          comments: [],
          history: [],
          files: [],
          projectId: activeProjectId
        };
        upsertProject({ ...project, tasks: [...project.tasks, fallbackTask] });
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
        <FileUploader files={files} dropzone={dropzone} onRemove={removeFile} />
        <Button type="submit" loading={isSubmitting} disabled={isSubmitting || !title.trim()}>
          Save task
        </Button>
      </form>
    </Modal>
  );
};

export default TaskModal;
