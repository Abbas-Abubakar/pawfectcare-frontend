import type { AvailabilitySlot } from '@/types/appointment';
import { parseDateKey } from './dateKey';

export const isSlotInPast = (slot: AvailabilitySlot): boolean => {
  const [hours, minutes] = slot.startTime.split(':').map(Number);
  const slotDateTime = parseDateKey(slot.date);
  slotDateTime.setHours(hours, minutes, 0, 0);
  return slotDateTime < new Date();
};