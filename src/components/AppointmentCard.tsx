import { useState } from 'react';
import type { Appointment } from '@/types/appointment';
import { RescheduleModal } from '@/components/RescheduleModal';

const STATUS_STYLES: Record<Appointment['status'], string> = {
  pending: 'bg-sunshine/30 text-ink',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-ink/10 text-ink/60',
  cancelled: 'bg-red-100 text-red-700',
};

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel: (id: string, reason?: string) => void;
  isCancelling: boolean;
}

export const AppointmentCard = ({ appointment, onCancel, isCancelling }: AppointmentCardProps) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);

  const canModify = appointment.status === 'pending' || appointment.status === 'confirmed';

  return (
    <div className="rounded-3xl border-2 border-ink/5 p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-peach">
            {appointment.pet.photo?.url ? (
              <img src={appointment.pet.photo.url} alt={appointment.pet.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl">🐾</div>
            )}
          </div>
          <div>
            <p className="font-semibold text-ink">{appointment.pet.name}</p>
            <p className="text-sm text-ink/50">with Dr. {appointment.vet.name}</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[appointment.status]}`}>
          {appointment.status}
        </span>
      </div>

      <div className="mt-4 text-sm text-ink/70">
        <p>
          {new Date(appointment.date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}{' '}
          at {appointment.startTime}
        </p>
        <p className="mt-1">{appointment.reason}</p>
      </div>

      {appointment.status === 'cancelled' && appointment.cancelReason && (
        <p className="mt-2 text-sm italic text-ink/40">Reason: {appointment.cancelReason}</p>
      )}

      {canModify && (
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={() => setIsRescheduleOpen(true)}
            className="text-sm font-semibold text-coral hover:text-coral-dark"
          >
            Reschedule
          </button>

          {showCancelConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink/60">Cancel this appointment?</span>
              <button
                onClick={() => onCancel(appointment._id)}
                disabled={isCancelling}
                className="text-sm font-semibold text-red-600 hover:text-red-700"
              >
                {isCancelling ? 'Cancelling...' : 'Yes, cancel'}
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="text-sm font-semibold text-ink/50 hover:text-ink"
              >
                Never mind
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="text-sm font-semibold text-ink/50 hover:text-red-600"
            >
              Cancel appointment
            </button>
          )}
        </div>
      )}

      <RescheduleModal
        appointment={appointment}
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
      />
    </div>
  );
};