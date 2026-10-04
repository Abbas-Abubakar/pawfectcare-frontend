export type NotificationType = 'appointment' | 'health_reminder' | 'adoption' | 'general';

export interface AppNotification {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  count: number;
  unreadCount: number;
  notifications: AppNotification[];
}