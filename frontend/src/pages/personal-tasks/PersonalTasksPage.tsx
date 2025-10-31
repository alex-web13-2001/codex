import { useEffect, useMemo, useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import FilterBar from '@/components/filters/FilterBar';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';
import { useTaskStore } from '@/store/taskStore';
import { useProjectStore } from '@/store/projectStore';
import { formatDate, isOverdue } from '@/utils/date';
import styles from './PersonalTasksPage.module.scss';

const filters = [
  { label: 'All', value: 'all' },
  { label: 'To Do', value: 'todo' },
  { label: 'In progress', value: 'in_progress' },
  { label: 'In review', value: 'review' },
  { label: 'Done', value: 'done' }
] as const;

type FilterValue = (typeof filters)[number]['value'];

const PersonalTasksPage = () => {
  const { tasks, setTasks, filter, setFilter } = useTaskStore();
  const { projects, toggleTaskModal } = useProjectStore();
  const [page, setPage] = useState(1);

  useEffect(() => {
    const aggregated = projects.flatMap((project) => project.tasks);
    setTasks(aggregated);
  }, [projects, setTasks]);

  const visibleTasks = useMemo(() => {
    const filtered = filter === 'all' ? tasks : tasks.filter((task) => task.status === filter);
    return filtered.slice(0, page * 8);
  }, [filter, page, tasks]);

  const hasMore = useMemo(() => {
    const filteredCount = filter === 'all' ? tasks.length : tasks.filter((task) => task.status === filter).length;
    return visibleTasks.length < filteredCount;
  }, [filter, tasks, visibleTasks.length]);

  return (
    <div className={styles.tasks}>
      <PageHeader
        title="My tasks"
        description="Prioritize your day and keep track of personal responsibilities."
        actions={
          <Button type="button" onClick={() => toggleTaskModal(true)}>
            Add task
          </Button>
        }
      />
      <div className={styles.toolbar}>
        <FilterBar label="Status" options={filters} value={filter as FilterValue} onChange={setFilter as never} />
      </div>
      {visibleTasks.length ? (
        <ul className={styles.list}>
          {visibleTasks.map((task) => (
            <li key={task.id} className={isOverdue(task.dueDate) ? styles.overdue : undefined}>
              <header>
                <h3>{task.title}</h3>
                <span>{formatDate(task.dueDate)}</span>
              </header>
              {task.description ? <p>{task.description}</p> : null}
              <footer>
                <span className={`badge badge-${task.status === 'done' ? 'completed' : 'active'}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </footer>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No tasks" description="You are all caught up for today." />
      )}
      {hasMore ? (
        <Button type="button" variant="secondary" className={styles.loadMore} onClick={() => setPage((prev) => prev + 1)}>
          Load more
        </Button>
      ) : null}
    </div>
  );
};

export default PersonalTasksPage;
