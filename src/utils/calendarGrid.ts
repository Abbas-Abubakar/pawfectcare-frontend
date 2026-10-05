export interface CalendarDay {
  date: Date;
  dateKey: string; // YYYY-MM-DD, for matching against slot data
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
}

/**
 * Builds a full 6-week grid for the given month, including the trailing/
 * leading days from adjacent months needed to fill complete weeks —
 * the standard shape every month-calendar UI needs.
 */
export const buildMonthGrid = (year: number, month: number): CalendarDay[] => {
  const firstOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstOfMonth.getDay(); // 0 = Sunday

  const gridStart = new Date(year, month, 1 - startDayOfWeek);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    date.setHours(0, 0, 0, 0);

    return {
      date,
      dateKey: date.toISOString().slice(0, 10),
      isCurrentMonth: date.getMonth() === month,
      isToday: date.getTime() === today.getTime(),
      isPast: date.getTime() < today.getTime(),
    };
  });
};

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];