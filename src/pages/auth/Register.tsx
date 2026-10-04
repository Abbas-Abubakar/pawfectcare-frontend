import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { authApi } from '../../api/auth.api';
import type { UserRole } from '../../types';

const ROLE_OPTIONS: { value: UserRole; label: string; emoji: string }[] = [
  { value: 'pet_owner', label: 'Pet Owner', emoji: '🐾' },
  { value: 'veterinarian', label: 'Veterinarian', emoji: '🩺' },
  { value: 'shelter_admin', label: 'Shelter Admin', emoji: '🏠' },
];

export const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: '' as UserRole | '',
  });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      navigate('/auth/verify-otp', { state: { email: data.email } });
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.role) {
      setError('Please choose what best describes you.');
      return;
    }

    mutation.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      password: form.password,
      role: form.role,
    });
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-ink">Let's get started</h1>
      <p className="mt-2 text-ink/60">Create your account in less than a minute.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="name" className="form-label">
            Full name
          </label>
          <input
            id="name"
            type="text"
            required
            className="input-field"
            placeholder="Amaka Johnson"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

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
          <label htmlFor="phone" className="form-label">
            Phone <span className="font-normal text-ink/40">(optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            className="input-field"
            placeholder="+234 801 234 5678"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            className="input-field"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div>
          <span className="form-label">I am a...</span>
          <div className="grid grid-cols-3 gap-2">
            {ROLE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setForm({ ...form, role: option.value })}
                className={`flex flex-col items-center gap-1 rounded-2xl border-2 px-2 py-3 text-xs font-medium transition-all ${
                  form.role === option.value
                    ? 'border-coral bg-coral-light text-coral-dark'
                    : 'border-ink/10 bg-white text-ink/60 hover:border-ink/20'
                }`}
              >
                <span className="text-xl">{option.emoji}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={mutation.isPending} className="btn-primary w-full">
          {mutation.isPending ? 'Creating your account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        Already have an account?{' '}
        <Link to="/auth/login" className="font-semibold text-coral hover:text-coral-dark">
          Log in
        </Link>
      </p>
    </>
  );
};