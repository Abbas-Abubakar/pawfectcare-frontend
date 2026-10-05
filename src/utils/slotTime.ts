import type { AvailabilitySlot } from '@/types/appointment';

/**
 * A slot is in the past if its date is before today, OR it's today but its
 * start time has already passed. Backend only filters by date (>= today),
 * not time-of-day, so "today's earlier slots" can still come back from the
 * API — this catches that case on the client.
 */
export const isSlotInPast = (slot: AvailabilitySlot): boolean => {
  const now = new Date();
  const slotDate = new Date(slot.date);

  const isPastDate = slotDate.toDateString() !== now.toDateString() && slotDate < now;
  if (isPastDate) return true;

  const isToday = slotDate.toDateString() === now.toDateString();
  if (!isToday) return false;

  const [hours, minutes] = slot.startTime.split(':').map(Number);
  const slotDateTime = new Date(slotDate);
  slotDateTime.setHours(hours, minutes, 0, 0);

  return slotDateTime < now;
};