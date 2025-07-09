// src/components/home/MostVisitedCreditsSection.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaEye, 
  FaArrowUp, 
  FaGamepad,
  FaUsers,
  FaChevronRight,
  FaStar
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE } from '../../config/api';

const MostVisitedCreditsSection = () => {
  const [creditsStaff, setCreditsStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Mock data for now - will be replaced with real API
  useEffect(() => {
    const mockCreditsData = [
      {
        id: 1,
        name: "Hideo Kojima",
        avatar: "https://m.media-amazon.com/images/M/MV5BMTYwNzAxNzI3M15BMl5BanBnXkFtZTgwMjIyMDgzNjE@._V1_UY317_CR16,0,214,317_AL_.jpg",
        role: "Game Director",
        department: "Direction",
        weeklyViews: 15420,
        totalViews: 89540,
        isVerified: true,
        recentGames: [
          { name: "Death Stranding", year: 2019, role: "Director" },
          { name: "Metal Gear Solid V", year: 2015, role: "Director" },
          { name: "P.T.", year: 2014, role: "Director" }
        ],
        trendPercentage: 23.5,
        currentRank: 1,
        changeDirection: 'up',
        changeAmount: 3
      },
      {
        id: 2,
        name: "Shigeru Miyamoto",
        avatar: "https://m.media-amazon.com/images/M/MV5BNzM3NDFhYTQtYWVlNC00MzQxLWE2MzMtYTBiMzVhMDI0OTk1XkEyXkFqcGdeQXVyMjQwMDg0Ng@@._V1_UY317_CR16,0,214,317_AL_.jpg",
        role: "Producer",
        department: "Production",
        weeklyViews: 12350,
        totalViews: 125000,
        isVerified: true,
        recentGames: [
          { name: "Super Mario Odyssey", year: 2017, role: "Producer" },
          { name: "The Legend of Zelda: BotW", year: 2017, role: "Producer" },
          { name: "Mario Kart 8", year: 2014, role: "Producer" }
        ],
        trendPercentage: 18.2,
        currentRank: 2,
        changeDirection: 'down',
        changeAmount: 1
      },
      {
        id: 3,
        name: "Amy Hennig",
        avatar: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTlhXkEyXkFqcGdeQXVyMTU2MjkxNDM@._V1_UY317_CR16,0,214,317_AL_.jpg",
        role: "Creative Director",
        department: "Direction",
        weeklyViews: 9870,
        totalViews: 67890,
        isVerified: true,
        recentGames: [
          { name: "Uncharted 3", year: 2011, role: "Creative Director" },
          { name: "Uncharted 2", year: 2009, role: "Creative Director" },
          { name: "Legacy of Kain", year: 1999, role: "Director" }
        ],
        trendPercentage: 31.8,
        currentRank: 3,
        changeDirection: 'up',
        changeAmount: 2
      },
      {
        id: 4,
        name: "Todd Howard",
        avatar: "https://m.media-amazon.com/images/M/MV5BNzM3NDFhYTQtYWVlNC00MzQxLWE2MzMtYTBiMzVhMDI0OTk1XkEyXkFqcGdeQXVyMjQwMDg0Ng@@._V1_UY317_CR16,0,214,317_AL_.jpg",
        role: "Game Director",
        department: "Direction",
        weeklyViews: 8540,
        totalViews: 98760,
        isVerified: true,
        recentGames: [
          { name: "Starfield", year: 2023, role: "Director" },
          { name: "Fallout 4", year: 2015, role: "Director" },
          { name: "The Elder Scrolls V: Skyrim", year: 2011, role: "Director" }
        ],
        trendPercentage: 12.4,
        currentRank: 4,
        changeDirection: 'same',
        changeAmount: 0
      },
      {
        id: 5,
        name: "Hidetaka Miyazaki",
        avatar: "https://m.media-amazon.com/images/M/MV5BNzM3NDFhYTQtYWVlNC00MzQxLWE2MzMtYTBiMzVhMDI0OTk1XkEyXkFqcGdeQXVyMjQwMDg0Ng@@._V1_UY317_CR16,0,214,317_AL_.jpg",
        role: "Game Director",
        department: "Direction",
        weeklyViews: 7890,
        totalViews: 76540,
        isVerified: true,
        recentGames: [
          { name: "Elden Ring", year: 2022, role: "Director" },
          { name: "Sekiro", year: 2019, role: "Director" },
          { name: "Dark Souls III", year: 2016, role: "Director" }
        ],
        trendPercentage: 45.2,
        currentRank: 5,
        changeDirection: 'up',
        changeAmount: 1
      },
      {
        id: 6,
        name: "Neil Druckmann",
        avatar: "https://m.media-amazon.com/images/M/MV5BNzM3NDFhYTQtYWVlNC00MzQxLWE2MzMtYTBiMzVhMDI0OTk1XkEyXkFqcGdeQXVyMjQwMDg0Ng@@._V1_UY317_CR16,0,214,317_AL_.jpg",
        role: "Creative Director",
        department: "Direction",
        weeklyViews: 6890,
        totalViews: 54320,
        isVerified: true,
        recentGames: [
          { name: "The Last of Us Part II", year: 2020, role: "Creative Director" },
          { name: "The Last of Us", year: 2013, role: "Creative Director" },
          { name: "Uncharted 4", year: 2016, role: "Creative Director" }
        ],
        trendPercentage: 28.7,
        currentRank: 6,
        changeDirection: 'down',
        changeAmount: 2
      },
      {
        id: 7,
        name: "Cory Barlog",
        avatar: "https://m.media-amazon.com/images/M/MV5BNzM3NDFhYTQtYWVlNC00MzQxLWE2MzMtYTBiMzVhMDI0OTk1XkEyXkFqcGdeQXVyMjQwMDg0Ng@@._V1_UY317_CR16,0,214,317_AL_.jpg",
        role: "Creative Director",
        department: "Direction",
        weeklyViews: 5670,
        totalViews: 43210,
        isVerified: true,
        recentGames: [
          { name: "God of War", year: 2018, role: "Creative Director" },
          { name: "God of War: Ascension", year: 2013, role: "Director" }
        ],
        trendPercentage: 19.4,
        currentRank: 7,
        changeDirection: 'up',
        changeAmount: 1
      },
      {
        id: 8,
        name: "Yoko Taro",
        avatar: "https://m.media-amazon.com/images/M/MV5BNzM3NDFhYTQtYWVlNC00MzQxLWE2MzMtYTBiMzVhMDI0OTk1XkEyXkFqcGdeQXVyMjQwMDg0Ng@@._V1_UY317_CR16,0,214,317_AL_.jpg",
        role: "Game Director",
        department: "Direction",
        weeklyViews: 4890,
        totalViews: 38920,
        isVerified: true,
        recentGames: [
          { name: "NieR: Automata", year: 2017, role: "Director" },
          { name: "NieR", year: 2010, role: "Director" }
        ],
        trendPercentage: 41.2,
        currentRank: 8,
        changeDirection: 'up',
        changeAmount: 4
      },
      {
        id: 9,
        name: "Cliff Bleszinski",
        avatar: "https://m.media-amazon.com/images/M/MV5BNzM3NDFhYTQtYWVlNC00MzQxLWE2MzMtYTBiMzVhMDI0OTk1XkEyXkFqcGdeQXVyMjQwMDg0Ng@@._V1_UY317_CR16,0,214,317_AL_.jpg",
        role: "Game Designer",
        department: "Design",
        weeklyViews: 3450,
        totalViews: 67890,
        isVerified: true,
        recentGames: [
          { name: "Gears of War", year: 2006, role: "Designer" },
          { name: "Unreal Tournament", year: 1999, role: "Designer" }
        ],
        trendPercentage: 15.8,
        currentRank: 9,
        changeDirection: 'down',
        changeAmount: 3
      },
      {
        id: 10,
        name: "Jade Raymond",
        avatar: "https://m.media-amazon.com/images/M/MV5BNzM3NDFhYTQtYWVlNC00MzQxLWE2MzMtYTBiMzVhMDI0OTk1XkEyXkFqcGdeQXVyMjQwMDg0Ng@@._V1_UY317_CR16,0,214,317_AL_.jpg",
        role: "Executive Producer",
        department: "Production",
        weeklyViews: 2980,
        totalViews: 45670,
        isVerified: true,
        recentGames: [
          { name: "Assassin's Creed", year: 2007, role: "Producer" },
          { name: "Watch Dogs", year: 2014, role: "Producer" }
        ],
        trendPercentage: 22.3,
        currentRank: 10,
        changeDirection: 'same',
        changeAmount: 0
      }
    ];

    // Simulate API delay
    setTimeout(() => {
      setCreditsStaff(mockCreditsData);
      setLoading(false);
    }, 500);
  }, []);

  const getRankChangeIcon = (direction, amount) => {
    switch (direction) {
      case 'up':
        return <FaArrowUp className="text-green-400" />;
      case 'down':
        return <FaArrowUp className="text-red-400 rotate-180" />;
      default:
        return <div className="w-3 h-3 bg-gray-400 rounded-full" />;
    }
  };

  const handlePersonClick = (person) => {
    navigate(`/person/${person.name.toLowerCase().replace(/\s+/g, '-')}`);
  };

  if (loading) {
    return (
      <section className="w-full bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            <span className="ml-3 text-white">Loading Top Credits...</span>
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
            <div className="text-red-400 mb-4">⚠️ Failed to load credits data</div>
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
                Most Visited Credits
              </h2>
            </div>
            <p className="text-gray-400 text-sm">
              This week's trending game industry professionals
            </p>
          </div>
          
          {/* View All Link */}
          <button 
            onClick={() => navigate('/credits/popular')}
            className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium text-sm flex items-center gap-2"
          >
            See all
            <FaChevronRight size={12} />
          </button>
        </motion.div>

        {/* Preview Grid - Show Top 6 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <AnimatePresence>
            {creditsStaff.slice(0, 6).map((person, index) => (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="relative group cursor-pointer"
                onClick={() => handlePersonClick(person)}
              >
                {/* Person Card */}
                <div className="bg-slate-900/50 rounded-lg overflow-hidden border border-gray-800 hover:border-yellow-400/50 transition-all duration-200 group-hover:transform group-hover:scale-105">
                  {/* Rank Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-400 text-black' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-orange-400 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Change Indicator */}
                  <div className="absolute top-2 right-2 z-10">
                    <div className="flex items-center gap-1">
                      {getRankChangeIcon(person.changeDirection, person.changeAmount)}
                      {person.changeAmount > 0 && (
                        <span className={`text-xs font-bold ${
                          person.changeDirection === 'up' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {person.changeAmount}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Person Photo */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/200x266/374151/ffffff?text=' + person.name.charAt(0);
                      }}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Verified Badge */}
                    {person.isVerified && (
                      <div className="absolute bottom-2 left-2">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Person Info */}
                  <div className="p-3">
                    <h3 className="font-bold text-white text-sm mb-1 truncate group-hover:text-yellow-400 transition-colors">
                      {person.name}
                    </h3>
                    <p className="text-gray-400 text-xs mb-2 truncate">
                      {person.role}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="text-center">
                        <div className="text-white font-bold">
                          {(person.weeklyViews / 1000).toFixed(1)}K
                        </div>
                        <div className="text-gray-500">views</div>
                      </div>
                      <div className={`text-center font-bold ${
                        person.trendPercentage > 30 ? 'text-green-400' :
                        person.trendPercentage > 15 ? 'text-yellow-400' :
                        'text-orange-400'
                      }`}>
                        +{person.trendPercentage}%
                      </div>
                    </div>

                    {/* Known For */}
                    <div className="mt-2 text-xs text-gray-400 truncate">
                      Known for: <span className="text-white">{person.recentGames[0]?.name}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default MostVisitedCreditsSection;