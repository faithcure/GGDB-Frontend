// ✅ GGDB - TopRatedGamesSidebar.jsx (en yüksek puanlı oyunları gösterir - maksimum 5 tanesi)

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../../config/api";


export default function TopRatedGamesSidebar() {
  const [topGames, setTopGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/games`);
        const sorted = res.data
          .filter(g => g.ggdbRating && g.coverImage)
          .sort((a, b) => b.ggdbRating - a.ggdbRating)
          .slice(0, 5);
        setTopGames(sorted);
      } catch (err) {
        console.error("Failed to fetch top rated games", err);
      }
    };
    fetchTopRated();
  }, []);

  return (
    <div className="bg-[#181a20] border border-gray-800 rounded-xl shadow p-5 text-white mb-8">
      <h4 className="font-bold mb-4 text-sm tracking-wide text-white/80">Top Rated Games</h4>
      {topGames.length === 0 ? (
        <div className="text-gray-500 text-sm">No data.</div>
      ) : (
        <ul className="space-y-4">
          {topGames.map((game) => (
            <li
              key={game._id}
              onClick={() => navigate(`/game/${game._id}`)}
              className="flex items-center gap-4 cursor-pointer hover:bg-gray-800 px-3 py-2 rounded transition"
            >
              <img
                src={game.coverImage}
                alt={game.title}
                className="w-12 h-16 object-cover rounded-md border border-gray-700 shadow-sm"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-gray-100 leading-snug line-clamp-2">
                  {game.title}
                </span>
                <div className="flex gap-2 mt-1">
                  <span className="bg-yellow-400/10 text-yellow-300 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-yellow-300/20">
                    {game.ggdbRating?.toFixed(1)} GGDB
                  </span>
                  {game.userRating && (
                    <span className="bg-blue-400/10 text-blue-300 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-blue-300/20">
                      {game.userRating.toFixed(1)} User
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
