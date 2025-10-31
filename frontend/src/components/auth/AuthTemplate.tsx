import { ReactNode } from 'react';
import styles from './AuthTemplate.module.scss';

interface AuthTemplateProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const AuthTemplate = ({ title, subtitle, children, footer }: AuthTemplateProps) => (
  <div className={styles.wrapper}>
    <div className={styles.card}>
      <header>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </header>
      <div className={styles.body}>{children}</div>
      {footer ? <footer>{footer}</footer> : null}
    </div>
  </div>
);

export default AuthTemplate;
