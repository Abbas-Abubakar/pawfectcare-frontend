import { useNavigate } from 'react-router-dom';
import type { AppNotification } from '@/types/notification';
import { resolveNotificationPath } from '@/utils/resolveNotificationLink';

const TYPE_ICONS: Record<AppNotification['type'], string> = {
  appointment: '📅',
  health_reminder: '💉',
  adoption: '🏠',
  general: '🔔',
};

const formatRelativeTime = (dateString: string): string => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

interface NotificationItemProps {
  notification: AppNotification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export const NotificationItem = ({ notification, onMarkAsRead, onDelete, isDeleting }: NotificationItemProps) => {
  const navigate = useNavigate();
  const path = resolveNotificationPath(notification);

  const handleClick = () => {
    if (!notification.isRead) onMarkAsRead(notification._id);
    if (path) navigate(path);
  };

  return (
    <div
      className={`flex items-start gap-3 rounded-3xl p-4 transition-colors ${
        notification.isRead ? 'bg-white' : 'bg-coral-light'
      }`}
    >
      <button
        type="button"
        onClick={handleClick}
        className={`flex flex-1 gap-3 text-left ${path ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <span className="text-xl">{TYPE_ICONS[notification.type]}</span>
        <div className="flex-1">
          <p className="font-semibold text-ink">{notification.title}</p>
          <p className="mt-0.5 text-sm text-ink/60">{notification.message}</p>
          <p className="mt-1 text-xs text-ink/40">{formatRelativeTime(notification.createdAt)}</p>
        </div>
      </button>

      <div className="flex shrink-0 items-start gap-2">
        {!notification.isRead && <span className="mt-2 h-2 w-2 rounded-full bg-coral" />}
        <button
          type="button"
          onClick={() => onDelete(notification._id)}
          disabled={isDeleting}
          aria-label="Delete notification"
          className="rounded-full p-1 text-ink/30 transition-colors hover:bg-white hover:text-red-500 disabled:opacity-40"
        >
          ✕
        </button>
      </div>
    </div>
  );
};