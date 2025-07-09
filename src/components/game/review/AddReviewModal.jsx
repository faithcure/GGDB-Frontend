// ✅ AddReviewModal.jsx – Geliştirilmiş sürüm (belli belirsiz stroke + eksik alan uyarıları)

import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useUser } from "../../../context/UserContext";

export default function AddReviewModal({ open, onClose, onSubmit }) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(null);
  const [spoiler, setSpoiler] = useState(null);
  const [error, setError] = useState("");
  const { user } = useUser();

  if (!open || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return setError("You must write a comment.");
    if (rating === null) return setError("Please select a rating.");
    if (spoiler === null) return setError("Please choose if it's a spoiler.");

    await onSubmit({
      user: user.username,
      comment,
      rating,
      spoiler,
    });

    setComment("");
    setRating(null);
    setSpoiler(null);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-[#181a20] border border-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl animate-slideDown relative" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08) inset, 0 0 20px rgba(255,255,255,0.05) inset" }}>
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-100 text-2xl font-bold"
        >×</button>

        <h3 className="text-lg font-bold text-white mb-3">Add Review</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-300 mr-1">Your Rating:</span>
            {[1, 2, 3, 4, 5].map(num => (
              <button
                type="button"
                key={num}
                onClick={() => setRating(num)}
                className={num <= rating ? "text-[#ffd600]" : "text-gray-700"}
                style={{ fontSize: 20 }}
              >
                <FaStar />
              </button>
            ))}
          </div>

          <textarea
            className="w-full px-3 py-2 rounded bg-gray-900 text-white outline-none"
            placeholder="Write your review…"
            rows={3}
            value={comment}
            maxLength={600}
            onChange={e => setComment(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1 text-xs text-gray-300">
            <span className="text-gray-400">This is a spoiler?</span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="spoiler"
                  value="yes"
                  checked={spoiler === true}
                  onChange={() => setSpoiler(true)}
                  className="accent-[#ffd600]"
                />
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="spoiler"
                  value="no"
                  checked={spoiler === false}
                  onChange={() => setSpoiler(false)}
                  className="accent-[#ffd600]"
                />
                No
              </label>
            </div>
          </div>

          {error && (
            <div className="text-xs text-red-500 font-medium bg-red-500/10 border border-red-500/20 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">{comment.length} / 600</span>
          </div>

          <button
            type="submit"
            className="bg-[#ffd600] text-black font-bold px-5 py-2 rounded mt-1 shadow hover:bg-yellow-400 transition"
          >
            Submit
          </button>
        </form>
      </div>

      <style>{`
        .animate-slideDown {
          animation: slideDown .32s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes slideDown {
          0% { opacity:0; transform: translateY(-24px); }
          100% { opacity:1; transform:none; }
        }
      `}</style>
    </div>
  );
}