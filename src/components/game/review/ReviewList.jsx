import React, { useState } from "react";
import ReviewRow from "./ReviewRow";
import AddReviewModal from "./AddReviewModal";
import { FaPlus } from "react-icons/fa";

// Başlangıç verisi örneği
const defaultReviews = [
  {
    user: "Fatih",
    comment: "Unputdownable. Best plot twist ever.",
    rating: 5,
    date: "2025-05-21",
    spoiler: false,
  },
  {
    user: "Alex",
    comment: "The villain’s real identity is shocking! (Spoiler)",
    rating: 3,
    date: "2025-05-20",
    spoiler: true,
  },
  {
    user: "Sam",
    comment: "I loved the atmosphere. Big spoiler here: The hero dies at the end.",
    rating: 4,
    date: "2025-05-20",
    spoiler: true,
  },
  {
    user: "Cem",
    comment: "Not bad, but too many side quests.",
    rating: 3,
    date: "2025-05-18",
    spoiler: false,
  },
  {
    user: "Derya",
    comment: "Absolutely loved it!",
    rating: 5,
    date: "2025-05-16",
    spoiler: false,
  },
];

export default function ReviewList({
  reviews: reviewsProp,
  onChange, // review eklendiğinde yukarıya haber vermek için (isteğe bağlı)
  showAll = false, // özet mi tam liste mi gösterecek
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [globalHideSpoiler, setGlobalHideSpoiler] = useState(true);
  const [reviews, setReviews] = useState(reviewsProp || defaultReviews);

  // Review eklenince state ve varsa onChange tetiklenir
  const handleAddReview = (review) => {
    setReviews([review, ...reviews]);
    if (onChange) onChange([review, ...reviews]);
  };

  // Özet modda ilk 3 yorum, tümü için tamamı
  const reviewsToShow = showAll ? reviews : reviews.slice(0, 3);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
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
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-[#22242b] border border-gray-700 px-4 py-2 rounded text-white hover:bg-[#23263a] hover:border-[#ffd600] transition"
        >
          <FaPlus className="text-[#ffd600]" />
          Add Review
        </button>
      </div>
      <div className="flex flex-col divide-y divide-gray-800 bg-gray-900/30 rounded-lg shadow-sm">
        {reviews.length === 0 && (
          <div className="text-gray-400 text-center py-12">No reviews yet. Be the first!</div>
        )}
        {reviewsToShow.map((review, idx) => (
          <ReviewRow review={review} key={idx} globalHideSpoiler={globalHideSpoiler} user={user} />

        ))}
      </div>
      {/* Show More */}
      {!showAll && reviews.length > 3 && (
        <div className="w-full flex justify-center mt-4">
          <button
            className="px-5 py-2 rounded bg-gray-800 text-white text-sm border border-gray-700 hover:border-[#ffd600] hover:bg-gray-900 transition"
            // Daha fazla gösterme işlemi üstten yönetilecek, burada örnek için uyarı gösterelim:
            onClick={() => alert("Show More Reviews butonuna tıklandı (bunu /reviews'e yönlendirerek yönetebilirsin)")}
          >
            Show More Reviews
          </button>
        </div>
      )}
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
