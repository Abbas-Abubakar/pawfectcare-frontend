import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/authStore';
import { getDashboardPath } from '../../utils/roleRedirect';

export const Login = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => authApi.login(form.email, form.password),
    onSuccess: (data) => {
      setUser(data.user);
      navigate(getDashboardPath(data.user.role), { replace: true });
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || 'Something went wrong. Please try again.';

        // The backend returns this specific message when an account exists
        // but hasn't completed OTP verification yet — redirect them there
        // instead of just showing an error with no path forward.
        if (message.toLowerCase().includes('verify your email')) {
          navigate('/auth/verify-otp', { state: { email: form.email } });
          return;
        }

        setError(message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    },
  });

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    mutation.mutate();
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-ink">Welcome back 👋</h1>
      <p className="mt-2 text-ink/60">Log in to check in on your pets.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="input-field"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <Link to="/auth/forgot-password" className="mb-1.5 text-sm font-semibold text-coral hover:text-coral-dark">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            required
            className="input-field"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={mutation.isPending} className="btn-primary w-full">
          {mutation.isPending ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        New to PawfectCare?{' '}
        <Link to="/auth/register" className="font-semibold text-coral hover:text-coral-dark">
          Create an account
        </Link>
      </p>
    </>
  );
};