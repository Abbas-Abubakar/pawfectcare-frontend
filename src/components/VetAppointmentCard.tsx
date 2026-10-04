import { useState } from 'react';
import type { VetAppointment } from '@/types/vetAppointment';

const STATUS_STYLES: Record<VetAppointment['status'], string> = {
  pending: 'bg-sunshine/30 text-ink',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-ink/10 text-ink/60',
  cancelled: 'bg-red-100 text-red-700',
};

interface VetAppointmentCardProps {
  appointment: VetAppointment;
  onConfirm: (id: string) => void;
  onReject: (id: string, reason?: string) => void;
  onComplete: (id: string) => void;
  onAddRecord: (appointment: VetAppointment) => void;
  isActing: boolean;
}

export const VetAppointmentCard = ({
  appointment,
  onConfirm,
  onReject,
  onComplete,
  onAddRecord,
  isActing,
}: VetAppointmentCardProps) => {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

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
            <p className="font-semibold text-ink">
              {appointment.pet.name} · {appointment.pet.species}
            </p>
            <p className="text-sm text-ink/50">Owner: {appointment.owner.name}</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[appointment.status]}`}>
          {appointment.status}
        </span>
      </div>

      <div className="mt-4 text-sm text-ink/70">
        <p>
          {appointment.startTime} – {appointment.endTime}
        </p>
        <p className="mt-1">{appointment.reason}</p>
      </div>

      {appointment.status === 'pending' &&
        (showRejectInput ? (
          <div className="mt-4 space-y-2">
            <input
              type="text"
              placeholder="Reason (optional)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="input-field text-sm"
            />
            <div className="flex gap-3">
              <button
                onClick={() => onReject(appointment._id, rejectReason)}
                disabled={isActing}
                className="text-sm font-semibold text-red-600"
              >
                Confirm decline
              </button>
              <button onClick={() => setShowRejectInput(false)} className="text-sm font-semibold text-ink/50">
                Never mind
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex gap-3">
            <button onClick={() => onConfirm(appointment._id)} disabled={isActing} className="btn-primary text-sm">
              Confirm
            </button>
            <button onClick={() => setShowRejectInput(true)} disabled={isActing} className="btn-secondary text-sm">
              Decline
            </button>
          </div>
        ))}

      {appointment.status === 'confirmed' && (
        <button onClick={() => onComplete(appointment._id)} disabled={isActing} className="btn-primary mt-4 text-sm">
          Mark as completed
        </button>
      )}

      {appointment.status === 'completed' && (
        <button
          onClick={() => onAddRecord(appointment)}
          className="mt-4 text-sm font-semibold text-coral hover:text-coral-dark"
        >
          + Add medical record
        </button>
      )}
    </div>
  );
};