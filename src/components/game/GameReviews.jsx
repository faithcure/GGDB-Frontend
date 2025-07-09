// ✅ GameReviews.jsx - Güncellenmiş sürüm
import React, { useEffect, useState, useRef } from "react";
import { FaStar, FaRegStar, FaPlus, FaEyeSlash, FaEye, FaThumbsDown, FaHeart } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import AuthModal from "../auth/AuthModal";
import AddReviewModal from "./review/AddReviewModal";
import ReviewOptionsMenu from "../common/ReviewOptionsMenu";
import { API_BASE } from "../../config/api";

const MAX_STARS = 5;
const pastel = [
  "#9CA3AF", "#A7F3D0", "#FECACA", "#C7D2FE", "#FDE68A",
  "#FCA5A5", "#FDBA74", "#FCD34D", "#6EE7B7", "#A5B4FC"
];
const avatarBg = (str) => pastel[str.charCodeAt(0) % pastel.length];

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
};

function ReviewRow({ review, globalHideSpoiler, user, handleDelete, setShowAuthModal }){
  const [showSpoiler, setShowSpoiler] = useState(false);
  const [likes, setLikes] = useState(review.likes || 0);
  const [dislikes, setDislikes] = useState(review.dislikes || 0);
  const [userVote, setUserVote] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const showReview = !(review.spoiler && globalHideSpoiler);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

const handleLike = async () => {
  if (!user?._id) {
  setShowAuthModal(true);
  return;
    }
  try {
    const res = await axios.patch(`${API_BASE}/api/reviews/${review._id}/vote`, {
      voteType: userVote === "like" ? null : "like",
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    setLikes(res.data.likes);
    setDislikes(res.data.dislikes);
    setUserVote(res.data.userVote);
  } catch (err) {
    console.error("Like error:", err);
  }
};



const handleDislike = async () => {
  if (!user?._id) {
  setShowAuthModal(true);
  return;
    } 
  try {
    const res = await axios.patch(`${API_BASE}/api/reviews/${review._id}/vote`, {
      voteType: userVote === "dislike" ? null : "dislike",
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    setLikes(res.data.likes);
    setDislikes(res.data.dislikes);
    setUserVote(res.data.userVote);
  } catch (err) {
    console.error("Dislike error:", err);
  }
};

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowMenu(false);
  };

  return (
    <div className="flex flex-col gap-2 border-b border-gray-800 px-3 py-6 relative">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold text-white" style={{ background: avatarBg(review.user) }}>
          {review.user.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="font-semibold text-gray-100">{review.user}</span>
              <span className="flex gap-1 items-center">
                {[...Array(MAX_STARS)].map((_, i) =>
                  i < review.rating
                    ? <FaStar key={i} className="text-[#ffd600] text-sm" />
                    : <FaRegStar key={i} className="text-gray-700 text-sm" />
                )}
              </span>
            <span className="ml-auto text-xs text-gray-500">{formatDate(review.date)}</span>
          </div>
          {review.spoiler ? (
            <div className="mt-2 flex items-center gap-3">
              {!showReview ? (
                <span className="text-xs text-red-400 bg-gray-800 px-2 rounded flex items-center gap-1">
                  <FaEyeSlash /> Spoiler hidden
                </span>
              ) : (
                <>
                  <button
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-gray-800 text-xs text-red-400 hover:text-yellow-400 transition"
                    onClick={() => setShowSpoiler((v) => !v)}
                  >
                    {showSpoiler ? <FaEye /> : <FaEyeSlash />}
                    {showSpoiler ? "Hide spoiler" : "Show spoiler"}
                  </button>
                  {showSpoiler && <span className="text-gray-300 ml-4">{review.comment}</span>}
                </>
              )}
            </div>
          ) : (
            <p className="mt-2 text-gray-300">{review.comment}</p>
          )}
          <div className="flex items-center gap-4 text-sm mt-3 justify-between">
            <div className="flex gap-4">
<button
  onClick={handleLike}
  className={`flex items-center gap-1 ${userVote === "like" ? "text-[#ffd600]" : "text-gray-400 hover:text-white"} transition duration-300`}
>
  <FaHeart className="text-base" />
  <span className="text-xs">{likes}</span>
</button>
<button
  onClick={handleDislike}
  className={`flex items-center gap-1 ${userVote === "dislike" ? "text-red-500" : "text-gray-400 hover:text-white"} transition duration-300`}
>
  <FaThumbsDown className="text-base" />
  <span className="text-xs">{dislikes}</span>
</button>

            </div>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(v => !v)}
                className="text-gray-400 hover:text-white text-xl px-2"
                title="Options"
              >
                &#8942;
              </button>
              {showMenu && (
                <ReviewOptionsMenu
                  show={showMenu}
                  onClose={() => setShowMenu(false)}
                  onCopyLink={handleCopyLink}
                  onDelete={() => handleDelete(review._id)}
                  isOwner={user?.username === review.user}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GameReviewsIMDBFlat() {
  const [modalOpen, setModalOpen] = useState(false);
  const [globalHideSpoiler, setGlobalHideSpoiler] = useState(true);
  const [reviews, setReviews] = useState([]);
  const { id: gameId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`${API_BASE}/api/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      console.error("❌ Failed to delete review:", err);
    }
  };


  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/reviews/${gameId}?limit=3`);
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };
    fetchReviews();
  }, [gameId]);

const handleAddReview = async (review) => {
  try {
    const token = localStorage.getItem("token");
    await axios.post(`${API_BASE}/api/reviews/${gameId}`, review, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // ✅ Yeni yorumdan sonra tüm yorumları yeniden çek
    const res = await axios.get(`${API_BASE}/api/reviews/${gameId}?limit=3`);
    setReviews(res.data);
  } catch (err) {
    console.error("Failed to submit review", err);
  }
};


  return (
    <section className="max-w-4xl mx-auto px-4 py-10 border-t border-gray-800">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">User Reviews</h2>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-400 select-none cursor-pointer mr-3">
            <input
              type="checkbox"
              checked={globalHideSpoiler}
              onChange={() => setGlobalHideSpoiler((v) => !v)}
              className="form-checkbox accent-[#ffd600]"
            />
            Hide spoilers
          </label>
          <button
            onClick={() => {
              if (!user) return setShowAuthModal(true);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#22242b] border border-gray-700 px-4 py-2 rounded text-white hover:bg-[#23263a] hover:border-[#ffd600] transition"
          >
            <FaPlus className="text-[#ffd600]" />
            Add Review
          </button>
        </div>
      </div>

      <div className="flex flex-col divide-y divide-gray-800 bg-gray-900/30 rounded-lg shadow-sm">
        {reviews.length === 0 && (
          <div className="text-gray-400 text-center py-12">No reviews yet. Be the first!</div>
        )}
        {reviews.map((review, idx) => (
        <ReviewRow
          review={review}
          key={idx}
          globalHideSpoiler={globalHideSpoiler}
          user={user}
          handleDelete={handleDelete}
          setShowAuthModal={setShowAuthModal} // ✅ burası önemli
        />
        ))}
      </div>

      {reviews.length >= 3 && (
        <div className="w-full flex justify-center mt-4">
          <button
            className="px-5 py-2 rounded bg-gray-800 text-white text-sm border border-gray-700 hover:border-[#ffd600] hover:bg-gray-900 transition"
            onClick={() => navigate(`/game/${gameId}/reviews`)}
          >
            Show More Reviews
          </button>
        </div>
      )}

      {!user && showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {user && (
        <AddReviewModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleAddReview}
        />
      )}
    </section>
    
  );
}
