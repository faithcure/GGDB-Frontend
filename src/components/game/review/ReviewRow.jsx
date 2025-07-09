// ✅ GGDB stiline uygun ReviewRow.jsx – arka plan, yazı rengi, buton renkleri uyarlandı

import React, { useState, useRef, useEffect } from "react";
import {
  FaStar, FaRegStar, FaThumbsUp, FaThumbsDown,
  FaEyeSlash
} from "react-icons/fa";
import { avatarBg, formatDate } from "./utils";
import axios from "axios";
import AuthModal from "../../auth/AuthModal";
import ReviewOptionsMenu from "../../common/ReviewOptionsMenu";
import { API_BASE } from "../../../config/api";

const MAX_STARS = 5;

export default function ReviewRow({ review, globalHideSpoiler, user, handleDelete }) {
  const [likes, setLikes] = useState(review.likes || 0);
  const [dislikes, setDislikes] = useState(review.dislikes || 0);
  const [userVote, setUserVote] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const showComment = !(review.spoiler && globalHideSpoiler);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user?._id) return;
    const liked = review.likedBy?.some(id => id === user._id || id?._id === user._id);
    const disliked = review.dislikedBy?.some(id => id === user._id || id?._id === user._id);
    if (liked) setUserVote("like");
    else if (disliked) setUserVote("dislike");
    else setUserVote(null);
  }, [review, user]);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/game/${review.gameId}#review-${review._id}`;
    navigator.clipboard.writeText(link);
    setShowMenu(false);
  };

  const handleLike = async () => {
    if (!user?._id) return setShowAuthModal(true);
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.patch(`${API_BASE}/api/reviews/${review._id}/vote`, {
        voteType: "like"
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
      setUserVote(res.data.userVote);
    } catch (err) {
      console.error("Like error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!user?._id) return setShowAuthModal(true);
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.patch(`${API_BASE}/api/reviews/${review._id}/vote`, {
        voteType: "dislike"
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
      setUserVote(res.data.userVote);
    } catch (err) {
      console.error("Dislike error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#181a20] rounded-xl border border-gray-800 mb-6 px-6 py-5 text-white shadow relative">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
          style={{ background: avatarBg(review.user) }}
        >
          {review.user.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-semibold text-white text-sm">{review.user}</div>
          <div className="flex gap-1 text-[#fde047] text-xs mt-0.5">
            {[...Array(MAX_STARS)].map((_, i) =>
              i < review.rating
                ? <FaStar key={i} />
                : <FaRegStar key={i} className="text-gray-500" />
            )}
          </div>
        </div>
        <span className="ml-auto text-xs text-gray-400">{formatDate(review.date)}</span>
      </div>

      {!showComment ? (
        <div className="mt-3 text-sm text-gray-300 bg-gray-800 px-4 py-2 rounded flex items-center gap-2 border border-gray-700">
          <FaEyeSlash className="text-red-500" />
          <span className="text-xs font-medium text-gray-300">Spoiler hidden by user settings.</span>
        </div>
      ) : (
        <div className="text-gray-300 text-[15px] leading-relaxed mt-2">
          {review.comment}
        </div>
      )}

      <div className="flex justify-between items-end mt-4">
        <div className="flex gap-4">
          <button
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center gap-1 text-sm ${userVote === "like" ? "text-yellow-400" : "text-gray-500 hover:text-white"}`}
          >
            <FaThumbsUp className="text-base" />
            <span className="text-xs">{likes}</span>
          </button>
          <button
            onClick={handleDislike}
            disabled={loading}
            className={`flex items-center gap-1 text-sm ${userVote === "dislike" ? "text-red-500" : "text-gray-500 hover:text-white"}`}
          >
            <FaThumbsDown className="text-base" />
            <span className="text-xs">{dislikes}</span>
          </button>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(v => !v)}
            disabled={loading}
            className="text-gray-500 hover:text-white text-xl"
            title="Options"
          >
            &#8942;
          </button>

          {showMenu && (
            <ReviewOptionsMenu
              show={showMenu}
              onClose={() => setShowMenu(false)}
              onCopyLink={handleCopyLink}
              onDelete={() => handleDelete?.(review._id)}
              isOwner={user?.username === review.user}
            />
          )}
        </div>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
