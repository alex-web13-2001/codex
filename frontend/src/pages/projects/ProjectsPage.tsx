import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import FilterBar from '@/components/filters/FilterBar';
import InfiniteTable from '@/components/table/InfiniteTable';
import EmptyState from '@/components/common/EmptyState';
import { useProjectStore } from '@/store/projectStore';
import { useCatalogStore } from '@/store/catalogStore';
import { formatDate } from '@/utils/date';
import styles from './ProjectsPage.module.scss';
import { useNavigate } from 'react-router-dom';

const statusFilters = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Archived', value: 'archived' }
] as const;

type StatusFilter = (typeof statusFilters)[number]['value'];

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { projects, toggleProjectModal, setActiveProject } = useProjectStore();
  const { categories } = useCatalogStore();
  const [status, setStatus] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);

  const filteredProjects = projects.filter((project) => status === 'all' || project.status === status);
  const paginatedProjects = filteredProjects.slice(0, page * 10);
  const hasMore = paginatedProjects.length < filteredProjects.length;

  return (
    <div className={styles.projects}>
      <PageHeader
        title="Projects"
        description="All projects and workstreams in one place."
        actions={
          <Button type="button" onClick={() => toggleProjectModal(true)}>
            New project
          </Button>
        }
      />
      <div className={styles.toolbar}>
        <FilterBar label="Status" options={statusFilters} value={status} onChange={setStatus} />
        <div className={styles.categories}>
          {categories.map((category) => (
            <span key={category}>{category}</span>
          ))}
        </div>
      </div>
      <InfiniteTable
        columns={[
          {
            key: 'title',
            header: 'Project',
            render: (project) => (
              <div>
                <strong>{project.title}</strong>
                <p className="muted">{project.description}</p>
              </div>
            )
          },
          {
            key: 'owner',
            header: 'Owner',
            render: (project) => project.owner?.name ?? '—'
          },
          {
            key: 'status',
            header: 'Status',
            render: (project) => <span className={`badge badge-${project.status}`}>{project.status}</span>
          },
          {
            key: 'updatedAt',
            header: 'Updated',
            render: (project) => formatDate(project.updatedAt)
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (project) => (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setActiveProject(project.id);
                  navigate(`/projects/${project.id}`);
                }}
              >
                Open
              </Button>
            )
          }
        ]}
        rows={paginatedProjects as never}
        isLoading={false}
        hasMore={hasMore}
        loadMore={() => setPage((prev) => prev + 1)}
        emptyState={<EmptyState title="No projects" description="Create a project to get started." />}
      />
    </div>
  );
};

export default ProjectsPage;
