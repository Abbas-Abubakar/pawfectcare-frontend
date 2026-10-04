import { useState } from 'react';
import axios from 'axios';
import { Modal } from '@/components/Modal';
import { SlotPicker } from '@/components/SlotPicker';
import { useOpenSlots, useRescheduleAppointment } from '@/hooks/useAppointments';
import type { Appointment, AvailabilitySlot } from '@/types/appointment';

interface RescheduleModalProps {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
}

export const RescheduleModal = ({ appointment, isOpen, onClose }: RescheduleModalProps) => {
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [error, setError] = useState('');

  const { data: slotsData, isLoading } = useOpenSlots(isOpen ? appointment.vet._id : '');
  const rescheduleMutation = useRescheduleAppointment();

  const handleConfirm = () => {
    if (!selectedSlot) return;
    setError('');

    rescheduleMutation.mutate(
      { id: appointment._id, newAvailabilityId: selectedSlot._id },
      {
        onSuccess: () => {
          setSelectedSlot(null);
          onClose();
        },
        onError: (err) => {
          setError(
            axios.isAxiosError(err) ? err.response?.data?.message || 'Could not reschedule.' : 'Could not reschedule.'
          );
        },
      }
    );
  };

  const handleClose = () => {
    setSelectedSlot(null);
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Reschedule with Dr. ${appointment.vet.name}`}>
      <p className="text-sm text-ink/60">
        Currently booked for{' '}
        {new Date(appointment.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at{' '}
        {appointment.startTime}.
      </p>

      <div className="mt-5">
        {isLoading ? (
          <p className="text-sm text-ink/50">Loading available times...</p>
        ) : (
          <SlotPicker
            slots={slotsData?.slots ?? []}
            selectedSlotId={selectedSlot?._id ?? null}
            onSelect={setSelectedSlot}
          />
        )}
      </div>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          disabled={!selectedSlot || rescheduleMutation.isPending}
          onClick={handleConfirm}
          className="btn-primary"
        >
          {rescheduleMutation.isPending ? 'Rescheduling...' : 'Confirm new time'}
        </button>
        <button type="button" onClick={handleClose} className="btn-secondary">
          Cancel
        </button>
      </div>
    </Modal>
  );
};