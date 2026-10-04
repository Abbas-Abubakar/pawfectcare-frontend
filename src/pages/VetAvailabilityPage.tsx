import { useState } from 'react';
import { useMyAvailability, useDeleteAvailability } from '@/hooks/useVetAvailability';
import { Modal } from '@/components/Modal';
import { AddAvailabilityForm } from '@/components/AddAvailabilityForm';
import type { AvailabilitySlot } from '@/types/appointment';

const formatDateHeading = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

export const VetAvailabilityPage = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { data, isLoading } = useMyAvailability();
  const deleteMutation = useDeleteAvailability();

  const slots = data?.slots ?? [];

  // Group by date for a readable, scannable schedule view
  const grouped = slots.reduce<Record<string, AvailabilitySlot[]>>((acc, slot) => {
    const key = slot.date.slice(0, 10);
    if (!acc[key]) acc[key] = [];
    acc[key].push(slot);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">My Availability</h1>
          <p className="mt-1 text-ink/60">Set the times pet owners can book with you.</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="btn-primary">
          + Add slots
        </button>
      </div>

      <div className="mt-8 space-y-6">
        {isLoading ? (
          <p className="text-ink/50">Loading...</p>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <p className="text-6xl">🗓️</p>
            <h2 className="font-display text-2xl font-bold text-ink">No availability set</h2>
            <p className="text-ink/60">Add some open slots so pet owners can book with you.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([dateKey, dateSlots]) => (
            <div key={dateKey}>
              <h3 className="mb-3 text-sm font-semibold text-ink/60">{formatDateHeading(dateKey)}</h3>
              <div className="flex flex-wrap gap-2">
                {dateSlots.map((slot) => (
                  <div
                    key={slot._id}
                    className={`flex items-center gap-2 rounded-2xl border-2 px-4 py-2 text-sm font-medium ${
                      slot.isBooked ? 'border-ink/10 bg-cream text-ink/40' : 'border-ink/10 bg-white text-ink'
                    }`}
                  >
                    <span>
                      {slot.startTime} – {slot.endTime}
                    </span>
                    {slot.isBooked ? (
                      <span className="text-xs">(booked)</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => deleteMutation.mutate(slot._id)}
                        disabled={deleteMutation.isPending}
                        aria-label="Remove slot"
                        className="text-ink/40 hover:text-red-500"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add availability">
        <AddAvailabilityForm onSuccess={() => setIsAddOpen(false)} />
      </Modal>
    </div>
  );
};