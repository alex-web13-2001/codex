import PageHeader from '@/components/layout/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';
import { useProjectStore } from '@/store/projectStore';
import { formatDate } from '@/utils/date';
import styles from './ArchivePage.module.scss';

const ArchivePage = () => {
  const { projects, setActiveProject } = useProjectStore();
  const archived = projects.filter((project) => project.status === 'archived');

  return (
    <div className={styles.archive}>
      <PageHeader title="Archive" description="Archived workspaces remain available for reference." />
      {archived.length ? (
        <ul className={styles.list}>
          {archived.map((project) => (
            <li key={project.id}>
              <div>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <span>Archived on {formatDate(project.dueDate)}</span>
              </div>
              <Button type="button" variant="secondary" onClick={() => setActiveProject(project.id)}>
                Restore
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="Nothing archived" description="Projects you archive will show up here." />
      )}
    </div>
  );
};

export default ArchivePage;
