import { useState } from 'react';
import { useTodayAppointments, useConfirmAppointment, useRejectAppointment, useCompleteAppointment } from '@/hooks/useVetDashboard';
import { VetAppointmentCard } from '@/components/VetAppointmentCard';
import { Modal } from '@/components/Modal';
import { AddMedicalRecordForm } from '@/components/AddMedicalRecordForm';
import type { VetAppointment } from '@/types/vetAppointment';

export const VetDashboard = () => {
  const { data, isLoading } = useTodayAppointments();
  const confirmMutation = useConfirmAppointment();
  const rejectMutation = useRejectAppointment();
  const completeMutation = useCompleteAppointment();

  const [recordModalAppointment, setRecordModalAppointment] = useState<VetAppointment | null>(null);

  const isActing = confirmMutation.isPending || rejectMutation.isPending || completeMutation.isPending;
  const appointments = data?.appointments ?? [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">Today's Appointments</h1>
      <p className="mt-1 text-ink/60">
        {appointments.length > 0 ? `${appointments.length} scheduled for today` : 'Nothing scheduled for today'}
      </p>

      <div className="mt-8 space-y-4">
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
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <p className="text-6xl">☀️</p>
            <h2 className="font-display text-2xl font-bold text-ink">Clear day ahead</h2>
            <p className="text-ink/60">No appointments scheduled for today.</p>
          </div>
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