// src/components/CreditSection.jsx
import React, { useState } from "react";

const CreditSection = ({ credits }) => {
  const [activeRole, setActiveRole] = useState(Object.keys(credits)[0]);
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (role, type) => {
    setExpandedSections((prev) => ({
      ...prev,
      [`${role}_${type}`]: !prev[`${role}_${type}`],
    }));
  };

  return (
    <div className="mt-16">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 p-6 rounded-lg mb-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-2">Gameography</h2>
        <p className="text-white/90 text-sm">Explore the complete gaming journey</p>
      </div>

      {/* Role Tabs with gradient styling */}
      <div className="flex gap-4 mb-8 flex-wrap">
        {Object.keys(credits).map((role) => (
          <button
            key={role}
            onClick={() => setActiveRole(role)}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
              activeRole === role
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "bg-gradient-to-r from-gray-600 to-gray-700 text-white/80 hover:from-gray-500 hover:to-gray-600"
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Accordion with colorful styling */}
      {["upcoming", "previous"].map((type) =>
        credits[activeRole]?.[type]?.length ? (
          <div key={type} className="mb-8">
            <button
              onClick={() => toggleSection(activeRole, type)}
              className={`w-full text-left flex justify-between items-center py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] ${
                type === "upcoming"
                  ? "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-400 hover:to-teal-500"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500"
              } shadow-lg`}
            >
              <span className="text-white font-bold text-lg capitalize">{type}</span>
              <span className="text-white text-xl">
                {expandedSections[`${activeRole}_${type}`] ? "▲" : "▼"}
              </span>
            </button>
            {expandedSections[`${activeRole}_${type}`] && (
              <div className="mt-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 shadow-inner">
                <ul className="space-y-4">
                  {credits[activeRole][type].map((item, i) => (
                    <li key={i} className="p-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg flex gap-4 items-center hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-[1.02] shadow-md">
                      <img
                        src={item.poster || "https://placehold.co/60x90?text=No+Image"}
                        alt={item.title}
                        className="w-14 h-20 object-cover rounded-lg shadow-lg border-2 border-gradient-to-r from-blue-400 to-purple-500"
                        onError={(e) => (e.target.src = "https://placehold.co/60x90?text=No+Image")}
                      />
                      <div className="flex-1">
                        <p className="text-white font-bold text-lg leading-tight">{item.title}</p>
                        <p className="text-blue-300 text-sm font-medium">{item.role}</p>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <p className="text-green-400 text-sm font-semibold">{item.year}</p>
                        {item.rating !== undefined && (
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <span className="text-yellow-400 text-lg">⭐</span>
                            <span className="text-yellow-400 text-sm font-bold">{item.rating}</span>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : null
      )}
    </div>
  );
};

export default CreditSection;
