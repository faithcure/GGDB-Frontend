import React from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

const MAX_STARS = 5;

export default function AverageStars({ avg }) {
  const fullStars = Math.floor(avg);
  const hasHalf = avg - fullStars >= 0.25 && avg - fullStars < 0.75;
  const emptyStars = MAX_STARS - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1 text-2xl">
      {/* Dolu yıldızlar */}
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} className="text-[#fde047] drop-shadow" />
      ))}
      {/* Yarım yıldız */}
      {hasHalf && <FaStarHalfAlt className="text-[#fde047] drop-shadow" />}
      {/* Boş yıldızlar */}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={i} className="text-[#e2e8f0]" />
      ))}
      {/* Ortalama puan */}
      <span className="ml-2 text-lg font-bold text-white/90">{avg}</span>
    </div>
  );
}
