import { useState } from 'react';
import axios from 'axios';
import { useSubmitContactMessage } from '@/hooks/useContactMessages';
import type { ContactSubmission } from '@/types/contact';

const EMPTY_FORM: ContactSubmission = {
  type: 'contact',
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  availability: '',
};

export const ContactUs = () => {
  const [form, setForm] = useState<ContactSubmission>(EMPTY_FORM);
  const [error, setError] = useState('');

  const mutation = useSubmitContactMessage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Name, email, and message are required.');
      return;
    }

    mutation.mutate(form, {
      onError: (err) => {
        setError(
          axios.isAxiosError(err) ? err.response?.data?.message || 'Something went wrong.' : 'Something went wrong.'
        );
      },
    });
  };

  if (mutation.isSuccess) {
    return (
      <div className="mx-auto mt-16 max-w-md text-center">
        <p className="text-6xl">💌</p>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink">Message sent!</h1>
        <p className="mt-2 text-ink/60">
          Thanks for reaching out — we'll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-center text-3xl font-bold text-ink">Get in touch</h1>
      <p className="mt-2 text-center text-ink/60">
        Questions, feedback, or want to volunteer? We'd love to hear from you.
      </p>

      <div className="mt-8 flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setForm({ ...EMPTY_FORM, type: 'contact' })}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
            form.type === 'contact' ? 'bg-coral text-white' : 'bg-white text-ink/60 hover:bg-cream'
          }`}
        >
          ✉️ General inquiry
        </button>
        <button
          type="button"
          onClick={() => setForm({ ...EMPTY_FORM, type: 'volunteer' })}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
            form.type === 'volunteer' ? 'bg-coral text-white' : 'bg-white text-ink/60 hover:bg-cream'
          }`}
        >
          🙋 Volunteer with us
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-4xl bg-white p-6">
        <div>
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            className="input-field"
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
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        {form.type === 'contact' ? (
          <div>
            <label htmlFor="subject" className="form-label">
              Subject <span className="font-normal text-ink/40">(optional)</span>
            </label>
            <input
              id="subject"
              type="text"
              className="input-field"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
          </div>
        ) : (
          <div>
            <label htmlFor="availability" className="form-label">
              Your availability <span className="font-normal text-ink/40">(optional)</span>
            </label>
            <input
              id="availability"
              type="text"
              placeholder="Weekends, 2-3 hrs"
              className="input-field"
              value={form.availability}
              onChange={(e) => setForm({ ...form, availability: e.target.value })}
            />
          </div>
        )}

        <div>
          <label htmlFor="message" className="form-label">
            {form.type === 'volunteer' ? 'Tell us why you want to volunteer' : 'Message'}
          </label>
          <textarea
            id="message"
            required
            rows={4}
            className="input-field resize-none"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </div>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={mutation.isPending} className="btn-primary w-full">
          {mutation.isPending ? 'Sending...' : 'Send message'}
        </button>
      </form>
    </div>
  );
};