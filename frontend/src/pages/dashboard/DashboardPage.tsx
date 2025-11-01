import { useEffect } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import KanbanBoard from '@/components/board/KanbanBoard';
import ParticipantList from '@/components/participants/ParticipantList';
import EmptyState from '@/components/common/EmptyState';
import { useProjectStore } from '@/store/projectStore';
import { useAuthStore } from '@/store/authStore';
import { mockProjects } from '@/mocks/projects';
import { fetchProjects } from '@/api/projects';
import { fetchProjectTasks } from '@/api/tasks';
import styles from './DashboardPage.module.scss';
import { disconnectSocket, getSocket } from '@/realtime/socket';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '@/store/uiStore';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projects, setProjects, toggleProjectModal, toggleTaskModal, moveTask, setActiveProject } =
    useProjectStore();
  const setUser = useAuthStore((state) => state.setUser);
  const openSidebar = useUIStore((state) => state.openSidebar);

  useEffect(() => {
    openSidebar();
  }, [openSidebar]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        if (!data.length) {
          setProjects([]);
          setActiveProject(null);
          setUser(null);
          return;
        }

        const [firstProject, ...rest] = data;
        const tasks = await fetchProjectTasks(firstProject.id);
        const enriched = [{ ...firstProject, tasks }, ...rest];
        setProjects(enriched);
        setActiveProject(firstProject.id);
        setUser(firstProject.members?.[0] ?? null);
      } catch (error) {
        console.warn('Falling back to mocked projects', error);
        setProjects(mockProjects);
        setActiveProject(mockProjects[0]?.id ?? null);
        setUser(mockProjects[0]?.members?.[0] ?? null);
      }
    };
    void loadProjects();
  }, [setProjects, setActiveProject, setUser]);

  useEffect(() => {
    const socket = getSocket();
    return () => {
      socket.off('task:moved');
      socket.off('project:updated');
      socket.off('task:updated');
      disconnectSocket();
    };
  }, [setUser]);

  const activeProject = projects[0];

  return (
    <div className={styles.dashboard}>
      <PageHeader
        title={t('dashboard')}
        description="Monitor progress, react to changes in real time, and keep your team aligned."
        actions={
          <div className={styles.actions}>
            <Button type="button" variant="secondary" onClick={() => toggleProjectModal(true)}>
              New project
            </Button>
            <Button type="button" onClick={() => toggleTaskModal(true)}>
              New task
            </Button>
          </div>
        }
      />
      {activeProject ? (
        <div className={styles.grid}>
          <section className={styles.boardSection}>
            <header>
              <div>
                <h2>{activeProject.title}</h2>
                <p>{activeProject.description}</p>
              </div>
              <Button type="button" variant="ghost" onClick={() => navigate(`/projects/${activeProject.id}`)}>
                View details
              </Button>
            </header>
            <KanbanBoard
              tasks={activeProject.tasks ?? []}
              onMoveTask={(taskId, status, index) => moveTask(activeProject.id, taskId, status, index)}
            />
          </section>
          <aside className={styles.sidebar}>
            <ParticipantList
              participants={activeProject.members ?? []}
              onInvite={() => navigate('/invitation')}
            />
          </aside>
        </div>
      ) : (
        <EmptyState
          title="No projects yet"
          description="Create your first project to start collaborating."
          action={
            <Button type="button" onClick={() => toggleProjectModal(true)}>
              Create project
            </Button>
          }
        />
      )}
    </div>
  );
};

export default DashboardPage;
