import { FormEvent, useEffect, useState } from 'react';
import Modal from './Modal';
import TextField from '@/components/common/TextField';
import Button from '@/components/common/Button';
import { useProjectStore } from '@/store/projectStore';
import { useCatalogStore } from '@/store/catalogStore';
import toast from 'react-hot-toast';
import { upsertProject as upsertProjectRequest } from '@/api/projects';

const ProjectModal = () => {
  const { isProjectModalOpen, toggleProjectModal, activeProjectId, projects, upsertProject } =
    useProjectStore();
  const { categories } = useCatalogStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const project = projects.find((item) => item.id === activeProjectId);

  useEffect(() => {
    if (!project) {
      setName('');
      setDescription('');
      setSelectedCategories([]);
      return;
    }
    setName(project.name);
    setDescription(project.description ?? '');
    setSelectedCategories(project.categories);
  }, [project]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        id: project?.id,
        name,
        description,
        categories: selectedCategories
      };
      const response = await upsertProjectRequest(payload);
      upsertProject(response);
      toast.success(`Project ${project ? 'updated' : 'created'} successfully`);
      toggleProjectModal(false);
    } catch (error) {
      console.error(error);
      const fallback = {
        id: project?.id ?? crypto.randomUUID(),
        name,
        description,
        status: project?.status ?? 'active',
        dueDate: project?.dueDate ?? new Date().toISOString(),
        members: project?.members ?? [],
        categories: selectedCategories,
        tasks: project?.tasks ?? []
      };
      upsertProject(fallback);
      toast.success(`Project ${project ? 'updated' : 'created'} (offline mode)`);
      toggleProjectModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={isProjectModalOpen}
      title={project ? 'Update project' : 'Create project'}
      onClose={() => toggleProjectModal(false)}
    >
      <form onSubmit={handleSubmit} className="form-grid">
        <TextField
          label="Project name"
          value={name}
          onChange={(event) => setName(event.target.value)}
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
        <label className="textarea-field">
          <span>Categories</span>
          <div className="chips">
            {categories.map((category) => {
              const active = selectedCategories.includes(category);
              return (
                <button
                  key={category}
                  type="button"
                  className={active ? 'chip chip-active' : 'chip'}
                  onClick={() =>
                    setSelectedCategories((prev) =>
                      prev.includes(category)
                        ? prev.filter((item) => item !== category)
                        : [...prev, category]
                    )
                  }
                >
                  {category}
                </button>
              );
            })}
          </div>
        </label>
        <Button type="submit" loading={isSubmitting} disabled={isSubmitting || !name.trim()}>
          Save project
        </Button>
      </form>
    </Modal>
  );
};

export default ProjectModal;
