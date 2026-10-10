import { useState } from 'react';
import { useContactMessages, useUpdateMessageStatus } from '@/hooks/useContactMessages';
import type { ContactMessageType, ContactMessageStatus } from '@/types/contact';
import { PageLoader } from '@/components/PageLoader';

const STATUS_STYLES: Record<ContactMessageStatus, string> = {
  new: 'bg-coral-light text-coral-dark',
  reviewed: 'bg-sunshine/30 text-ink',
  resolved: 'bg-green-100 text-green-700',
};

const TYPE_LABELS: Record<ContactMessageType, string> = {
  contact: '✉️ Contact',
  volunteer: '🙋 Volunteer',
};

export const MessagesPage = () => {
  const [typeFilter, setTypeFilter] = useState<ContactMessageType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ContactMessageStatus | 'all'>('all');

  const { data, isLoading } = useContactMessages({
    type: typeFilter === 'all' ? undefined : typeFilter,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });
  const updateStatus = useUpdateMessageStatus();

  const messages = data?.messages ?? [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">Messages</h1>
      <p className="mt-1 text-ink/60">Contact form and volunteer applications.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {(['all', 'contact', 'volunteer'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              typeFilter === t ? 'bg-ink text-white' : 'bg-white text-ink/60 hover:bg-cream'
            }`}
          >
            {t === 'all' ? 'All types' : TYPE_LABELS[t]}
          </button>
        ))}
        <span className="mx-1 self-center text-ink/20">|</span>
        {(['all', 'new', 'reviewed', 'resolved'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
              statusFilter === s ? 'bg-ink text-white' : 'bg-white text-ink/60 hover:bg-cream'
            }`}
          >
            {s === 'all' ? 'All statuses' : s}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <PageLoader/>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg._id} className="rounded-3xl border-2 border-ink/5 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-ink">
                    {TYPE_LABELS[msg.type]} · {msg.name}
                  </p>
                  <p className="text-sm text-ink/50">
                    {msg.email} {msg.phone && `· ${msg.phone}`}
                  </p>
                </div>
                <select
                  value={msg.status}
                  onChange={(e) => updateStatus.mutate({ id: msg._id, status: e.target.value })}
                  className={`rounded-full border-none px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[msg.status]}`}
                >
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              {msg.subject && <p className="mt-2 text-sm font-medium text-ink">{msg.subject}</p>}
              <p className="mt-1 text-sm text-ink/70">{msg.message}</p>
              {msg.availability && (
                <p className="mt-2 text-xs text-ink/50">Availability: {msg.availability}</p>
              )}
              <p className="mt-2 text-xs text-ink/40">
                {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          ))
        ) : (
          <p className="mt-10 text-center text-ink/50">No messages found.</p>
        )}
      </div>
    </div>
  );
};