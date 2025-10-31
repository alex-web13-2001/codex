import { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './AppShell.module.scss';
import Header from './Header';
import Sidebar from './Sidebar';
import { useUIStore } from '@/store/uiStore';

interface AppShellProps {
  children: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);

  return (
    <div className={styles.appShell}>
      <aside
        className={clsx(styles.sidebar, {
          [styles.sidebarClosed]: !isSidebarOpen
        })}
      >
        <Sidebar />
      </aside>
      <header className={styles.header}>
        <Header />
      </header>
      <main className={styles.content}>{children}</main>
    </div>
  );
};

export default AppShell;
