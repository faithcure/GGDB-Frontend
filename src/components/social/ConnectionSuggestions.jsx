import React, { useState, useEffect } from 'react';
import { Users, UserPlus, X, Gamepad2, Star, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import FollowButton from './FollowButton';

const ConnectionSuggestions = ({ limit = 6 }) => {
  const { user } = useUser();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissedUsers, setDismissedUsers] = useState(new Set());

  useEffect(() => {
    if (user) {
      fetchSuggestions();
    }
  }, [user]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/connections/suggestions', {
        params: { limit }
      });
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error('Error fetching connection suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = (userId) => {
    setDismissedUsers(prev => new Set([...prev, userId]));
    setSuggestions(prev => prev.filter(suggestion => suggestion._id !== userId));
  };

  const handleRefresh = () => {
    setDismissedUsers(new Set());
    fetchSuggestions();
  };

  const visibleSuggestions = suggestions.filter(suggestion => 
    !dismissedUsers.has(suggestion._id)
  );

  if (!user || loading) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      </div>
    );
  }

  if (visibleSuggestions.length === 0 && !loading) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-white">Suggested Connections</h2>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            title="Refresh suggestions"
          >
            <RefreshCw className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="text-center py-8 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No suggestions available right now</p>
          <p className="text-sm">Complete your profile to get better suggestions!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-bold text-white">Suggested Connections</h2>
          <span className="px-2 py-1 bg-gray-700 rounded-md text-xs text-gray-300">
            {visibleSuggestions.length}
          </span>
        </div>
        
        <button
          onClick={handleRefresh}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          title="Refresh suggestions"
        >
          <RefreshCw className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleSuggestions.map(suggestion => (
          <SuggestionCard
            key={suggestion._id}
            suggestion={suggestion}
            onDismiss={handleDismiss}
          />
        ))}
      </div>

      {/* View All Button */}
      {visibleSuggestions.length > 0 && (
        <div className="text-center mt-6">
          <button className="px-6 py-2 text-yellow-500 hover:text-yellow-400 font-medium transition-colors">
            View All Suggestions
          </button>
        </div>
      )}
    </div>
  );
};

const SuggestionCard = ({ suggestion, onDismiss }) => {
  const getMatchingReasons = () => {
    const reasons = [];
    
    if (suggestion.favoriteGenres?.length > 0) {
      reasons.push(`${suggestion.favoriteGenres.length} common genres`);
    }
    
    if (suggestion.platforms?.length > 0) {
      reasons.push(`${suggestion.platforms.length} shared platforms`);
    }
    
    if (suggestion.gameStats?.totalGames > 0) {
      reasons.push(`${suggestion.gameStats.totalGames} games played`);
    }
    
    return reasons.slice(0, 2); // Show max 2 reasons
  };

  const matchingReasons = getMatchingReasons();

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-yellow-500/50 transition-all duration-200 group relative">
      {/* Dismiss Button */}
      <button
        onClick={() => onDismiss(suggestion._id)}
        className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-700 rounded-full"
        title="Dismiss suggestion"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>

      {/* User Info */}
      <div className="text-center mb-4">
        <img
          src={suggestion.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(suggestion.username)}&background=random&color=fff&size=64`}
          alt={suggestion.username}
          className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
        />
        
        <h3 className="font-semibold text-white group-hover:text-yellow-400 transition-colors">
          {suggestion.username}
        </h3>
        
        {suggestion.bio && (
          <p className="text-sm text-gray-400 mt-1 line-clamp-2">
            {suggestion.bio}
          </p>
        )}
      </div>

      {/* Matching Info */}
      {matchingReasons.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-yellow-400 font-medium">
              Similarity Score: {suggestion.similarityScore || 0}
            </span>
          </div>
          
          <div className="space-y-1">
            {matchingReasons.map((reason, index) => (
              <div key={index} className="flex items-center justify-center space-x-1">
                <Gamepad2 className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-400">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Favorite Genres Preview */}
      {suggestion.favoriteGenres?.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1 justify-center">
            {suggestion.favoriteGenres.slice(0, 3).map((genre, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded-md"
              >
                {genre.name}
              </span>
            ))}
            {suggestion.favoriteGenres.length > 3 && (
              <span className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded-md">
                +{suggestion.favoriteGenres.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Gaming Stats */}
      {suggestion.gameStats && (
        <div className="text-center mb-4">
          <div className="grid grid-cols-1 gap-2">
            {suggestion.gameStats.totalGames > 0 && (
              <div>
                <span className="text-lg font-bold text-white">
                  {suggestion.gameStats.totalGames}
                </span>
                <p className="text-xs text-gray-400">Games Played</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Follow Button */}
      <div className="flex justify-center">
        <FollowButton
          targetUserId={suggestion._id}
          targetUsername={suggestion.username}
          size="small"
          showMessageButton={false}
        />
      </div>
    </div>
  );
};

export default ConnectionSuggestions;