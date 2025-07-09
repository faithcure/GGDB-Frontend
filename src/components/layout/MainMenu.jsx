import React from "react";
import { FaBars, FaStar, FaTags, FaCommentAlt, FaTrophy, FaFire, FaGamepad, FaUsers, FaChartLine, FaVideo, FaBuilding } from "react-icons/fa";

const MainMenu = ({ mobile = false, onItemClick = () => {} }) => {
  const menuItems = [
    {
      icon: FaStar,
      label: "Top Rated",
      href: "/top-rated",
      color: "text-yellow-400",
      description: "Highest rated games"
    },
    {
      icon: FaFire,
      label: "Trending",
      href: "#trending",
      color: "text-orange-400",
      description: "What's hot right now",
      badge: "HOT"
    },
    {
      icon: FaTags,
      label: "Genres",
      href: "/genres",
      color: "text-blue-400",
      description: "Browse by category",
      badge: "NEW"
    },
    {
      icon: FaTrophy,
      label: "Awards",
      href: "/awards",
      color: "text-purple-400",
      description: "Game of the year winners"
    },
    {
      icon: FaVideo,
      label: "Trailers",
      href: "/trailers",
      color: "text-red-400",
      description: "Latest game trailers"
    },
    {
      icon: FaUsers,
      label: "Community",
      href: "/community",
      color: "text-pink-400",
      description: "Connect with gamers"
    },
    {
      icon: FaBuilding,
      label: "Studios",
      href: "/studios",
      color: "text-indigo-400",
      description: "Game development studios"
    },
    {
      icon: FaChartLine,
      label: "Statistics",
      href: "#stats",
      color: "text-cyan-400",
      description: "Gaming analytics"
    }
  ];

  // Mobile version
  if (mobile) {
    return (
      <div className="space-y-2">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <a
              key={index}
              href={item.href}
              onClick={onItemClick}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors group"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-800 group-hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all duration-200">
                  <IconComponent className={`text-base ${item.color} group-hover:scale-110 transition-transform duration-200`} />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium group-hover:text-yellow-400 transition-colors">
                      {item.label}
                    </p>
                    <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Badge */}
                  {item.badge && (
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      item.badge === 'HOT'
                        ? 'bg-orange-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    );
  }

  // Desktop version
  return (
      <div className="relative group">
        {/* Menu Button */}
        <button className="group/btn flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50 rounded-md transition-all duration-200 border border-transparent hover:border-gray-700">
          <FaBars className="text-base group-hover/btn:rotate-90 transition-transform duration-300" />
          <span className="uppercase tracking-wide">Menu</span>
          <div className="w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200"></div>
        </button>

        {/* Invisible Bridge - Mouse geçişi için */}
        <div className="absolute top-10 left-0 w-80 h-4 bg-transparent"></div>

        {/* Dropdown Menu */}
        <div className="absolute top-12 left-0 z-50 w-80 bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">

          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-700/50">
            <div className="flex items-center gap-2">
              <FaGamepad className="text-yellow-400 text-lg" />
              <h3 className="text-white font-bold text-base">Game Hub</h3>
            </div>
            <p className="text-gray-400 text-xs mt-1">Discover amazing games</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                  <a
                      key={index}
                      href={item.href}
                      className="group/item flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 transition-all duration-200 relative overflow-hidden"
                  >
                    {/* Hover Effect Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-200"></div>

                    {/* Icon */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-800 group-hover/item:bg-gray-700 rounded-md flex items-center justify-center transition-all duration-200 group-hover/item:scale-110">
                        <IconComponent className={`text-sm ${item.color} group-hover/item:scale-110 transition-transform duration-200`} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex-1 min-w-0">
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
                            <span className={`text-[10px] px-2 py-1 rounded-full font-bold transition-all duration-200 ${
                                item.badge === 'HOT'
                                    ? 'bg-orange-500 text-white group-hover/item:bg-orange-400'
                                    : 'bg-red-500 text-white group-hover/item:bg-red-400'
                            }`}>
                        {item.badge}
                      </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow Indicator */}
                    <div className="relative z-10 opacity-0 group-hover/item:opacity-100 transition-all duration-200 transform translate-x-2 group-hover/item:translate-x-0">
                      <div className="w-1 h-4 bg-yellow-400 rounded-full"></div>
                    </div>
                  </a>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-700/50 bg-gray-800/30">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Quick Access</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-400">Live Updates</span>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-2 right-2 w-16 h-16 bg-yellow-400/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-2 left-2 w-12 h-12 bg-blue-400/5 rounded-full blur-xl"></div>
        </div>
      </div>
  );
};

export default MainMenu;