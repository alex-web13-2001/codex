import { ReactNode } from 'react';
import styles from './EmptyState.module.scss';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className={styles.emptyState}>
    {icon ? <div className={styles.icon}>{icon}</div> : null}
    <h3>{title}</h3>
    {description ? <p>{description}</p> : null}
    {action ? <div className={styles.action}>{action}</div> : null}
  </div>
);

export default EmptyState;
