import { buildMonthGrid, MONTH_NAMES, WEEKDAY_LABELS } from '@/utils/calendarGrid';

interface AvailabilityCalendarProps {
  year: number;
  month: number; // 0-indexed
  onMonthChange: (year: number, month: number) => void;
  selectedDateKey: string | null;
  onSelectDate: (dateKey: string) => void;
  datesWithSlots: Set<string>; // dateKeys that have at least one slot
}

export const AvailabilityCalendar = ({
  year,
  month,
  onMonthChange,
  selectedDateKey,
  onSelectDate,
  datesWithSlots,
}: AvailabilityCalendarProps) => {
  const days = buildMonthGrid(year, month);

  const goToPrevMonth = () => {
    onMonthChange(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1);
  };

  const goToNextMonth = () => {
    onMonthChange(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1);
  };

  return (
    <div className="rounded-4xl bg-white p-5">
      <div className="flex items-center justify-between">
        <button onClick={goToPrevMonth} aria-label="Previous month" className="rounded-full p-2 hover:bg-cream">
          ←
        </button>
        <h3 className="font-display text-lg font-bold text-ink">
          {MONTH_NAMES[month]} {year}
        </h3>
        <button onClick={goToNextMonth} aria-label="Next month" className="rounded-full p-2 hover:bg-cream">
          →
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((label, i) => (
          <div key={i} className="py-1 text-center text-xs font-medium text-ink/40">
            {label}
          </div>
        ))}

        {days.map((day) => {
          const hasSlots = datesWithSlots.has(day.dateKey);
          const isSelected = day.dateKey === selectedDateKey;

          return (
            <button
              key={day.dateKey}
              onClick={() => onSelectDate(day.dateKey)}
              disabled={day.isPast && !day.isToday}
              className={`relative flex aspect-square flex-col items-center justify-center rounded-2xl text-sm transition-colors ${
                !day.isCurrentMonth ? 'text-ink/20' : day.isPast && !day.isToday ? 'text-ink/20' : 'text-ink'
              } ${isSelected ? 'bg-coral text-white' : day.isToday ? 'bg-coral-light' : 'hover:bg-cream'} ${
                day.isPast && !day.isToday ? 'cursor-not-allowed' : ''
              }`}
            >
              {day.date.getDate()}
              {hasSlots && (
                <span
                  className={`absolute bottom-1.5 h-1 w-1 rounded-full ${isSelected ? 'bg-white' : 'bg-coral'}`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};