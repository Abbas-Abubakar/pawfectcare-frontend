import type { AppNotification } from '@/types/notification';

export const resolveNotificationPath = (notification: AppNotification): string | null => {
  const { type, link } = notification;
  if (!link) return null;

  switch (type) {
    case 'appointment':
      return '/owner/appointments';

    case 'health_reminder': {
      const match = link.match(/\/pets\/([a-f0-9]+)/);
      return match ? `/owner/pets/${match[1]}` : null;
    }

    case 'adoption': {
      const petMatch = link.match(/^\/pets\/([a-f0-9]+)$/);
      return petMatch ? `/owner/pets/${petMatch[1]}` : null;
    }

    default:
      return null;
  }
};