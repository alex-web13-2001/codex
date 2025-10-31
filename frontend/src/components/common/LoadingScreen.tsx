import styles from './LoadingScreen.module.scss';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen = ({ message = 'Loading…' }: LoadingScreenProps) => (
  <div className={styles.wrapper} role="status" aria-live="polite">
    <div className={styles.spinner} />
    <p>{message}</p>
  </div>
);

export default LoadingScreen;
