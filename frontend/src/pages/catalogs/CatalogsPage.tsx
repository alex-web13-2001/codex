import { FormEvent, useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import TextField from '@/components/common/TextField';
import { useCatalogStore } from '@/store/catalogStore';
import styles from './CatalogsPage.module.scss';

const CatalogsPage = () => {
  const { categories, addCategory, removeCategory } = useCatalogStore();
  const [category, setCategory] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!category.trim()) return;
    addCategory(category.trim());
    setCategory('');
  };

  return (
    <div className={styles.catalogs}>
      <PageHeader
        title="Catalogs"
        description="Manage shared labels, categories, and custom fields."
      />
      <section className={styles.create}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="New category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="QA, Backlog, Hiring"
          />
          <Button type="submit">Add category</Button>
        </form>
      </section>
      <ul className={styles.list}>
        {categories.map((item) => (
          <li key={item}>
            <span>{item}</span>
            <Button type="button" variant="ghost" onClick={() => removeCategory(item)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CatalogsPage;
