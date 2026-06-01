'use client';

import { useState, useEffect, useCallback, useRef, useTransition } from 'react';
import { notificationsAPI } from '@/lib/api';
import { useAuth } from './use-auth';

const POLL_INTERVAL = 30000;

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPending, startTransition] = useTransition();
  const { user } = useAuth();
  const fetchNotificationsRef = useRef<() => Promise<void>>(undefined);
  const fetchingRef = useRef(false);
  // Circuit breaker: stop polling once the session is confirmed dead
  const sessionExpiredRef = useRef(false);

  // Reset circuit breaker on new login
  useEffect(() => {
    sessionExpiredRef.current = false;
  }, [user?.id]);

  // Stop immediately when apiCall signals session expiry
  useEffect(() => {
    const handler = () => { sessionExpiredRef.current = true; };
    window.addEventListener('auth:session-expired', handler);
    return () => window.removeEventListener('auth:session-expired', handler);
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!user || fetchingRef.current || sessionExpiredRef.current) return;

    fetchingRef.current = true;
    startTransition(async () => {
      try {
        const data = await notificationsAPI.list();
        const notificationsArray = Array.isArray(data) ? data : data?.notifications || [];
        setNotifications(notificationsArray);
        setUnreadCount(notificationsArray.filter((n: Notification) => !n.is_read).length);
      } catch (error: unknown) {
        const status = (error as { status?: number })?.status;
        if (status === 401) {
          // Refresh already failed inside apiCall — session dead, stop polling
          sessionExpiredRef.current = true;
        }
      } finally {
        fetchingRef.current = false;
      }
    });
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications((current) =>
        current.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((current) => Math.max(0, current - 1));
    } catch {
      // silent
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications((current) => current.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    fetchNotificationsRef.current = fetchNotifications;
  }, [fetchNotifications]);

  useEffect(() => {
    if (!user?.id) return;

    fetchNotificationsRef.current?.();

    const interval = setInterval(() => {
      fetchNotificationsRef.current?.();
    }, POLL_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [user?.id]);

  return {
    notifications,
    unreadCount,
    isLoading: isPending,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  };
}
