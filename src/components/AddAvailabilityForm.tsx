import { useState } from 'react';
import axios from 'axios';
import { useCreateAvailability } from '@/hooks/useVetAvailability';

interface TimeSlotInput {
  startTime: string;
  endTime: string;
}

const EMPTY_SLOT: TimeSlotInput = { startTime: '', endTime: '' };

export const AddAvailabilityForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<TimeSlotInput[]>([{ ...EMPTY_SLOT }]);
  const [error, setError] = useState('');

  const mutation = useCreateAvailability();

  const updateSlot = (index: number, field: keyof TimeSlotInput, value: string) => {
    setSlots((prev) => prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)));
  };

  const addSlotRow = () => setSlots((prev) => [...prev, { ...EMPTY_SLOT }]);

  const removeSlotRow = (index: number) => setSlots((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!date) {
      setError('Please choose a date.');
      return;
    }

    const validSlots = slots.filter((s) => s.startTime && s.endTime);
    if (validSlots.length === 0) {
      setError('Add at least one complete time slot.');
      return;
    }

    mutation.mutate(
      { date, slots: validSlots },
      {
        onSuccess: () => onSuccess(),
        onError: (err) => {
          setError(
            axios.isAxiosError(err) ? err.response?.data?.message || 'Could not save slots.' : 'Could not save slots.'
          );
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="date" className="form-label">
          Date
        </label>
        <input
          id="date"
          type="date"
          required
          min={new Date().toISOString().slice(0, 10)}
          className="input-field"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div>
        <span className="form-label">Time slots</span>
        <div className="space-y-2">
          {slots.map((slot, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="time"
                required
                className="input-field"
                value={slot.startTime}
                onChange={(e) => updateSlot(index, 'startTime', e.target.value)}
              />
              <span className="text-ink/40">to</span>
              <input
                type="time"
                required
                className="input-field"
                value={slot.endTime}
                onChange={(e) => updateSlot(index, 'endTime', e.target.value)}
              />
              {slots.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSlotRow(index)}
                  aria-label="Remove slot"
                  className="shrink-0 rounded-full p-2 text-ink/40 hover:bg-cream hover:text-red-500"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addSlotRow}
          className="mt-2 text-sm font-semibold text-coral hover:text-coral-dark"
        >
          + Add another slot
        </button>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={mutation.isPending} className="btn-primary w-full">
        {mutation.isPending ? 'Saving...' : 'Save availability'}
      </button>
    </form>
  );
};