// src/components/home/UpcomingGamesSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaChevronLeft, 
  FaChevronRight,
  FaClock,
  FaGamepad,
  FaFire
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import GameCard from '../common/GameCard';

const UpcomingGamesSection = () => {
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hovering, setHovering] = useState(false);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const scrollByAmount = 300;

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: scrollByAmount, behavior: "smooth" });
  };

  // Mock upcoming games data
  const mockUpcomingGames = [
    {
      _id: "upcoming1",
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6st9.webp",
      title: "The Elder Scrolls VI",
      rating: 0,
      votes: 0,
      studio: "Bethesda Game Studios",
      country: "USA",
      metacritic: null,
      isNew: true,
      isTrending: true,
      genre: "RPG",
      genres: ["RPG", "Adventure"],
      platforms: ["PC", "PlayStation 5", "Xbox Series X/S"],
      releaseDate: "2025-12-31",
      releaseYear: 2025,
      isUpcoming: true,
      ggdbRating: null,
      description: "The highly anticipated next chapter in The Elder Scrolls saga"
    },
    {
      _id: "upcoming2",
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6r8w.webp",
      title: "Grand Theft Auto VI",
      rating: 0,
      votes: 0,
      studio: "Rockstar Games",
      country: "USA",
      metacritic: null,
      isNew: true,
      isTrending: true,
      genre: "Action",
      genres: ["Action", "Adventure"],
      platforms: ["PC", "PlayStation 5", "Xbox Series X/S"],
      releaseDate: "2025-10-15",
      releaseYear: 2025,
      isUpcoming: true,
      ggdbRating: null,
      description: "The next generation of open-world crime action"
    },
    {
      _id: "upcoming3",
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6st2.webp",
      title: "Fable",
      rating: 0,
      votes: 0,
      studio: "Playground Games",
      country: "UK",
      metacritic: null,
      isNew: true,
      isTrending: false,
      genre: "RPG",
      genres: ["RPG", "Fantasy"],
      platforms: ["PC", "Xbox Series X/S"],
      releaseDate: "2025-08-20",
      releaseYear: 2025,
      isUpcoming: true,
      ggdbRating: null,
      description: "A new beginning for the beloved fantasy RPG series"
    },
    {
      _id: "upcoming4",
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6r9x.webp",
      title: "Hollow Knight: Silksong",
      rating: 0,
      votes: 0,
      studio: "Team Cherry",
      country: "Australia",
      metacritic: null,
      isNew: true,
      isTrending: true,
      genre: "Metroidvania",
      genres: ["Action", "Adventure"],
      platforms: ["PC", "PlayStation 5", "Xbox Series X/S", "Nintendo Switch"],
      releaseDate: "2025-06-12",
      releaseYear: 2025,
      isUpcoming: true,
      ggdbRating: null,
      description: "The highly anticipated sequel to the acclaimed Hollow Knight"
    },
    {
      _id: "upcoming5",
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6st5.webp",
      title: "Wolverine",
      rating: 0,
      votes: 0,
      studio: "Insomniac Games",
      country: "USA",
      metacritic: null,
      isNew: true,
      isTrending: true,
      genre: "Action",
      genres: ["Action", "Adventure"],
      platforms: ["PlayStation 5"],
      releaseDate: "2025-11-30",
      releaseYear: 2025,
      isUpcoming: true,
      ggdbRating: null,
      description: "An intense, mature adventure featuring the iconic Marvel hero"
    }
  ];

  useEffect(() => {
    const loadUpcomingGames = async () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setUpcomingGames(mockUpcomingGames);
        setLoading(false);
      }, 500);
    };

    loadUpcomingGames();
  }, []);

  // Auto-scroll every 6 seconds when not hovering
  useEffect(() => {
    const interval = setInterval(() => {
      if (!hovering) scrollRight();
    }, 6000);
    return () => clearInterval(interval);
  }, [hovering]);

  const formatReleaseDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getDaysUntilRelease = (dateString) => {
    const today = new Date();
    const releaseDate = new Date(dateString);
    const diffTime = releaseDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <section className="w-full bg-slate-950 py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-blue-400"></div>
              <h2 className="text-3xl font-bold text-white">
                Upcoming Games
              </h2>
            </div>
            <p className="text-gray-400 text-sm">
              Most anticipated games coming soon
            </p>
          </div>
        </motion.div>

        {/* Upcoming Games Horizontal Scroll */}
        <div className="relative">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <span className="ml-3 text-gray-400">Loading upcoming games...</span>
            </div>
          ) : (
            <div 
              className="relative group"
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              {/* Scroll Navigation Buttons */}
              <button
                onClick={scrollLeft}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-gray-800 text-white p-3 rounded-full shadow hover:bg-gray-700 transition hidden group-hover:block"
              >
                <FaChevronLeft size={20} />
              </button>

              <button
                onClick={scrollRight}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-gray-800 text-white p-3 rounded-full shadow hover:bg-gray-700 transition hidden group-hover:block"
              >
                <FaChevronRight size={20} />
              </button>

              {/* Horizontal Scroll Container */}
              <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-4 px-8"
                style={{ scrollPaddingLeft: "2rem", scrollPaddingRight: "2rem" }}
              >
                <AnimatePresence>
                  {upcomingGames.map((game, index) => (
                    <motion.div
                      key={game._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="min-w-[280px] max-w-[280px] flex-shrink-0 relative"
                    >
                      {/* Coming Soon Badge */}
                      <div className="absolute top-2 left-2 z-10">
                        <div className="px-2 py-1 rounded-full text-xs font-bold bg-blue-500 text-white backdrop-blur-sm">
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt className="w-3 h-3" />
                            Coming Soon
                          </div>
                        </div>
                      </div>

                      {/* Release Date Badge */}
                      <div className="absolute top-2 right-2 z-10">
                        <div className="px-2 py-1 rounded-full text-xs font-bold bg-gray-800 text-white backdrop-blur-sm">
                          <div className="flex items-center gap-1">
                            <FaClock className="w-3 h-3" />
                            {formatReleaseDate(game.releaseDate)}
                          </div>
                        </div>
                      </div>

                      {/* Trending Badge */}
                      {game.isTrending && (
                        <div className="absolute top-12 left-2 z-10">
                          <div className="px-2 py-1 rounded-full text-xs font-bold bg-orange-500 text-white backdrop-blur-sm">
                            <div className="flex items-center gap-1">
                              <FaFire className="w-3 h-3" />
                              Trending
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="transform scale-95 origin-center">
                        <GameCard 
                          {...game}
                          customBadge={
                            <div className="absolute bottom-2 left-2 right-2 bg-black/90 backdrop-blur-sm rounded-lg p-2">
                              <div className="text-white text-xs">
                                <div className="font-semibold mb-1 flex items-center gap-1">
                                  <FaGamepad className="w-3 h-3" />
                                  {getDaysUntilRelease(game.releaseDate)} days to go
                                </div>
                                <p className="text-gray-300 text-xs leading-tight">
                                  {game.description}
                                </p>
                              </div>
                            </div>
                          }
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UpcomingGamesSection;