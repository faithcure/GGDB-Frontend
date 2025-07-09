// src/components/home/TopSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaTrophy, 
  FaChevronLeft, 
  FaChevronRight,
  FaCrown,
  FaMedal,
  FaStar,
  FaAward,
  FaChartLine
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import GameCard from '../common/GameCard';

const TopSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('alltime');
  const [topGames, setTopGames] = useState([]);
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

  // Categories for top games
  const categories = [
    { id: 'alltime', label: 'All Time Top 250', icon: FaTrophy, color: 'text-yellow-500' },
    { id: '2025', label: '2025 Top 250', icon: FaCrown, color: 'text-purple-500' },
    { id: 'bestofyear', label: 'Best of 2024', icon: FaMedal, color: 'text-green-500' },
    { id: 'rising', label: 'Rising Stars', icon: FaChartLine, color: 'text-blue-500' },
    { id: 'critics', label: 'Critics Choice', icon: FaAward, color: 'text-red-500' }
  ];

  // Mock top games data
  const mockTopGames = {
    alltime: [
      {
        _id: "top1",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1yhq.webp",
        title: "Disco Elysium",
        rating: 9.8,
        votes: 2340,
        studio: "ZA/UM",
        country: "Estonia",
        metacritic: 97,
        isNew: false,
        isTrending: false,
        genre: "RPG",
        genres: ["RPG", "Narrative"],
        platforms: ["PC", "PlayStation 5", "Xbox Series X/S"],
        releaseYear: 2019,
        isTopRated: true,
        ggdbRating: 9.8,
        rank: 1,
        description: "A groundbreaking RPG with unparalleled narrative depth"
      },
      {
        _id: "top2",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7a.webp",
        title: "The Witcher 3: Wild Hunt",
        rating: 9.7,
        votes: 5680,
        studio: "CD Projekt RED",
        country: "Poland",
        metacritic: 95,
        isNew: false,
        isTrending: false,
        genre: "RPG",
        genres: ["RPG", "Adventure"],
        platforms: ["PC", "PlayStation 5", "Xbox Series X/S"],
        releaseYear: 2015,
        isTopRated: true,
        ggdbRating: 9.7,
        rank: 2,
        description: "Epic fantasy RPG with incredible world-building"
      },
      {
        _id: "top3",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5o.webp",
        title: "Baldur's Gate 3",
        rating: 9.6,
        votes: 3240,
        studio: "Larian Studios",
        country: "Belgium",
        metacritic: 96,
        isNew: false,
        isTrending: true,
        genre: "RPG",
        genres: ["RPG", "Strategy"],
        platforms: ["PC", "PlayStation 5"],
        releaseYear: 2023,
        isTopRated: true,
        ggdbRating: 9.6,
        rank: 3,
        description: "The ultimate D&D experience in video game form"
      },
      {
        _id: "top4",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2l4x.webp",
        title: "Hades",
        rating: 9.4,
        votes: 2890,
        studio: "Supergiant Games",
        country: "USA",
        metacritic: 93,
        isNew: false,
        isTrending: false,
        genre: "Action",
        genres: ["Action", "RPG"],
        platforms: ["PC", "PlayStation 5", "Xbox Series X/S"],
        releaseYear: 2020,
        isTopRated: true,
        ggdbRating: 9.4,
        rank: 4,
        description: "Perfect blend of story and gameplay mechanics"
      },
      {
        _id: "top5",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1rgi.webp",
        title: "Hollow Knight",
        rating: 9.3,
        votes: 2450,
        studio: "Team Cherry",
        country: "Australia",
        metacritic: 90,
        isNew: false,
        isTrending: false,
        genre: "Metroidvania",
        genres: ["Action", "Adventure"],
        platforms: ["PC", "PlayStation 5", "Xbox Series X/S"],
        releaseYear: 2017,
        isTopRated: true,
        ggdbRating: 9.3,
        rank: 5,
        description: "Masterpiece of atmospheric exploration"
      }
    ],
    '2025': [
      {
        _id: "2025_1",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6qst.webp",
        title: "Spider-Man 2",
        rating: 9.2,
        votes: 1890,
        studio: "Insomniac Games",
        country: "USA",
        metacritic: 90,
        isNew: true,
        isTrending: true,
        genre: "Action",
        genres: ["Action", "Adventure"],
        platforms: ["PlayStation 5"],
        releaseYear: 2023,
        isTopRated: false,
        ggdbRating: 9.2,
        rank: 1,
        description: "Web-slinging perfection with dual protagonist gameplay"
      },
      {
        _id: "2025_2",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6r0w.webp",
        title: "Alan Wake 2",
        rating: 8.9,
        votes: 1340,
        studio: "Remedy Entertainment",
        country: "Finland",
        metacritic: 88,
        isNew: false,
        isTrending: true,
        genre: "Horror",
        genres: ["Horror", "Action"],
        platforms: ["PC", "PlayStation 5", "Xbox Series X/S"],
        releaseYear: 2023,
        isTopRated: false,
        ggdbRating: 8.9,
        rank: 2,
        description: "Psychological horror masterpiece with stunning visuals"
      },
      {
        _id: "2025_3",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5o.webp",
        title: "Baldur's Gate 3",
        rating: 9.6,
        votes: 3240,
        studio: "Larian Studios",
        country: "Belgium",
        metacritic: 96,
        isNew: false,
        isTrending: true,
        genre: "RPG",
        genres: ["RPG", "Strategy"],
        platforms: ["PC", "PlayStation 5"],
        releaseYear: 2023,
        isTopRated: true,
        ggdbRating: 9.6,
        rank: 3,
        description: "Game of the year contender with endless possibilities"
      },
      {
        _id: "2025_4",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6st3.webp",
        title: "Starfield",
        rating: 8.2,
        votes: 2150,
        studio: "Bethesda Game Studios",
        country: "USA",
        metacritic: 82,
        isNew: true,
        isTrending: false,
        genre: "RPG",
        genres: ["RPG", "Space"],
        platforms: ["PC", "Xbox Series X/S"],
        releaseYear: 2023,
        isTopRated: false,
        ggdbRating: 8.2,
        rank: 4,
        description: "Ambitious space exploration RPG from Bethesda"
      },
      {
        _id: "2025_5",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6r8w.webp",
        title: "Hogwarts Legacy",
        rating: 8.7,
        votes: 3890,
        studio: "Avalanche Software",
        country: "USA",
        metacritic: 84,
        isNew: false,
        isTrending: false,
        genre: "RPG",
        genres: ["RPG", "Adventure"],
        platforms: ["PC", "PlayStation 5", "Xbox Series X/S"],
        releaseYear: 2023,
        isTopRated: false,
        ggdbRating: 8.7,
        rank: 5,
        description: "Magical wizarding world adventure"
      }
    ],
    bestofyear: [
      {
        _id: "best1",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5o.webp",
        title: "Baldur's Gate 3",
        rating: 9.6,
        votes: 3240,
        studio: "Larian Studios",
        country: "Belgium",
        metacritic: 96,
        isNew: false,
        isTrending: true,
        genre: "RPG",
        genres: ["RPG", "Strategy"],
        platforms: ["PC", "PlayStation 5"],
        releaseYear: 2023,
        isTopRated: true,
        ggdbRating: 9.6,
        rank: 1,
        description: "Unanimous game of the year winner"
      },
      {
        _id: "best2",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6qst.webp",
        title: "Spider-Man 2",
        rating: 9.2,
        votes: 1890,
        studio: "Insomniac Games",
        country: "USA",
        metacritic: 90,
        isNew: true,
        isTrending: true,
        genre: "Action",
        genres: ["Action", "Adventure"],
        platforms: ["PlayStation 5"],
        releaseYear: 2023,
        isTopRated: false,
        ggdbRating: 9.2,
        rank: 2,
        description: "PlayStation's superhero showcase"
      },
      {
        _id: "best3",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6r0w.webp",
        title: "Alan Wake 2",
        rating: 8.9,
        votes: 1340,
        studio: "Remedy Entertainment",
        country: "Finland",
        metacritic: 88,
        isNew: false,
        isTrending: true,
        genre: "Horror",
        genres: ["Horror", "Action"],
        platforms: ["PC", "PlayStation 5", "Xbox Series X/S"],
        releaseYear: 2023,
        isTopRated: false,
        ggdbRating: 8.9,
        rank: 3,
        description: "Horror game of the year"
      },
      {
        _id: "best4",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6st4.webp",
        title: "Pizza Tower",
        rating: 9.0,
        votes: 890,
        studio: "Tour De Pizza",
        country: "Canada",
        metacritic: 88,
        isNew: true,
        isTrending: false,
        genre: "Platformer",
        genres: ["Platformer", "Action"],
        platforms: ["PC", "Nintendo Switch"],
        releaseYear: 2023,
        isTopRated: false,
        ggdbRating: 9.0,
        rank: 4,
        description: "Indie platformer perfection"
      },
      {
        _id: "best5",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6r8w.webp",
        title: "Hogwarts Legacy",
        rating: 8.7,
        votes: 3890,
        studio: "Avalanche Software",
        country: "USA",
        metacritic: 84,
        isNew: false,
        isTrending: false,
        genre: "RPG",
        genres: ["RPG", "Adventure"],
        platforms: ["PC", "PlayStation 5", "Xbox Series X/S"],
        releaseYear: 2023,
        isTopRated: false,
        ggdbRating: 8.7,
        rank: 5,
        description: "Magical adventure of the year"
      }
    ],
    rising: [
      {
        _id: "rising1",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6st4.webp",
        title: "Pizza Tower",
        rating: 9.0,
        votes: 890,
        studio: "Tour De Pizza",
        country: "Canada",
        metacritic: 88,
        isNew: true,
        isTrending: true,
        genre: "Platformer",
        genres: ["Platformer", "Action"],
        platforms: ["PC", "Nintendo Switch"],
        releaseYear: 2023,
        isTopRated: false,
        ggdbRating: 9.0,
        rank: 1,
        description: "Breakout indie sensation"
      },
      {
        _id: "rising2",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6st5.webp",
        title: "Lethal Company",
        rating: 8.8,
        votes: 1240,
        studio: "Zeekerss",
        country: "Finland",
        metacritic: 86,
        isNew: true,
        isTrending: true,
        genre: "Horror",
        genres: ["Horror", "Co-op"],
        platforms: ["PC"],
        releaseYear: 2023,
        isTopRated: false,
        ggdbRating: 8.8,
        rank: 2,
        description: "Viral co-op horror phenomenon"
      },
      {
        _id: "rising3",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6st6.webp",
        title: "Bomb Rush Cyberfunk",
        rating: 8.5,
        votes: 670,
        studio: "Team Reptile",
        country: "Netherlands",
        metacritic: 83,
        isNew: true,
        isTrending: true,
        genre: "Action",
        genres: ["Action", "Sports"],
        platforms: ["PC", "PlayStation 5", "Xbox Series X/S"],
        releaseYear: 2023,
        isTopRated: false,
        ggdbRating: 8.5,
        rank: 3,
        description: "Stylish street culture game"
      },
      {
        _id: "rising4",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6st7.webp",
        title: "Dredge",
        rating: 8.3,
        votes: 1120,
        studio: "Black Salt Games",
        country: "New Zealand",
        metacritic: 81,
        isNew: true,
        isTrending: false,
        genre: "Adventure",
        genres: ["Adventure", "Horror"],
        platforms: ["PC", "PlayStation 5", "Xbox Series X/S"],
        releaseYear: 2023,
        isTopRated: false,
        ggdbRating: 8.3,
        rank: 4,
        description: "Atmospheric fishing horror"
      },
      {
        _id: "rising5",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6st8.webp",
        title: "Jusant",
        rating: 8.4,
        votes: 890,
        studio: "DON'T NOD",
        country: "France",
        metacritic: 82,
        isNew: true,
        isTrending: false,
        genre: "Adventure",
        genres: ["Adventure", "Puzzle"],
        platforms: ["PC", "Xbox Series X/S"],
        releaseYear: 2023,
        isTopRated: false,
        ggdbRating: 8.4,
        rank: 5,
        description: "Meditative climbing adventure"
      }
    ],
    critics: [
      {
        _id: "critics1",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5o.webp",
        title: "Baldur's Gate 3",
        rating: 9.6,
        votes: 3240,
        studio: "Larian Studios",
        country: "Belgium",
        metacritic: 96,
        isNew: false,
        isTrending: true,
        genre: "RPG",
        genres: ["RPG", "Strategy"],
        platforms: ["PC", "PlayStation 5"],
        releaseYear: 2023,
        isTopRated: true,
        ggdbRating: 9.6,
        rank: 1,
        description: "Critics' unanimous choice"
      },
      {
        _id: "critics2",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6qst.webp",
        title: "Spider-Man 2",
        rating: 9.2,
        votes: 1890,
        studio: "Insomniac Games",
        country: "USA",
        metacritic: 90,
        isNew: true,
        isTrending: true,
        genre: "Action",
        genres: ["Action", "Adventure"],
        platforms: ["PlayStation 5"],
        releaseYear: 2023,
        isTopRated: false,
        ggdbRating: 9.2,
        rank: 2,
        description: "Critics praise technical excellence"
      },
      {
        _id: "critics3",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6r0w.webp",
        title: "Alan Wake 2",
        rating: 8.9,
        votes: 1340,
        studio: "Remedy Entertainment",
        country: "Finland",
        metacritic: 88,
        isNew: false,
        isTrending: true,
        genre: "Horror",
        genres: ["Horror", "Action"],
        platforms: ["PC", "PlayStation 5", "Xbox Series X/S"],
        releaseYear: 2023,
        isTopRated: false,
        ggdbRating: 8.9,
        rank: 3,
        description: "Critics acclaim artistic vision"
      },
      {
        _id: "critics4",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6st4.webp",
        title: "Pizza Tower",
        rating: 9.0,
        votes: 890,
        studio: "Tour De Pizza",
        country: "Canada",
        metacritic: 88,
        isNew: true,
        isTrending: false,
        genre: "Platformer",
        genres: ["Platformer", "Action"],
        platforms: ["PC", "Nintendo Switch"],
        releaseYear: 2023,
        isTopRated: false,
        ggdbRating: 9.0,
        rank: 4,
        description: "Critics love innovative design"
      },
      {
        _id: "critics5",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1yhq.webp",
        title: "Disco Elysium",
        rating: 9.8,
        votes: 2340,
        studio: "ZA/UM",
        country: "Estonia",
        metacritic: 97,
        isNew: false,
        isTrending: false,
        genre: "RPG",
        genres: ["RPG", "Narrative"],
        platforms: ["PC", "PlayStation 5", "Xbox Series X/S"],
        releaseYear: 2019,
        isTopRated: true,
        ggdbRating: 9.8,
        rank: 5,
        description: "Timeless critics' favorite"
      }
    ]
  };

  useEffect(() => {
    const loadTopGames = async () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setTopGames(mockTopGames[selectedCategory] || []);
        setLoading(false);
      }, 300);
    };

    loadTopGames();
  }, [selectedCategory]);

  // Auto-scroll every 7 seconds when not hovering
  useEffect(() => {
    const interval = setInterval(() => {
      if (!hovering) scrollRight();
    }, 7000);
    return () => clearInterval(interval);
  }, [hovering]);

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-orange-400';
    return 'text-gray-500';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return FaTrophy;
    if (rank === 2) return FaMedal;
    if (rank === 3) return FaAward;
    return FaStar;
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
              <div className="w-1 h-8 bg-yellow-400"></div>
              <h2 className="text-3xl font-bold text-white">
                Top Games
              </h2>
            </div>
            <p className="text-gray-400 text-sm">
              The highest rated games across different categories
            </p>
          </div>
        </motion.div>

        {/* Category Pills */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-yellow-400 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${selectedCategory === category.id ? 'text-black' : category.color}`} />
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Top Games Horizontal Scroll */}
        <div className="relative">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
              <span className="ml-3 text-gray-400">Loading top games...</span>
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
                <AnimatePresence mode="wait">
                  {topGames.map((game, index) => {
                    const RankIcon = getRankIcon(game.rank);
                    return (
                      <motion.div
                        key={`${selectedCategory}-${game._id}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="min-w-[280px] max-w-[280px] flex-shrink-0 relative"
                      >
                        {/* Rank Badge */}
                        <div className="absolute top-2 left-2 z-10">
                          <div className={`px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm bg-black/80 ${getRankColor(game.rank)}`}>
                            <div className="flex items-center gap-1">
                              <RankIcon className="w-4 h-4" />
                              #{game.rank}
                            </div>
                          </div>
                        </div>

                        {/* Metacritic Score */}
                        {game.metacritic && (
                          <div className="absolute top-2 right-2 z-10">
                            <div className="px-2 py-1 rounded-full text-xs font-bold bg-green-600 text-white backdrop-blur-sm">
                              {game.metacritic}
                            </div>
                          </div>
                        )}

                        <div className="transform scale-95 origin-center">
                          <GameCard 
                            {...game}
                          />
                        </div>

                        {/* Game Description */}
                        <div className="absolute bottom-2 left-2 right-2 opacity-0 hover:opacity-100 transition-opacity duration-200 z-10">
                          <div className="bg-black/90 backdrop-blur-sm rounded-lg p-2">
                            <div className="text-white text-xs">
                              <div className="font-semibold mb-1 flex items-center gap-1">
                                <FaTrophy className="w-3 h-3 text-yellow-400" />
                                Top Rated
                              </div>
                              <p className="text-gray-300 text-xs leading-tight">
                                {game.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TopSection;