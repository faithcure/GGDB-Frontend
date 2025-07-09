import React, { useState, useEffect } from 'react';
import { 
  FaRocket, 
  FaStar, 
  FaHeart, 
  FaGamepad, 
  FaChartLine,
  FaFilter,
  FaSync,
  FaEye,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import axios from 'axios';
import { API_BASE } from "../../../../config/api";

const RecommendationsTab = ({ gamer }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterGenre, setFilterGenre] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [recommendationType, setRecommendationType] = useState('personalized');
  const [dismissedGames, setDismissedGames] = useState(new Set());


  useEffect(() => {
    fetchRecommendations();
  }, [gamer, recommendationType, filterGenre, filterPlatform]);

  const fetchRecommendations = async () => {
    if (!gamer?._id) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // In a real app, this would be a proper recommendation API
      // For now, we'll use mock data based on user preferences
      const mockRecommendations = generateMockRecommendations();
      
      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockRecommendations = () => {
    const allGames = [
      {
        id: 1,
        title: 'Elden Ring',
        genres: ['Action', 'RPG'],
        platforms: ['PC', 'PlayStation', 'Xbox'],
        rating: 9.2,
        coverImage: '/images/elden-ring.jpg',
        releaseDate: '2022-02-25',
        description: 'A vast open-world action RPG set in the Lands Between.',
        matchScore: 95,
        matchReasons: ['Loved The Witcher 3', 'Enjoys Action RPGs', 'High-rated games'],
        estimatedPlaytime: '60-100 hours',
        tags: ['Open World', 'Dark Fantasy', 'Challenging']
      },
      {
        id: 2,
        title: 'Baldur\'s Gate 3',
        genres: ['RPG', 'Strategy'],
        platforms: ['PC', 'PlayStation'],
        rating: 9.1,
        coverImage: '/images/baldurs-gate-3.jpg',
        releaseDate: '2023-08-03',
        description: 'A turn-based RPG with deep storytelling and character customization.',
        matchScore: 88,
        matchReasons: ['Enjoys RPGs', 'Likes story-driven games'],
        estimatedPlaytime: '75-100 hours',
        tags: ['Turn-based', 'Story Rich', 'Character Creation']
      },
      {
        id: 3,
        title: 'Spider-Man: Miles Morales',
        genres: ['Action', 'Adventure'],
        platforms: ['PlayStation', 'PC'],
        rating: 8.8,
        coverImage: '/images/spiderman-miles.jpg',
        releaseDate: '2020-11-12',
        description: 'Swing through New York as the new Spider-Man.',
        matchScore: 82,
        matchReasons: ['Enjoyed God of War', 'Likes Action games'],
        estimatedPlaytime: '15-20 hours',
        tags: ['Superhero', 'Open World', 'Action']
      },
      {
        id: 4,
        title: 'Hades',
        genres: ['Action', 'Indie'],
        platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
        rating: 9.0,
        coverImage: '/images/hades.jpg',
        releaseDate: '2020-09-17',
        description: 'A rogue-like dungeon crawler with exceptional storytelling.',
        matchScore: 79,
        matchReasons: ['Likes indie games', 'Enjoys challenging gameplay'],
        estimatedPlaytime: '40-60 hours',
        tags: ['Roguelike', 'Mythology', 'Replayable']
      },
      {
        id: 5,
        title: 'Disco Elysium',
        genres: ['RPG', 'Indie'],
        platforms: ['PC', 'PlayStation', 'Xbox'],
        rating: 9.3,
        coverImage: '/images/disco-elysium.jpg',
        releaseDate: '2019-10-15',
        description: 'A groundbreaking RPG with no combat, only consequences.',
        matchScore: 76,
        matchReasons: ['Appreciates narrative depth', 'Likes unique RPGs'],
        estimatedPlaytime: '30-40 hours',
        tags: ['Narrative', 'Detective', 'Choices Matter']
      }
    ];

    // Filter based on user preferences
    let filtered = allGames;
    
    if (filterGenre !== 'all') {
      filtered = filtered.filter(game => 
        game.genres.some(genre => genre.toLowerCase() === filterGenre.toLowerCase())
      );
    }
    
    if (filterPlatform !== 'all') {
      filtered = filtered.filter(game => 
        game.platforms.some(platform => platform.toLowerCase() === filterPlatform.toLowerCase())
      );
    }

    // Remove dismissed games
    filtered = filtered.filter(game => !dismissedGames.has(game.id));

    // Sort by match score
    return filtered.sort((a, b) => b.matchScore - a.matchScore);
  };

  const handleDismissGame = (gameId) => {
    setDismissedGames(prev => new Set([...prev, gameId]));
  };

  const handleAddToWishlist = async (gameId) => {
    // In a real app, this would add to user's wishlist
    console.log('Adding to wishlist:', gameId);
  };

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    if (score >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  const getMatchScoreBg = (score) => {
    if (score >= 90) return 'bg-green-500/20';
    if (score >= 80) return 'bg-yellow-500/20';
    if (score >= 70) return 'bg-orange-500/20';
    return 'bg-red-500/20';
  };

  const recommendationTypes = [
    { key: 'personalized', label: 'For You', icon: <FaRocket /> },
    { key: 'trending', label: 'Trending', icon: <FaChartLine /> },
    { key: 'similar', label: 'Similar Games', icon: <FaGamepad /> },
    { key: 'newReleases', label: 'New Releases', icon: <FaStar /> }
  ];

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Game Recommendations</h2>
          <p className="text-white/60">Discover your next favorite game</p>
        </div>
        <button
          onClick={fetchRecommendations}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-colors"
        >
          <FaSync />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="glass-effect rounded-xl p-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Recommendation Type */}
          <div className="flex gap-2">
            {recommendationTypes.map(type => (
              <button
                key={type.key}
                onClick={() => setRecommendationType(type.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  recommendationType === type.key
                    ? 'bg-yellow-500 text-black font-medium'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {type.icon}
                {type.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-white/20"></div>

          {/* Genre Filter */}
          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-yellow-500 focus:outline-none"
          >
            <option value="all">All Genres</option>
            <option value="action">Action</option>
            <option value="rpg">RPG</option>
            <option value="strategy">Strategy</option>
            <option value="indie">Indie</option>
            <option value="adventure">Adventure</option>
          </select>

          {/* Platform Filter */}
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-yellow-500 focus:outline-none"
          >
            <option value="all">All Platforms</option>
            <option value="pc">PC</option>
            <option value="playstation">PlayStation</option>
            <option value="xbox">Xbox</option>
            <option value="nintendo switch">Nintendo Switch</option>
          </select>
        </div>
      </div>

      {/* Recommendations Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map(game => (
            <div key={game.id} className="glass-effect rounded-xl overflow-hidden group hover:scale-105 transition-all duration-300">
              {/* Game Cover */}
              <div className="relative h-48 bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center">
                <FaGamepad className="text-6xl text-white/20" />
                
                {/* Match Score Badge */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${getMatchScoreBg(game.matchScore)} ${getMatchScoreColor(game.matchScore)}`}>
                  {game.matchScore}% Match
                </div>

                {/* Action Buttons */}
                <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDismissGame(game.id)}
                    className="w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white text-sm transition-colors"
                    title="Not Interested"
                  >
                    <FaTimesCircle />
                  </button>
                  <button
                    onClick={() => handleAddToWishlist(game.id)}
                    className="w-8 h-8 bg-yellow-500/80 hover:bg-yellow-500 rounded-full flex items-center justify-center text-black text-sm transition-colors"
                    title="Add to Wishlist"
                  >
                    <FaHeart />
                  </button>
                </div>
              </div>

              {/* Game Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-white text-lg group-hover:text-yellow-400 transition-colors">
                    {game.title}
                  </h3>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <FaStar className="text-xs" />
                    <span className="text-sm font-medium">{game.rating}</span>
                  </div>
                </div>

                <p className="text-white/60 text-sm mb-3 line-clamp-2">
                  {game.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {game.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Match Reasons */}
                <div className="mb-3">
                  <p className="text-white/40 text-xs mb-1">Why recommended:</p>
                  <div className="flex flex-wrap gap-1">
                    {game.matchReasons.slice(0, 2).map((reason, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Playtime */}
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>{game.estimatedPlaytime}</span>
                  <span>{new Date(game.releaseDate).getFullYear()}</span>
                </div>

                {/* Action Button */}
                <button className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-medium py-2 rounded-lg transition-all">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && recommendations.length === 0 && (
        <div className="text-center py-12">
          <FaGamepad className="text-6xl text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No recommendations found</h3>
          <p className="text-white/60 mb-4">Try adjusting your filters or check back later</p>
          <button
            onClick={fetchRecommendations}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors"
          >
            Refresh Recommendations
          </button>
        </div>
      )}
    </div>
  );
};

export default RecommendationsTab;