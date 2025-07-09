// ✅ GGDB - MoreExplorer.jsx (Benzer oyunları şık ve detaylı gösterir, isim benzerliği desteği ekli)

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE } from "../../../config/api";


export default function MoreExplorer() {
  const { gameId } = useParams();
  const [similarGames, setSimilarGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/games/${gameId}/similar`);
        setSimilarGames(res.data);
      } catch (err) {
        console.error("Failed to fetch similar games", err);
      }
    };
    fetchSimilar();
  }, [gameId]);

  return (
    <div className="bg-[#181a20] border border-gray-800 rounded-xl shadow p-5 text-white mb-8">
      <h4 className="font-bold mb-4 text-sm tracking-wide text-white/80">More to explore</h4>

      {similarGames.length === 0 ? (
        <div className="text-gray-500 text-sm">No similar games found.</div>
      ) : (
        <ul className="space-y-4">
          {similarGames.map((sim) => (
            <li
              key={sim._id}
              onClick={() => navigate(`/game/${sim._id}`)}
              className="flex items-center gap-4 cursor-pointer hover:bg-gray-800 px-3 py-2 rounded transition"
            >
              <img
                src={sim.coverImage}
                alt={sim.title}
                className="w-12 h-16 object-cover rounded-md border border-gray-700 shadow-sm"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-gray-100 leading-snug line-clamp-2">
                  {sim.title}
                </span>
                <span className="text-xs text-gray-400 mt-1">Explore details →</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
