import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { authApi } from '@/api/auth.api';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => authApi.forgotPassword(email),
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
    mutation.mutate();
  };

  // Once submitted successfully, show a confirmation state instead of the form.
  // Note: our backend deliberately returns the same success message whether or
  // not the email exists (to prevent user enumeration) — so this success view
  // is shown unconditionally on a 200, by design, not just for "real" accounts.
  if (mutation.isSuccess) {
    return (
      <>
        <h1 className="text-3xl font-bold text-ink">Check your inbox 📬</h1>
        <p className="mt-2 text-ink/60">
          If an account exists for <span className="font-semibold text-ink">{email}</span>, we've
          sent a link to reset your password. It expires in 15 minutes.
        </p>

        <Link to="/auth/login" className="btn-primary mt-8 w-full">
          Back to login
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-ink">Forgot your password?</h1>
      <p className="mt-2 text-ink/60">
        No worries — enter your email and we'll send you a reset link.
      </p>

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={mutation.isPending} className="btn-primary w-full">
          {mutation.isPending ? 'Sending...' : 'Send reset link'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        Remembered it?{' '}
        <Link to="/auth/login" className="font-semibold text-coral hover:text-coral-dark">
          Back to login
        </Link>
      </p>
    </>
  );
};