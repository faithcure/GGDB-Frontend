// components/admin/Analytics.jsx
import React from "react";

const Analytics = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">📊 Site Analytics</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded shadow text-center">
          <h3 className="text-lg font-semibold text-yellow-400">Visitors</h3>
          <p className="text-2xl font-bold text-white mt-2">12,354</p>
        </div>
        <div className="bg-gray-800 p-6 rounded shadow text-center">
          <h3 className="text-lg font-semibold text-yellow-400">Most Viewed Game</h3>
          <p className="text-md text-white mt-2">Elden Ring</p>
        </div>
        <div className="bg-gray-800 p-6 rounded shadow text-center">
          <h3 className="text-lg font-semibold text-yellow-400">Top Referrer</h3>
          <p className="text-md text-white mt-2">Google</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
