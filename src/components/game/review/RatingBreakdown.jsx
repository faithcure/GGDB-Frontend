// src/components/game/review/RatingBreakdown.jsx
import React from "react";
import { FaStar } from "react-icons/fa";

export default function RatingBreakdown({ stats }) {
  const total = stats.reduce((a, b) => a + b.count, 0) || 1;
  return (
    <div className="w-full flex flex-col gap-1 mt-4 max-w-sm mx-auto">
      {stats.map(s => {
        const pct = Math.round((s.count / total) * 100);
        return (
          <div className="flex items-center gap-2" key={s.stars}>
            <span className="w-5 text-xs text-gray-700 font-bold flex justify-end">{s.stars}</span>
            <FaStar className="text-[#fde047] text-xs mr-1" />
            <div className="h-2 rounded bg-gray-200 flex-1 overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: `${pct}%`,
                  minWidth: s.count ? 10 : 0,
                  background: `linear-gradient(90deg, #38bdf8 0%, #fde047 100%)`
                }}
              />
            </div>
            <span className="w-8 text-right text-xs text-gray-400">{pct}%</span>
            <span className="w-8 text-right text-xs text-gray-400">{s.count}</span>
          </div>
        );
      })}
    </div>
  );
}
