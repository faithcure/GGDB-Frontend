import React, { useRef, useEffect, useState } from "react";
import GameCard from "../common/GameCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import { API_BASE } from "../../config/api";

const TopRatedSection = () => {
  const scrollRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);

  const scrollByAmount = 300;

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: scrollByAmount, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/games`);
        const data = res.data;

        if (Array.isArray(data)) {
          setGames(data);
        } else {
          throw new Error("API returned invalid data format");
        }
      } catch (err) {
        setError("Failed to load games. Please try again later.");
      }
    };
    fetchGames();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hovering) scrollRight();
    }, 5000);
    return () => clearInterval(interval);
  }, [hovering]);

  return (
    <section className="bg-gray-950 text-white py-10 relative overflow-hidden">
      <div className="px-0 sm:px-8 max-w-7xl mx-auto">
        {/* Başlık ve alt yazı ortalanmış */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">🔥 Top Rated Games</h2>
          <p className="text-sm text-gray-400 mb-8">
            What our community loves the most.
          </p>
        </div>

        {/* Scroll alanı - fade/gradyan yok, padding ile kartlar tam görünür */}
        <div
          className="relative group"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <button
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-gray-800 text-white p-3 rounded-full shadow hover:bg-gray-700 transition hidden group-hover:block"
          >
            <FaChevronLeft size={20} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-16 overflow-x-auto scroll-smooth scrollbar-hide pb-4 px-8"
            style={{ scrollPaddingLeft: "2rem", scrollPaddingRight: "2rem" }}
          >
            {error ? (
              <p className="text-red-400">{error}</p>
            ) : Array.isArray(games) && games.length > 0 ? (
              games.map((game) => (
                <div
                  className="min-w-[240px] max-w-[240px] flex-shrink-0"
                  key={game._id || game.id}
                >
                  <GameCard
                    _id={game._id}
                    image={game.coverImage || "https://placehold.co/240x360?text=No+Image"}
                    title={game.title}
                    rating={game.userRating || 0}
                    votes={game.votes || 0}
                    metacritic={game.metacritic}
                    studio={game.studio || game.developer || "-"}
                    country={game.country || "us"}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-400">No games available.</p>
            )}
          </div>

          <button
            onClick={scrollRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-gray-800 text-white p-3 rounded-full shadow hover:bg-gray-700 transition hidden group-hover:block"
          >
            <FaChevronRight size={20} />
          </button>
        </div>

        {/* IMDb tarzı ortalanmış buton */}
        <div className="mt-10 flex justify-center">
          <a
            href="/trailers"
            className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-semibold text-lg hover:bg-yellow-300 transition shadow-md"
          >
            <FaChevronRight />
            More Top Rated Games
          </a>
        </div>
      </div>
    </section>
  );
};

export default TopRatedSection;
