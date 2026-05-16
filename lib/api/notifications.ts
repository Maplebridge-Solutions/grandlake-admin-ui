import apiClient from "@/lib/client";

export interface NotificationRecord {
  _id: string;
  user: string;
  title: string;
  message: string;
  level: "info" | "warning" | "error";
  eventType: string;
  eventId: string;
  data: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  readAt?: string;
}

interface NotificationsResponse {
  success: boolean;
  message: string;
  data: NotificationRecord[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export async function getMissedNotifications() {
  const res = await apiClient.get<NotificationsResponse>("/notifications/missed");
  return res.data;
}

export async function markAllNotificationsRead() {
  const res = await apiClient.patch<{ success: boolean }>("/notifications/read-all");
  return res.data;
}

export async function markNotificationRead(id: string) {
  const res = await apiClient.patch<{ success: boolean; data: NotificationRecord }>(
    `/notifications/${id}/read`,
  );
  return res.data;
}
