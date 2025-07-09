// src/components/home/WhatToPlaySection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaGamepad, 
  FaRandom, 
  FaHeart, 
  FaClock, 
  FaFire,
  FaChevronRight,
  FaChevronLeft,
  FaStar,
  FaBolt
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import GameCard from '../common/GameCard';
import { calculateGameMatch, getMatchReasons, getMatchColor } from '../../services/matchCalculator';
import { useUser } from '../../context/UserContext';
import { API_BASE } from '../../config/api';

const WhatToPlaySection = () => {
  const [selectedCategory, setSelectedCategory] = useState('foryou');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hovering, setHovering] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const scrollByAmount = 300;

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: scrollByAmount, behavior: "smooth" });
  };

  // Categories for recommendations
  const categories = [
    { id: 'foryou', label: 'For You', icon: FaStar, color: 'text-purple-500' },
    { id: 'trending', label: 'Trending Now', icon: FaFire, color: 'text-orange-500' },
    { id: 'quick', label: 'Quick Games', icon: FaClock, color: 'text-blue-500' },
    { id: 'random', label: 'Surprise Me', icon: FaRandom, color: 'text-green-500' },
    { id: 'popular', label: 'Most Popular', icon: FaHeart, color: 'text-red-500' }
  ];

  // Mock user data for matching
  const mockUser = {
    favoriteGenres: ['RPG', 'Action', 'Adventure'],
    platforms: ['PC', 'PlayStation 5'],
    stats: { averageRating: 8.2 }
  };

  // Mock recommendations data formatted for GameCard
  const mockRecommendations = {
    foryou: [
      {
        _id: "match1",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5o.webp",
        title: "Baldur's Gate 3",
        rating: 9.6,
        votes: 1250,
        studio: "Larian Studios",
        country: "Belgium",
        metacritic: 96,
        isNew: false,
        isTrending: true,
        genre: "RPG",
        genres: ["RPG", "Adventure"],
        platforms: ["PC", "PlayStation 5"],
        releaseYear: 2023,
        isTopRated: true,
        ggdbRating: 9.6
      },
      {
        _id: "match2",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7a.webp",
        title: "The Witcher 3",
        rating: 9.7,
        votes: 3450,
        studio: "CD Projekt RED",
        country: "Poland",
        metacritic: 95,
        isNew: false,
        isTrending: false,
        genre: "RPG",
        genres: ["RPG", "Adventure"],
        platforms: ["PC", "PlayStation 5"],
        releaseYear: 2015,
        isTopRated: true,
        ggdbRating: 9.7
      },
      {
        _id: "match3",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2l4x.webp",
        title: "Hades",
        rating: 9.4,
        votes: 1580,
        studio: "Supergiant Games",
        country: "USA",
        metacritic: 93,
        isNew: false,
        isTrending: false,
        genre: "Action",
        genres: ["Action", "RPG"],
        platforms: ["PC"],
        releaseYear: 2020,
        isTopRated: true,
        ggdbRating: 9.4
      },
      {
        _id: "match4",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1y8w.webp",
        title: "Stardew Valley",
        rating: 9.1,
        votes: 2890,
        studio: "ConcernedApe",
        country: "USA",
        metacritic: 89,
        isNew: false,
        isTrending: false,
        genre: "Simulation",
        genres: ["Simulation", "RPG"],
        platforms: ["PC", "PlayStation 5"],
        releaseYear: 2016,
        isTopRated: false,
        ggdbRating: 9.1
      },
      {
        _id: "match5",
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1rgi.webp",
        title: "Hollow Knight",
        rating: 9.3,
        votes: 1450,
        studio: "Team Cherry",
        country: "Australia",
        metacritic: 90,
        isNew: false,
        isTrending: false,
        genre: "Metroidvania",
        genres: ["Action", "Adventure"],
        platforms: ["PC"],
        releaseYear: 2017,
        isTopRated: true,
        ggdbRating: 9.3
      }
    ],
    trending: [
      {
        _id: 1,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5o.webp",
        title: "Baldur's Gate 3",
        rating: 9.6,
        votes: 1250,
        studio: "Larian Studios",
        country: "Belgium",
        metacritic: 96,
        isNew: false,
        isTrending: true,
        genre: "RPG",
        releaseYear: 2023,
        isTopRated: true,
        matchPercentage: 98
      },
      {
        _id: 2,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6qst.webp",
        title: "Spider-Man 2",
        rating: 9.2,
        votes: 980,
        studio: "Insomniac Games",
        country: "USA",
        metacritic: 90,
        isNew: true,
        isTrending: true,
        genre: "Action",
        releaseYear: 2023,
        isTopRated: false,
        matchPercentage: 95
      },
      {
        _id: 3,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6r0w.webp",
        title: "Alan Wake 2",
        rating: 8.9,
        votes: 750,
        studio: "Remedy Entertainment",
        country: "Finland",
        metacritic: 88,
        isNew: false,
        isTrending: true,
        genre: "Horror",
        releaseYear: 2023,
        isTopRated: false,
        matchPercentage: 92
      },
      {
        _id: 13,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7c.webp",
        title: "Grand Theft Auto V",
        rating: 9.1,
        votes: 4200,
        studio: "Rockstar Games",
        country: "USA",
        metacritic: 97,
        isNew: false,
        isTrending: true,
        genre: "Action",
        releaseYear: 2013,
        isTopRated: false,
        matchPercentage: 91
      },
      {
        _id: 14,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1yhq.webp",
        title: "Disco Elysium",
        rating: 9.8,
        votes: 890,
        studio: "ZA/UM",
        country: "Estonia",
        metacritic: 97,
        isNew: false,
        isTrending: true,
        genre: "RPG",
        releaseYear: 2019,
        isTopRated: true,
        matchPercentage: 99
      }
    ],
    quick: [
      {
        _id: 4,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2l4x.webp",
        title: "Hades",
        rating: 9.4,
        votes: 1580,
        studio: "Supergiant Games",
        country: "USA",
        metacritic: 93,
        isNew: false,
        isTrending: false,
        genre: "Roguelike",
        releaseYear: 2020,
        isTopRated: true,
        matchPercentage: 97
      },
      {
        _id: 5,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2l8w.webp",
        title: "Rocket League",
        rating: 8.7,
        votes: 2100,
        studio: "Psyonix",
        country: "USA",
        metacritic: 86,
        isNew: false,
        isTrending: false,
        genre: "Sports",
        releaseYear: 2015,
        isTopRated: false,
        matchPercentage: 89
      },
      {
        _id: 6,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6qz2.webp",
        title: "Fall Guys",
        rating: 8.2,
        votes: 1320,
        studio: "Mediatonic",
        country: "UK",
        metacritic: 79,
        isNew: false,
        isTrending: false,
        genre: "Party",
        releaseYear: 2020,
        isTopRated: false,
        matchPercentage: 85
      },
      {
        _id: 15,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1x7w.webp",
        title: "Minecraft",
        rating: 9.0,
        votes: 5890,
        studio: "Mojang Studios",
        country: "Sweden",
        metacritic: 93,
        isNew: false,
        isTrending: false,
        genre: "Sandbox",
        releaseYear: 2011,
        isTopRated: false,
        matchPercentage: 87
      },
      {
        _id: 16,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2l8w.webp",
        title: "Among Us",
        rating: 8.5,
        votes: 1890,
        studio: "InnerSloth",
        country: "USA",
        metacritic: 85,
        isNew: false,
        isTrending: false,
        genre: "Party",
        releaseYear: 2018,
        isTopRated: false,
        matchPercentage: 83
      }
    ],
    random: [
      {
        _id: 7,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1yhq.webp",
        title: "Disco Elysium",
        rating: 9.8,
        votes: 890,
        studio: "ZA/UM",
        country: "Estonia",
        metacritic: 97,
        isNew: false,
        isTrending: false,
        genre: "RPG",
        releaseYear: 2019,
        isTopRated: true,
        matchPercentage: 99
      },
      {
        _id: 8,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1y8w.webp",
        title: "Stardew Valley",
        rating: 9.1,
        votes: 2890,
        studio: "ConcernedApe",
        country: "USA",
        metacritic: 89,
        isNew: false,
        isTrending: false,
        genre: "Simulation",
        releaseYear: 2016,
        isTopRated: false,
        matchPercentage: 94
      },
      {
        _id: 9,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1rgi.webp",
        title: "Hollow Knight",
        rating: 9.3,
        votes: 1450,
        studio: "Team Cherry",
        country: "Australia",
        metacritic: 90,
        isNew: false,
        isTrending: false,
        genre: "Metroidvania",
        releaseYear: 2017,
        isTopRated: true,
        matchPercentage: 96
      },
      {
        _id: 17,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7a.webp",
        title: "The Witcher 3",
        rating: 9.7,
        votes: 3450,
        studio: "CD Projekt RED",
        country: "Poland",
        metacritic: 95,
        isNew: false,
        isTrending: false,
        genre: "RPG",
        releaseYear: 2015,
        isTopRated: true,
        matchPercentage: 98
      },
      {
        _id: 18,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5o.webp",
        title: "Baldur's Gate 3",
        rating: 9.6,
        votes: 1250,
        studio: "Larian Studios",
        country: "Belgium",
        metacritic: 96,
        isNew: false,
        isTrending: true,
        genre: "RPG",
        releaseYear: 2023,
        isTopRated: true,
        matchPercentage: 98
      }
    ],
    popular: [
      {
        _id: 10,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7a.webp",
        title: "The Witcher 3",
        rating: 9.7,
        votes: 3450,
        studio: "CD Projekt RED",
        country: "Poland",
        metacritic: 95,
        isNew: false,
        isTrending: false,
        genre: "RPG",
        releaseYear: 2015,
        isTopRated: true,
        matchPercentage: 98
      },
      {
        _id: 11,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7c.webp",
        title: "Grand Theft Auto V",
        rating: 9.1,
        votes: 4200,
        studio: "Rockstar Games",
        country: "USA",
        metacritic: 97,
        isNew: false,
        isTrending: false,
        genre: "Action",
        releaseYear: 2013,
        isTopRated: false,
        matchPercentage: 91
      },
      {
        _id: 12,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1x7w.webp",
        title: "Minecraft",
        rating: 9.0,
        votes: 5890,
        studio: "Mojang Studios",
        country: "Sweden",
        metacritic: 93,
        isNew: false,
        isTrending: false,
        genre: "Sandbox",
        releaseYear: 2011,
        isTopRated: false,
        matchPercentage: 87
      },
      {
        _id: 19,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2l4x.webp",
        title: "Hades",
        rating: 9.4,
        votes: 1580,
        studio: "Supergiant Games",
        country: "USA",
        metacritic: 93,
        isNew: false,
        isTrending: false,
        genre: "Roguelike",
        releaseYear: 2020,
        isTopRated: true,
        matchPercentage: 97
      },
      {
        _id: 20,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1y8w.webp",
        title: "Stardew Valley",
        rating: 9.1,
        votes: 2890,
        studio: "ConcernedApe",
        country: "USA",
        metacritic: 89,
        isNew: false,
        isTrending: false,
        genre: "Simulation",
        releaseYear: 2016,
        isTopRated: false,
        matchPercentage: 94
      }
    ]
  };

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      
      try {
        const API_BASE_URL = API_BASE;
        const token = localStorage.getItem('token');
        
        // Build headers
        const headers = {
          'Content-Type': 'application/json'
        };
        
        // Add auth header if user is logged in and category is 'foryou'
        if (token && selectedCategory === 'foryou') {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Convert frontend category to backend endpoint
        const categoryMap = {
          'foryou': 'for-you',
          'trending': 'trending',
          'quick': 'quick',
          'random': 'random',
          'popular': 'popular'
        };
        
        const backendCategory = categoryMap[selectedCategory] || selectedCategory;
        
        // Make API call to backend
        const response = await fetch(`${API_BASE_URL}/api/recommendations/${backendCategory}?limit=5`, {
          method: 'GET',
          headers
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ API Success for ${selectedCategory}:`, data);
          if (data.success && data.data.recommendations) {
            console.log(`📊 Received ${data.data.recommendations.length} recommendations`);
            setRecommendations(data.data.recommendations);
          } else {
            console.warn('Invalid API response format:', data);
            // Fallback to mock data
            setRecommendations(mockRecommendations[selectedCategory] || []);
          }
        } else {
          console.error('API request failed:', response.status, response.statusText);
          // Fallback to mock data
          setRecommendations(mockRecommendations[selectedCategory] || []);
        }
        
      } catch (error) {
        console.error('Error loading recommendations from API:', error);
        
        // Fallback to mock data calculation for 'foryou' category
        if (selectedCategory === 'foryou') {
          try {
            const currentUser = user || mockUser;
            const gamesWithMatches = await Promise.all(
              mockRecommendations.foryou.map(async (game) => {
                const matchPercentage = await calculateGameMatch(currentUser, game);
                const matchReasons = getMatchReasons(currentUser, game, matchPercentage);
                
                return {
                  ...game,
                  matchPercentage,
                  matchReasons
                };
              })
            );
            
            const sortedMatches = gamesWithMatches
              .filter(game => game.matchPercentage !== null)
              .sort((a, b) => b.matchPercentage - a.matchPercentage);
              
            setRecommendations(sortedMatches);
          } catch (matchError) {
            console.error('Error calculating matches:', matchError);
            setRecommendations(mockRecommendations.foryou);
          }
        } else {
          // For other categories, use mock data
          setRecommendations(mockRecommendations[selectedCategory] || []);
        }
      }
      
      setLoading(false);
    };

    loadRecommendations();
  }, [selectedCategory, user]);

  // Auto-scroll every 5 seconds when not hovering
  useEffect(() => {
    const interval = setInterval(() => {
      if (!hovering) scrollRight();
    }, 5000);
    return () => clearInterval(interval);
  }, [hovering]);

  const handleGameClick = (game) => {
    navigate(`/game/${game.title.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

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
                What to Play
              </h2>
            </div>
            <p className="text-gray-400 text-sm">
              Personalized recommendations just for you
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

        {/* Recommendations Horizontal Scroll */}
        <div className="relative">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
              <span className="ml-3 text-gray-400">Loading recommendations...</span>
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
                  {recommendations.map((game, index) => (
                    <motion.div
                      key={`${selectedCategory}-${game._id}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="min-w-[280px] max-w-[280px] flex-shrink-0 relative"
                    >
                      {/* Match Badge for "For You" category */}
                      {selectedCategory === 'foryou' && game.matchPercentage && (
                        <div className="absolute top-2 left-2 z-10">
                          <div className={`px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${getMatchColor(game.matchPercentage)} bg-black/70`}>
                            <div className="flex items-center gap-1">
                              <FaBolt className="w-3 h-3" />
                              {game.matchPercentage}%
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="transform scale-95 origin-center">
                        <GameCard 
                          {...game}
                        />
                      </div>

                      {/* Match Reasons Tooltip for "For You" category */}
                      {selectedCategory === 'foryou' && game.matchReasons && game.matchReasons.length > 0 && (
                        <div className="absolute bottom-2 left-2 right-2 opacity-0 hover:opacity-100 transition-opacity duration-200 z-10">
                          <div className="bg-black/90 backdrop-blur-sm rounded-lg p-2">
                            <div className="text-white text-xs">
                              <div className="font-semibold mb-1">Why this matches:</div>
                              <ul className="space-y-1">
                                {game.matchReasons.slice(0, 2).map((reason, i) => (
                                  <li key={i} className="text-gray-300">• {reason}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
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

export default WhatToPlaySection;