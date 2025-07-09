import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import GameCard from "../components/common/GameCard";
import { FaPlay, FaFire, FaStar, FaGamepad, FaSearch, FaFilter, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import { BsController } from "react-icons/bs";
import { API_BASE } from "../config/api";

const HERO_BACKGROUNDS = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1920&h=1080&fit=crop",
];

const CATEGORY_FILTERS = [
  { 
    id: "featured", 
    label: "🔥 Featured", 
    color: "from-orange-500 to-red-500",
    description: "Handpicked by editors"
  },
  { 
    id: "new", 
    label: "✨ New Releases", 
    color: "from-emerald-500 to-cyan-500",
    description: "Fresh out of the oven"
  },
  { 
    id: "trending", 
    label: "📈 Trending", 
    color: "from-purple-500 to-pink-500",
    description: "Everyone's talking about"
  },
  { 
    id: "upcoming", 
    label: "🚀 Coming Soon", 
    color: "from-blue-500 to-indigo-500",
    description: "Future blockbusters"
  },
  { 
    id: "indie", 
    label: "💎 Indie Gems", 
    color: "from-yellow-500 to-orange-500",
    description: "Hidden treasures"
  }
];

const GENRE_PILLS = [
  "Action", "Adventure", "RPG", "Strategy", "Shooter", "Horror", 
  "Puzzle", "Racing", "Sports", "Simulation", "Fighting", "Platformer"
];

