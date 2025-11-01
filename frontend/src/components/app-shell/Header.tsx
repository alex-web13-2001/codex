import { FiBell, FiMenu, FiSearch } from 'react-icons/fi';
import styles from './Header.module.scss';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';

const Header = () => {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const user = useAuthStore((state) => state.user);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((segment) => segment[0])
        .join('')
        .toUpperCase()
    : undefined;

  return (
    <div className={styles.header}>
      <div className={styles.leftSection}>
        <button type="button" className={styles.burger} onClick={toggleSidebar} aria-label="Toggle menu">
          <FiMenu size={22} />
        </button>
        <div className={styles.searchBar}>
          <FiSearch />
          <input type="search" placeholder="Search projects, tasks, people" aria-label="Search" />
        </div>
      </div>
      <div className={styles.actions}>
        <FiBell size={22} aria-label="Notifications" />
        <div className={styles.avatar}>{initials || 'PM'}</div>
      </div>
    </div>
  );
};

export default Header;
