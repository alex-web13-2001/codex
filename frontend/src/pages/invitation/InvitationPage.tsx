import { FormEvent, useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import TextField from '@/components/common/TextField';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import toast from 'react-hot-toast';
import styles from './InvitationPage.module.scss';

const InvitationPage = () => {
  const [email, setEmail] = useState('');
  const [invited, setInvited] = useState<string[]>([]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;
    setInvited((prev) => [email, ...prev]);
    toast.success(`Invitation sent to ${email}`);
    setEmail('');
  };

  return (
    <div className={styles.invitation}>
      <PageHeader title="Send invitation" description="Invite teammates to collaborate in real time." />
      <form className={styles.form} onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="new.member@company.com"
          required
        />
        <Button type="submit">Send invite</Button>
      </form>
      {invited.length ? (
        <ul className={styles.list}>
          {invited.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No invitations yet" description="Invite your first teammate to start collaborating." />
      )}
    </div>
  );
};

export default InvitationPage;
