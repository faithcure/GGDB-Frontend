import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaSearch, FaListUl, FaBell, FaCaretDown, FaStar, FaCalendarAlt, FaSpinner } from "react-icons/fa";
import { MessageCircle, Users, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MainMenu from "./MainMenu";
import UserMenu from "./UserMenu";
import NotificationDropdown from "./NotificationDropdown";
import MessageCenter from "../social/MessageCenter";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import { API_BASE } from "../../config/api";

const Header = () => {
  const { user, loading, setUser } = useUser();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchCategory, setSearchCategory] = useState('all');
  
  // Social features state
  const [showMessageCenter, setShowMessageCenter] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [pendingConnectionsCount, setPendingConnectionsCount] = useState(0);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const debounceTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const isAdmin = user?.role?.toLowerCase() === "admin";

  // Search categories
  const searchCategories = [
    { id: 'all', label: 'All', placeholder: 'Search everything...' },
    { id: 'games', label: 'Games', placeholder: 'Search games...' },
    { id: 'gamers', label: 'Gamers', placeholder: 'Search gamers...' },
    { id: 'credits', label: 'Credits', placeholder: 'Search people...' }
  ];

  // Search functionality
  const performSearch = useCallback(async (query, category = 'all') => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setSearchLoading(true);
    try {
      let results = [];
      
      switch (category) {
        case 'games':
          const gamesResponse = await fetch(`${API_BASE}/api/games/search?q=${encodeURIComponent(query)}&limit=8`);
          if (gamesResponse.ok) {
            const gamesData = await gamesResponse.json();
            results = gamesData.results || gamesData || [];
          }
          break;
          
        case 'gamers':
          const gamersResponse = await fetch(`${API_BASE}/api/auth/search-users?q=${encodeURIComponent(query)}&limit=8`);
          if (gamersResponse.ok) {
            const gamersData = await gamersResponse.json();
            results = gamersData.users || gamersData.results || gamersData || [];
          }
          break;
          
        case 'credits':
          // Credits search - could be people in games
          const creditsResponse = await fetch(`${API_BASE}/api/games/search?q=${encodeURIComponent(query)}&type=people&limit=8`);
          if (creditsResponse.ok) {
            const creditsData = await creditsResponse.json();
            results = creditsData.results || creditsData || [];
          }
          break;
          
        case 'all':
          // Search both games and users in parallel
          const [gamesRes, usersRes] = await Promise.allSettled([
            fetch(`${API_BASE}/api/games/search?q=${encodeURIComponent(query)}&limit=4`),
            fetch(`${API_BASE}/api/auth/search-users?q=${encodeURIComponent(query)}&limit=4`)
          ]);
          
          let games = [];
          let users = [];
          
          if (gamesRes.status === 'fulfilled' && gamesRes.value.ok) {
            const gamesData = await gamesRes.value.json();
            games = gamesData.results || gamesData || [];
          }
          
          if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
            const usersData = await usersRes.value.json();
            users = usersData.users || usersData.results || usersData || [];
          }
          
          // Combine results with type markers
          results = [
            ...games.map(game => ({ ...game, type: 'game' })),
            ...users.map(user => ({ ...user, type: 'user' }))
          ];
          break;
          
        default:
          const defaultResponse = await fetch(`${API_BASE}/api/games/search?q=${encodeURIComponent(query)}&limit=8`);
          if (defaultResponse.ok) {
            const defaultData = await defaultResponse.json();
            results = defaultData.results || defaultData || [];
          }
      }

      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setSearchLoading(false);
    }
  }, [API_BASE]);

  // Fetch social data
  const fetchSocialData = useCallback(async () => {
    if (!user) return;

    try {
      const [messagesRes, connectionsRes] = await Promise.all([
        axios.get('/api/messages/unread-count'),
        axios.get('/api/connections/pending?type=received')
      ]);

      setUnreadMessageCount(messagesRes.data.unreadCount || 0);
      setPendingConnectionsCount(connectionsRes.data.count || 0);
    } catch (error) {
      console.error('Error fetching social data:', error);
    }
  }, [user]);

  // Update social data periodically
  useEffect(() => {
    if (user) {
      fetchSocialData();
      
      // Update every 30 seconds
      const interval = setInterval(fetchSocialData, 30000);
      return () => clearInterval(interval);
    }
  }, [user, fetchSocialData]);

  // Debounced search
  const handleSearchInput = useCallback((value) => {
    setSearchQuery(value);
    
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      performSearch(value, searchCategory);
    }, 300);
  }, [performSearch, searchCategory]);

  const handleSearchItemClick = (item) => {
    setShowSearch(false);
    setShowResults(false);
    setSearchQuery('');
    
    // Cache user data for profile page if it's a user
    if (item.type === 'user' || item.username || item.email) {
      const userId = item._id || item.username;
      localStorage.setItem(`user_search_${userId}`, JSON.stringify(item));
      console.log(`💾 Cached user data for: ${item.username}`);
    }
    
    // Navigate based on search category
    switch (searchCategory) {
      case 'games':
        navigate(`/game/${item._id}`);
        break;
      case 'gamers':
        navigate(`/person/${item.username || item._id}`);
        break;
      case 'all':
        // Check if item has type marker or detect by properties
        if (item.type === 'user' || item.username || item.email) {
          navigate(`/person/${item.username || item._id}`);
        } else {
          navigate(`/game/${item._id}`);
        }
        break;
      case 'credits':
        // Could navigate to a people page or game credits
        navigate(`/game/${item._id}`);
        break;
      default:
        navigate(`/game/${item._id}`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearch(false);
      setShowResults(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&category=${searchCategory}`);
    }
  };

  // Render search result based on category
  const renderSearchResult = (item, index) => {
    switch (searchCategory) {
      case 'all':
        // Determine if item is a user or game by type marker or properties
        if (item.type === 'user' || item.username || item.email) {
          // User result
          return (
            <div
              key={item._id || item.username}
              onClick={() => handleSearchItemClick(item)}
              className="flex items-center gap-4 p-4 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0 transition-colors"
            >
              <div className="flex-shrink-0">
                <img
                  src={item.avatar || '/default-avatar.png'}
                  alt={item.username}
                  className="w-12 h-12 object-cover rounded-full border border-white/20"
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-sm truncate">
                  {item.username}
                </h3>
                {item.title && (
                  <div className="text-gray-400 text-xs mt-1 truncate">
                    {item.title}
                  </div>
                )}
                <div className="text-blue-400 text-xs mt-1 font-medium">
                  👤 Gamer
                </div>
              </div>
            </div>
          );
        } else {
          // Game result
          return (
            <div
              key={item._id}
              onClick={() => handleSearchItemClick(item)}
              className="flex items-center gap-4 p-4 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0 transition-colors"
            >
              <div className="flex-shrink-0">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-12 h-16 object-cover rounded border border-white/20"
                  onError={(e) => {
                    e.target.src = '/placeholder-game.jpg';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-sm truncate">
                  {item.title}
                </h3>
                {item.releaseYear && (
                  <div className="text-gray-400 text-xs mt-1">
                    {item.releaseYear}
                  </div>
                )}
                <div className="text-yellow-400 text-xs mt-1 font-medium">
                  🎮 Game
                </div>
              </div>
            </div>
          );
        }
      case 'gamers':
        return (
          <div
            key={item._id || item.username}
            onClick={() => handleSearchItemClick(item)}
            className="flex items-center gap-4 p-4 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0 transition-colors"
          >
            <div className="flex-shrink-0">
              <img
                src={item.avatar || '/default-avatar.png'}
                alt={item.username}
                className="w-12 h-12 object-cover rounded-full border border-white/20"
                onError={(e) => {
                  e.target.src = '/default-avatar.png';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium text-sm truncate">
                {item.username}
              </h3>
              {item.title && (
                <div className="text-gray-400 text-xs mt-1 truncate">
                  {item.title}
                </div>
              )}
              <div className="text-gray-500 text-xs mt-1">
                Gamer Profile
              </div>
            </div>
          </div>
        );
      
      case 'games':
      default:
        // First result - Enhanced IMDB style
        if (index === 0) {
          return (
            <div
              key={item._id}
              onClick={() => handleSearchItemClick(item)}
              className="p-6 hover:bg-white/5 cursor-pointer border-b-2 border-yellow-500/30 transition-colors"
            >
              <div className="flex gap-6">
                {/* Main Cover */}
                <div className="flex-shrink-0">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-20 h-28 object-cover rounded-lg border border-white/30 shadow-lg"
                    onError={(e) => {
                      e.target.src = '/placeholder-game.jpg';
                    }}
                  />
                </div>
                
                {/* Game Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1 truncate">
                        {item.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 mb-2">
                        {item.releaseYear && (
                          <span className="text-gray-300 text-sm">
                            <FaCalendarAlt className="w-3 h-3 inline mr-1" />
                            {item.releaseYear}
                          </span>
                        )}
                        {item.averageRating > 0 && (
                          <span className="text-yellow-400 text-sm font-medium">
                            <FaStar className="w-4 h-4 inline mr-1" />
                            {item.averageRating.toFixed(1)}/10
                          </span>
                        )}
                      </div>
                      
                      <div className="text-gray-400 text-sm mb-2">
                        <strong>Developer:</strong> {item.developer}
                      </div>
                      
                      {item.fullDescription && (
                        <p className="text-gray-300 text-sm leading-relaxed mb-3 max-w-lg">
                          {item.fullDescription.length > 200 
                            ? item.fullDescription.substring(0, 200) + '...' 
                            : item.fullDescription
                          }
                        </p>
                      )}
                      
                      {/* Genres */}
                      {item.genres && item.genres.length > 0 && (
                        <div className="flex gap-2 mb-3">
                          {item.genres.map((genre, genreIndex) => (
                            <span
                              key={genreIndex}
                              className="bg-blue-600/20 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-500/30"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Media Gallery */}
                  {(item.gallery || item.screenshots || item.videos) && (
                    <div className="mt-4">
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {/* Videos */}
                        {item.videos && item.videos.map((video, videoIndex) => (
                          <div key={`video-${videoIndex}`} className="flex-shrink-0 relative group">
                            <img
                              src={video.thumbnail || '/video-placeholder.jpg'}
                              alt={`Video ${videoIndex + 1}`}
                              className="w-20 h-12 object-cover rounded border border-white/20 group-hover:border-yellow-400 transition-colors"
                            />
                            <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center group-hover:bg-black/30 transition-colors">
                              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                <div className="w-0 h-0 border-l-2 border-l-black border-y-1 border-y-transparent ml-0.5"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Screenshots */}
                        {item.gallery && item.gallery.map((image, imgIndex) => (
                          <div key={`gallery-${imgIndex}`} className="flex-shrink-0">
                            <img
                              src={image.url || image}
                              alt={`Screenshot ${imgIndex + 1}`}
                              className="w-20 h-12 object-cover rounded border border-white/20 hover:border-yellow-400 transition-colors"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }
        
        // Other results - Simple style
        return (
          <div
            key={item._id}
            onClick={() => handleSearchItemClick(item)}
            className="flex items-center gap-4 p-4 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0 transition-colors"
          >
            <div className="flex-shrink-0">
              <img
                src={item.coverImage}
                alt={item.title}
                className="w-12 h-16 object-cover rounded border border-white/20"
                onError={(e) => {
                  e.target.src = '/placeholder-game.jpg';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium text-sm truncate">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {item.releaseYear && (
                  <span className="text-gray-400 text-xs">
                    <FaCalendarAlt className="w-3 h-3 inline mr-1" />
                    {item.releaseYear}
                  </span>
                )}
                {item.averageRating > 0 && (
                  <span className="text-yellow-400 text-xs">
                    <FaStar className="w-3 h-3 inline mr-1" />
                    {item.averageRating.toFixed(1)}
                  </span>
                )}
              </div>
              <div className="text-gray-400 text-xs mt-1 truncate">
                {item.developer}
              </div>
              {item.genres && item.genres.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {item.genres.slice(0, 2).map((genre, genreIndex) => (
                    <span
                      key={genreIndex}
                      className="bg-purple-600/20 text-purple-300 text-xs px-2 py-0.5 rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  // Scroll effect için
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearch(false);
        setShowResults(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setShowMobileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search focus effect
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    } else if (!showSearch) {
      setSearchQuery('');
      setSearchResults([]);
      setShowResults(false);
    }
  }, [showSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-black/95 backdrop-blur-sm shadow-lg' 
          : 'bg-gradient-to-b from-black/80 via-black/60 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Left Section - Logo & Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img 
                src="/GGDB_logo.svg" 
                alt="GGDB" 
                className="h-8 lg:h-10 w-auto transition-transform hover:scale-105" 
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <MainMenu />
            </nav>
          </div>

          {/* Right Section - Search, Actions & Profile */}
          <div className="flex items-center space-x-4">
            
            {/* Search */}
            <div className="relative" ref={searchContainerRef}>
              {!showSearch ? (
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2 text-white hover:text-gray-300 transition-colors"
                >
                  <FaSearch className="w-5 h-5" />
                </button>
              ) : (
                <div className="relative">
                  <form onSubmit={handleSearchSubmit} className="flex items-center bg-black/70 border border-white/20 rounded-sm">
                    {/* Category Dropdown */}
                    <div className="relative">
                      <select
                        value={searchCategory}
                        onChange={(e) => {
                          setSearchCategory(e.target.value);
                          if (searchQuery.trim().length >= 2) {
                            performSearch(searchQuery, e.target.value);
                          }
                        }}
                        className="bg-transparent text-gray-300 border-r border-white/20 px-3 py-2 pr-6 focus:outline-none text-sm appearance-none cursor-pointer"
                      >
                        {searchCategories.map((category) => (
                          <option key={category.id} value={category.id} className="bg-black text-white">
                            {category.label}
                          </option>
                        ))}
                      </select>
                      <FaCaretDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                    </div>
                    
                    <FaSearch className="w-4 h-4 text-gray-400 ml-3" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchInput(e.target.value)}
                      placeholder={searchCategories.find(c => c.id === searchCategory)?.placeholder || "Search..."}
                      className="bg-transparent text-white placeholder-gray-400 px-3 py-2 w-96 focus:outline-none text-sm"
                      autoComplete="off"
                    />
                    {searchLoading && (
                      <FaSpinner className="w-4 h-4 text-gray-400 mr-3 animate-spin" />
                    )}
                  </form>

                  {/* Search Results Dropdown */}
                  {showResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 border border-white/20 rounded-lg backdrop-blur-sm shadow-2xl z-50 max-h-96 overflow-y-auto">
                      {searchResults.map((item, index) => renderSearchResult(item, index))}
                      
                      {/* View All Results */}
                      <div className="p-3 border-t border-white/10">
                        <button
                          onClick={() => {
                            setShowSearch(false);
                            setShowResults(false);
                            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                          }}
                          className="w-full text-center text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
                        >
                          View all results for "{searchQuery}"
                        </button>
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {showResults && searchResults.length === 0 && !searchLoading && searchQuery.length >= 2 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 border border-white/20 rounded-lg backdrop-blur-sm shadow-2xl z-50 p-4">
                      <div className="text-center text-gray-400">
                        <FaSearch className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No results found for "{searchQuery}"</p>
                        <p className="text-xs mt-1">Try different keywords or check spelling</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Section */}
            {!loading && user ? (
              <div className="flex items-center space-x-4">
                

                {/* Social Features */}
                <div className="flex items-center space-x-2">
                  {/* Messages */}
                  <button
                    onClick={() => setShowMessageCenter(true)}
                    className="relative p-2 text-gray-300 hover:text-white transition-colors"
                    title="Messages"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {unreadMessageCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Notifications */}
                <NotificationDropdown />

                {/* User Profile */}
                <UserMenu
                  user={user}
                  navigate={navigate}
                  showUserMenu={showUserMenu}
                  setShowUserMenu={setShowUserMenu}
                  userMenuRef={userMenuRef}
                  handleLogout={handleLogout}
                />

                {/* Admin Panel */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden lg:block bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors"
                  >
                    Admin
                  </Link>
                )}
              </div>
            ) : (
              // Guest User Buttons
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate("/login")}
                  className="text-white hover:text-gray-300 transition-colors text-sm font-medium"
                >
                  Sign In
                </button>
                <Link
                  to="/register"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-white hover:text-gray-300 transition-colors"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`block h-0.5 w-full bg-current transition-all duration-300 ${
                  showMobileMenu ? 'rotate-45 translate-y-2' : ''
                }`}></span>
                <span className={`block h-0.5 w-full bg-current transition-all duration-300 ${
                  showMobileMenu ? 'opacity-0' : ''
                }`}></span>
                <span className={`block h-0.5 w-full bg-current transition-all duration-300 ${
                  showMobileMenu ? '-rotate-45 -translate-y-2' : ''
                }`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div 
          ref={mobileMenuRef}
          className="lg:hidden fixed top-16 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/20 z-40 animate-slide-down"
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Mobile Navigation */}
            <nav className="mb-6">
              <MainMenu mobile onItemClick={() => setShowMobileMenu(false)} />
            </nav>

            {/* Mobile Search */}
            <div className="mb-6">
              <div className="flex items-center bg-black/70 border border-white/20 rounded-lg">
                <div className="relative">
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="bg-transparent text-gray-300 border-r border-white/20 px-3 py-3 pr-6 focus:outline-none text-sm appearance-none cursor-pointer"
                  >
                    {searchCategories.map((category) => (
                      <option key={category.id} value={category.id} className="bg-black text-white">
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <FaCaretDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                </div>
                
                <FaSearch className="w-4 h-4 text-gray-400 ml-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  placeholder={searchCategories.find(c => c.id === searchCategory)?.placeholder || "Search..."}
                  className="bg-transparent text-white placeholder-gray-400 px-3 py-3 flex-1 focus:outline-none text-sm"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Mobile User Actions */}
            {!loading && user ? (
              <div className="space-y-4">
                <Link
                  to="/dashboard"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-3 text-white hover:text-yellow-400 transition-colors p-3 rounded-lg hover:bg-white/10"
                >
                  <FaListUl className="w-5 h-5" />
                  <span>My Vault</span>
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-auto">
                    172
                  </span>
                </Link>

                <div className="p-3 rounded-lg hover:bg-white/10">
                  <NotificationDropdown />
                  <span className="ml-3 text-sm">Notifications</span>
                </div>

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-3 text-white hover:text-green-400 transition-colors p-3 rounded-lg hover:bg-white/10"
                  >
                    <span>Admin Panel</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors p-3 rounded-lg hover:bg-white/10 w-full"
                >
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Link
                  to="/login"
                  onClick={() => setShowMobileMenu(false)}
                  className="block text-center bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setShowMobileMenu(false)}
                  className="block text-center bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Message Center Modal */}
      <MessageCenter 
        isOpen={showMessageCenter}
        onClose={() => setShowMessageCenter(false)}
      />
    </header>
  );
};

export default Header;
