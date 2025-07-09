// src/components/home/FeaturedSection.jsx - Text clipping fix

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaPlay, FaCheck, FaHeart, FaThumbsUp, FaThumbsDown, FaEye, FaUsers, FaStopwatch } from "react-icons/fa";
import { FaHeartCrack } from "react-icons/fa6";
import Tippy from '@tippyjs/react';
import AuthModal from "../auth/AuthModal";
import { useFeaturedGames } from "./featured/useFeaturedGames";
import ProgressBubble from "./featured/ProgressBubble";
import SEOHead from "../seo/SEOHead";
import NotificationDemo from "../demo/NotificationDemo";
import {
  renderStoreIcons,
  getProgressButtonStyle,
  getProgressMessage
} from "./featured/featuredUtils";

export default function FeaturedSection() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const {
    // Game state
    games,
    featured,
    activeIndex,
    isLoading,
    error,
    isTransitioning,
    setIsPaused,

    // Progress state
    getDisplayProgress,
    isEditingProgress,
    setIsEditingProgress,
    progressTippy,

    // User activity state
    isLiked,
    isLoved,
    isDisliked,
    isPlanToPlay,
    loadingStates,
    loadingPlan,

    // Real-time stats
    getCurrentStats,
    gameMatches,

    // Handlers
    handleLike,
    handleLoved,
    handleDislike,
    handlePlanToPlay,
    handleProgressTempChange,
    handleProgressSaveAndClose,
    handleGameSelect
  } = useFeaturedGames(user, token);

  // Auth wrapper for actions
  const requireAuth = (action) => {
    if (!user || !token) {
      setShowAuthModal(true);
      return;
    }
    action();
  };

  // 🎨 Enhanced image selection with banner override support
  const getFeaturedBackgroundImage = (game) => {
    // Priority 1: Banner override from admin
    if (game.bannerOverrides?.featuredBackground) {
      console.log("🎨 Using banner override:", game.bannerOverrides.featuredBackground);
      return game.bannerOverrides.featuredBackground;
    }

    // Priority 2: bannerImage field
    if (game.bannerImage) {
      return game.bannerImage;
    }

    // Priority 3: Gallery assets with appropriate metadata
    if (game.gallery && game.gallery.length > 0) {
      // Look for landscape/banner assets first
      const landscapeAsset = game.gallery.find(asset => {
        const isImage = asset.type === "image" || asset.url?.match(/\.(jpg|jpeg|png|webp)$/i);
        const isLandscape = asset.meta?.some(m =>
            (m.label === "Orientation" && m.value === "Landscape") ||
            (m.label === "Type" && (m.value === "Banner" || m.value === "Background" || m.value === "Screenshot"))
        );
        return isImage && isLandscape;
      });

      if (landscapeAsset) {
        console.log("🎨 Using gallery landscape asset:", landscapeAsset.url);
        return landscapeAsset.url;
      }

      // Fallback to any image asset
      const anyImageAsset = game.gallery.find(asset =>
          asset.type === "image" || asset.url?.match(/\.(jpg|jpeg|png|webp)$/i)
      );

      if (anyImageAsset) {
        console.log("🎨 Using gallery fallback asset:", anyImageAsset.url);
        return anyImageAsset.url;
      }
    }

    // Priority 4: coverImage as fallback
    if (game.coverImage) {
      return game.coverImage;
    }

    // Priority 5: Placeholder
    return "https://placehold.co/1920x1080?text=Featured+Game";
  };

  // 🎬 Enhanced poster image selection
  const getPosterImage = (game) => {
    // Priority 1: Poster override from admin
    if (game.bannerOverrides?.posterImage) {
      return game.bannerOverrides.posterImage;
    }

    // Priority 2: Gallery assets marked as poster/cover
    if (game.gallery && game.gallery.length > 0) {
      const posterAsset = game.gallery.find(asset => {
        const isImage = asset.type === "image" || asset.url?.match(/\.(jpg|jpeg|png|webp)$/i);
        const isPoster = asset.meta?.some(m =>
            (m.label === "Type" && (m.value === "Poster" || m.value === "Cover")) ||
            (m.label === "Orientation" && m.value === "Portrait")
        );
        return isImage && isPoster;
      });

      if (posterAsset) {
        return posterAsset.url;
      }
    }

    // Priority 3: coverImage
    return game.coverImage || "https://placehold.co/600x900?text=Game+Poster";
  };

  // 🎬 Enhanced trailer URL selection
  const getTrailerUrl = (game) => {
    // Priority 1: Trailer override from admin
    if (game.bannerOverrides?.trailerUrl) {
      return game.bannerOverrides.trailerUrl;
    }

    // Priority 2: trailerUrl field
    if (game.trailerUrl) {
      return game.trailerUrl;
    }

    // Priority 3: Gallery video assets
    if (game.gallery && game.gallery.length > 0) {
      const videoAsset = game.gallery.find(asset =>
          asset.type === "video" ||
          asset.url?.includes("youtube.com") ||
          asset.url?.includes("youtu.be") ||
          asset.url?.match(/\.(mp4|webm|ogg)$/i)
      );

      if (videoAsset) {
        return videoAsset.url;
      }
    }

    return null;
  };

  if (isLoading) {
    return (
        <div className="bg-black text-white h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl">Loading awesome games...</p>
          </div>
        </div>
    );
  }

  if (error && games.length === 0) {
    return (
        <div className="bg-black text-white h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
    );
  }

  if (!featured) return null;

  // Get enhanced image sources
  const backgroundImage = getFeaturedBackgroundImage(featured);
  const posterImage = getPosterImage(featured);
  const trailerUrl = getTrailerUrl(featured);

  return (
    <>
      {/* SEO Meta Tags for Homepage */}
      <SEOHead
        title="Gaming Database - Reviews, Ratings & Community"
        description="Discover the best games with comprehensive reviews, ratings, and community discussions. Join GGDB to track your gaming journey and connect with fellow gamers."
        keywords="gaming database, game reviews, game ratings, gaming community, GGDB, video games, game recommendations"
        url="/"
        type="website"
      />
      
      <div className="bg-black text-white">
        {/* Auth Modal */}
        {showAuthModal && (
            <AuthModal onClose={() => setShowAuthModal(false)} />
        )}

        {/* Hero Banner */}
        <div className="relative h-screen overflow-hidden">
          {/* Progress Display - Right Side Typography */}
          {getDisplayProgress() > 0 && (
              <div className="absolute right-20 top-1/3 z-30">
                {/* Progress Text */}
                <div className="relative text-right">
                  {/* Main Progress Number */}
                  <div className="text-8xl lg:text-9xl xl:text-[10rem] font-black text-white/25 leading-none select-none font-mono">
                    {getDisplayProgress()}
                  </div>
                  
                  {/* Overlaid Solid Number */}
                  <div className="absolute inset-0 text-8xl lg:text-9xl xl:text-[10rem] font-black text-white leading-none select-none font-mono"
                       style={{
                         WebkitTextStroke: '2px rgba(255,255,255,0.8)',
                         WebkitTextFillColor: 'transparent'
                       }}>
                    {getDisplayProgress()}
                  </div>
                  
                  {/* Percent Symbol */}
                  <div className="text-3xl lg:text-4xl font-bold text-white/60 -mt-4 mr-1">
                    PERCENT
                  </div>
                  
                  {/* Status Line */}
                  <div className="mt-3 text-lg lg:text-xl font-medium text-white/80 uppercase tracking-wider">
                    {getProgressMessage(getDisplayProgress())}
                  </div>
                  
                  {/* Simple Progress Line */}
                  <div className="mt-4 w-32 h-1 bg-white/20 ml-auto">
                    <div 
                      className="h-full bg-white transition-all duration-700 ease-out"
                      style={{ width: `${getDisplayProgress()}%` }}
                    />
                  </div>
                </div>
              </div>
          )}
          {/* Background with transition and enhanced image selection */}
          <div className={`absolute inset-0 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <img
                src={backgroundImage}
                alt={featured.title}
                className="w-full h-full object-cover scale-105"
                onError={(e) => {
                  console.warn("🖼️ Background image failed to load, using fallback");
                  e.target.src = "https://placehold.co/1920x1080?text=Featured+Game";
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black"></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-40 left-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-8 w-full">
              <div className={`max-w-3xl transition-all duration-300 ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>

                {/* Badges */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg">
                    🏆 FEATURED
                  </div>
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2.5 rounded-full border border-white/20">
                    <FaStar className="text-yellow-400" size={18} />
                    <span className="text-xl font-bold text-white">
                    {featured.ggdbRating != null && !isNaN(Number(featured.ggdbRating))
                        ? Number(featured.ggdbRating).toFixed(1)
                        : "0.0"}
                  </span>
                    <span className="text-gray-300 text-sm">
                    ({(featured.ratingCount || 0).toLocaleString()} GGDB RATE)
                  </span>
                  </div>
                  <div className="bg-black/30 backdrop-blur-sm px-4 py-2.5 rounded-full border border-white/20">
                    <span className="text-gray-300 font-medium text-base">{featured.releaseDate?.split("-")[0] || '2024'}</span>
                  </div>

                </div>

                {/* 🔧 TITLE - Max 2 lines, smaller text, no truncation */}
                <h1 className="text-3xl md:text-4xl lg:text-6xl font-black mb-8 leading-[1.2] tracking-tight bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent drop-shadow-2xl pb-2 max-h-[2.4em] overflow-visible">
                  {featured.title}
                </h1>

                {/* Studio & Genres */}
                <div className="flex items-center gap-4 mb-6">
                <span
                    className="font-bold border border-yellow-400 px-4 py-1 rounded-none"
                    style={{
                      color: "#fde047",
                      background: "transparent",
                      borderWidth: "2px"
                    }}
                >
                  {featured.publisher || featured.studio || featured.developer || "Publisher"}
                </span>
                  <span className="text-gray-500">•</span>
                  {featured.genres?.slice(0, 3).map((genre, i) => (
                      <span
                          key={genre}
                          className="px-3 py-1 border border-white/40 text-white/90 text-base font-semibold mr-2 rounded-full"
                          style={{
                            background: "transparent",
                            borderWidth: "2px",
                            backdropFilter: "blur(3px)"
                          }}
                      >
                    {genre}
                  </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-lg text-gray-200 mb-8 leading-relaxed max-w-4xl line-clamp-3">
                  {featured.story || featured.description || "Embark on an unforgettable game journey with stunning visuals and immersive gameplay."}
                </p>

                {/* Dynamic Game Stats */}
                <div className="flex items-center gap-6 mb-8 flex-wrap">
                  {(() => {
                    const stats = getCurrentStats(featured);
                    return (
                      <>
                        <div className="flex items-center gap-2 text-gray-300">
                          <FaThumbsUp className="text-gray-400" size={18} />
                          <span className="text-lg font-medium">{stats.likesCount.toLocaleString()} liked</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <div className="relative w-4 h-4 flex items-center justify-center">
                            <FaThumbsUp className="text-gray-400 absolute transform -translate-x-0.5 -translate-y-0.5" size={14} style={{filter: 'drop-shadow(1px 1px 0px rgba(0,0,0,0.6))'}} />
                            <FaThumbsUp className="text-gray-400 absolute transform translate-x-0.5 translate-y-0.5" size={14} style={{filter: 'drop-shadow(-1px -1px 0px rgba(0,0,0,0.6))'}} />
                          </div>
                          <span className="text-lg font-medium ml-1">{stats.lovedCount.toLocaleString()} loved</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <FaThumbsDown className="text-gray-400" size={18} />
                          <span className="text-lg font-medium">{stats.dislikesCount.toLocaleString()} dislikes</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <FaStopwatch className="text-gray-400" size={18} />
                          <span className="text-lg font-medium">{stats.planToPlayCount.toLocaleString()} plan to play</span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Action Buttons */}
                <div
                    className="flex items-center gap-3 mb-8 flex-wrap"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                  <Tippy content="View Game Details" placement="top">
                    <button
                        onClick={() => navigate(`/game/${featured._id || ""}`)}
                        className="flex items-center gap-3 bg-gray-100 text-black px-8 py-3 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                    >
                      <FaPlay size={18} />
                      View Game
                    </button>
                  </Tippy>

                  <span className="mx-2 h-8 border-l border-gray-400 opacity-70"></span>

                  {/* Progress Button */}
                  <Tippy
                      content={
                        user && token ? (
                            <ProgressBubble
                                currentProgress={getDisplayProgress()}
                                onProgressChange={handleProgressTempChange}
                                onSave={handleProgressSaveAndClose}
                            />
                        ) : null
                      }
                      interactive={true}
                      trigger="click"
                      placement="top-end"
                      arrow={false}
                      hideOnClick={false}
                      onShow={(instance) => {
                        if (!user || !token) {
                          setShowAuthModal(true);
                          instance.hide();
                          return false;
                        }
                        setIsEditingProgress(true);
                        progressTippy.current = instance;
                      }}
                      onHide={() => {
                        setIsEditingProgress(false);
                      }}
                      appendTo={() => document.body}
                      theme="transparent"
                      offset={[20, 10]}
                      disabled={loadingStates.progress}
                  >
                    <button
                        className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 border ${getProgressButtonStyle(getDisplayProgress())} ${loadingStates.progress ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loadingStates.progress}
                    >
                      <FaCheck size={20} />
                      {getDisplayProgress() > 0 && (
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white">
                            {getDisplayProgress()}
                          </div>
                      )}
                    </button>
                  </Tippy>

                  {/* Like Button - Single Thumbs Up */}
                  <Tippy content="I Like This Game" placement="top">
                    <button
                        onClick={() => requireAuth(handleLike)}
                        disabled={loadingStates.like}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 
                      ${isLiked() ? "bg-red-600 text-white border-red-500" : "bg-gray-800/40 text-gray-200 border-gray-600/50 hover:bg-red-600/70 hover:text-white"} 
                      ${loadingStates.like ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <FaThumbsUp size={18} />
                    </button>
                  </Tippy>

                  {/* Loved Button - Double Thumbs Up (Netflix Style) */}
                  <Tippy content="I Love This Game! (Netflix Style)" placement="top">
                    <button
                        onClick={() => requireAuth(handleLoved)}
                        disabled={loadingStates.loved}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300
                      ${isLoved() ? "bg-yellow-500 text-black border-yellow-400" : "bg-gray-800/40 text-gray-200 border-gray-600/50 hover:bg-yellow-500/70 hover:text-black"} 
                      ${loadingStates.loved ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="relative w-5 h-5 flex items-center justify-center">
                        <FaThumbsUp size={16} className="absolute transform -translate-x-0.5 -translate-y-0.5" style={{filter: 'drop-shadow(1px 1px 0px rgba(0,0,0,0.8))'}} />
                        <FaThumbsUp size={16} className="absolute transform translate-x-0.5 translate-y-0.5" style={{filter: 'drop-shadow(-1px -1px 0px rgba(0,0,0,0.8))'}} />
                      </div>
                    </button>
                  </Tippy>

                  {/* Plan to Play Button */}
                  <Tippy content="Plan to Play" placement="top">
                    <button
                        onClick={() => requireAuth(handlePlanToPlay)}
                        disabled={loadingPlan}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300
                      ${isPlanToPlay() ? "bg-purple-600 text-white border-purple-500" : "bg-gray-800/40 text-gray-200 border-gray-600/50 hover:bg-purple-600/70 hover:text-white"}
                      ${loadingPlan ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <FaStopwatch size={20} />
                    </button>
                  </Tippy>

                  {/* Dislike Button */}
                  <Tippy content="Dislike" placement="top">
                    <button
                        onClick={() => requireAuth(handleDislike)}
                        disabled={loadingStates.dislike}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 
                      ${isDisliked() ? "bg-blue-700 text-white border-blue-700" : "bg-gray-800/40 text-gray-200 border-gray-600/50 hover:bg-blue-700/70 hover:text-white"} 
                      ${loadingStates.dislike ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <FaThumbsDown size={20} />
                    </button>
                  </Tippy>
                </div>

                {/* Enhanced Stats */}
                <div className="flex items-center gap-6 text-lg text-gray-300">
                  {/* Match Percentage with Auth Popup */}
                  <Tippy
                    content={
                      !user ? (
                        <div className="text-white text-sm font-medium">
                          Sign up for personalized game matching
                        </div>
                      ) : gameMatches[featured._id] ? (
                        <div>
                          <div className="text-white font-semibold">
                            {gameMatches[featured._id]}% Match
                          </div>
                          <div className="text-white/70 text-sm">
                            Based on your gaming preferences
                          </div>
                        </div>
                      ) : null
                    }
                    placement="left"
                    interactive={true}
                    trigger="mouseenter focus"
                    hideOnClick={!user}
                  >
                    <div className="flex items-center gap-3 bg-black/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10 cursor-pointer hover:bg-black/30 transition-all">
                      <span className={`font-bold text-2xl transition-all ${
                        !user ? 'text-blue-400 hover:text-blue-300' :
                        gameMatches[featured._id] ? 
                          gameMatches[featured._id] >= 80 ? 'text-green-400' :
                          gameMatches[featured._id] >= 60 ? 'text-yellow-400' :
                          'text-orange-400'
                        : 'text-gray-400'
                      }`}>
                        {!user ? '?' :
                         user && gameMatches[featured._id] != null ? `${gameMatches[featured._id]}%` : 
                         featured.match != null ? `${featured.match}%` : "~"}
                      </span>
                      <span className="font-medium">
                        Match
                      </span>
                      {!user && (
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse ml-1"></div>
                      )}
                    </div>
                  </Tippy>
                  <div className="flex items-center gap-3 bg-black/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10">
                  <span className="text-blue-400 font-bold text-2xl">
                    {(() => {
                      const stats = getCurrentStats(featured);
                      return stats.reviewsCount > 0 ? stats.reviewsCount.toLocaleString() : "~";
                    })()}
                  </span>
                    <span className="font-medium">Reviews</span>
                  </div>
                  <div className="flex items-center gap-3 bg-black/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10">
                  <span className="text-blue-400 font-bold text-2xl">
                    {featured.metacriticScore != null ? featured.metacriticScore : "~"}
                  </span>
                    <span className="font-medium">Metacritic</span>
                  </div>
                </div>

                {/* Store Icons */}
                {renderStoreIcons(featured.storeLinks)}
              </div>
            </div>
          </div>

          {/* Game Navigation Dots */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm px-4 py-3 rounded-full border border-white/20">
              {games.map((_, index) => (
                  <button
                      key={index}
                      onClick={() => handleGameSelect(index)}
                      className={`relative transition-all duration-300 ${
                          index === activeIndex
                              ? 'w-8 h-3 bg-white rounded-full'
                              : 'w-3 h-3 bg-white/40 rounded-full hover:bg-white/60'
                      }`}
                      onMouseEnter={() => setIsPaused(true)}
                      onMouseLeave={() => setIsPaused(false)}
                  >
                    {index === activeIndex && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 rounded-full animate-pulse" />
                    )}
                  </button>
              ))}
              <div className="ml-2 pl-2 border-l border-white/20">
              <span className="text-white text-xs font-medium">
                {activeIndex + 1}/{games.length}
              </span>
              </div>
            </div>
          </div>
        </div>

        <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* 🔧 Fix for text clipping - Ensure proper overflow handling */
        h1.line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: visible !important; /* Allow proper rendering */
          line-height: 1.1 !important; /* Tight but readable line height */
          padding-bottom: 8px; /* Extra space for descenders */
        }
        
        /* Ensure gradient text doesn't get clipped */
        .bg-clip-text {
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          background-image: linear-gradient(to bottom, #ffffff, #d1d5db);
        }
        
        /* Tippy transparent theme */
        .tippy-box[data-theme~='transparent'] {
          background-color: transparent;
          box-shadow: none;
        }
      `}</style>
      </div>
    </>
  );
}