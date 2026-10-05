export type ContactMessageType = 'contact' | 'volunteer';
export type ContactMessageStatus = 'new' | 'reviewed' | 'resolved';

export interface ContactMessage {
  _id: string;
  type: ContactMessageType;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  availability?: string;
  status: ContactMessageStatus;
  createdAt: string;
}

export interface ContactMessagesResponse {
  success: boolean;
  count: number;
  messages: ContactMessage[];
}