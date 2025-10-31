import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './KanbanBoard.module.scss';
import type { Task, TaskStatus } from '@/types/task';
import { formatDate, isOverdue } from '@/utils/date';

const STATUSES: { key: TaskStatus; label: string }[] = [
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'review', label: 'In Review' },
  { key: 'done', label: 'Done' }
];

interface KanbanBoardProps {
  tasks: Task[];
  onMoveTask: (taskId: string, status: TaskStatus, index: number) => void;
  onOpenTask?: (task: Task) => void;
}

const KanbanBoard = ({ tasks, onMoveTask, onOpenTask }: KanbanBoardProps) => {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const grouped = STATUSES.map(({ key, label }) => ({
    key,
    label,
    tasks: tasks.filter((task) => task.status === key)
  }));

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return;
    const containerId = over.data.current?.sortable?.containerId as TaskStatus | undefined;
    const overIndex = over.data.current?.sortable?.index as number | undefined;
    if (!containerId || overIndex === undefined) return;
    onMoveTask(active.id.toString(), containerId, overIndex);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className={styles.board}>
        {grouped.map((column) => (
          <SortableContext
            key={column.key}
            id={column.key}
            items={column.tasks.map((task) => task.id)}
            strategy={rectSortingStrategy}
          >
            <section className={styles.column}>
              <header>
                <h3>
                  {column.label} <span>{column.tasks.length}</span>
                </h3>
              </header>
              <div className={styles.cards}>
                {column.tasks.map((task) => (
                  <KanbanCard
                    key={task.id}
                    id={task.id}
                    task={task}
                    onClick={() => onOpenTask?.(task)}
                  />
                ))}
              </div>
            </section>
          </SortableContext>
        ))}
      </div>
    </DndContext>
  );
};

interface KanbanCardProps {
  id: string;
  task: Task;
  onClick?: () => void;
}

const KanbanCard = ({ id, task, onClick }: KanbanCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  } as const;

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={isDragging ? `${styles.card} ${styles.dragging}` : styles.card}
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      <h4>{task.title}</h4>
      {task.description ? <p>{task.description}</p> : null}
      <footer>
        <span className={isOverdue(task.dueDate) ? styles.overdue : undefined}>
          {formatDate(task.dueDate)}
        </span>
        <div className={styles.assignees}>
          {task.assignees.map((assignee) => (
            <span key={assignee.id}>{assignee.fullName.slice(0, 1).toUpperCase()}</span>
          ))}
        </div>
      </footer>
    </article>
  );
};

export default KanbanBoard;
