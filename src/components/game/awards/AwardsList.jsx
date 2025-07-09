// 📁 src/components/game/awards/AwardsList.jsx
import React from "react";

const AwardsList = ({ awards, limit = null, showLink = false }) => {
  if (!awards || awards.length === 0) {
    return <p className="text-white/60 italic">No awards available.</p>;
  }

  const displayedAwards = limit ? awards.slice(0, limit) : awards;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayedAwards.map((award, index) => (
          <div
            key={index}
            className="relative group rounded-xl px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-yellow-400/10 to-yellow-600/5 opacity-0 group-hover:opacity-100 transition duration-300 blur-lg pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <h3 className="text-base font-semibold text-white leading-tight">
                  {award.title} {award.date ? `- ${award.date}` : ""}
                </h3>
              </div>
              {award.category && (
                <p className="text-xs text-white/60 pl-6">{award.category}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {showLink && (
        <div className="text-right mt-2">
          <a
            href="#awards"
            className="text-sm text-yellow-400 hover:underline hover:text-yellow-300 transition"
          >
            → View all awards
          </a>
        </div>
      )}
    </div>
  );
};

export default AwardsList;
