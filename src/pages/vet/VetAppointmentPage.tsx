import { useState } from 'react';
import { useVetAppointments } from '@/hooks/useVetAppointmentsFull';
import { useConfirmAppointment, useRejectAppointment, useCompleteAppointment } from '@/hooks/useVetDashboard';
import { VetAppointmentCard } from '@/components/VetAppointmentCard';
import { Modal } from '@/components/Modal';
import { AddMedicalRecordForm } from '@/components/AddMedicalRecordForm';
import type { VetAppointment } from '@/types/vetAppointment';
import type { AppointmentStatus } from '@/types/appointment';

const FILTERS: { label: string; value: AppointmentStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export const VetAppointmentsPage = () => {
  const [filter, setFilter] = useState<AppointmentStatus | 'all'>('all');
  const { data, isLoading } = useVetAppointments(filter === 'all' ? undefined : filter);

  const confirmMutation = useConfirmAppointment();
  const rejectMutation = useRejectAppointment();
  const completeMutation = useCompleteAppointment();
  const [recordModalAppointment, setRecordModalAppointment] = useState<VetAppointment | null>(null);

  const isActing = confirmMutation.isPending || rejectMutation.isPending || completeMutation.isPending;
  const appointments = data?.appointments ?? [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">All Appointments</h1>
      <p className="mt-1 text-ink/60">Your full appointment history, past and upcoming.</p>

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

      <div className="mt-6 space-y-4">
        {isLoading ? (
          <p className="text-ink/50">Loading...</p>
        ) : appointments.length > 0 ? (
          appointments.map((appointment) => (
            <VetAppointmentCard
              key={appointment._id}
              appointment={appointment}
              isActing={isActing}
              onConfirm={(id) => confirmMutation.mutate(id)}
              onReject={(id, reason) => rejectMutation.mutate({ id, reason })}
              onComplete={(id) => completeMutation.mutate(id)}
              onAddRecord={(appt) => setRecordModalAppointment(appt)}
            />
          ))
        ) : (
          <p className="mt-10 text-center text-ink/50">No appointments found.</p>
        )}
      </div>

      <Modal
        isOpen={!!recordModalAppointment}
        onClose={() => setRecordModalAppointment(null)}
        title={`Medical record — ${recordModalAppointment?.pet.name ?? ''}`}
      >
        {recordModalAppointment && (
          <AddMedicalRecordForm
            appointmentId={recordModalAppointment._id}
            petId={recordModalAppointment.pet._id}
            onSuccess={() => setRecordModalAppointment(null)}
          />
        )}
      </Modal>
    </div>
  );
};