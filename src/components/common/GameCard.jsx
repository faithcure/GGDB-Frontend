import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaGamepad, FaHeart, FaThumbsUp, FaThumbsDown, FaClock, FaHeartBroken, FaPlay, FaTrophy, FaFire } from "react-icons/fa";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import "flag-icons/css/flag-icons.min.css";
import { API_BASE } from "../../config/api";

// Basit Tooltip Componenti
const Tooltip = ({ content, children }) => {
  const [show, setShow] = useState(false);

  return (
      <div
          className="relative inline-block"
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
      >
        {children}
        {show && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded shadow-xl whitespace-nowrap z-50 border border-gray-700/50 animate-fadeIn">
              {content}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-gray-900/95"></div>
            </div>
        )}
      </div>
  );
};

const GameCard = ({ _id, image, title, rating, votes, studio, country, metacritic, isNew, isTrending, genre, releaseYear, rank, isTopRated, matchPercentage }) => {
  const [liked, setLiked] = useState(false);         // Single thumbs up
  const [loved, setLoved] = useState(false);         // Double thumbs up
  const [played, setPlayed] = useState(false);
  const [planning, setPlanning] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [playedPercent, setPlayedPercent] = useState(0);
  const [showPercentInput, setShowPercentInput] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const glowRef = useRef(null);
  const shakeTimeoutRef = useRef(null);
  const particleTimeoutRef = useRef(null);
  const debounceTimeoutRef = useRef(null);
  const sliderAutoCloseRef = useRef(null);
  const navigate = useNavigate();

  const API_URL = API_BASE;
  const token = localStorage.getItem('token');
  
  // Safe user parsing with error handling
  const getUser = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return {};
      const parsed = JSON.parse(userStr);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
      console.error('User parse error:', error);
      localStorage.removeItem('user'); // Cleanup corrupted data
      return {};
    }
  };
  
  const user = getUser();

  // Save activity to localStorage
  const saveActivity = (newActivity) => {
    if (!user._id || !_id) return;
    
    const storageKey = `game_activity_${user._id}_${_id}`;
    const currentActivity = localStorage.getItem(storageKey);
    
    let activity = {};
    if (currentActivity) {
      try {
        activity = JSON.parse(currentActivity);
      } catch (e) {
        console.error('Error parsing current activity:', e);
      }
    }
    
    // Merge new activity with existing
    const updatedActivity = {
      ...activity,
      ...newActivity,
      playedPercent,
      played
    };
    
    localStorage.setItem(storageKey, JSON.stringify(updatedActivity));
  };

  // Safe API call helper (disabled for now)
  const safeApiCall = async (url, options = {}) => {
    try {
      // Temporarily disabled to prevent 500 errors
      console.log('API call disabled:', url);
      return { success: false, error: 'API calls temporarily disabled' };
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: error.message };
    }
  };

  // Kullanıcı aktivitelerini yükle
  useEffect(() => {
    if (!user._id || !_id) return;

    const fetchUserActivity = async () => {
      try {
        // Temporarily disable API calls to prevent 500 errors
        // Use localStorage for persistent state instead
        const storageKey = `game_activity_${user._id}_${_id}`;
        const savedActivity = localStorage.getItem(storageKey);
        
        if (savedActivity) {
          try {
            const activity = JSON.parse(savedActivity);
            setLiked(activity.liked || false);
            setLoved(activity.loved || false);
            setDisliked(activity.disliked || false);
            setPlanning(activity.planning || false);
            setPlayedPercent(activity.playedPercent || 0);
            setPlayed(activity.played || false);
          } catch (e) {
            console.error('Error parsing saved activity:', e);
          }
        }

      } catch (error) {
        console.error('Failed to fetch user activity:', error);
      }
    };

    fetchUserActivity();
  }, [user._id, _id]);

  useEffect(() => {
    if (loved) {
      // Create heart particles when loved
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: i * 0.1
      }));
      setParticles(newParticles);
      
      // Clear any existing particle timeout
      if (particleTimeoutRef.current) {
        clearTimeout(particleTimeoutRef.current);
      }
      
      // Set new timeout with cleanup
      particleTimeoutRef.current = setTimeout(() => {
        setParticles([]);
        particleTimeoutRef.current = null;
      }, 2000);
    }
  }, [loved]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (particleTimeoutRef.current) {
        clearTimeout(particleTimeoutRef.current);
      }
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current);
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (sliderAutoCloseRef.current) {
        clearTimeout(sliderAutoCloseRef.current);
      }
    };
  }, []);

  const getMetacriticColor = (score) => {
    if (score >= 85) return "from-emerald-400 to-green-500";
    if (score >= 75) return "from-green-400 to-emerald-500";
    if (score >= 60) return "from-yellow-400 to-orange-400";
    if (score >= 50) return "from-orange-400 to-red-400";
    return "from-red-400 to-red-600";
  };

  const getRatingColor = (rating) => {
    if (rating >= 9) return "from-purple-400 to-pink-400";
    if (rating >= 8) return "from-blue-400 to-purple-400";
    if (rating >= 7) return "from-green-400 to-blue-400";
    if (rating >= 6) return "from-yellow-400 to-green-400";
    return "from-orange-400 to-yellow-400";
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;

    if (imageRef.current && imageLoaded) {
      const offsetX = (x - centerX) / 15;
      const offsetY = (y - centerY) / 15;
      imageRef.current.style.transform = `scale(1.15) translate(${offsetX}px, ${offsetY}px)`;
    }

    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`;
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }
    if (imageRef.current && imageLoaded) {
      imageRef.current.style.transform = "scale(1.1) translate(0, 0)";
    }
    if (glowRef.current) {
      glowRef.current.style.background = "transparent";
    }
  };

  const handleActionClick = async (action, e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user._id || !token) {
      // Kullanıcı giriş yapmamış - login sayfasına yönlendir
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      switch(action) {
        case 'play':
          // Progress işlemi
          if (!played) {
            setPlayed(true);
            setShowPercentInput(true);
            resetSliderAutoClose();
          } else {
            setShowPercentInput(!showPercentInput);
            if (!showPercentInput) {
              resetSliderAutoClose();
            }
          }
          break;

        case 'like':
          // Single thumbs up toggle
          const newLiked = !liked;
          setLiked(newLiked);
          if (newLiked) {
            setLoved(false);
            setDisliked(false);
          }
          saveActivity({ liked: newLiked, loved: false, disliked: false });
          break;

        case 'love':
          // Double thumbs up toggle
          const newLoved = !loved;
          setLoved(newLoved);
          if (newLoved) {
            setLiked(false);
            setDisliked(false);
          }
          saveActivity({ loved: newLoved, liked: false, disliked: false });
          break;

        case 'plan':
          // Eğer oyun %10'dan fazla oynandıysa plan to play engelle
          if (playedPercent > 10 && !planning) {
            alert(`You've already played this game ${playedPercent}% - can't add to plan to play!`);
            break;
          }

          const newPlanning = !planning;
          setPlanning(newPlanning);
          saveActivity({ planning: newPlanning });
          break;

        case 'hate':
          // Dislike toggle
          const newDisliked = !disliked;
          setDisliked(newDisliked);
          if (newDisliked) {
            setLiked(false);
            setLoved(false);
          }
          saveActivity({ disliked: newDisliked, liked: false, loved: false });

          // Shake animation
          if (cardRef.current) {
            cardRef.current.style.animation = "shake 0.5s ease-in-out";
            
            // Clear any existing shake timeout
            if (shakeTimeoutRef.current) {
              clearTimeout(shakeTimeoutRef.current);
            }
            
            // Set new timeout with cleanup
            shakeTimeoutRef.current = setTimeout(() => {
              if (cardRef.current) {
                cardRef.current.style.animation = "";
              }
              shakeTimeoutRef.current = null;
            }, 500);
          }
          break;
      }
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced progress save to localStorage
  const debouncedProgressSave = async (newProgress) => {
    saveActivity({ 
      playedPercent: newProgress, 
      played: newProgress > 0 
    });
  };

  // Progress kaydetme with debouncing
  const handleProgressSave = (newProgress) => {
    // Update UI immediately for responsiveness
    setPlayedPercent(newProgress);
    setPlayed(newProgress > 0);

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Debounce save call (wait 500ms after user stops dragging)
    debounceTimeoutRef.current = setTimeout(() => {
      debouncedProgressSave(newProgress);
      debounceTimeoutRef.current = null;
    }, 500);

    // Reset auto-close timer
    resetSliderAutoClose();
  };

  // Auto-close slider after 1 second of inactivity
  const resetSliderAutoClose = () => {
    if (sliderAutoCloseRef.current) {
      clearTimeout(sliderAutoCloseRef.current);
    }
    
    sliderAutoCloseRef.current = setTimeout(() => {
      setShowPercentInput(false);
      sliderAutoCloseRef.current = null;
    }, 1000);
  };

  // Ana kart tıklama handler'ı - buton alanlarını kontrol ediyor
  const handleCardClick = (e) => {
    // Eğer tıklanan element button, input veya bunların içindeki bir element ise navigate etme
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('.action-area')) {
      return;
    }
    navigate(`/game/${_id}`);
  };

  return (
      <div className="relative group">
        {/* Particle System */}
        {particles.map((particle) => (
            <div
                key={particle.id}
                className="absolute pointer-events-none z-50"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  animationDelay: `${particle.delay}s`
                }}
            >
              <FaHeart className="text-pink-400 text-lg animate-ping" />
            </div>
        ))}

        {/* Main Card */}
        <div
            ref={cardRef}
            className="relative w-[300px] h-[480px] rounded-2xl overflow-hidden cursor-pointer transform-gpu"
            onClick={handleCardClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              transformStyle: "preserve-3d",
            }}
        >
          {/* Glow Effect */}
          <div
              ref={glowRef}
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-10"
          />

          {/* Holographic Border */}
          <div className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <div className="w-full h-full rounded-2xl bg-slate-900" />
          </div>

          {/* Background Image */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            {/* Loading placeholder */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="animate-pulse">
                  <div className="w-16 h-16 bg-gray-700 rounded-lg mb-2"></div>
                  <div className="h-2 bg-gray-700 rounded w-20"></div>
                </div>
              </div>
            )}
            
            <img
                ref={imageRef}
                src={image || 'https://placehold.co/300x400?text=No+Image'}
                alt={title || 'Game Image'}
                className={`w-full h-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  filter: isHovered ? "brightness(1.1) contrast(1.1) saturate(1.2)" : "brightness(0.8)",
                  transform: imageLoaded ? 'scale(1.1)' : 'scale(1.05)',
                  transition: 'none'
                }}
                onError={(e) => {
                  if (e.target.src !== 'https://placehold.co/300x400?text=No+Image') {
                    e.target.src = 'https://placehold.co/300x400?text=No+Image';
                  }
                  setImageLoaded(true);
                }}
                onLoad={() => {
                  setImageLoaded(true);
                }}
            />

            {/* Dynamic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            {/* Shimmer Effect */}
            <div
                className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full transition-transform duration-300 ${isHovered ? 'translate-x-full' : ''}`}
                style={{ transform: 'skewX(-25deg)' }}
            />
          </div>

          {/* Status Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
            {/* Rank Badge for Top Rated */}
            {isTopRated && rank && (
                <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  <FaTrophy className="text-xs" />
                  #{rank}
                </div>
            )}

            {/* Progress Badge */}
            {playedPercent > 0 && (
                <div className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                  <FaGamepad className="text-xs" />
                  {playedPercent}%
                </div>
            )}

            {/* Match Percentage Badge */}
            {user && user._id && matchPercentage != null ? (
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-lg text-white ${
                  matchPercentage >= 90 ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                  matchPercentage >= 80 ? 'bg-gradient-to-r from-green-500 to-lime-500' :
                  matchPercentage >= 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                  matchPercentage >= 60 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                  'bg-gradient-to-r from-red-500 to-pink-500'
                }`}>
                  <FaHeart className="text-xs" />
                  {matchPercentage}% Match
                </div>
            ) : !user._id ? (
                <Tooltip content="Sign in to see your personal game match percentage based on your preferences!">
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    ?% Match
                  </div>
                </Tooltip>
            ) : null}

            {isNew && (
                <div className="flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 rounded-full text-white text-xs font-bold">
                  <HiSparkles className="text-sm" />
                  NEW
                </div>
            )}
            {isTrending && (
                <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 rounded-full text-white text-xs font-bold">
                  <FaFire className="text-sm" />
                  TRENDING
                </div>
            )}
          </div>

          {/* Metacritic Score */}
          {metacritic !== undefined && (
              <div className="absolute top-4 right-4 z-20">
                <div className={`bg-gradient-to-r ${getMetacriticColor(metacritic)} p-[2px] rounded-lg`}>
                  <div className="bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <div className="text-white font-bold text-sm text-center">
                      {metacritic}
                    </div>
                    <div className="text-white/70 text-xs text-center">META</div>
                  </div>
                </div>
              </div>
          )}

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-6 z-10">
            {/* Header Info */}
            <div className="flex-1" />

            {/* Main Content */}
            <div className="space-y-4">
              {/* Title & Studio */}
              <div className="space-y-2">
                <h3 className="font-bold text-2xl text-white drop-shadow-lg line-clamp-2 leading-tight">
                  {title}
                </h3>
                <div className="flex items-center gap-3 text-white/80">
                  <span className="text-sm font-medium">{studio}</span>
                  {country && (
                      <span className={`fi fi-${country.toLowerCase()} text-lg drop-shadow`} />
                  )}
                  {releaseYear && (
                      <span className="text-sm bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                    {releaseYear}
                  </span>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className={`bg-gradient-to-r ${getRatingColor(rating)} p-[2px] rounded-xl`}>
                  <div className="bg-black/80 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2">
                    <FaStar className="text-yellow-300 text-lg" />
                    <span className="font-bold text-lg text-white">
                      {rating && !isNaN(parseFloat(rating)) ? parseFloat(rating).toFixed(1) : '0.0'}
                    </span>
                  </div>
                </div>
                <div className="text-white/60 text-sm">
                  <div className="font-medium">{(votes || 0).toLocaleString()}</div>
                  <div className="text-xs">votes</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between action-area">
                <div className="flex items-center gap-2">
                  <Tooltip content="Mark as Played">
                    <button
                        onClick={(e) => handleActionClick('play', e)}
                        className={`relative group/btn p-3 rounded-xl transition-all duration-300 ${
                            played
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25"
                                : "bg-white/10 backdrop-blur-sm text-white/70 hover:bg-white/20 hover:text-white"
                        }`}
                    >
                      <FaGamepad className="text-lg" />
                      {played && (
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/20 to-emerald-400/20 animate-pulse" />
                      )}
                    </button>
                  </Tooltip>

                  <Tooltip content="Like This Game">
                    <button
                        onClick={(e) => handleActionClick('like', e)}
                        disabled={loading}
                        className={`relative group/btn p-3 rounded-xl transition-all duration-300 ${
                            liked
                                ? "bg-red-600 text-white shadow-lg shadow-red-500/25"
                                : "bg-white/10 backdrop-blur-sm text-white/70 hover:bg-red-600/70 hover:text-white"
                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <FaThumbsUp className="text-lg" />
                    </button>
                  </Tooltip>

                  <Tooltip content="Love This Game">
                    <button
                        onClick={(e) => handleActionClick('love', e)}
                        disabled={loading}
                        className={`relative group/btn p-3 rounded-xl transition-all duration-300 ${
                            loved
                                ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/25"
                                : "bg-white/10 backdrop-blur-sm text-white/70 hover:bg-yellow-500/70 hover:text-black"
                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="relative w-5 h-5 flex items-center justify-center">
                        <FaThumbsUp size={16} className="absolute transform -translate-x-0.5 -translate-y-0.5" style={{filter: 'drop-shadow(1px 1px 0px rgba(0,0,0,0.8))'}} />
                        <FaThumbsUp size={16} className="absolute transform translate-x-0.5 translate-y-0.5" style={{filter: 'drop-shadow(-1px -1px 0px rgba(0,0,0,0.8))'}} />
                      </div>
                    </button>
                  </Tooltip>

                  <Tooltip content="Plan to Play">
                    <button
                        onClick={(e) => handleActionClick('plan', e)}
                        disabled={loading}
                        className={`relative group/btn p-3 rounded-xl transition-all duration-300 ${
                            planning
                                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                                : "bg-white/10 backdrop-blur-sm text-white/70 hover:bg-purple-600/70 hover:text-white"
                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <FaClock className="text-lg" />
                    </button>
                  </Tooltip>
                </div>

                <Tooltip content="Not Interested">
                  <button
                      onClick={(e) => handleActionClick('hate', e)}
                      disabled={loading}
                      className={`p-3 rounded-xl transition-all duration-300 ${
                          disliked
                              ? "bg-blue-700 text-white shadow-lg shadow-blue-500/25"
                              : "bg-white/10 backdrop-blur-sm text-white/70 hover:bg-blue-700/70 hover:text-white"
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <FaThumbsDown className="text-lg" />
                  </button>
                </Tooltip>
              </div>

              {/* Progress Input */}
              {showPercentInput && (
                  <div 
                    className="bg-black/60 backdrop-blur-lg rounded-xl p-4 border border-white/10 animate-slideIn action-area"
                    onMouseEnter={() => {
                      if (sliderAutoCloseRef.current) {
                        clearTimeout(sliderAutoCloseRef.current);
                      }
                    }}
                    onMouseLeave={() => resetSliderAutoClose()}
                  >
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Completion Progress
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 relative">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={playedPercent}
                            onChange={(e) => {
                              const newProgress = parseInt(e.target.value);
                              handleProgressSave(newProgress);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onMouseMove={() => resetSliderAutoClose()}
                            onMouseDown={() => {
                              if (sliderAutoCloseRef.current) {
                                clearTimeout(sliderAutoCloseRef.current);
                              }
                            }}
                            onMouseUp={() => resetSliderAutoClose()}
                            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div
                            className="absolute top-0 left-0 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg transition-all duration-300"
                            style={{ width: `${playedPercent}%` }}
                        />
                      </div>
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1 rounded-lg text-white font-bold text-sm min-w-[60px] text-center">
                        {playedPercent}%
                      </div>
                    </div>

                    {/* Progress Status Message */}
                    {playedPercent > 0 && (
                        <div className="mt-2 text-center">
                    <span className="text-xs text-green-400 font-medium">
                      {playedPercent === 100 ? '🏆 Completed!' :
                          playedPercent >= 75 ? '⚡ Almost there!' :
                              playedPercent >= 50 ? '🔥 Making progress!' :
                                  playedPercent >= 25 ? '💪 Getting started!' :
                                      '🚀 Just started!'}
                    </span>
                        </div>
                    )}
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Custom Styles */}
        <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) scale(0.8); }
          to { opacity: 1; transform: translateX(-50%) scale(1); }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #10b981, #059669);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #10b981, #059669);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }
      `}</style>
      </div>
  );
};

export default GameCard;