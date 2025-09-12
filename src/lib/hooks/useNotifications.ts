// src/lib/hooks/useNotifications.ts
import { useState, useEffect, useCallback } from 'react';
import { notificationsApi } from '@/lib/api';
import { Notification } from '@/types';

interface UseNotificationsReturn {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    refetch: () => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const [notificationsResponse, unreadResponse] = await Promise.all([
                notificationsApi.getNotifications(1),
                notificationsApi.getUnreadCount()
            ]);

            if (notificationsResponse.success && notificationsResponse.data) {
                setNotifications(notificationsResponse.data.items);
            }

            if (unreadResponse.success && unreadResponse.data) {
                setUnreadCount(unreadResponse.data.count);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const markAsRead = useCallback(async (id: number) => {
        try {
            const response = await notificationsApi.markAsRead(id);
            if (response.success) {
                setNotifications(prev =>
                    prev.map(notification =>
                        notification.id === id
                            ? { ...notification, read_at: new Date().toISOString() }
                            : notification
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            const response = await notificationsApi.markAllAsRead();
            if (response.success) {
                setNotifications(prev =>
                    prev.map(notification => ({
                        ...notification,
                        read_at: notification.read_at || new Date().toISOString()
                    }))
                );
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    }, []);

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        refetch: fetchNotifications,
    };
};