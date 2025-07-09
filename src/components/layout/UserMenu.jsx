import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaUserCog,
  FaUsers,
  FaHeart,
  FaListUl,
  FaThumbsUp,
  FaSkullCrossbones,
  FaCaretDown,
  FaCrown,
  FaGamepad,
  FaStar,
  FaCog
} from "react-icons/fa";
import { UserPlus } from "lucide-react";
import { useUser } from "../../context/UserContext";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const UserMenu = ({ user, showUserMenu, setShowUserMenu, userMenuRef }) => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [pendingConnectionsCount, setPendingConnectionsCount] = useState(0);

  // Fetch social data
  const fetchSocialData = useCallback(async () => {
    if (!user) return;

    try {
      const connectionsRes = await axios.get('/api/connections/pending?type=received');
      setPendingConnectionsCount(connectionsRes.data.count || 0);
    } catch (error) {
      console.error('Error fetching social data:', error);
    }
  }, [user]);

  // Update social data periodically
  useEffect(() => {
    if (user) {
      fetchSocialData();
      
      // Update every 30 seconds
      const interval = setInterval(fetchSocialData, 30000);
      return () => clearInterval(interval);
    }
  }, [user, fetchSocialData]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
    setShowUserMenu(false);
  };

  const menuSections = [
    {
      title: "Account",
      items: [
        {
          icon: FaUserCog,
          label: "My Vault",
          color: "text-purple-400",
          action: () => {
            navigate("/dashboard");
            setShowUserMenu(false);
          },
          description: "Profile & settings"
        }
      ]
    },
    {
      title: "Social",
      items: [
        {
          icon: UserPlus,
          label: "Connection Requests",
          color: "text-yellow-400",
          action: () => {
            navigate("/connections");
            setShowUserMenu(false);
          },
          description: "Manage friend requests",
          badge: pendingConnectionsCount > 0 ? pendingConnectionsCount : null
        },
        {
          icon: FaUsers,
          label: "Find Gaming Friends",
          color: "text-green-400",
          action: () => {
            navigate("/find-friends");
            setShowUserMenu(false);
          },
          description: "Discover new gamers"
        },
        {
          icon: FaHeart,
          label: "Community",
          color: "text-cyan-400",
          action: () => {
            navigate("/community");
            setShowUserMenu(false);
          },
          description: "Connect with gamers"
        }
      ]
    }
  ];

  return (
    <div className="relative" ref={userMenuRef}>
      {/* User Button */}
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="group/btn flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50 rounded-md transition-all duration-200 border border-transparent hover:border-gray-700"
      >
        <div className="w-7 h-7 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center ring-2 ring-transparent group-hover/btn:ring-yellow-400/30 transition-all duration-200">
          <span className="text-xs font-bold text-gray-900">
            {user.username?.[0]?.toUpperCase() || 'U'}
          </span>
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium leading-tight">{user.username}</p>
        </div>
        <FaCaretDown className={`w-3 h-3 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
      </button>

      {/* Invisible Bridge */}
      <div className="absolute top-10 right-0 w-64 h-4 bg-transparent"></div>

      {/* Dropdown Menu */}
      {showUserMenu && (
        <div
          className="absolute top-12 right-0 w-72 bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-2xl z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-4 py-4 border-b border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-bold text-base">{user.username}</h3>
                  {user.role?.toLowerCase() === 'admin' && (
                    <FaCrown className="text-yellow-400 text-sm" title="Admin" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-400 text-xs">Online now</span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Sections */}
          <div className="py-2 max-h-80 overflow-y-auto">
            {menuSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {/* Section Title */}
                <div className="px-4 py-2">
                  <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wide">
                    {section.title}
                  </h4>
                </div>

                {/* Section Items */}
                {section.items.map((item, itemIndex) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={itemIndex}
                      onClick={item.action}
                      className={`group/item w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 transition-all duration-200 relative overflow-hidden ${
                        item.special ? 'hover:bg-red-900/20' : ''
                      }`}
                    >
                      {/* Hover Effect Background */}
                      <div className={`absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 ${
                        item.special ? 'bg-gradient-to-r from-red-400/10 to-transparent' : 'bg-gradient-to-r from-yellow-400/10 to-transparent'
                      }`}></div>
                      
                      {/* Icon */}
                      <div className="relative z-10 flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-800 group-hover/item:bg-gray-700 rounded-md flex items-center justify-center transition-all duration-200 group-hover/item:scale-110">
                          <IconComponent className={`text-sm ${item.color} group-hover/item:scale-110 transition-transform duration-200`} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative z-10 flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium text-sm group-hover/item:text-yellow-400 transition-colors duration-200">
                              {item.label}
                            </p>
                            <p className="text-gray-400 text-xs group-hover/item:text-gray-300 transition-colors duration-200">
                              {item.description}
                            </p>
                          </div>
                          
                          {/* Badge */}
                          {item.badge && (
                            <span className="bg-yellow-500 text-black text-[10px] px-2 py-1 rounded-full font-bold min-w-[20px] text-center">
                              {item.badge > 9 ? '9+' : item.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arrow Indicator */}
                      <div className="relative z-10 opacity-0 group-hover/item:opacity-100 transition-all duration-200 transform translate-x-2 group-hover/item:translate-x-0">
                        <div className={`w-1 h-4 rounded-full ${item.special ? 'bg-red-400' : 'bg-yellow-400'}`}></div>
                      </div>
                    </button>
                  );
                })}

                {/* Divider */}
                {sectionIndex < menuSections.length - 1 && (
                  <div className="mx-4 my-2 border-t border-gray-700/50"></div>
                )}
              </div>
            ))}
          </div>

          {/* Footer - Logout */}
          <div className="border-t border-gray-700/50 p-2">
            <button
              onClick={handleLogout}
              className="group/logout w-full flex items-center gap-3 px-4 py-3 hover:bg-red-900/20 transition-all duration-200 relative overflow-hidden rounded-md"
            >
              {/* Hover Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 to-transparent opacity-0 group-hover/logout:opacity-100 transition-opacity duration-200"></div>
              
              {/* Icon */}
              <div className="relative z-10 flex-shrink-0">
                <div className="w-8 h-8 bg-gray-800 group-hover/logout:bg-red-800 rounded-md flex items-center justify-center transition-all duration-200">
                  <FaSignOutAlt className="text-sm text-red-400 group-hover/logout:text-red-300 transition-colors duration-200" />
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 flex-1 text-left">
                <p className="text-red-400 font-medium text-sm group-hover/logout:text-red-300 transition-colors duration-200">
                  Sign Out
                </p>
                <p className="text-gray-500 text-xs group-hover/logout:text-gray-400 transition-colors duration-200">
                  See you later!
                </p>
              </div>

              {/* Arrow Indicator */}
              <div className="relative z-10 opacity-0 group-hover/logout:opacity-100 transition-all duration-200 transform translate-x-2 group-hover/logout:translate-x-0">
                <div className="w-1 h-4 bg-red-400 rounded-full"></div>
              </div>
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-2 right-2 w-16 h-16 bg-yellow-400/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-2 left-2 w-12 h-12 bg-blue-400/5 rounded-full blur-xl"></div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;