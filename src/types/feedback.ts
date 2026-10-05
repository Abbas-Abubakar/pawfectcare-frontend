export interface Feedback {
  _id: string;
  user: { _id: string; name: string; role: string };
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface FeedbackResponse {
  success: boolean;
  count: number;
  feedback: Feedback[];
}