// 📁 components/admin/GameEdit/TabNavigation.jsx
import React from "react";

const TabNavigation = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b border-gray-700 mb-8 gap-6 text-sm overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-2 font-semibold whitespace-nowrap transition ${
            activeTab === tab
              ? "text-yellow-400 border-b-2 border-yellow-400"
              : "text-gray-400 hover:text-yellow-300"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
