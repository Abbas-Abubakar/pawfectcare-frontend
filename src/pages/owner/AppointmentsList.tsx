import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMyAppointments, useCancelAppointment } from '@/hooks/useAppointments';
import { AppointmentCard } from '@/components/AppointmentCard';
import type { AppointmentStatus } from '@/types/appointment';

const FILTERS: { label: string; value: AppointmentStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Upcoming', value: 'confirmed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export const AppointmentsList = () => {
  const [filter, setFilter] = useState<AppointmentStatus | 'all'>('all');
  const { data, isLoading } = useMyAppointments(filter === 'all' ? undefined : filter);
  const cancelMutation = useCancelAppointment();

  const handleCancel = (id: string, reason?: string) => {
    cancelMutation.mutate({ id, reason });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">Appointments</h1>
          <p className="mt-1 text-ink/60">Keep track of upcoming and past vet visits.</p>
        </div>
        <Link to="/owner/appointments/new" className="btn-primary">
          + Book appointment
        </Link>
      </div>

      <div className="mt-6 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === f.value ? 'bg-ink text-white' : 'bg-white text-ink/60 hover:bg-cream'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {isLoading ? (
          <p className="text-ink/50">Loading appointments...</p>
        ) : data && data.appointments.length > 0 ? (
          <div className="space-y-4">
            {data.appointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                onCancel={handleCancel}
                isCancelling={cancelMutation.isPending}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <p className="text-6xl">📅</p>
            <h2 className="font-display text-2xl font-bold text-ink">No appointments here</h2>
            <p className="text-ink/60">Book a visit when your pet needs one.</p>
            <Link to="/owner/appointments/new" className="btn-primary mt-2">
              Book an appointment
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};