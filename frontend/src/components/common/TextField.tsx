import { InputHTMLAttributes } from 'react';
import styles from './TextField.module.scss';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

const TextField = ({ label, hint, error, ...props }: TextFieldProps) => (
  <label className={styles.field}>
    <span>{label}</span>
    <input {...props} aria-invalid={Boolean(error)} />
    {hint && !error ? <small>{hint}</small> : null}
    {error ? (
      <small role="alert" className={styles.error}>
        {error}
      </small>
    ) : null}
  </label>
);

export default TextField;
