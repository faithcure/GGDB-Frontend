import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaSearch, FaStar, FaCalendarAlt, FaUser, FaGamepad, FaEdit, FaFilter, FaSort } from 'react-icons/fa';
import { API_BASE } from "../config/api";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterBy, setFilterBy] = useState('all');


  // Search categories with counts
  const categories = [
    { id: 'all', label: 'All', icon: <FaSearch />, count: 0 },
    { id: 'games', label: 'Games', icon: <FaGamepad />, count: 0 },
    { id: 'people', label: 'People', icon: <FaUser />, count: 0 },
    { id: 'reviews', label: 'Reviews', icon: <FaEdit />, count: 0 },
    { id: 'gamers', label: 'Gamers', icon: <FaUser />, count: 0 }
  ];

  const sortOptions = [
    { id: 'relevance', label: 'Relevance' },
    { id: 'rating', label: 'Rating' },
    { id: 'date', label: 'Release Date' },
    { id: 'title', label: 'Title A-Z' }
  ];

  useEffect(() => {
    if (query) {
      searchAllCategories();
    }
  }, [query]);

  useEffect(() => {
    if (activeCategory !== initialCategory) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('category', activeCategory);
      navigate(`/search?${newSearchParams.toString()}`, { replace: true });
    }
  }, [activeCategory]);

  const searchAllCategories = async () => {
    setLoading(true);
    try {
      const results = {
        games: [],
        gamers: [],
        people: [],
        reviews: [],
        all: []
      };

      // Search games - should always work
      try {
        const gamesResponse = await fetch(`${API_BASE}/api/games/search?q=${encodeURIComponent(query)}&limit=50`);
        if (gamesResponse.ok) {
          const gamesData = await gamesResponse.json();
          results.games = gamesData.results || [];
        }
      } catch (error) {
        console.error('Games search failed:', error);
      }

      // Search users/gamers - now public endpoint
      try {
        const gamersResponse = await fetch(`${API_BASE}/api/auth/search-users?q=${encodeURIComponent(query)}&limit=50`);
        if (gamersResponse.ok) {
          const gamersData = await gamersResponse.json();
          results.gamers = gamersData.users || [];
        }
      } catch (error) {
        console.error('Gamers search failed:', error);
      }

      // Search people (contributors) - fallback to extracting from games
      try {
        const peopleResponse = await fetch(`${API_BASE}/api/games/search/people?q=${encodeURIComponent(query)}&limit=50`);
        if (peopleResponse.ok) {
          const peopleData = await peopleResponse.json();
          results.people = peopleData.results || [];
        } else {
          // Fallback: Extract people from game results
          const people = [];
          results.games.forEach(game => {
            if (game.crewList && Array.isArray(game.crewList)) {
              game.crewList.forEach(person => {
                if (person.name && person.name.toLowerCase().includes(query.toLowerCase())) {
                  people.push({
                    _id: person.userId || person.id,
                    name: person.name,
                    department: person.department || 'Unknown',
                    role: person.role || 'Unknown',
                    image: person.image,
                    isRegisteredUser: person.isRegisteredUser || false,
                    gameCount: 1,
                    games: [{ _id: game._id, title: game.title, coverImage: game.coverImage }]
                  });
                }
              });
            }
          });
          results.people = people.slice(0, 20); // Limit results
        }
      } catch (error) {
        console.error('People search failed:', error);
        // Still try fallback
        const people = [];
        results.games.forEach(game => {
          if (game.crewList && Array.isArray(game.crewList)) {
            game.crewList.forEach(person => {
              if (person.name && person.name.toLowerCase().includes(query.toLowerCase())) {
                people.push({
                  _id: person.userId || person.id,
                  name: person.name,
                  department: person.department || 'Unknown',
                  role: person.role || 'Unknown',
                  image: person.image,
                  isRegisteredUser: person.isRegisteredUser || false,
                  gameCount: 1,
                  games: [{ _id: game._id, title: game.title, coverImage: game.coverImage }]
                });
              }
            });
          }
        });
        results.people = people.slice(0, 20);
      }

      // Search reviews
      try {
        const reviewsResponse = await fetch(`${API_BASE}/api/reviews/search?q=${encodeURIComponent(query)}&limit=50`);
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          results.reviews = reviewsData.results || [];
        }
      } catch (error) {
        console.error('Reviews search failed:', error);
      }

      // Combine all results
      results.all = [
        ...results.games.map(item => ({ ...item, type: 'game' })),
        ...results.gamers.map(item => ({ ...item, type: 'gamer' })),
        ...results.people.map(item => ({ ...item, type: 'person' })),
        ...results.reviews.map(item => ({ ...item, type: 'review' }))
      ];

      setResults(results);

    } catch (error) {
      console.error('Search failed:', error);
      setResults({
        games: [],
        gamers: [],
        people: [],
        reviews: [],
        all: []
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentResults = () => {
    if (!results[activeCategory]) return [];
    return results[activeCategory] || [];
  };

  const getCategoryCount = (categoryId) => {
    if (!results[categoryId]) return 0;
    return results[categoryId].length || 0;
  };

  const renderGameCard = (game) => (
    <div 
      key={game._id}
      onClick={() => navigate(`/game/${game._id}`)}
      className="bg-zinc-900 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors group flex gap-4 p-4"
    >
      {/* Game Cover - Smaller for list view */}
      <div className="flex-shrink-0">
        <img
          src={game.coverImage || '/placeholder-game.jpg'}
          alt={game.title}
          className="w-20 h-28 object-cover rounded border border-zinc-700 group-hover:border-yellow-400 transition-colors"
          onError={(e) => {
            e.target.src = '/placeholder-game.jpg';
          }}
        />
      </div>
      
      {/* Game Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-semibold text-lg group-hover:text-yellow-400 transition-colors truncate">
            {game.title}
          </h3>
          
          {game.averageRating > 0 && (
            <div className="flex items-center gap-1 bg-black/50 rounded px-2 py-1 ml-2">
              <FaStar className="w-3 h-3 text-yellow-400" />
              <span className="text-white text-sm font-medium">
                {game.averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        
        <div className="text-gray-400 text-sm mb-2">
          <strong>Developer:</strong> {game.developer}
        </div>
        
        <div className="flex items-center gap-4 text-gray-500 text-sm mb-3">
          {game.releaseYear && (
            <span className="flex items-center gap-1">
              <FaCalendarAlt className="w-3 h-3" />
              {game.releaseYear}
            </span>
          )}
          {game.metacriticScore && (
            <span className="text-green-400">
              Metacritic: {game.metacriticScore}
            </span>
          )}
        </div>
        
        {/* Description if available */}
        {game.fullDescription && (
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
            {game.fullDescription.length > 150 
              ? game.fullDescription.substring(0, 150) + '...' 
              : game.fullDescription
            }
          </p>
        )}
        
        {/* Genres */}
        {game.genres && game.genres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {game.genres.slice(0, 4).map((genre, index) => (
              <span
                key={index}
                className="bg-purple-600/20 text-purple-300 text-xs px-2 py-1 rounded-full border border-purple-500/30"
              >
                {genre}
              </span>
            ))}
            {game.genres.length > 4 && (
              <span className="text-gray-500 text-xs px-2 py-1">
                +{game.genres.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderGamerCard = (gamer) => (
    <div 
      key={gamer._id || gamer.username}
      onClick={() => navigate(`/portfolio/${gamer._id || gamer.username}`)}
      className="bg-zinc-900 rounded-lg p-4 cursor-pointer hover:bg-zinc-800 transition-colors group"
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <img
            src={gamer.avatar || '/default-avatar.png'}
            alt={gamer.username}
            className="w-16 h-16 rounded-full object-cover border-2 border-zinc-700 group-hover:border-yellow-400 transition-colors"
            onError={(e) => {
              e.target.src = '/default-avatar.png';
            }}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold mb-1 group-hover:text-yellow-400 transition-colors">
            {gamer.username}
          </h3>
          
          {gamer.title && (
            <div className="text-gray-400 text-sm mb-1">
              {gamer.title}
            </div>
          )}
          
          <div className="text-gray-500 text-xs">
            Gamer Profile
          </div>
          
          {gamer.stats && (
            <div className="mt-2 flex gap-4 text-xs text-gray-400">
              {gamer.stats.totalGames && (
                <span>{gamer.stats.totalGames} games</span>
              )}
              {gamer.stats.totalHours && (
                <span>{gamer.stats.totalHours}h played</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPersonCard = (person) => (
    <div 
      key={person._id || person.name}
      onClick={() => {
        if (person.isRegisteredUser && person._id) {
          navigate(`/portfolio/${person._id}`);
        } else if (person.games && person.games.length > 0) {
          navigate(`/game/${person.games[0]._id}/cast-crew`);
        }
      }}
      className="bg-zinc-900 rounded-lg p-4 cursor-pointer hover:bg-zinc-800 transition-colors group"
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <img
            src={person.image || '/default-avatar.png'}
            alt={person.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-zinc-700 group-hover:border-yellow-400 transition-colors"
            onError={(e) => {
              e.target.src = '/default-avatar.png';
            }}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold mb-1 group-hover:text-yellow-400 transition-colors">
            {person.name}
          </h3>
          
          <div className="text-gray-400 text-sm mb-1">
            {person.department} • {person.role}
          </div>
          
          <div className="text-gray-500 text-xs mb-2">
            {person.gameCount} game{person.gameCount > 1 ? 's' : ''}
            {person.isRegisteredUser && <span className="text-blue-400 ml-2">• Registered User</span>}
          </div>
          
          {/* Recent Games */}
          {person.games && person.games.length > 0 && (
            <div className="flex gap-1">
              {person.games.slice(0, 3).map((game, index) => (
                <img
                  key={index}
                  src={game.coverImage || '/placeholder-game.jpg'}
                  alt={game.title}
                  className="w-8 h-10 object-cover rounded border border-zinc-600"
                  title={game.title}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderReviewCard = (review) => (
    <div 
      key={review._id}
      onClick={() => navigate(`/game/${review.game._id}/reviews`)}
      className="bg-zinc-900 rounded-lg p-4 cursor-pointer hover:bg-zinc-800 transition-colors group"
    >
      <div className="flex gap-4">
        {/* Game Cover */}
        <div className="flex-shrink-0">
          <img
            src={review.game.coverImage || '/placeholder-game.jpg'}
            alt={review.game.title}
            className="w-16 h-20 object-cover rounded border border-zinc-700"
            onError={(e) => {
              e.target.src = '/placeholder-game.jpg';
            }}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Review Header */}
          <div className="flex items-center gap-2 mb-2">
            <img
              src={review.authorAvatar || '/default-avatar.png'}
              alt={review.authorName}
              className="w-6 h-6 rounded-full"
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
            <span className="text-gray-400 text-sm">{review.authorName}</span>
            {review.rating && (
              <div className="flex items-center gap-1">
                <FaStar className="w-3 h-3 text-yellow-400" />
                <span className="text-yellow-400 text-sm">{review.rating}/10</span>
              </div>
            )}
          </div>
          
          {/* Game Title */}
          <h3 className="text-white font-semibold mb-2 group-hover:text-yellow-400 transition-colors">
            Review for "{review.game.title}"
          </h3>
          
          {/* Review Content */}
          <p className="text-gray-300 text-sm mb-3 line-clamp-3">
            {review.comment}
          </p>
          
          {/* Review Meta */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <FaCalendarAlt className="w-3 h-3" />
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
            {review.likeCount > 0 && (
              <span>{review.likeCount} likes</span>
            )}
            {review.spoiler && (
              <span className="bg-red-600/20 text-red-400 px-2 py-0.5 rounded">
                Spoiler
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    const currentResults = getCurrentResults();
    
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-zinc-900 rounded-lg animate-pulse flex gap-4 p-4">
              <div className="w-20 h-28 bg-zinc-800 rounded"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-zinc-800 rounded w-1/2"></div>
                <div className="h-4 bg-zinc-800 rounded w-1/3"></div>
                <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-zinc-800 rounded w-16"></div>
                  <div className="h-6 bg-zinc-800 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (currentResults.length === 0) {
      return (
        <div className="text-center py-16">
          <FaSearch className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
          <p className="text-gray-400">
            Try different keywords or check the spelling
          </p>
        </div>
      );
    }

    if (activeCategory === 'games' || (activeCategory === 'all' && currentResults.some(r => r.type === 'game' || !r.type))) {
      const gameResults = activeCategory === 'all' 
        ? currentResults.filter(r => r.type === 'game' || !r.type) 
        : currentResults;
      
      return (
        <div className="space-y-4">
          {gameResults.map(game => renderGameCard(game))}
        </div>
      );
    }

    if (activeCategory === 'gamers' || (activeCategory === 'all' && currentResults.some(r => r.type === 'gamer'))) {
      const gamerResults = activeCategory === 'all' 
        ? currentResults.filter(r => r.type === 'gamer') 
        : currentResults;
      
      return (
        <div className="space-y-4">
          {gamerResults.map(gamer => renderGamerCard(gamer))}
        </div>
      );
    }

    if (activeCategory === 'people') {
      return (
        <div className="space-y-4">
          {currentResults.map(person => renderPersonCard(person))}
        </div>
      );
    }

    if (activeCategory === 'reviews') {
      return (
        <div className="space-y-4">
          {currentResults.map(review => renderReviewCard(review))}
        </div>
      );
    }

    // Mixed results for 'all' category
    return (
      <div className="space-y-8">
        {/* Games Section */}
        {results.games && results.games.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaGamepad className="text-yellow-400" />
              Games ({results.games.length})
            </h3>
            <div className="space-y-4">
              {results.games.slice(0, 6).map(game => renderGameCard(game))}
            </div>
            {results.games.length > 6 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setActiveCategory('games')}
                  className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
                >
                  View all {results.games.length} games →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Gamers Section */}
        {results.gamers && results.gamers.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaUser className="text-yellow-400" />
              Gamers ({results.gamers.length})
            </h3>
            <div className="space-y-4">
              {results.gamers.slice(0, 6).map(gamer => renderGamerCard(gamer))}
            </div>
            {results.gamers.length > 6 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setActiveCategory('gamers')}
                  className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
                >
                  View all {results.gamers.length} gamers →
                </button>
              </div>
            )}
          </div>
        )}

        {/* People Section */}
        {results.people && results.people.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaUser className="text-yellow-400" />
              People & Contributors ({results.people.length})
            </h3>
            <div className="space-y-4">
              {results.people.slice(0, 6).map(person => renderPersonCard(person))}
            </div>
            {results.people.length > 6 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setActiveCategory('people')}
                  className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
                >
                  View all {results.people.length} people →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Reviews Section */}
        {results.reviews && results.reviews.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaEdit className="text-yellow-400" />
              Reviews ({results.reviews.length})
            </h3>
            <div className="space-y-4">
              {results.reviews.slice(0, 4).map(review => renderReviewCard(review))}
            </div>
            {results.reviews.length > 4 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setActiveCategory('reviews')}
                  className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
                >
                  View all {results.reviews.length} reviews →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-zinc-900 to-black py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Search Results
            </h1>
            <p className="text-xl text-gray-300">
              Results for "<span className="text-yellow-400">{query}</span>"
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  activeCategory === category.id
                    ? 'bg-yellow-600 text-black font-semibold'
                    : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                }`}
              >
                {category.icon}
                <span>{category.label}</span>
                {!loading && (
                  <span className="bg-black/20 text-xs px-2 py-0.5 rounded-full">
                    {getCategoryCount(category.id)}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Filters and Sorting */}
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <FaSort className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-zinc-800 text-white border border-zinc-700 rounded px-3 py-1 text-sm"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="bg-zinc-800 text-white border border-zinc-700 rounded px-3 py-1 text-sm"
              >
                <option value="all">All Time</option>
                <option value="recent">Recent</option>
                <option value="popular">Most Popular</option>
                <option value="rated">Highly Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {renderResults()}
      </div>
    </div>
  );
};

export default SearchResultsPage;