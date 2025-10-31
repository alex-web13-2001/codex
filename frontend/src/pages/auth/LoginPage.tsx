import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthTemplate from '@/components/auth/AuthTemplate';
import TextField from '@/components/common/TextField';
import Button from '@/components/common/Button';
import { useAuthStore } from '@/store/authStore';
import { login as loginRequest } from '@/api/auth';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const [email, setEmail] = useState('sarah.connor@example.com');
  const [password, setPassword] = useState('password');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await loginRequest(email, password);
      setUser(response.user);
      setToken(response.token);
      toast.success('Welcome back!');
    } catch (error) {
      console.warn('Falling back to offline login mode', error);
      const mockUser = {
        id: '1',
        email,
        fullName: 'Sarah Connor',
        role: 'owner' as const,
        locale: 'en'
      };
      setUser(mockUser);
      setToken('mock-token');
      toast.success('Signed in (offline mode)');
    } finally {
      setIsSubmitting(false);
      const redirect = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard';
      navigate(redirect, { replace: true });
    }
  };

  return (
    <AuthTemplate
      title="Sign in"
      subtitle="Track projects, tasks, and collaboration in one place."
      footer={
        <span>
          Don't have an account? <Link to="/auth/register">Create one</Link>
        </span>
      }
    >
      <form className="form-grid" onSubmit={handleSubmit}>
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
          Sign in
        </Button>
        <Button type="button" variant="ghost" onClick={() => navigate('/auth/reset')}>
          Forgot password?
        </Button>
      </form>
    </AuthTemplate>
  );
};

export default LoginPage;
