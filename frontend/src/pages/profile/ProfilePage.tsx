import PageHeader from '@/components/layout/PageHeader';
import TextField from '@/components/common/TextField';
import Button from '@/components/common/Button';
import { useAuthStore } from '@/store/authStore';
import styles from './ProfilePage.module.scss';
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const { user, setUser } = useAuthStore();

  if (!user) {
    return null;
  }

  const handleLocaleChange = (locale: string) => {
    void i18n.changeLanguage(locale);
    setUser({ ...user, locale });
  };

  return (
    <div className={styles.profile}>
      <PageHeader title="Profile" description="Manage your account and personal preferences." />
      <section className={styles.card}>
        <form className="form-grid">
          <TextField label="Full name" value={user.fullName} readOnly />
          <TextField label="Email" type="email" value={user.email} readOnly />
          <label className="textarea-field">
            <span>Language</span>
            <select value={user.locale} onChange={(event) => handleLocaleChange(event.target.value)}>
              <option value="en">English</option>
              <option value="ru">Русский</option>
            </select>
          </label>
          <Button type="button" variant="secondary">
            {t('welcome')}, {user.fullName.split(' ')[0]}!
          </Button>
        </form>
      </section>
    </div>
  );
};

export default ProfilePage;
