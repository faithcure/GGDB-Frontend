import React, { useState, useRef, useEffect } from "react";

const DashboardTabs = ({ activeTab, setActiveTab, tabs }) => {
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabRefs = useRef({});

  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (activeTabElement) {
      setIndicatorStyle({
        width: activeTabElement.offsetWidth,
        left: activeTabElement.offsetLeft,
      });
    }
  }, [activeTab]);

  return (
    <div className="relative my-6">
      {/* Modern Professional Container */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-1.5 shadow-lg">
        <nav className="flex gap-1 relative">
          {/* Smooth Active Indicator */}
          <div
            className="absolute top-0 bottom-0 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-lg shadow-md transition-all duration-300 ease-out"
            style={{
              width: indicatorStyle.width,
              transform: `translateX(${indicatorStyle.left}px)`,
              zIndex: 1
            }}
          />
          
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => (tabRefs.current[tab.id] = el)}
                onClick={() => setActiveTab(tab.id)}
                className={`relative z-10 px-6 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-3 rounded-lg ${
                  isActive
                    ? 'text-black'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {/* Icon */}
                <span className={`text-base transition-all duration-200 ${
                  isActive ? 'scale-105' : 'group-hover:scale-105'
                }`}>
                  {tab.icon}
                </span>
                
                {/* Label */}
                <span className="font-semibold">
                  {tab.label}
                </span>
                
                {/* Professional Badge */}
                {tab.badge && (
                  <span className={`ml-1 px-2 py-0.5 text-xs rounded-full font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-black/20 text-black' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
      
      {/* Subtle ambient shadow */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-transparent to-yellow-500/5 rounded-xl blur-xl -z-10" />
    </div>
  );
};

export default DashboardTabs;