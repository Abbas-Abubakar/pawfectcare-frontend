import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/authStore';
import { getDashboardPath } from '@/utils/roleRedirect';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const email = searchParams.get('email') ?? '';
  const token = searchParams.get('token') ?? '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => authApi.resetPassword(email, token, newPassword),
    onSuccess: (data) => {
      setUser(data.user);
      navigate(getDashboardPath(data.user.role), { replace: true });
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    },
  });

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    mutation.mutate();
  };

  // A missing token/email means this page was opened without a valid reset
  // link (e.g. visited directly) — there's nothing meaningful to do here.
  if (!email || !token) {
    return (
      <>
        <h1 className="text-3xl font-bold text-ink">Link not found</h1>
        <p className="mt-2 text-ink/60">
          This reset link looks incomplete or has already been used. Request a new one below.
        </p>
        <Link to="/auth/forgot-password" className="btn-primary mt-8 w-full">
          Request a new link
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-ink">Set a new password</h1>
      <p className="mt-2 text-ink/60">Make it something you'll remember this time.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="newPassword" className="form-label">
            New password
          </label>
          <input
            id="newPassword"
            type="password"
            required
            minLength={8}
            className="input-field"
            placeholder="At least 8 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="form-label">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            className="input-field"
            placeholder="Re-enter your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={mutation.isPending} className="btn-primary w-full">
          {mutation.isPending ? 'Resetting...' : 'Reset password'}
        </button>
      </form>
    </>
  );
};