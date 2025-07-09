import React, { useState } from 'react';
import {
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaSearch,
  FaShieldAlt,
  FaGlobe,
  FaExclamationTriangle
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';

const AdminHeader = ({ user, adminStats, activeModule }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { logout } = useUser();

  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'API Performance Issue',
      message: 'External API response time increased by 20%',
      time: '5 min ago',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'New User Registrations',
      message: '23 new users registered today',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'success',
      title: 'Database Backup Complete',
      message: 'Daily backup completed successfully',
      time: '2 hours ago',
      read: true
    }
  ];

  const getModuleTitle = (module) => {
    const titles = {
      overview: 'Dashboard Overview',
      games: 'Game Management',
      users: 'User Management',
      studios: 'Studio Management',
      analytics: 'Analytics & Reports',
      settings: 'System Settings',
      logs: 'System Logs'
    };
    return titles[module] || 'Admin Panel';
  };

  const getSystemHealthIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'warning':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>;
      case 'error':
        return <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleVisitSite = () => {
    window.open('/', '_blank');
    setShowProfile(false);
  };

  const handleLogout = () => {
    logout();
    setShowProfile(false);
  };

  return (
    <header className="glass-effect border-b border-white/10 px-6 py-4 relative z-20">
      <div className="flex items-center justify-between">
        {/* Left Side - Module Info */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {getModuleTitle(activeModule)}
            </h1>
            <p className="text-white/60 text-sm">
              Manage your gaming platform efficiently
            </p>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search users, games, studios..."
              className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 transition-colors"
            />
          </div>
        </div>

        {/* Right Side - Stats & Actions */}
        <div className="flex items-center gap-4">
          {/* System Health */}
          {adminStats?.systemHealth && (
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
              <FaShieldAlt className="text-white/60" />
              <div className="flex items-center gap-1">
                {Object.entries(adminStats.systemHealth).map(([service, status]) => (
                  <div key={service} className="flex items-center gap-1" title={`${service}: ${status}`}>
                    {getSystemHealthIcon(status)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="hidden lg:flex items-center gap-4 text-sm">
            <div className="text-center">
              <div className="text-white font-semibold">
                {adminStats?.totalUsers?.toLocaleString() || '0'}
              </div>
              <div className="text-white/60 text-xs">Users</div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-white font-semibold">
                {adminStats?.totalGames?.toLocaleString() || '0'}
              </div>
              <div className="text-white/60 text-xs">Games</div>
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <FaBell className="text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-full mt-2 w-80 glass-effect rounded-lg border border-white/20 shadow-xl z-50"
              >
                <div className="p-4 border-b border-white/10">
                  <h3 className="font-semibold text-white">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-white/10 hover:bg-white/5 transition-colors ${
                        !notification.read ? 'bg-white/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 ${
                          notification.type === 'warning' ? 'text-yellow-500' :
                          notification.type === 'error' ? 'text-red-500' :
                          notification.type === 'success' ? 'text-green-500' : 'text-blue-500'
                        }`}>
                          {notification.type === 'warning' && <FaExclamationTriangle />}
                          {notification.type === 'info' && <FaBell />}
                          {notification.type === 'success' && <FaShieldAlt />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white text-sm">{notification.title}</h4>
                          <p className="text-white/70 text-xs mt-1">{notification.message}</p>
                          <p className="text-white/50 text-xs mt-2">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center">
                  <button className="text-yellow-400 hover:text-yellow-300 text-sm">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <FaUser className="text-black text-sm" />
                )}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-white text-sm font-medium">{user?.username}</div>
                <div className="text-white/60 text-xs">Administrator</div>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg border border-gray-700 shadow-xl z-50"
              >
                <div className="p-2">
                  <button 
                    onClick={handleVisitSite}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-left"
                  >
                    <FaGlobe className="text-white/60" />
                    <span className="text-white text-sm">Visit Site</span>
                  </button>
                  <hr className="border-gray-700 my-2" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors text-left"
                  >
                    <FaSignOutAlt />
                    <span className="text-sm">LogOut!</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;