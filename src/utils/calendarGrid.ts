import { toDateKey } from '@/utils/dateKey';

export interface CalendarDay {
  date: Date;
  dateKey: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
}

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
      dateKey: toDateKey(date),
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