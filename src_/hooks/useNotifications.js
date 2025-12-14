
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/apiClient';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get('/notifications/');
      const data = response.data;
      
      setNotifications(data.results || data);
      setUnreadCount(data.results ? data.results.filter(n => !n.is_read).length : data.filter(n => !n.is_read).length);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
      
      // Mock data for development
      setNotifications([
        {
          id: 1,
          title: 'Assignment Submitted',
          message: 'Your assignment "Database Project" has been submitted successfully.',
          type: 'assignment',
          is_read: false,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          related_url: '/student/assignments/1'
        },
        {
          id: 2,
          title: 'Grade Posted',
          message: 'Your grade for "Midterm Exam" has been posted.',
          type: 'grade',
          is_read: false,
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          related_url: '/student/progress'
        },
        {
          id: 3,
          title: 'New Announcement',
          message: 'Important: Updated course schedule for next week.',
          type: 'announcement',
          is_read: true,
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          related_url: '/student/courses'
        },
        {
          id: 4,
          title: 'New Message',
          message: 'You have received a new message from Dr. Smith.',
          type: 'message',
          is_read: false,
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          related_url: '/student/communication'
        }
      ]);
      setUnreadCount(3);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await apiClient.patch(`/notifications/${notificationId}/`, { is_read: true });
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      
      // Update locally even if API call fails
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      setLoading(true);
      
      // For now, mark all locally since we don't have the exact API endpoint
      setNotifications(prev => prev.map(notification => ({ ...notification, is_read: true })));
      setUnreadCount(0);
      
      // In a real implementation, you'd call:
      // await apiClient.patch('/notifications/mark-all-read/');
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await apiClient.delete(`/notifications/${notificationId}/`);
      
      const deletedNotification = notifications.find(n => n.id === notificationId);
      
      setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
      
      if (deletedNotification && !deletedNotification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
      
      // Remove locally even if API call fails
      const deletedNotification = notifications.find(n => n.id === notificationId);
      
      setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
      
      if (deletedNotification && !deletedNotification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }
  };

  // Refresh notifications
  const refreshNotifications = () => {
    fetchNotifications();
  };




  // Real-time notification setup (optional)
  const setupRealtimeNotifications = useCallback(() => {
    // This would be implemented with WebSocket or Server-Sent Events
    // For now, we'll use polling
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
  }, [fetchNotifications]);


  // Initialize notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);




  // Setup real-time notifications
  useEffect(() => {
    const cleanup = setupRealtimeNotifications();
    return cleanup;
  }, [setupRealtimeNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    fetchNotifications
  };
};
