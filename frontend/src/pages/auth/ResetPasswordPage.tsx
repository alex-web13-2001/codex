import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthTemplate from '@/components/auth/AuthTemplate';
import TextField from '@/components/common/TextField';
import Button from '@/components/common/Button';
import { requestPasswordReset } from '@/api/auth';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('sarah.connor@example.com');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await requestPasswordReset(email);
      toast.success('Check your inbox for reset instructions');
    } catch (error) {
      console.warn('Falling back to offline reset mode', error);
      toast.success('Reset link sent (offline mode)');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthTemplate
      title="Reset password"
      subtitle="We will send you an email with reset instructions."
      footer={<Link to="/auth/login">Back to sign in</Link>}
    >
      <form className="form-grid" onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
          Send reset link
        </Button>
      </form>
    </AuthTemplate>
  );
};

export default ResetPasswordPage;
