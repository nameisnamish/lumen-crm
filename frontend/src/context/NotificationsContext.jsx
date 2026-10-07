import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { notificationsApi } from "../lib/services";

const NotificationsContext = createContext(null);

const POLL_INTERVAL = 30_000; // 30 seconds

/**
 * Provides notification state with 30-second polling.
 * Demonstrates useEffect with cleanup, useRef for interval ID, and useCallback.
 */
export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await notificationsApi.list();
      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch {
      // silently fail on polling errors
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id) => {
    try {
      const res = await notificationsApi.markAsRead(id);
      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch {
      // ignore
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const res = await notificationsApi.markAsRead("all");
      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(0);
      }
    } catch {
      // ignore
    }
  }, []);

  // Initial fetch + polling with cleanup on unmount
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await notificationsApi.list();
        if (active && res.success) {
          setNotifications(res.notifications || []);
          setUnreadCount(res.unreadCount || 0);
        }
      } catch {
        // silently fail on polling errors
      }
    })();

    intervalRef.current = setInterval(fetchNotifications, POLL_INTERVAL);

    return () => {
      active = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchNotifications]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        refetch: fetchNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within a NotificationsProvider");
  return ctx;
}
