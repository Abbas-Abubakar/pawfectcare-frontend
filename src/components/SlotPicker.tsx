import type { AvailabilitySlot } from '@/types/appointment';

interface SlotPickerProps {
  slots: AvailabilitySlot[];
  selectedSlotId: string | null;
  onSelect: (slot: AvailabilitySlot) => void;
}

const formatDateHeading = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
};

export const SlotPicker = ({ slots, selectedSlotId, onSelect }: SlotPickerProps) => {
  if (slots.length === 0) {
    return (
      <div className="py-10 text-center text-ink/50">
        <p className="text-4xl">📅</p>
        <p className="mt-2">This vet has no open slots right now.</p>
      </div>
    );
  }

  // Group slots by their date string so each date gets its own heading
  const grouped = slots.reduce<Record<string, AvailabilitySlot[]>>((acc, slot) => {
    const key = slot.date.slice(0, 10);
    if (!acc[key]) acc[key] = [];
    acc[key].push(slot);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([dateKey, dateSlots]) => (
        <div key={dateKey}>
          <h4 className="mb-3 text-sm font-semibold text-ink/60">{formatDateHeading(dateKey)}</h4>
          <div className="flex flex-wrap gap-2">
            {dateSlots.map((slot) => (
              <button
                key={slot._id}
                type="button"
                onClick={() => onSelect(slot)}
                className={`rounded-2xl border-2 px-4 py-2 text-sm font-medium transition-all ${
                  selectedSlotId === slot._id
                    ? 'border-coral bg-coral text-white'
                    : 'border-ink/10 bg-white text-ink hover:border-coral'
                }`}
              >
                {slot.startTime}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};