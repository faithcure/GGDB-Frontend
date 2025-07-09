// 📁 components/admin/GameEdit/_Info.jsx
import React from "react";

const Info = ({ label, value }) => (
  <div>
    <label className="text-gray-400 font-medium">{label}</label>
    <p className="bg-gray-800 p-2 rounded border border-gray-700 mt-1">
      {value || "-"}
    </p>
  </div>
);

export default Info;
