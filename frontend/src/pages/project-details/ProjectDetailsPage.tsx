import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import KanbanBoard from '@/components/board/KanbanBoard';
import EmptyState from '@/components/common/EmptyState';
import ParticipantList from '@/components/participants/ParticipantList';
import { useProjectStore } from '@/store/projectStore';
import { formatDate } from '@/utils/date';
import styles from './ProjectDetailsPage.module.scss';
import { fetchProjectTasks } from '@/api/tasks';

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, moveTask, toggleTaskModal, setActiveProject, upsertProject } = useProjectStore();

  useEffect(() => {
    if (projectId) {
      setActiveProject(projectId);
    }
  }, [projectId, setActiveProject]);

  const project = useMemo(() => projects.find((item) => item.id === projectId), [projects, projectId]);

  useEffect(() => {
    if (!project) {
      return;
    }
    if (project.tasks && project.tasks.length > 0) {
      return;
    }
    let isCancelled = false;
    const loadTasks = async () => {
      try {
        const tasks = await fetchProjectTasks(project.id);
        if (!isCancelled) {
          upsertProject({ ...project, tasks });
        }
      } catch (error) {
        if (!isCancelled) {
          console.warn('Unable to load project tasks', error);
        }
      }
    };
    void loadTasks();
    return () => {
      isCancelled = true;
    };
  }, [project, upsertProject]);

  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        description="This project may have been archived or deleted."
        action={<Button onClick={() => navigate('/projects')}>Back to projects</Button>}
      />
    );
  }

  return (
    <div className={styles.details}>
      <PageHeader
        title={project.title}
        description={`Updated ${formatDate(project.updatedAt)}`}
        actions={
          <Button
            type="button"
            onClick={() => {
              setActiveProject(project.id);
              toggleTaskModal(true);
            }}
          >
            New task
          </Button>
        }
      />
      <section className={styles.meta}>
        <div>
          <h3>Overview</h3>
          <p>{project.description}</p>
          <div className={styles.categories}>
            {project.categories.map((category) => (
              <span key={category.id}>{category.title}</span>
            ))}
          </div>
        </div>
        <ParticipantList participants={project.members ?? []} onInvite={() => navigate('/invitation')} />
      </section>
      <KanbanBoard
        tasks={project.tasks ?? []}
        onMoveTask={(taskId, status, index) => moveTask(project.id, taskId, status, index)}
      />
    </div>
  );
};

export default ProjectDetailsPage;
