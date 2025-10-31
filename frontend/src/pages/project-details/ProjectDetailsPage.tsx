import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import KanbanBoard from '@/components/board/KanbanBoard';
import EmptyState from '@/components/common/EmptyState';
import ParticipantList from '@/components/participants/ParticipantList';
import { useProjectStore } from '@/store/projectStore';
import { formatDate } from '@/utils/date';
import styles from './ProjectDetailsPage.module.scss';

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, moveTask, toggleTaskModal, setActiveProject } = useProjectStore();

  const project = useMemo(() => projects.find((item) => item.id === projectId), [projects, projectId]);

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
        title={project.name}
        description={`Deadline: ${formatDate(project.dueDate)}`}
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
              <span key={category}>{category}</span>
            ))}
          </div>
        </div>
        <ParticipantList participants={project.members} onInvite={() => navigate('/invitation')} />
      </section>
      <KanbanBoard
        tasks={project.tasks}
        onMoveTask={(taskId, status, index) => moveTask(project.id, taskId, status, index)}
      />
    </div>
  );
};

export default ProjectDetailsPage;
