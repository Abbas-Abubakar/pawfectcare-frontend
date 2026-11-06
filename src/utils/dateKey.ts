const pad = (n: number) => String(n).padStart(2, '0');

/** Date to "YYYY-MM-DD" using the local calendar day, not UTC. */
export const toDateKey = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** "YYYY-MM-DD" (or an ISO string starting with it) to local midnight on that day. */
export const parseDateKey = (key: string): Date => {
  const [year, month, day] = key.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
};

/** Format a date-only value without timezone drift. */
export const formatDateOnly = (value: string, options: Intl.DateTimeFormatOptions): string =>
  parseDateKey(value).toLocaleDateString('en-US', options);