import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Button.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

const Button = ({ variant = 'primary', loading, className, children, ...props }: ButtonProps) => (
  <button className={clsx(styles.button, styles[variant], className)} {...props}>
    {loading ? <span className={styles.spinner} /> : null}
    <span>{children}</span>
  </button>
);

export default Button;
