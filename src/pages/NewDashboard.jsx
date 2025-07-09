import React, { useState, useRef } from 'react';
import { 
  FaGamepad, 
  FaHeart, 
  FaListUl, 
  FaThumbsDown, 
  FaCommentAlt, 
  FaStar, 
  FaCog,
  FaChartLine,
  FaTrophy,
  FaCalendarAlt,
  FaEye,
  FaPlus,
  FaEdit,
  FaShare,
  FaClock,
  FaCamera,
  FaPlaystation,
  FaSteam,
  FaXbox,
  FaDesktop,
  FaLinkedin,
  FaDiscord,
  FaYoutube,
  FaGithub,
  FaBriefcase,
  FaCode,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaBuilding
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

// Professional User Data
const mockUser = {
  id: 1,
  username: "alexchen",
  displayName: "Alex Chen",
  title: "Senior Game Developer",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face",
  coverPhoto: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1400&h=300&fit=crop",
  email: "alex.chen@ggdb.com", 
  location: "Istanbul, Turkey",
  company: "Riot Games",
  
  // Professional Info
  plan: "GGDB Pro",
  memberSince: "March 2020",
  verified: true,
  
  // Gaming Stats
  totalGames: 247,
  completedGames: 89,
  currentlyPlaying: 3,
  hoursPlayed: 1247,
  reviews: 43,
  averageRating: 4.2,
  favorites: 32,
  planToPlay: 15,
  
  // Platforms
  platforms: ["PC", "PlayStation 5", "Xbox Series X", "Nintendo Switch"],
  
  // Genre Preferences (clean data)
  topGenres: [
    { name: "RPG", percentage: 41 },
    { name: "Action", percentage: 28 },
    { name: "Strategy", percentage: 17 },
    { name: "Indie", percentage: 14 }
  ],
  
  // Social Links
  social: {
    linkedin: "https://linkedin.com/in/alexchen",
    github: "https://github.com/alexchen",
    twitter: "https://twitter.com/alexchen"
  }
};

// Clean Games Data
const mockGames = {
  favorites: [
    { 
      id: 1, 
      title: "The Witcher 3: Wild Hunt", 
      img: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=300&h=400&fit=crop", 
      rating: 5, 
      year: 2015,
      genre: "RPG",
      platform: "PC",
      status: "Completed"
    },
    { 
      id: 2, 
      title: "Red Dead Redemption 2", 
      img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=400&fit=crop", 
      rating: 5, 
      year: 2018,
      genre: "Action",
      platform: "PC",
      status: "Completed"
    },
    { 
      id: 3, 
      title: "Hades", 
      img: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=300&h=400&fit=crop", 
      rating: 5, 
      year: 2020,
      genre: "Indie",
      platform: "PC",
      status: "Completed"
    },
    { 
      id: 4, 
      title: "Ghost of Tsushima", 
      img: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop", 
      rating: 5, 
      year: 2020,
      genre: "Action",
      platform: "PS5",
      status: "Completed"
    }
  ],
  
  recent: [
    { 
      id: 5, 
      title: "Elden Ring", 
      img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=400&fit=crop", 
      rating: 4, 
      year: 2022,
      genre: "RPG",
      platform: "PC",
      status: "Playing",
      progress: 76
    },
    { 
      id: 6, 
      title: "God of War", 
      img: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300&h=400&fit=crop", 
      rating: 4, 
      year: 2018,
      genre: "Action",
      platform: "PS5",
      status: "Completed",
      progress: 100
    }
  ]
};

// Professional Portfolio
const mockPortfolio = [
  {
    id: 1,
    gameTitle: "League of Legends: Wild Rift",
    role: "Senior Game Developer",
    company: "Riot Games",
    year: "2022-2024",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=240&fit=crop",
    description: "Led development of mobile MOBA features and gameplay systems",
    technologies: ["Unity", "C#", "Python"]
  },
  {
    id: 2,
    gameTitle: "Teamfight Tactics",
    role: "Game Developer",
    company: "Riot Games",
    year: "2020-2022",
    image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=240&fit=crop",
    description: "Developed auto-battler mechanics and balancing systems"
  }
];

export default function GGDBUserDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const coverInputRef = useRef();
  const avatarInputRef = useRef();

  // Clean Tab Component
  const TabButton = ({ id, label, active, count }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`
        px-6 py-3 rounded-lg font-medium text-sm transition-all border
        ${active 
          ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
          : 'bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600 border-gray-600'
        }
      `}
    >
      {label}
      {count && (
        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
          active ? 'bg-white/20 text-white' : 'bg-gray-600 text-gray-300'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  // Clean Game Card
  const GameCard = ({ game, size = "default" }) => (
    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden hover:shadow-md hover:border-gray-600 transition-all">
      <img 
        src={game.img} 
        alt={game.title}
        className={size === "small" ? "w-full h-32 object-cover" : "w-full h-48 object-cover"}
      />
      <div className="p-4">
        <h4 className="font-semibold text-white text-sm mb-2 line-clamp-1">{game.title}</h4>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                className={`w-3 h-3 ${i < game.rating ? 'text-yellow-400' : 'text-gray-600'}`} 
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">{game.year}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{game.genre}</span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            game.status === 'Completed' ? 'bg-green-900/50 text-green-400 border border-green-800' :
            game.status === 'Playing' ? 'bg-blue-900/50 text-blue-400 border border-blue-800' :
            'bg-gray-700 text-gray-300 border border-gray-600'
          }`}>
            {game.status}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Cover Photo Section */}
          <div className="relative h-48 -mx-6 mb-6">
            <img 
              src={mockUser.coverPhoto} 
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            
            <button
              onClick={() => coverInputRef.current?.click()}
              className="absolute top-4 right-4 bg-gray-800/90 hover:bg-gray-800 rounded-lg p-2 text-gray-300 hover:text-white transition-colors shadow-sm backdrop-blur-sm"
            >
              <FaCamera className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex items-start gap-6 pb-6">
            
            {/* Avatar */}
            <div className="relative -mt-16">
              <div className="w-32 h-32 bg-gray-800 rounded-2xl p-1 shadow-lg border border-gray-700">
                <img 
                  src={mockUser.avatar} 
                  alt={mockUser.displayName}
                  className="w-full h-full rounded-xl object-cover"
                />
              </div>
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 rounded-lg p-2 text-white transition-colors shadow-sm"
              >
                <FaCamera className="w-3 h-3" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 pt-4">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">{mockUser.displayName}</h1>
                {mockUser.verified && (
                  <FaCheckCircle className="w-5 h-5 text-blue-400" />
                )}
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {mockUser.plan}
                </span>
              </div>
              
              <p className="text-lg text-gray-300 mb-3">{mockUser.title}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <FaBuilding className="w-4 h-4" />
                  {mockUser.company}
                </div>
                <div className="flex items-center gap-1">
                  <FaMapMarkerAlt className="w-4 h-4" />
                  {mockUser.location}
                </div>
                <div className="flex items-center gap-1">
                  <FaCalendarAlt className="w-4 h-4" />
                  Member since {mockUser.memberSince}
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {Object.entries(mockUser.social).map(([platform, url]) => {
                  const icons = {
                    linkedin: FaLinkedin,
                    github: FaGithub,
                    twitter: FaXTwitter
                  };
                  const IconComponent = icons[platform];
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Connect
              </button>
              <button className="bg-white hover:bg-gray-100 text-gray-900 px-6 py-2 rounded-lg font-medium border border-gray-600 transition-colors">
                Message
              </button>
              <button className="w-10 h-10 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <FaShare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Stats Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Games Played", value: mockUser.totalGames, icon: FaGamepad, color: "blue" },
            { label: "Completed", value: mockUser.completedGames, icon: FaTrophy, color: "green" },
            { label: "Hours Played", value: `${mockUser.hoursPlayed}h`, icon: FaClock, color: "purple" },
            { label: "Reviews", value: mockUser.reviews, icon: FaCommentAlt, color: "orange" }
          ].map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700">
              <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center ${
                stat.color === 'blue' ? 'bg-blue-900/50 text-blue-400' :
                stat.color === 'green' ? 'bg-green-900/50 text-green-400' :
                stat.color === 'purple' ? 'bg-purple-900/50 text-purple-400' :
                'bg-orange-900/50 text-orange-400'
              }`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 bg-gray-800 p-2 rounded-xl shadow-sm border border-gray-700">
          <TabButton id="overview" label="Overview" active={activeTab === "overview"} />
          <TabButton id="games" label="Games" active={activeTab === "games"} count={mockUser.totalGames} />
          <TabButton id="reviews" label="Reviews" active={activeTab === "reviews"} count={mockUser.reviews} />
          <TabButton id="portfolio" label="Portfolio" active={activeTab === "portfolio"} count={mockPortfolio.length} />
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {activeTab === "overview" && (
              <div className="space-y-8">
                
                {/* Recent Games */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Recent Games</h3>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      View all
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {mockGames.recent.map(game => (
                      <GameCard key={game.id} game={game} size="small" />
                    ))}
                  </div>
                </div>

                {/* Professional Experience */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-6">Professional Experience</h3>
                  <div className="space-y-6">
                    {mockPortfolio.map(project => (
                      <div key={project.id} className="flex gap-4">
                        <img 
                          src={project.image} 
                          alt={project.gameTitle}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{project.gameTitle}</h4>
                          <p className="text-sm text-gray-300 mb-1">{project.role} at {project.company}</p>
                          <p className="text-sm text-gray-400 mb-2">{project.year}</p>
                          <p className="text-sm text-gray-300">{project.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "games" && (
              <div className="space-y-8">
                
                {/* Favorite Games */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-6">Favorite Games</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {mockGames.favorites.map(game => (
                      <GameCard key={game.id} game={game} />
                    ))}
                  </div>
                </div>

                {/* Recently Played */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-6">Recently Played</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {mockGames.recent.map(game => (
                      <GameCard key={game.id} game={game} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-6">Game Reviews</h3>
                <div className="space-y-6">
                  {mockGames.favorites.slice(0, 3).map(game => (
                    <div key={game.id} className="border-b border-gray-700 pb-6 last:border-b-0">
                      <div className="flex gap-4">
                        <img 
                          src={game.img} 
                          alt={game.title}
                          className="w-16 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white">{game.title}</h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm mb-3">
                            "Exceptional storytelling and gameplay mechanics. This game showcases the best of what modern RPGs can offer with incredible attention to detail and immersive world-building."
                          </p>
                          <div className="text-xs text-gray-400">
                            Reviewed 2 weeks ago • 15 people found this helpful
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "portfolio" && (
              <div className="space-y-6">
                {mockPortfolio.map(project => (
                  <div key={project.id} className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.gameTitle}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h4 className="text-xl font-semibold text-white mb-2">{project.gameTitle}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
                        <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded-full font-medium border border-blue-800">
                          {project.role}
                        </span>
                        <span>•</span>
                        <span>{project.company}</span>
                        <span>•</span>
                        <span>{project.year}</span>
                      </div>
                      <p className="text-gray-300 mb-4">{project.description}</p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map(tech => (
                            <span key={tech} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm border border-gray-600">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Gaming Platforms */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700">
              <h3 className="font-semibold text-white mb-4">Gaming Platforms</h3>
              <div className="space-y-3">
                {mockUser.platforms.map(platform => {
                  const icons = {
                    "PC": FaDesktop,
                    "PlayStation 5": FaPlaystation,
                    "Xbox Series X": FaXbox,
                    "Nintendo Switch": FaGamepad
                  };
                  const IconComponent = icons[platform];
                  return (
                    <div key={platform} className="flex items-center gap-3 text-sm">
                      <IconComponent className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{platform}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Genres */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700">
              <h3 className="font-semibold text-white mb-4">Top Genres</h3>
              <div className="space-y-4">
                {mockUser.topGenres.map(genre => (
                  <div key={genre.name}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">{genre.name}</span>
                      <span className="text-white font-medium">{genre.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${genre.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gaming Activity */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700">
              <h3 className="font-semibold text-white mb-4">Gaming Activity</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">This Month</span>
                  <span className="text-sm font-medium text-white">47 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Games Added</span>
                  <span className="text-sm font-medium text-white">3 games</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Reviews Written</span>
                  <span className="text-sm font-medium text-white">2 reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Inputs */}
      <input ref={coverInputRef} type="file" accept="image/*" className="hidden" />
      <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" />
    </div>
  );
}