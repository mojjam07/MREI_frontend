

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import { calculateUnreadCount } from '../utils/helpers.js';
import { NOTIFICATION_TYPES, NOTIFICATION_PRIORITIES, NOTIFICATION_STATUS, NOTIFICATION_DEFAULTS } from '../utils/constants.js';

const NotificationContext = createContext();

/**
 * Notification Provider Component
 * Manages global notification state and provides notification methods
 */
export const NotificationProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const {
    notifications,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications
  } = useNotifications();

  // Local state for UI management
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationFilters, setNotificationFilters] = useState({
    type: NOTIFICATION_TYPES.ALL,
    priority: NOTIFICATION_PRIORITIES.ALL,
    status: NOTIFICATION_STATUS.ALL
  });

  // Calculate unread count using useMemo to avoid setState in effect
  const calculatedUnreadCount = useMemo(() => {
    return calculateUnreadCount(notifications);
  }, [notifications]);

  useEffect(() => {
    setUnreadCount(calculatedUnreadCount);
  }, [calculatedUnreadCount]);

  // Update unread count when notifications change
  useEffect(() => {
    // Only refresh notifications if auth has loaded and there is a user
    if (user && !authLoading) {
      refreshNotifications();
    }
  }, [user, authLoading, refreshNotifications]);

  // Notification methods
  const showNotification = useCallback((message, type = 'info', options = {}) => {
    // For browser notifications (if supported and permission granted)
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(options.title || 'Notification', {
        body: message,
        icon: '/vite.svg',
        badge: '/vite.svg',
        ...options.notificationOptions
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);
    }

    // For in-app notifications, we could add to a global state
    // This would be handled by the NotificationCenter component
    console.log('Notification shown:', { message, type, options });
  }, []);

  const showSuccess = useCallback((message, options = {}) => {
    showNotification(message, 'success', {
      title: 'Success',
      priority: 'low',
      ...options
    });
  }, [showNotification]);

  const showError = useCallback((message, options = {}) => {
    showNotification(message, 'error', {
      title: 'Error',
      priority: 'high',
      autoClose: false, // Don't auto-close error notifications
      ...options
    });
  }, [showNotification]);

  const showWarning = useCallback((message, options = {}) => {
    showNotification(message, 'warning', {
      title: 'Warning',
      priority: 'medium',
      ...options
    });
  }, [showNotification]);

  const showInfo = useCallback((message, options = {}) => {
    showNotification(message, 'info', {
      title: 'Information',
      priority: 'low',
      ...options
    });
  }, [showNotification]);

  // Notification panel methods
  const toggleNotificationPanel = useCallback(() => {
    setIsNotificationPanelOpen(prev => !prev);
  }, []);

  const openNotificationPanel = useCallback(() => {
    setIsNotificationPanelOpen(true);
  }, []);

  const closeNotificationPanel = useCallback(() => {
    setIsNotificationPanelOpen(false);
  }, []);

  // Notification management methods
  const handleMarkAsRead = useCallback(async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      showError('Failed to mark notification as read');
    }
  }, [markAsRead, showError]);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
      showSuccess('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      showError('Failed to mark all notifications as read');
    }
  }, [markAllAsRead, showSuccess, showError]);

  const handleDeleteNotification = useCallback(async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      showSuccess('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      showError('Failed to delete notification');
    }
  }, [deleteNotification, showSuccess, showError]);

  // Filter notifications based on current filters
  const filteredNotifications = React.useMemo(() => {
    return notifications.filter(notification => {
      // Type filter
      if (notificationFilters.type !== 'all' && notification.type !== notificationFilters.type) {
        return false;
      }

      // Priority filter
      if (notificationFilters.priority !== 'all' && notification.priority !== notificationFilters.priority) {
        return false;
      }

      // Status filter
      if (notificationFilters.status !== 'all') {
        const isRead = notification.is_read;
        if (notificationFilters.status === 'read' && !isRead) return false;
        if (notificationFilters.status === 'unread' && isRead) return false;
      }

      return true;
    });
  }, [notifications, notificationFilters]);

  // Real-time notification handling
  useEffect(() => {
    if (!user) return;

    // Set up WebSocket connection for real-time notifications
    // This would typically connect to your backend WebSocket server
    const setupRealtimeNotifications = () => {
      // Example WebSocket setup (implement based on your backend)
      // const ws = new WebSocket(`ws://your-api.com/ws/notifications/${user.id}`);
      
      // ws.onmessage = (event) => {
      //   const notification = JSON.parse(event.data);
      //   // Handle new notification
      //   showNotification(notification.message, notification.type, notification.options);
      // };

      // return () => ws.close();
    };

    const cleanup = setupRealtimeNotifications();
    return cleanup;
  }, [user, showNotification]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Context value
  const contextValue = {
    // Notifications data
    notifications: filteredNotifications,
    allNotifications: notifications,
    unreadCount,
    loading,
    error,

    // UI state
    isNotificationPanelOpen,
    notificationFilters,

    // Notification filters
    setNotificationFilters,

    // Panel controls
    toggleNotificationPanel,
    openNotificationPanel,
    closeNotificationPanel,

    // Notification methods
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,

    // Notification management
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDeleteNotification,
    refreshNotifications,

    // Utility methods
    getNotificationsByType: (type) => notifications.filter(n => n.type === type),
    getNotificationsByPriority: (priority) => notifications.filter(n => n.priority === priority),
    getUnreadNotifications: () => notifications.filter(n => !n.is_read)
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};


export default NotificationContext;
