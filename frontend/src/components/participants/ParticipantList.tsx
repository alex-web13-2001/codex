import { FiPlus } from 'react-icons/fi';
import styles from './ParticipantList.module.scss';
import type { User } from '@/types/user';
import Button from '@/components/common/Button';

interface ParticipantListProps {
  participants: User[];
  onInvite: () => void;
}

const ParticipantList = ({ participants, onInvite }: ParticipantListProps) => (
  <div className={styles.wrapper}>
    <header>
      <h3>Participants</h3>
      <Button type="button" variant="secondary" onClick={onInvite}>
        <FiPlus /> Invite
      </Button>
    </header>
    <ul>
      {participants.map((participant) => (
        <li key={participant.id}>
          <div className={styles.avatar}>{participant.fullName.slice(0, 1).toUpperCase()}</div>
          <div>
            <strong>{participant.fullName}</strong>
            <span>{participant.email}</span>
          </div>
          <span className={styles.role}>{participant.role}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default ParticipantList;
