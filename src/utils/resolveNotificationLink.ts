import type { AppNotification } from '@/types/notification';

/**
 * The backend's notification.link is a generic path with no knowledge of
 * the frontend's actual (role-prefixed) route structure. Rather than
 * navigate to that raw value, we extract the relevant id from it and
 * rebuild a path that matches a route we've actually built.
 *
 * Returns null when there's no frontend page for that notification type
 * yet — callers should render a non-navigating item in that case, rather
 * than linking somewhere that 404s.
 */
export const resolveNotificationPath = (notification: AppNotification): string | null => {
  const { type, link } = notification;
  if (!link) return null;

  switch (type) {
    case 'appointment':
      // No single-appointment detail page exists yet — the list page is
      // where the relevant appointment is visible.
      return '/owner/appointments';

    case 'health_reminder': {
      const match = link.match(/\/pets\/([a-f0-9]+)/);
      return match ? `/owner/pets/${match[1]}` : null;
    }

    case 'adoption': {
      // Only the "approved → new Pet created" case has a real page right
      // now; adoption-listing browsing isn't built on the frontend yet.
      const petMatch = link.match(/^\/pets\/([a-f0-9]+)$/);
      return petMatch ? `/owner/pets/${petMatch[1]}` : null;
    }

    default:
      return null;
  }
};