import { api } from './api';
import { ApiResponse, NotificationItem } from '../types';
import { INITIAL_NOTIFICATIONS } from '../data/mockData';

let localNotifications = [...INITIAL_NOTIFICATIONS];

export const notificationService = {
  async getNotifications(): Promise<ApiResponse<NotificationItem[]>> {
    const res = await api.get<NotificationItem[]>('/notifications');
    if (res.success && res.data) {
      localNotifications = res.data;
      return res;
    }
    return {
      success: true,
      data: localNotifications,
    };
  },

  async markAsRead(id: string): Promise<ApiResponse<NotificationItem>> {
    const res = await api.patch<NotificationItem>(`/notifications/${id}/read`);
    if (res.success && res.data) {
      return res;
    }
    const notif = localNotifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      return { success: true, data: notif };
    }
    return {
      success: false,
      data: null as unknown as NotificationItem,
      error: { code: 'NOT_FOUND', message: 'Notification not found' },
    };
  },

  async clearAll(): Promise<ApiResponse<boolean>> {
    const res = await api.delete<boolean>('/notifications');
    localNotifications = [];
    return res.success ? res : { success: true, data: true };
  },
};
