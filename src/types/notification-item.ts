import type { UserRef } from "./user-ref";

export interface NotificationItem {
  _id: string;
  userId?: UserRef | string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrls?: string[];
  isViewed?: boolean;
  createdAt?: string;
}