// src/pages/ContributePerson/Badge.jsx
import React from "react";

const Badge = ({ icon, text, colorClass }) => (
    <span className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-md border ${colorClass}`}>
    {icon}
        {text}
  </span>
);

export default Badge;
