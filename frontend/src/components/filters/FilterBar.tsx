import { ChangeEvent } from 'react';
import styles from './FilterBar.module.scss';

export interface FilterOption<T extends string> {
  label: string;
  value: T;
}

interface FilterBarProps<T extends string> {
  label: string;
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

const FilterBar = <T extends string>({ label, options, value, onChange }: FilterBarProps<T>) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as T);
  };

  return (
    <div className={styles.filterBar}>
      <label>
        <span>{label}</span>
        <select value={value} onChange={handleChange}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default FilterBar;
