import React from 'react';
import { useNotifications } from '../../context/NotificationContext';

const NotificationDemo = () => {
  const { addNotification, NOTIFICATION_TYPES } = useNotifications();

  const demoNotifications = [
    {
      type: NOTIFICATION_TYPES.FRIEND_REQUEST,
      title: 'New Friend Request',
      message: 'ProGamer2024 wants to connect with you',
      icon: '👥'
    },
    {
      type: NOTIFICATION_TYPES.ACHIEVEMENT,
      title: 'Achievement Unlocked!',
      message: 'You\'ve completed your first game review! Keep up the great work!',
      icon: '🏆'
    },
    {
      type: NOTIFICATION_TYPES.GAME_UPDATE,
      title: 'Game Updated',
      message: 'The Witcher 3: Wild Hunt has received new user reviews and screenshots',
      icon: '🎮'
    },
    {
      type: NOTIFICATION_TYPES.GAME_RELEASE,
      title: 'New Game Release',
      message: 'Cyberpunk 2077: Phantom Liberty is now available! Check out the reviews.',
      icon: '🎮'
    },
    {
      type: NOTIFICATION_TYPES.REVIEW_LIKE,
      title: 'Review Liked',
      message: 'GameMaster liked your review of "Red Dead Redemption 2". Your review is helping other gamers!',
      icon: '❤️'
    },
    {
      type: NOTIFICATION_TYPES.SYSTEM,
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight from 2-4 AM EST. Some features may be temporarily unavailable.',
      icon: '⚙️'
    }
  ];

  const triggerNotification = (demo) => {
    addNotification({
      ...demo,
      showToast: true
    });
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur p-6 rounded-lg border border-gray-700">
      <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
        🔔 Notification System Demo
      </h3>
      <p className="text-gray-400 text-sm mb-6">
        Click the buttons below to test different notification types. Check the bell icon in the header!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {demoNotifications.map((demo, index) => (
          <button
            key={index}
            onClick={() => triggerNotification(demo)}
            className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-left"
          >
            <span className="text-lg">{demo.icon}</span>
            <div>
              <div className="font-medium text-sm">{demo.title}</div>
              <div className="text-gray-400 text-xs truncate">
                {demo.message.length > 40 ? demo.message.slice(0, 40) + '...' : demo.message}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h4 className="text-blue-400 font-medium text-sm mb-2">🎯 Testing Instructions</h4>
        <ul className="text-gray-300 text-xs space-y-1">
          <li>• Click any button above to trigger a notification</li>
          <li>• Toast notifications will appear in the top-right corner</li>
          <li>• Check the bell icon for notification count and dropdown</li>
          <li>• Notifications persist in localStorage between sessions</li>
          <li>• Click on notifications to mark them as read</li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationDemo;