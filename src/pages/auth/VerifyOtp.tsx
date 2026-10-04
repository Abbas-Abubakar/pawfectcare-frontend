import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { OtpInput } from '../../components/OtpInput';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/authStore';
import { getDashboardPath } from '../../utils/roleRedirect';

const RESEND_COOLDOWN_SECONDS = 60;

export const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const email = (location.state as { email?: string })?.email;

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!email) {
      navigate('/auth/register', { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const verifyMutation = useMutation({
    mutationFn: () => authApi.verifyOtp(email!, otp),
    onSuccess: (data) => {
      setUser(data.user);
      navigate(getDashboardPath(data.user.role), { replace: true });
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Invalid code. Please try again.');
      } else {
        setError('Invalid code. Please try again.');
      }
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => authApi.resendOtp(email!),
    onSuccess: () => {
      setResendMessage('A fresh code is on its way to your inbox.');
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setOtp('');
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Could not resend code. Please try again.');
      }
    },
  });

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Enter all 6 digits.');
      return;
    }

    verifyMutation.mutate();
  };

  if (!email) return null;

  return (
    <>
      <h1 className="text-3xl font-bold text-ink">Check your inbox 📬</h1>
      <p className="mt-2 text-ink/60">
        We sent a 6-digit code to <span className="font-semibold text-ink">{email}</span>
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <OtpInput value={otp} onChange={setOtp} />

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        {resendMessage && !error && (
          <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            {resendMessage}
          </p>
        )}

        <button type="submit" disabled={verifyMutation.isPending} className="btn-primary w-full">
          {verifyMutation.isPending ? 'Verifying...' : 'Verify account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        Didn't get a code?{' '}
        {cooldown > 0 ? (
          <span className="text-ink/40">Resend in {cooldown}s</span>
        ) : (
          <button
            type="button"
            onClick={() => resendMutation.mutate()}
            disabled={resendMutation.isPending}
            className="font-semibold text-coral hover:text-coral-dark"
          >
            {resendMutation.isPending ? 'Sending...' : 'Resend code'}
          </button>
        )}
      </p>

      <p className="mt-4 text-center text-sm text-ink/60">
        Wrong email?{' '}
        <Link to="/auth/register" className="font-semibold text-coral hover:text-coral-dark">
          Start over
        </Link>
      </p>
    </>
  );
};