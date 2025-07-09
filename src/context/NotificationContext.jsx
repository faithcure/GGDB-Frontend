import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Notification types
  const NOTIFICATION_TYPES = {
    FRIEND_REQUEST: 'friend_request',
    GAME_UPDATE: 'game_update',
    REVIEW_LIKE: 'review_like',
    ACHIEVEMENT: 'achievement',
    SYSTEM: 'system',
    GAME_RELEASE: 'game_release'
  };

  // Add notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep max 50
    setUnreadCount(prev => prev + 1);

    // Show toast for certain types
    if (notification.showToast !== false) {
      showToast(newNotification);
    }
  };

  // Show toast notification
  const showToast = (notification) => {
    const { type, title, message } = notification;
    
    const toastOptions = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    };

    switch (type) {
      case NOTIFICATION_TYPES.FRIEND_REQUEST:
        toast.info(`${title}: ${message}`, toastOptions);
        break;
      case NOTIFICATION_TYPES.ACHIEVEMENT:
        toast.success(`🏆 ${title}: ${message}`, toastOptions);
        break;
      case NOTIFICATION_TYPES.GAME_RELEASE:
        toast(`🎮 ${title}: ${message}`, toastOptions);
        break;
      case NOTIFICATION_TYPES.SYSTEM:
        toast.warning(`⚙️ ${title}: ${message}`, toastOptions);
        break;
      default:
        toast(`${title}: ${message}`, toastOptions);
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  // Remove notification
  const removeNotification = (notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return prev.filter(n => n.id !== notificationId);
    });
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('ggdb_notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed.notifications || []);
        setUnreadCount(parsed.unreadCount || 0);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }, []);

  // Save notifications to localStorage
  useEffect(() => {
    const notificationData = {
      notifications,
      unreadCount,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('ggdb_notifications', JSON.stringify(notificationData));
  }, [notifications, unreadCount]);

  // Sample notifications for demo
  useEffect(() => {
    // Add some sample notifications for demo
    const sampleNotifications = [
      {
        type: NOTIFICATION_TYPES.ACHIEVEMENT,
        title: 'Achievement Unlocked',
        message: 'You\'ve reviewed 10 games! Keep it up!',
        icon: '🏆',
        showToast: false
      },
      {
        type: NOTIFICATION_TYPES.GAME_UPDATE,
        title: 'Game Updated',
        message: 'Cyberpunk 2077 has new reviews available',
        icon: '🎮',
        showToast: false
      },
      {
        type: NOTIFICATION_TYPES.FRIEND_REQUEST,
        title: 'Friend Request',
        message: 'GamerPro2024 wants to be your friend',
        icon: '👥',
        showToast: false
      }
    ];

    // Add sample notifications only if no notifications exist
    if (notifications.length === 0) {
      sampleNotifications.forEach((notif, index) => {
        setTimeout(() => {
          addNotification(notif);
        }, index * 1000);
      });
    }
  }, []); // Only run once on mount

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    NOTIFICATION_TYPES
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;