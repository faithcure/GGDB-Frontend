import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaGamepad,
  FaHome,
  FaSearch,
  FaArrowLeft,
  FaRocket,
  FaGhost,
  FaDice
} from 'react-icons/fa';

const NotFound = () => {
  const navigate = useNavigate();
  const [glitchText, setGlitchText] = useState('404');
  const [gameRecommendations, setGameRecommendations] = useState([]);

  const glitchTexts = ['404', '40$', '4##', '@04', '###', '404'];
  const gameQuotes = [
    "The princess is in another castle... and so is this page.",
    "You died... trying to find this page.",
    "Game Over. Insert coin to continue... or go back home.",
    "This page has been consumed by the void.",
    "Achievement Unlocked: Page Not Found Explorer",
    "Error 404: Page.exe has stopped working."
  ];

  const popularPages = [
    { name: 'Game Library', path: '/games', icon: <FaGamepad /> },
    { name: 'Top Rated', path: '/top-rated', icon: <FaRocket /> },
    { name: 'New Releases', path: '/new-releases', icon: <FaRocket /> },
    { name: 'Community', path: '/community', icon: <FaHome /> }
  ];

  useEffect(() => {
    // Glitch effect for 404 text
    const interval = setInterval(() => {
      setGlitchText(glitchTexts[Math.floor(Math.random() * glitchTexts.length)]);
    }, 150);

    // Clean up interval
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setGlitchText('404');
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const handleRandomPage = () => {
    const randomPage = popularPages[Math.floor(Math.random() * popularPages.length)];
    navigate(randomPage.path);
  };

  const currentQuote = gameQuotes[Math.floor(Math.random() * gameQuotes.length)];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
        <div className="absolute bottom-10 right-10 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
            {Array.from({ length: 400 }).map((_, i) => (
              <div key={i} className="border border-white/10"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* 404 Glitch Text */}
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 animate-pulse font-mono">
              {glitchText}
            </h1>
            <div className="text-yellow-500 text-2xl md:text-3xl font-bold mt-4 animate-bounce">
              PAGE NOT FOUND
            </div>
          </div>

          {/* Game-themed Message */}
          <div className="glass-effect rounded-2xl p-8 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <FaGhost className="text-4xl text-yellow-500 animate-bounce" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Oops! You've entered the void</h2>
            <p className="text-white/70 text-lg mb-6">
              {currentQuote}
            </p>
            <p className="text-white/60">
              The page you're looking for doesn't exist, was moved, or was consumed by a glitch in the matrix.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            >
              <FaArrowLeft />
              Go Back
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 font-medium"
            >
              <FaHome />
              Home
            </button>
            
            <button
              onClick={() => navigate('/search')}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            >
              <FaSearch />
              Search Games
            </button>
            
            <button
              onClick={handleRandomPage}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            >
              <FaDice />
              Random Page
            </button>
          </div>

          {/* Popular Pages */}
          <div className="glass-effect rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center gap-2">
              <FaRocket className="text-yellow-500" />
              Popular Pages
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {popularPages.map((page, index) => (
                <button
                  key={index}
                  onClick={() => navigate(page.path)}
                  className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-105 group"
                >
                  <div className="text-2xl text-yellow-500 group-hover:text-yellow-400 transition-colors">
                    {page.icon}
                  </div>
                  <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                    {page.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Easter Egg */}
          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm">
              Fun fact: This is error #{Math.floor(Math.random() * 9999) + 1} in our database of lost pages.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Game Elements */}
      <div className="absolute top-1/4 left-10 text-yellow-500/20 text-6xl animate-spin-slow">
        <FaGamepad />
      </div>
      <div className="absolute bottom-1/4 right-10 text-blue-500/20 text-4xl animate-bounce">
        <FaRocket />
      </div>
      <div className="absolute top-1/3 right-1/4 text-green-500/20 text-5xl animate-pulse">
        <FaGhost />
      </div>
    </div>
  );
};

export default NotFound;
