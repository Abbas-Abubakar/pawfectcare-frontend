import { useState, useMemo } from 'react';
import { useMyAvailability, useDeleteAvailability } from '@/hooks/useVetAvailability';
import { AvailabilityCalendar } from '@/components/AvailabilityCalendar';
import { Modal } from '@/components/Modal';
import { AddAvailabilityForm } from '@/components/AddAvailabilityForm';

const todayKey = new Date().toISOString().slice(0, 10);

export const VetAvailabilityPage = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDateKey, setSelectedDateKey] = useState<string>(todayKey);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Fetch the whole visible month range so the calendar can mark which days have slots
  const monthStart = new Date(year, month, 1).toISOString().slice(0, 10);
  const monthEnd = new Date(year, month + 1, 0).toISOString().slice(0, 10);

  const { data, isLoading } = useMyAvailability({ from: monthStart, to: monthEnd });
  const deleteMutation = useDeleteAvailability();

  const slots = data?.slots ?? [];

  const datesWithSlots = useMemo(() => new Set(slots.map((s) => s.date.slice(0, 10))), [slots]);

  const selectedDaySlots = slots
    .filter((s) => s.date.slice(0, 10) === selectedDateKey)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const selectedDateLabel = new Date(selectedDateKey).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">My Availability</h1>
      <p className="mt-1 text-ink/60">Set the times pet owners can book with you.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        <AvailabilityCalendar
          year={year}
          month={month}
          onMonthChange={(y, m) => {
            setYear(y);
            setMonth(m);
          }}
          selectedDateKey={selectedDateKey}
          onSelectDate={setSelectedDateKey}
          datesWithSlots={datesWithSlots}
        />

        <div className="rounded-4xl bg-white p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-ink">{selectedDateLabel}</h3>
            <button onClick={() => setIsAddOpen(true)} className="btn-primary text-sm">
              + Add slots
            </button>
          </div>

          <div className="mt-5 space-y-2">
            {isLoading ? (
              <p className="text-sm text-ink/50">Loading...</p>
            ) : selectedDaySlots.length === 0 ? (
              <p className="text-sm text-ink/50">No slots set for this day.</p>
            ) : (
              selectedDaySlots.map((slot) => (
                <div
                  key={slot._id}
                  className={`flex items-center justify-between rounded-2xl border-2 px-4 py-3 text-sm font-medium ${
                    slot.isBooked ? 'border-ink/10 bg-cream text-ink/40' : 'border-ink/10 bg-white text-ink'
                  }`}
                >
                  <span>
                    {slot.startTime} – {slot.endTime}
                  </span>
                  {slot.isBooked ? (
                    <span className="text-xs">Booked</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(slot._id)}
                      disabled={deleteMutation.isPending}
                      className="text-ink/40 hover:text-red-500"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title={`Add availability — ${selectedDateLabel}`}>
        <AddAvailabilityForm prefilledDate={selectedDateKey} onSuccess={() => setIsAddOpen(false)} />
      </Modal>
    </div>
  );
};