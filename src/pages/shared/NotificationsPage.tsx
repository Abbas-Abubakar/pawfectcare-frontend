import { useNotifications, useMarkAsRead, useMarkAllAsRead, useDeleteNotification } from '@/hooks/useNotifications';
import { NotificationItem } from '@/components/NotificationItem';

export const NotificationsPage = () => {
  const { data, isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">Notifications</h1>
          <p className="mt-1 text-ink/60">
            {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
            className="text-sm font-semibold text-coral hover:text-coral-dark"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="mt-6 space-y-2">
        {isLoading ? (
          <p className="text-ink/50">Loading...</p>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={(id) => markAsRead.mutate(id)}
              onDelete={(id) => deleteNotification.mutate(id)}
              isDeleting={deleteNotification.isPending && deleteNotification.variables === notification._id}
            />
          ))
        ) : (
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <p className="text-6xl">🔔</p>
            <h2 className="font-display text-2xl font-bold text-ink">Nothing here yet</h2>
            <p className="text-ink/60">We'll let you know when something needs your attention.</p>
          </div>
        )}
      </div>
    </div>
  );
};