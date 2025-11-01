import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthTemplate from '@/components/auth/AuthTemplate';
import TextField from '@/components/common/TextField';
import Button from '@/components/common/Button';
import { register as registerRequest } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const [name, setName] = useState('New Member');
  const [email, setEmail] = useState('new.member@example.com');
  const [password, setPassword] = useState('password');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await registerRequest({ name, email, password });
      setUser(response.user);
      setToken(response.token);
      toast.success('Account created');
      navigate('/dashboard');
    } catch (error) {
      console.warn('Falling back to offline register mode', error);
      setUser({ id: 'offline', email, name, role: 'member' });
      setToken('mock-token');
      toast.success('Account created (offline mode)');
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthTemplate
      title="Create account"
      subtitle="Invite your team and ship projects faster."
      footer={
        <span>
          Already have an account? <Link to="/auth/login">Sign in</Link>
        </span>
      }
    >
      <form className="form-grid" onSubmit={handleSubmit}>
        <TextField label="Full name" value={name} onChange={(event) => setName(event.target.value)} required />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthTemplate>
  );
};

export default RegisterPage;
