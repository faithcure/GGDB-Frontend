// src/components/home/FeaturedTodaySection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaFire,
  FaCrown,
  FaGem,
  FaStar,
  FaCalendarAlt
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import GameCard from '../common/GameCard';
import axios from 'axios';
import { API_BASE } from '../../config/api';

const FeaturedTodaySection = () => {
  const [featuredGames, setFeaturedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const navigate = useNavigate();

  // Fetch featured games from API
  useEffect(() => {
    const fetchFeaturedGames = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${API_BASE}/api/featured-today`);
        
        if (response.data.success && response.data.data.games) {
          // Limit to maximum 5 games
          const limitedGames = response.data.data.games.slice(0, 5);
          setFeaturedGames(limitedGames);
          console.log('🎯 Featured Today loaded:', limitedGames.length, 'games (limited to 5)');
          
          // Preload first few images for better performance
          preloadImages(limitedGames.slice(0, 4));
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('❌ Error fetching featured games:', err);
        setError(err.response?.data?.message || 'Failed to load featured games');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedGames();
  }, []);

  // Preload images function
  const preloadImages = (games) => {
    games.forEach((featuredGame) => {
      if (featuredGame.game.coverImage) {
        const img = new Image();
        img.src = featuredGame.game.coverImage;
        img.onload = () => {
          console.log('✅ Preloaded:', featuredGame.game.title);
        };
        img.onerror = () => {
          console.log('❌ Failed to preload:', featuredGame.game.title);
        };
      }
    });
    setImagesPreloaded(true);
  };


  const getReasonIcon = (reason) => {
    switch (reason) {
      case 'trending':
        return <FaFire className="text-orange-500" />;
      case 'highly_rated':
        return <FaCrown className="text-yellow-500" />;
      case 'new':
        return <FaStar className="text-blue-500" />;
      case 'hidden_gem':
        return <FaGem className="text-purple-500" />;
      case 'seasonal':
        return <FaCalendarAlt className="text-green-500" />;
      default:
        return <FaThumbsUp className="text-gray-400" />;
    }
  };

  const formatGameForCard = (featuredGame) => {
    const game = featuredGame.game;
    return {
      _id: game._id,
      image: game.coverImage || 'https://placehold.co/300x400?text=No+Image',
      title: game.title,
      rating: game.ggdbRating || 0,
      votes: game.ratingCount || 0,
      studio: game.developer || game.publisher || 'Unknown Studio',
      country: null, // We don't have country in game model
      metacritic: game.metacriticScore,
      isNew: featuredGame.reason === 'new',
      isTrending: featuredGame.reason === 'trending',
      genre: game.genres ? game.genres[0] : null,
      releaseYear: game.releaseDate ? new Date(game.releaseDate).getFullYear() : null,
      rank: null,
      isTopRated: featuredGame.reason === 'highly_rated',
      matchPercentage: null // Could be calculated later based on user preferences
    };
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <section className="w-full bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            <span className="ml-3 text-white">Loading Featured Games...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-red-400 mb-4">⚠️ Failed to load featured games</div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredGames || featuredGames.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-black py-16">
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
                Featured Today
              </h2>
            </div>
            <p className="text-gray-400 text-sm">
              {getFormattedDate()} • {featuredGames.length} handpicked games
            </p>
          </div>
        </motion.div>

        {/* Games Grid - Using GameCard */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <AnimatePresence>
            {featuredGames.map((featuredGame, index) => {
              const formattedGame = formatGameForCard(featuredGame);
              return (
                <motion.div
                  key={`${featuredGame.game._id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full"
                >
                  <div className="transform scale-95 origin-center">
                    <GameCard 
                      {...formattedGame}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTodaySection;