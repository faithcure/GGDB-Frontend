// ✅ GGDB UI'ye uygun GameReviewPage.jsx – layout optimize edildi, User Score Breakdown sağa kaydırıldı, Add Review butonu geliştirildi

import React, { useEffect, useState } from "react";
import { FaPlus, FaChevronLeft, FaStar } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../../context/UserContext";
import MoreExplorer from "./MoreExplorer";
import ReviewRow from "./ReviewRow";
import AverageStars from "./AverageStars";
import RatingBreakdown from "./RatingBreakdown";
import AddReviewModal from "./AddReviewModal";
import AuthModal from "../../auth/AuthModal";
import TopRatedGamesSidebar from "./TopRatedGamesSidebar";
import { API_BASE } from "../../../config/api";


const getRatingStats = (reviews) => {
  const counts = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    const idx = 5 - r.rating;
    if (idx >= 0 && idx < 5) counts[idx]++;
  });
  return [5, 4, 3, 2, 1].map((star, i) => ({ stars: star, count: counts[i] }));
};

const GGDB = {
  blue: "#38bdf8",
  navy: "#030718",
  yellow: "#fde047",
  gray: "#0e0f11",
};

export default function GameReviewPage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [game, setGame] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [globalHideSpoiler, setGlobalHideSpoiler] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/games/${gameId}`);
        setGame(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch game", err);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/reviews/${gameId}`);
        setReviews(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch reviews", err);
      }
    };

    fetchGame();
    fetchReviews();
  }, [gameId]);

  const handleAddReview = async (review) => {
    try {
      await axios.post(`${API_BASE}/api/reviews/${gameId}`, review);
      const res = await axios.get(`${API_BASE}/api/reviews/${gameId}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to submit review", err);
    }
  };

  const avg = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)
  ).toFixed(2);
  const ratingStats = getRatingStats(reviews);

  let filteredReviews =
    filter === "all"
      ? [...reviews]
      : reviews.filter((r) => r.rating === parseInt(filter));

  if (sortBy === "date") {
    filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortBy === "likes") {
    filteredReviews.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  }

  if (!game) {
    return (
      <div className="text-center py-20 text-gray-400 text-lg">
        Loading game details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0f11]">
      {/* Hero Banner */}
      <div
        className="relative w-full overflow-hidden border-b border-[#38bdf8]"
        style={{ height: "320px" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center blur-md scale-110"
          style={{ backgroundImage: `url(${game.coverImage})`, opacity: 0.28 }}
        ></div>

        <div className="relative z-10 max-w-6xl mx-auto flex flex-col justify-end gap-4 h-full px-6 pb-8">
          <button
            onClick={() => navigate(-1)}
            className="self-start mb-2 text-white hover:text-[#38bdf8] font-semibold text-sm flex items-center gap-2"
          >
            <FaChevronLeft className="text-sm" /> Back to game
          </button>

          <div className="flex items-end gap-6">
            <img
              src={game.coverImage}
              alt={game.title}
              className="w-24 h-36 object-cover rounded-md shadow-md"
            />
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-1">{game.title}</h2>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-300">
                <span className="px-2 py-0.5 rounded bg-gray-700 text-xs">{game.releaseDate}</span>
                <span className="flex items-center gap-1 text-xs text-[#fde047] font-bold">
                  <FaStar className="text-xs" /> {avg} GGDB
                </span>
                <span className="bg-[#38bdf8] text-black font-bold px-2 py-0.5 rounded text-xs">
                  {game.metacriticScore || "N/A"} Metascore
                </span>
                {game.genres?.map((g, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-gray-700 text-xs">
                    {g}
                  </span>
                ))}
                {game.platforms?.map((p, i) => (
                  <span key={i} className="px-2 py-0.5 rounded border border-gray-600 text-xs">
                    {p}
                  </span>
                ))}
              </div>
              <p className="text-gray-300 mt-2 text-sm max-w-2xl">{game.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews + Sidebar */}
      <div className="max-w-[1250px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 px-6">
        <div className="md:col-span-2">
          <div className="bg-[#181a20] border border-gray-800 rounded-xl shadow-lg p-10 mb-10">
            <div className="flex justify-end items-center mb-6">
              <div className="mr-auto flex items-center gap-2 text-white font-bold text-lg">
                <FaStar className="text-[#fde047]" /> User Score Breakdown
              </div>
              <button
                onClick={() => {
                  if (!user) return setShowAuthModal(true);
                  setModalOpen(true);
                }}
                className="flex items-center gap-2 bg-[#38bdf8] hover:bg-[#0ea5e9] text-black font-bold px-5 py-2 rounded shadow-md transition"
              >
                <FaPlus className="text-sm" /> Add Review
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
              <span className="text-gray-400">{reviews.length} user review{reviews.length !== 1 && "s"}</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-gray-900 text-white border border-gray-700 rounded px-2 py-1 text-sm"
              >
                <option value="all">All Ratings</option>
                <option value="5">5★</option>
                <option value="4">4★</option>
                <option value="3">3★</option>
                <option value="2">2★</option>
                <option value="1">1★</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-900 text-white border border-gray-700 rounded px-2 py-1 text-sm"
              >
                <option value="date">Sort by Date</option>
                <option value="likes">Sort by Likes</option>
              </select>
              <label className="flex items-center gap-2 text-gray-400">
                <input
                  type="checkbox"
                  checked={globalHideSpoiler}
                  onChange={() => setGlobalHideSpoiler((v) => !v)}
                  className="form-checkbox accent-[#38bdf8]"
                />
                Hide spoilers
              </label>
            </div>

            {filteredReviews.length === 0 ? (
              <div className="text-gray-500 text-center py-10">No reviews match this filter.</div>
            ) : (
              filteredReviews.map((review, idx) => (
                <ReviewRow review={review} key={idx} globalHideSpoiler={globalHideSpoiler} user={user} />
              ))
            )}
          </div>
        </div>

        <aside>
          <MoreExplorer />    
          <TopRatedGamesSidebar />

          <div className="bg-[#181a20] border border-gray-800 rounded-xl shadow p-5 text-white">
            <h4 className="font-bold mb-3 text-sm">Score Breakdown</h4>
            <RatingBreakdown stats={ratingStats} />
          </div>
        </aside>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {user && (
        <AddReviewModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleAddReview}
        />
      )}
    </div>
  );
}