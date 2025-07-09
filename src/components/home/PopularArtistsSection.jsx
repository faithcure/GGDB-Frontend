import React, { useRef } from "react";
import { FaArrowUp, FaArrowDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const popularArtists = [
    { name: "Hideo Kojima", roles: "Game Designer, Writer", image: "https://placehold.co/200x200?text=HK", rank: 1, change: 2 },
    { name: "Keanu Reeves", roles: "Actor, Writer, Director", image: "https://placehold.co/200x200?text=KR", rank: 2, change: -1 },
    { name: "Shigeru Miyamoto", roles: "Game Director, Producer", image: "https://placehold.co/200x200?text=SM", rank: 3, change: 0 },
    { name: "Neil Druckmann", roles: "Writer, Director", image: "https://placehold.co/200x200?text=ND", rank: 4, change: -2 },
    { name: "Cory Barlog", roles: "Director, God of War", image: "https://placehold.co/200x200?text=CB", rank: 5, change: 1 },
    { name: "Ashley Johnson", roles: "Voice Actress", image: "https://placehold.co/200x200?text=AJ", rank: 6, change: 0 },
    { name: "Nolan North", roles: "3D artist", image: "https://placehold.co/200x200?text=NN", rank: 7, change: 2 },
    { name: "Sam Lake", roles: "Writer, Director", image: "https://placehold.co/200x200?text=SL", rank: 8, change: 1 },
    { name: "Troy Baker", roles: "Environment Artist", image: "https://placehold.co/200x200?text=TB", rank: 9, change: -1 },
    { name: "Yoko Taro", roles: "Game Developer", image: "https://placehold.co/200x200?text=YT", rank: 10, change: 3 },
    { name: "Ken Levine", roles: "Creative Director", image: "https://placehold.co/200x200?text=KL", rank: 11, change: -2 },
    { name: "Cliff Bleszinski", roles: "Game Designer", image: "https://placehold.co/200x200?text=CB2", rank: 12, change: -3 },
    { name: "Amy Hennig", roles: "Game Writer", image: "https://placehold.co/200x200?text=AH", rank: 13, change: 1 },
    { name: "Jen Zee", roles: "Art Director", image: "https://placehold.co/200x200?text=JZ", rank: 14, change: 0 },
    { name: "Jesper Kyd", roles: "Composer", image: "https://placehold.co/200x200?text=JK", rank: 15, change: 2 },
    { name: "Ikumi Nakamura", roles: "Creative Director", image: "https://placehold.co/200x200?text=IN", rank: 16, change: 1 },
  ];

const PopularArtistsSection = () => {
  const scrollRef = useRef();

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-gray-900 py-20 px-4 w-full relative overflow-hidden">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
          Meet the Artists Behind the Games 🎭
        </h2>
        <p className="text-gray-700 text-md max-w-xl mx-auto">
          Writers, voice actors, and creative minds who brought your favorite worlds to life.
        </p>
      </div>

      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-gray-700 p-2 rounded-full shadow"
        >
          <FaChevronLeft />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-10 overflow-x-auto pb-2 no-scrollbar px-12"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {popularArtists.map((artist, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-48 text-center"
            >
              <div className="relative w-32 h-32 mx-auto mb-4">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="rounded-full w-full h-full object-cover border-4 border-yellow-400"
                />
                <div className="absolute bottom-0 right-0 bg-yellow-500 text-xs text-black font-bold px-2 py-0.5 rounded-full border border-yellow-600 shadow">
                  #{artist.rank}
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">{artist.name}</h3>
              <p className="text-sm text-gray-600">{artist.roles}</p>
              {artist.change !== 0 && (
                <div
                  className={`mt-2 text-sm font-semibold flex items-center justify-center ${
                    artist.change > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {artist.change > 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                  {Math.abs(artist.change)}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-gray-700 p-2 rounded-full shadow"
        >
          <FaChevronRight />
        </button>
      </div>

      <div className="text-center mt-10">
        <a
          href="/artists"
          className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-semibold text-lg hover:bg-yellow-300 transition shadow-md"
        >
          View All Artists →
        </a>
      </div>
    </section>
  );
};

export default PopularArtistsSection;
