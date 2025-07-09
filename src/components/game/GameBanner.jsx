import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { FaPlay, FaStar, FaCheckCircle, FaRegHeart, FaRegClock, FaTwitch, FaYoutube, FaThumbsUp, FaThumbsDown, FaCheck, FaTimes } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import { BsShareFill } from "react-icons/bs";
import { MdTrendingUp, MdStars, MdThumbUp, MdThumbDown, MdFavorite, MdTrendingFlat, MdHourglassEmpty } from "react-icons/md";
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
import { IoSparkles, IoFlame, IoShieldCheckmark } from "react-icons/io5";
import AwardsList from "../game/awards/AwardsList";
import PopularityModal from "./PopularityModal";

// YouTube linkinden ID çıkar (trailer embed için)
const getYoutubeId = (url = "") => {
  const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+|(?:v|embed)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/) || [];
  return match[1] || "";
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const GameBanner = ({ game, averageRating, ratingCount }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const role = user?.role?.toLowerCase();
  const [showProgressInput, setShowProgressInput] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [gameProgress, setGameProgress] = useState(0);
  
  const [isLiked, setIsLiked] = useState(false);     // Single thumbs up
  const [isLoved, setIsLoved] = useState(false);     // Double thumbs up
  const [isPlanned, setIsPlanned] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [showPopularityModal, setShowPopularityModal] = useState(false);

  // Override desteği
  const poster = game.bannerOverrides?.posterImage || game.coverImage;
  const trailer = game.bannerOverrides?.trailerUrl || game.trailerUrl;

  // Trailer tipi belirleme
  const isYoutube = trailer && (trailer.includes("youtube.com") || trailer.includes("youtu.be"));
  const isVideoFile = trailer && (trailer.endsWith(".mp4") || trailer.endsWith(".webm") || trailer.endsWith(".ogg"));

  // API URL
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Twitch ve YouTube arama linkleri
  const openTwitchSearch = () => {
    const searchQuery = encodeURIComponent(game.title);
    window.open(`https://www.twitch.tv/search?term=${searchQuery}`, '_blank');
  };

  const openYouTubeSearch = () => {
    const searchQuery = encodeURIComponent(game.title);
    window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank');
  };

  const handleFinishedClick = () => {
    setProgressValue(gameProgress); // Mevcut değeri progressValue'ya set et
    setShowProgressInput(true);
  };

  const handleProgressSubmit = () => {
    fetch(`${API_URL}/api/user-activity/progress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ gameId: game._id, progress: Number(progressValue) }),
    })
      .then(res => res.json())
      .then(data => {
        setGameProgress(data.progress);
        setShowProgressInput(false);
        // Toast mesajı ekleyebilirsiniz
      })
      .catch(error => {
        console.error("Progress update failed:", error);
        setShowProgressInput(false);
      });
  };

  const handleProgressCancel = () => {
    setShowProgressInput(false);
    setProgressValue(gameProgress); // Eski değere geri dön
  };

  const getProgressMessage = (val) => {
    const num = Number(val);
    if (num === 0) return "Ready to start the quest! 🎮";
    if (num <= 10) return "Just entered the game! 🚀";
    if (num < 25) return "Getting the hang of it! 💪";
    if (num < 50) return "Making solid progress! 🔥";
    if (num < 75) return "More than halfway there! ⚡";
    if (num < 90) return "Almost at the finish line! 🏁";
    if (num < 100) return "So close to victory! 👑";
    if (num === 100) return "Achievement unlocked! GG! 🏆";
    return "";
  };

  // Hybrid rating algorithm combining community, GGDB, and Metacritic scores
  const getCommunityStatus = () => {
    // Community interaction data
    const likedCount = game.likedCount || 0;
    const lovedCount = game.lovedCount || 0;
    const dislikedCount = game.dislikedCount || 0;
    const totalInteractions = likedCount + lovedCount + dislikedCount;

    // Professional rating data
    const ggdbScore = averageRating || 0; // 0-10 scale
    const ggdbRatingCount = ratingCount || 0;
    const metacriticScore = game.metacriticScore || 0; // 0-100 scale

    // Calculate normalized scores (0-1 scale)
    let communityScore = 0;
    if (totalInteractions > 0) {
      const rawCommunityScore = (lovedCount * 2 + likedCount * 1 - dislikedCount * 1) / totalInteractions;
      communityScore = Math.max(0, Math.min(1, (rawCommunityScore + 1) / 2)); // -1 to 1 → 0 to 1
    }
    
    const ggdbNormalized = ggdbScore / 10; // 0-10 → 0-1
    const metacriticNormalized = metacriticScore / 100; // 0-100 → 0-1

    // Dynamic weighted average based on available data
    let finalScore = 0;
    let totalWeight = 0;

    // Community data (40% weight if enough interactions)
    if (totalInteractions >= 10) {
      finalScore += communityScore * 0.4;
      totalWeight += 0.4;
    }
    
    // GGDB rating (35% weight if enough ratings)
    if (ggdbRatingCount >= 3) {
      finalScore += ggdbNormalized * 0.35;
      totalWeight += 0.35;
    }
    
    // Metacritic score (25% weight if available)
    if (metacriticScore > 0) {
      finalScore += metacriticNormalized * 0.25;
      totalWeight += 0.25;
    }

    // No sufficient data available
    if (totalWeight === 0) {
      return { text: "Awaiting Reviews", color: "text-gray-400", icon: MdHourglassEmpty };
    }

    // Normalize final score by actual weight used
    finalScore = finalScore / totalWeight;

    // Enhanced status levels based on hybrid score
    if (finalScore >= 0.92) {
      return { text: "Masterpiece", color: "text-purple-400", icon: MdStars };
    } else if (finalScore >= 0.85) {
      return { text: "Exceptional", color: "text-pink-400", icon: IoShieldCheckmark };
    } else if (finalScore >= 0.78) {
      return { text: "Outstanding", color: "text-green-400", icon: IoFlame };
    } else if (finalScore >= 0.70) {
      return { text: "Very Positive", color: "text-green-500", icon: IoSparkles };
    } else if (finalScore >= 0.60) {
      return { text: "Mostly Positive", color: "text-lime-400", icon: BiSolidUpArrow };
    } else if (finalScore >= 0.45) {
      return { text: "Mixed Reviews", color: "text-yellow-400", icon: MdTrendingFlat };
    } else if (finalScore >= 0.30) {
      return { text: "Mostly Negative", color: "text-orange-400", icon: BiSolidDownArrow };
    } else if (finalScore >= 0.15) {
      return { text: "Poor Reception", color: "text-red-400", icon: MdThumbDown };
    } else {
      return { text: "Overwhelmingly Negative", color: "text-red-500", icon: MdThumbDown };
    }
  };

  const handleLikeClick = () => {
    fetch(`${API_URL}/api/user-activity/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ gameId: game._id }),
    })
      .then(res => res.json())
      .then(data => {
        setIsLiked(data.liked);
        if (data.liked) {
          setIsLoved(false);
          setIsDisliked(false);
        }
      })
      .catch(error => console.error("Like action failed:", error));
  };

  const handleLovedClick = () => {
    fetch(`${API_URL}/api/user-activity/loved`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ gameId: game._id }),
    })
      .then(res => res.json())
      .then(data => {
        setIsLoved(data.loved);
        if (data.loved) {
          setIsLiked(false);
          setIsDisliked(false);
        }
      })
      .catch(error => console.error("Loved action failed:", error));
  };

  const handlePlanClick = () => {
    // Eğer oyun %10'dan fazla oynandıysa plan to play aktif etmeye izin verme
    if (gameProgress > 10 && !isPlanned) {
      alert(`You've already played this game ${gameProgress}% - can't add to plan to play!`);
      return;
    }

    fetch(`${API_URL}/api/user-activity/plantoplay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ gameId: game._id }),
    })
      .then(res => res.json())
      .then(data => setIsPlanned(data.plantoplay))
      .catch(error => console.error("Plan to play action failed:", error));
  };

  const handleHateClick = () => {
    fetch(`${API_URL}/api/user-activity/dislike`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ gameId: game._id }),
    })
      .then(res => res.json())
      .then(data => {
        setIsDisliked(data.disliked);
        if (data.disliked) {
          setIsLiked(false);
          setIsLoved(false);
        }
      })
      .catch(error => console.error("Dislike action failed:", error));
  };

  const getStatusDisplay = () => {
    const statuses = [];
    
    const displayProgress = showProgressInput ? progressValue : gameProgress;
    
    if ((gameProgress > 0 && !showProgressInput) || (showProgressInput && progressValue > 0)) {
      statuses.push(
        <div key="finished" className="flex items-center gap-1">
          <FaCheckCircle className="text-green-400" size={16} />
          <span className="text-green-300 font-medium">{displayProgress}%</span>
          <span className="text-green-300/60">•</span>
          <span className="text-green-300 font-medium">
            {getProgressMessage(displayProgress)}
          </span>
        </div>
      );
    }
    
    if (isLiked) {
      statuses.push(
        <div key="liked" className="flex items-center gap-1">
          <FaThumbsUp className="text-red-400" size={16} />
          <span className="text-red-300 font-medium">Liked</span>
        </div>
      );
    }
    
    if (isLoved) {
      statuses.push(
        <div key="loved" className="flex items-center gap-1">
          <div className="relative w-4 h-4 flex items-center justify-center">
            <FaThumbsUp className="text-yellow-400 absolute transform -translate-x-0.5 -translate-y-0.5" size={12} style={{filter: 'drop-shadow(1px 1px 0px rgba(0,0,0,0.6))'}} />
            <FaThumbsUp className="text-yellow-400 absolute transform translate-x-0.5 translate-y-0.5" size={12} style={{filter: 'drop-shadow(-1px -1px 0px rgba(0,0,0,0.6))'}} />
          </div>
          <span className="text-yellow-300 font-medium ml-1">Loved</span>
        </div>
      );
    }
    
    if (isPlanned) {
      statuses.push(
        <div key="planned" className="flex items-center gap-1">
          <FaRegClock className="text-purple-400" size={16} />
          <span className="text-purple-300 font-medium">Planned</span>
        </div>
      );
    }

    if (isDisliked) {
      statuses.push(
        <div key="hated" className="flex items-center gap-1">
          <FaThumbsDown className="text-gray-400" size={16} />
          <span className="text-gray-300 font-medium">Disliked</span>
        </div>
      );
    }
    
    if (statuses.length === 0) return null;
    
    return (
      <div className="flex items-center gap-4">
        {statuses}
      </div>
    );
  };

  // User activity durumlarını getir
  useEffect(() => {
    if (!user || !game?._id) return;

    const fetchUserActivity = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      try {
        // Like durumu
        const likeRes = await fetch(`${API_URL}/api/user-activity/like/${user._id}/${game._id}`, { headers });
        const likeData = await likeRes.json();
        setIsLiked(likeData.liked || false);

        // Loved durumu
        const lovedRes = await fetch(`${API_URL}/api/user-activity/loved/${user._id}/${game._id}`, { headers });
        const lovedData = await lovedRes.json();
        setIsLoved(lovedData.loved || false);

        // Plan to play durumu
        const planRes = await fetch(`${API_URL}/api/user-activity/plantoplay/${user._id}/${game._id}`, { headers });
        const planData = await planRes.json();
        setIsPlanned(planData.plantoplay || false);

        // Dislike durumu
        const dislikeRes = await fetch(`${API_URL}/api/user-activity/dislike/${user._id}/${game._id}`, { headers });
        const dislikeData = await dislikeRes.json();
        setIsDisliked(dislikeData.disliked || false);

        // Progress durumu
        const progressRes = await fetch(`${API_URL}/api/user-activity/progress/${user._id}/${game._id}`, { headers });
        const progressData = await progressRes.json();
        const currentProgress = progressData.progress || 0;
        setGameProgress(currentProgress);
        setProgressValue(currentProgress); // progressValue'yu da güncelle
      } catch (error) {
        console.error("Failed to fetch user activity:", error);
        // Hata durumunda default değerleri koru
        setIsLiked(false);
        setIsLoved(false);
        setIsPlanned(false);
        setIsDisliked(false);
        setGameProgress(0);
        setProgressValue(0);
      }
    };

    fetchUserActivity();
  }, [user, game?._id, API_URL]);

  return (
    <section className="relative text-white mt-16">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${poster})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(30px) brightness(0.08)",
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 z-0" />

      {/* Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-6">
        {/* ÜST SATIR: MENÜ + RATING */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/80 font-medium">
            <button 
              onClick={() => navigate(`/game/${game._id}/cast-crew`)}
              className="hover:text-white transition"
            >
              Cast & crew
            </button>
            <span className="text-white/40">·</span>
            <button 
              onClick={() => navigate(`/game/${game._id}/reviews`)}
              className="hover:text-white transition"
            >
              User reviews
            </button>
            <span className="text-white/40">·</span>
            <button 
              onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-white transition"
            >
              Screenshots
            </button>
            <span className="text-white/40">·</span>
            <button 
              onClick={() => document.getElementById('rating')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-white transition"
            >
              Rating System
            </button>
            <span className="text-white/40">·</span>
            <BsShareFill className="text-white cursor-pointer hover:text-white/80" />
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-white">
            <div className="flex flex-col items-center">
              <span className="text-xs text-white/60 tracking-widest">GGDB RATING</span>
              <div className="flex items-center gap-1 mt-1">
                <AiFillStar className="text-yellow-400 text-lg" />
                <span className="text-white font-bold">{(averageRating ?? 0).toFixed(1)}</span>
                <span className="text-white/60">/10</span>
              </div>
              <span className="text-xs text-white/50">
                {ratingCount > 0 ? `${ratingCount} votes` : "-"}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-white/60 tracking-widest">METACRITIC RATING</span>
              <div className="flex items-center gap-1 mt-1">
                {game.metacriticScore !== undefined ? (
                  <>
                    <FaStar className="text-blue-400 text-lg" />
                    <span className="text-white font-bold">{game.metacriticScore}</span>
                    <span className="text-white/60">/100</span>
                  </>
                ) : (
                  <span className="text-white/50 italic">No data</span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-white/60 tracking-widest">POPULARITY</span>
              <button 
                onClick={() => setShowPopularityModal(true)}
                className="flex items-center gap-1 mt-1 hover:bg-white/10 px-2 py-1 rounded transition-colors cursor-pointer"
              >
                <MdTrendingUp className="text-green-400 text-lg" />
                <span className="text-white font-bold">{game.popularity || "-"}</span>
                <span className="text-white/60">+{game.popularityDelta || 0}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ALT SATIR: Başlık */}
        <div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-4xl font-bold">{game.title}</h1>
              {getStatusDisplay()}
            </div>
            {role === "admin" && (
              <a
                href={`/admin/view/${game._id}`}
                className="border border-lime-400 text-lime-300 bg-lime-400/10 hover:bg-lime-400/20
                          px-6 py-2 w-[220px] text-center rounded-md text-sm font-semibold
                          transition-colors duration-200"
              >
                🛠️ Edit This Game
              </a>
            )}
          </div>
          <p className="text-sm text-gray-300">
            Original title: {game.originalTitle || game.title} - {formatDate(game.releaseDate)}
          </p>
        </div>

        {/* POSTER + VIDEO + SIDE BUTTONS */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Poster */}
          <div className="w-full md:w-[300px] h-[460px]">
            <img
              src={poster}
              alt={game.title}
              className="rounded-lg shadow-xl w-full h-full object-cover"
            />
          </div>

          {/* Trailer / Video */}
          <div className="flex-1 relative">
            <div className="h-[460px] relative rounded-lg overflow-hidden shadow-lg bg-black">
              {trailer ? (
                isYoutube ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYoutubeId(trailer)}?rel=0&showinfo=0&modestbranding=1`}
                    className="w-full h-full object-cover"
                    frameBorder="0"
                    allow="encrypted-media"
                    allowFullScreen
                    title="Trailer"
                  />
                ) : isVideoFile ? (
                  <video
                    src={trailer}
                    className="w-full h-full object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={trailer}
                    alt="Trailer"
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <img
                  src={poster}
                  alt="Trailer"
                  className="w-full h-full object-cover"
                />
              )}
              
              {!isVideoFile && !isYoutube && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center hover:bg-opacity-60 transition cursor-pointer">
                  <FaPlay className="text-white text-4xl" />
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {/* Progress Button */}
                <div className="group relative flex items-center justify-end">
                  <div 
                    className={`h-12 rounded-xl flex items-center border bg-gray-800/40 text-gray-200 border-gray-600/50 hover:bg-green-600/70 hover:text-white transition-all duration-300 relative z-10 overflow-hidden cursor-pointer hover:border-green-400/50 ${
                      showProgressInput ? 'w-[300px] px-3' : gameProgress > 0 ? 'w-12 group-hover:w-[200px] px-3' : 'w-12 group-hover:w-[180px] px-3'
                    }`}
                  >
                    {showProgressInput ? (
                      <div className="w-full flex items-center gap-2">
                        <FaCheckCircle size={20} className="flex-shrink-0" />
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={progressValue}
                            onChange={(e) => setProgressValue(e.target.value)}
                            className="flex-1 h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, #10b981 0%, #10b981 ${progressValue}%, rgba(255,255,255,0.2) ${progressValue}%, rgba(255,255,255,0.2) 100%)`
                            }}
                          />
                          <span className="text-sm font-bold min-w-[35px]">{progressValue}%</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={handleProgressSubmit}
                            className="w-8 h-8 bg-green-500 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors"
                            title="Save progress"
                          >
                            <FaCheck size={12} />
                          </button>
                          <button
                            onClick={handleProgressCancel}
                            className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors"
                            title="Cancel"
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={handleFinishedClick}
                        className="w-full h-full flex items-center group/btn"
                      >
                        <FaCheckCircle size={20} className="flex-shrink-0 group-hover/btn:scale-110 transition-transform" />
                        <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 text-base font-medium whitespace-nowrap">
                          {gameProgress > 0 ? `${gameProgress}% Completed` : "I have finished"}
                        </span>
                      </button>
                    )}
                  </div>
                  
                  {/* Tooltip */}
                  {!showProgressInput && (
                    <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-300 pointer-events-none z-20">
                      <div className="bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-gray-600">
                        Click to set progress
                        <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-black/90 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                      </div>
                    </div>
                  )}
                  
                  
                  {/* Progress Message */}
                  {showProgressInput && (
                    <div className="absolute -bottom-10 left-0 right-0">
                      <div className="bg-black/80 text-xs text-cyan-300 font-semibold px-2 py-1 rounded text-center">
                        {getProgressMessage(progressValue)}
                      </div>
                    </div>
                  )}
                </div>  

                {/* Like Button - Single Thumbs Up */}
                <div className="group relative flex items-center justify-end">
                  <button 
                    onClick={handleLikeClick}
                    className={`h-12 rounded-xl flex items-center border
                      ${isLiked ? "bg-red-600/70 text-white border-red-400" : "bg-gray-800/40 text-gray-200 border-gray-600/50 hover:bg-red-600/70 hover:text-white"}
                      transition-all duration-300 relative z-10 w-12 group-hover:w-[180px] px-3 overflow-hidden`}
                  >
                    <FaThumbsUp size={20} className="flex-shrink-0" />
                    <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 text-base font-medium whitespace-nowrap">
                      I like this game
                    </span>
                  </button>
                </div>

                {/* Loved Button - Double Thumbs Up */}
                <div className="group relative flex items-center justify-end">
                  <button 
                    onClick={handleLovedClick}
                    className={`h-12 rounded-xl flex items-center border
                      ${isLoved ? "bg-yellow-500/70 text-black border-yellow-400" : "bg-gray-800/40 text-gray-200 border-gray-600/50 hover:bg-yellow-500/70 hover:text-black"}
                      transition-all duration-300 relative z-10 w-12 group-hover:w-[180px] px-3 overflow-hidden`}
                  >
                    <div className="relative w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <FaThumbsUp size={16} className="absolute transform -translate-x-0.5 -translate-y-0.5" style={{filter: 'drop-shadow(1px 1px 0px rgba(0,0,0,0.5))'}} />
                      <FaThumbsUp size={16} className="absolute transform translate-x-0.5 translate-y-0.5" style={{filter: 'drop-shadow(-1px -1px 0px rgba(0,0,0,0.5))'}} />
                    </div>
                    <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 text-base font-medium whitespace-nowrap">
                      I love this game
                    </span>
                  </button>
                </div>

                {/* Plan to Play Button */}
                <div className="group relative flex items-center justify-end">
                  <button 
                    onClick={handlePlanClick}
                    className={`h-12 rounded-xl flex items-center border
                      ${isPlanned ? "bg-purple-600/70 text-white border-purple-500" : "bg-gray-800/40 text-gray-200 border-gray-600/50 hover:bg-purple-600/70 hover:text-white"}
                      transition-all duration-300 relative z-10 w-12 group-hover:w-[180px] px-3 overflow-hidden`}
                  >
                    <FaRegClock size={20} className="flex-shrink-0" />
                    <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 text-base font-medium whitespace-nowrap">
                      Plan to play
                    </span>
                  </button>
                </div>

                {/* Dislike Button */}
                <div className="group relative flex items-center justify-end">
                  <button 
                    onClick={handleHateClick}
                    className={`h-12 rounded-xl flex items-center border
                      ${isDisliked ? "bg-gray-700/70 text-red-400 border-gray-400" : "bg-gray-800/40 text-gray-200 border-gray-600/50 hover:bg-gray-700/70 hover:text-red-400"}
                      transition-all duration-300 relative z-10 w-12 group-hover:w-[180px] px-3 overflow-hidden`}
                  >
                    <FaThumbsDown size={20} className="flex-shrink-0" />
                    <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 text-base font-medium whitespace-nowrap">
                      I hate this game
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between mt-4 text-sm text-white/80">
              <div className="flex gap-4">
                <button 
                  onClick={openTwitchSearch}
                  className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                >
                  <FaTwitch className="text-purple-500" /> Watch on Twitch
                </button>
                <button 
                  onClick={openYouTubeSearch}
                  className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                >
                  <FaYoutube className="text-red-500" /> Watch on YouTube
                </button>
              </div>
              <div className={`${getCommunityStatus().color} font-medium transition-all hover:brightness-125 cursor-default flex items-center gap-2`}>
                {React.createElement(getCommunityStatus().icon, { className: "text-lg" })}
                {getCommunityStatus().text}
              </div>
            </div>
          </div>
        </div>

        {/* TAGLAR */}
        <div className="flex flex-wrap gap-2 text-sm mt-4">
          {game.genres?.map((genre, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full border border-white/40 text-white hover:bg-white/10 transition"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* AÇIKLAMA + AWARDS */}
        <div className="grid md:grid-cols-2 gap-8 mt-6 border-t border-white/10 pt-6">
          <div className="space-y-2 text-sm text-gray-300">
            <p className="border-b border-white/10 pb-2"><span className="text-white font-semibold">Director:</span> {game.director || "-"}</p>
            <p className="border-b border-white/10 pb-2"><span className="text-white font-semibold">Studio:</span> {game.studio || game.developer || "-"}</p>
            <p className="border-b border-white/10 pb-2"><span className="text-white font-semibold">Stars:</span> {game.cast?.join(" · ") || "-"}</p>
            <p className="border-b border-white/10 pb-2"><span className="text-white font-semibold">Soundtrack:</span> {game.soundtrack || "-"}</p>
            <p className="pb-2"><span className="text-white font-semibold">Full Crew:</span> <button className="underline hover:text-white">View full list</button></p>
          </div>
          <div className="space-y-4">
            <AwardsList awards={game.awards} limit={4} showLink={true} />
          </div>
        </div>
      </div>

      {/* Popularity Modal */}
      <PopularityModal 
        isOpen={showPopularityModal}
        onClose={() => setShowPopularityModal(false)}
        game={game}
      />

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          border: 2px solid #10b981;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          border: 2px solid #10b981;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        input[type="range"]::-webkit-slider-track {
          background: transparent;
        }
        input[type="range"]::-moz-range-track {
          background: transparent;
        }
      `}</style>
    </section>
  );
};

export default GameBanner;