const InteractiveTrailerShowcase = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [featuredGame, setFeaturedGame] = useState(null);
  const [activeCategory, setActiveCategory] = useState("featured");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [viewMode, setViewMode] = useState("grid"); // grid, list, showcase
  const [sortBy, setSortBy] = useState("rating");
  const [isLoading, setIsLoading] = useState(true);
  
  const heroRef = useRef(null);
  const searchRef = useRef(null);

  // Hero background rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Fetch games data
  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/games`);
        const gamesData = res.data || [];
        
        // Add mock properties for demo
        const enhancedGames = gamesData.map((game, index) => ({
          ...game,
          isNew: index < 3,
          isTrending: index % 3 === 0,
          isExclusive: index % 5 === 0,
          trailerViews: Math.floor(Math.random() * 1000000) + 10000,
          releaseYear: new Date(game.releaseDate).getFullYear() || 2024,
          platforms: ["PC", "PS5", "Xbox"].slice(0, Math.floor(Math.random() * 3) + 1)
        }));
        
        setGames(enhancedGames);
        setFeaturedGame(enhancedGames[0]);
        setFilteredGames(enhancedGames);
      } catch (err) {
        console.error("Failed to load games", err);
        setGames([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Advanced filtering logic
  useEffect(() => {
    let result = [...games];

    // Category filter
    if (activeCategory !== "featured") {
      switch (activeCategory) {
        case "new":
          result = result.filter(game => game.isNew);
          break;
        case "trending":
          result = result.filter(game => game.isTrending);
          break;
        case "upcoming":
          result = result.filter(game => new Date(game.releaseDate) > new Date());
          break;
        case "indie":
          result = result.filter(game => game.studio && game.studio.length < 20);
          break;
      }
    }

    // Genre filter
    if (selectedGenres.length > 0) {
      result = result.filter(game => 
        game.genres && selectedGenres.some(genre => game.genres.includes(genre))
      );
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(game =>
        game.title.toLowerCase().includes(query) ||
        game.studio?.toLowerCase().includes(query) ||
        game.genres?.some(genre => genre.toLowerCase().includes(query))
      );
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.userRating || 0) - (a.userRating || 0);
        case "newest":
          return new Date(b.releaseDate) - new Date(a.releaseDate);
        case "popular":
          return (b.trailerViews || 0) - (a.trailerViews || 0);
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredGames(result);
  }, [games, activeCategory, selectedGenres, searchQuery, sortBy]);

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const clearAllFilters = () => {
    setSelectedGenres([]);
    setSearchQuery("");
    setActiveCategory("featured");
    setSortBy("rating");
  };

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      {/* Epic Hero Section */}
      <div 
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Dynamic Background */}
        <div className="absolute inset-0">
          {HERO_BACKGROUNDS.map((bg, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-2000 ${
                index === heroIndex ? 'opacity-30' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${bg})` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-blue-900/30" />
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-cyan-200 mb-6 animate-pulse-slow">
              GAME TRAILERS
            </h1>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent flex-1 max-w-xs" />
              <HiSparkles className="text-purple-400 text-2xl animate-spin-slow" />
              <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent flex-1 max-w-xs" />
            </div>
            <p className="text-2xl text-white/80 mb-12 font-light tracking-wide">
              Discover epic gameplay, watch exclusive trailers, and experience the future of gaming
            </p>
          </div>

          {/* Interactive Search */}
          <div className="relative max-w-2xl mx-auto mb-12">
            <div className={`relative transition-all duration-500 ${isSearchFocused ? 'scale-105' : ''}`}>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search for games, studios, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full px-8 py-6 text-xl bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300"
              />
              <FaSearch className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white/50 text-xl" />
              {isSearchFocused && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl animate-pulse pointer-events-none" />
              )}
            </div>
          </div>

          {/* Stats Counter */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-black text-white mb-2">{games.length}</div>
              <div className="text-white/60 uppercase tracking-wider text-sm">Games</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-white mb-2">
                {formatViews(games.reduce((acc, game) => acc + (game.trailerViews || 0), 0))}
              </div>
              <div className="text-white/60 uppercase tracking-wider text-sm">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-white mb-2">
                {Math.floor(games.reduce((acc, game) => acc + (game.userRating || 0), 0) / games.length * 10) / 10}
              </div>
              <div className="text-white/60 uppercase tracking-wider text-sm">Avg Rating</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {CATEGORY_FILTERS.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`group relative px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 ${
                    activeCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-2xl scale-105`
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/20'
                  }`}
                >
                  {category.label}
                  {activeCategory === category.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full animate-shimmer" />
                  )}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  showFilters ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <FaFilter />
                Filters
                {(selectedGenres.length > 0 || searchQuery) && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedGenres.length + (searchQuery ? 1 : 0)}
                  </span>
                )}
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-400"
              >
                <option value="rating">⭐ Highest Rated</option>
                <option value="newest">🆕 Newest First</option>
                <option value="popular">🔥 Most Popular</option>
                <option value="alphabetical">🔤 A-Z</option>
              </select>

              <div className="flex bg-white/10 rounded-lg p-1">
                {['grid', 'list'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1 rounded transition-all duration-200 ${
                      viewMode === mode ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {mode === 'grid' ? '⊞' : '☰'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white/5 rounded-xl backdrop-blur-sm animate-slideDown">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <HiLightningBolt className="text-yellow-400" />
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {GENRE_PILLS.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => toggleGenre(genre)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                          selectedGenres.includes(genre)
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                            : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
                
                {(selectedGenres.length > 0 || searchQuery) && (
                  <button
                    onClick={clearAllFilters}
                    className="self-start flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all duration-300"
                  >
                    <FaTimes />
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Games Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              <BsController className="absolute inset-0 m-auto text-2xl text-purple-400 animate-pulse" />
            </div>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold text-white mb-4">No games found</h3>
            <p className="text-white/60 mb-8">Try adjusting your filters or search terms</p>
            <button
              onClick={clearAllFilters}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full hover:scale-105 transition-transform duration-300"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">
                {filteredGames.length} Games Found
              </h2>
              <div className="text-white/60">
                Showing {activeCategory === "featured" ? "all games" : CATEGORY_FILTERS.find(c => c.id === activeCategory)?.description}
              </div>
            </div>

            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' 
                : 'space-y-6'
            }`}>
              {filteredGames.map((game, index) => (
                <div
                  key={game._id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <GameCard
                    _id={game._id}
                    image={game.coverImage}
                    title={game.title}
                    rating={game.userRating || Math.random() * 3 + 7}
                    votes={game.trailerViews || Math.floor(Math.random() * 100000)}
                    studio={game.studio}
                    country={game.country?.toLowerCase() || "us"}
                    metacritic={game.metacriticScore}
                    isNew={game.isNew}
                    isTrending={game.isTrending}
                    isExclusive={game.isExclusive}
                    genre={game.genres?.[0]}
                    releaseYear={game.releaseYear}
                    platforms={game.platforms}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #ec4899);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #db2777);
        }
      `}</style>
    </div>
  );
};

export default InteractiveTrailerShowcase;