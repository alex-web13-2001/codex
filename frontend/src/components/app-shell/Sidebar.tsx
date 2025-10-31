import { NavLink } from 'react-router-dom';
import { FiArchive, FiGrid, FiLayers, FiLogIn, FiSettings, FiUser, FiUsers } from 'react-icons/fi';
import styles from './Sidebar.module.scss';
import { useUIStore } from '@/store/uiStore';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <FiGrid /> },
  { to: '/projects', label: 'Projects', icon: <FiLayers /> },
  { to: '/tasks', label: 'My Tasks', icon: <FiUser /> },
  { to: '/catalogs', label: 'Catalogs', icon: <FiUsers /> },
  { to: '/archive', label: 'Archive', icon: <FiArchive /> },
  { to: '/profile', label: 'Profile', icon: <FiSettings /> },
  { to: '/auth/login', label: 'Auth', icon: <FiLogIn /> }
];

const Sidebar = () => {
  const closeSidebar = useUIStore((state) => state.closeSidebar);

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <span role="img" aria-label="logo">
          🚀
        </span>
        FlowPilot
      </div>
      <div className={styles.navSection}>
        <span className={styles.sectionLabel}>Navigation</span>
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
            onClick={closeSidebar}
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </div>
      <div className={styles.footer}>
        Manage everything in one place. Track progress, collaborate and deliver on time.
      </div>
    </div>
  );
};

export default Sidebar;
