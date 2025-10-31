import { ReactNode } from 'react';
import useInfiniteLoader from '@/hooks/useInfiniteLoader';
import styles from './InfiniteTable.module.scss';

interface InfiniteTableProps<T> {
  columns: { key: keyof T; header: ReactNode; render?: (row: T) => ReactNode }[];
  rows: T[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  emptyState?: ReactNode;
}

const InfiniteTable = <T extends Record<string, unknown>>({
  columns,
  rows,
  isLoading,
  hasMore,
  loadMore,
  emptyState
}: InfiniteTableProps<T>) => {
  const sentinelRef = useInfiniteLoader({ hasMore, isLoading, onLoadMore: loadMore });

  return (
    <div className={styles.wrapper}>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key as string}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id as string}>
              {columns.map((column) => (
                <td key={column.key as string}>
                  {column.render ? column.render(row) : (row[column.key] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && !isLoading ? emptyState : null}
      <div ref={sentinelRef} />
      {isLoading ? <div className={styles.loader}>Loading…</div> : null}
    </div>
  );
};

export default InfiniteTable;
