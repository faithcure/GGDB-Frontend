import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
  FaUser,
  FaGamepad,
  FaStar,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaGlobe,
  FaDownload,
  FaShare,
  FaHeart,
  FaEye,
  FaTrophy,
  FaAward,
  FaProjectDiagram,
  FaChartLine,
  FaLinkedin,
  FaGithub,
  FaExternalLinkAlt
} from 'react-icons/fa';
import axios from 'axios';
import { API_BASE } from '../config/api';

const PublicGamerPortfolio = () => {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const [gamer, setGamer] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    fetchGamerProfile();
  }, [slug, id]);

  const fetchGamerProfile = async () => {
    try {
      setLoading(true);
      
      // Use id or slug - both come from /portfolio route now
      const userIdentifier = id || slug;
      // If it looks like an ObjectId (24 chars hex), use ID endpoint, otherwise use slug endpoint
      const isObjectId = userIdentifier && /^[a-f\d]{24}$/i.test(userIdentifier);
      
      // Try multiple possible endpoints
      const possibleEndpoints = isObjectId ? [
        `${API_BASE}/api/users/${userIdentifier}`,
        `${API_BASE}/api/auth/user/${userIdentifier}`,
        `${API_BASE}/api/users/profile/${userIdentifier}`,
        `${API_BASE}/api/profile/${userIdentifier}`
      ] : [
        `${API_BASE}/api/users/by-slug/${userIdentifier}`,
        `${API_BASE}/api/users/slug/${userIdentifier}`,
        `${API_BASE}/api/profile/slug/${userIdentifier}`
      ];
      
      let gamerRes;
      for (const endpoint of possibleEndpoints) {
        try {
          gamerRes = await axios.get(endpoint);
          console.log(`✅ Successfully found user data at: ${endpoint}`);
          break;
        } catch (error) {
          if (error.response?.status !== 404) {
            console.error(`❌ API Error (non-404) at ${endpoint}:`, error.message);
            throw error;
          }
          // Silently continue to next endpoint if 404
          console.log(`⚠️ Endpoint not found (404): ${endpoint}`);
        }
      }
      
      // If no endpoint worked, show mock data for now
      if (!gamerRes) {
        console.warn(`No user profile endpoint found for: ${userIdentifier}`);
        // Try to get user data from localStorage (if came from search)
        const searchUserData = localStorage.getItem(`user_search_${userIdentifier}`);
        if (searchUserData) {
          try {
            const userData = JSON.parse(searchUserData);
            console.log(`📁 Using cached search data for user: ${userData.username}`);
            gamerRes = { data: userData };
          } catch (e) {
            console.warn('Failed to parse cached user data');
          }
        }
        
        // If still no data, use mock data
        if (!gamerRes) {
          gamerRes = {
            data: {
              _id: userIdentifier,
              username: 'Demo User',
              avatar: '/default-avatar.png',
              title: 'Gamer',
              bio: 'This is a demo profile. Backend user endpoint not yet implemented.',
              totalContributions: 0,
              totalHours: 0,
              favoriteGenres: [],
              platforms: []
            }
          };
        }
      }
      
      const [contributionsRes] = await Promise.all([
        // This would fetch user's contributions
        Promise.resolve({ data: { contributions: mockContributions, stats: mockStats } })
      ]);

      setGamer(gamerRes.data);
      setContributions(contributionsRes.data.contributions);
      setStats(contributionsRes.data.stats);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const mockContributions = [
    {
      _id: '1',
      title: 'Cyberpunk 2077',
      coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=500',
      roles: [{ name: 'Lead Game Designer', department: 'Design' }],
      userRole: 'Lead Game Designer',
      department: 'Design',
      ggdbRating: 4.2,
      releaseDate: '2020-12-10',
      status: 'Released',
      platforms: ['PC', 'PlayStation', 'Xbox'],
      genres: ['Action', 'RPG'],
      description: 'Led the design of character progression systems and main quest narratives.'
    },
    {
      _id: '2',
      title: 'The Witcher 3: Wild Hunt',
      coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=500',
      roles: [{ name: 'Quest Designer', department: 'Design' }],
      userRole: 'Quest Designer',
      department: 'Design',
      ggdbRating: 4.8,
      releaseDate: '2015-05-19',
      status: 'Released',
      platforms: ['PC', 'PlayStation', 'Xbox'],
      genres: ['Action', 'RPG'],
      description: 'Designed and implemented multiple side quests including the Bloody Baron storyline.'
    },
    {
      _id: '3',
      title: 'Gwent: The Witcher Card Game',
      coverImage: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=500',
      roles: [{ name: 'Game Balance Designer', department: 'Design' }],
      userRole: 'Game Balance Designer',
      department: 'Design',
      ggdbRating: 4.1,
      releaseDate: '2018-10-23',
      status: 'Released',
      platforms: ['PC', 'Mobile'],
      genres: ['Strategy', 'Card Game'],
      description: 'Responsible for card balance and meta-game health across multiple competitive seasons.'
    }
  ];

  const mockStats = {
    totalProjects: 3,
    departmentBreakdown: { Design: 3, Programming: 1 },
    roleBreakdown: { 'Lead Game Designer': 1, 'Quest Designer': 1, 'Game Balance Designer': 1 },
    averageRating: 4.4,
    platformsWorkedOn: ['PC', 'PlayStation', 'Xbox', 'Mobile'],
    genresWorkedOn: ['Action', 'RPG', 'Strategy', 'Card Game'],
    upcomingProjects: 0,
    completedProjects: 3
  };

  const handleExportResume = () => {
    // This would generate a PDF resume
    console.log('Exporting resume...');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    // Show toast notification
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
        <div 
          className="h-96 bg-cover bg-center"
          style={{
            backgroundImage: `url(${gamer?.coverImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3'})`
          }}
        ></div>
        
        <div className="absolute inset-0 z-20 flex items-end">
          <div className="max-w-7xl mx-auto px-4 pb-8">
            <div className="flex items-end gap-6">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 p-1">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-4xl">
                  {gamer?.avatar ? (
                    <img 
                      src={gamer.avatar} 
                      alt={gamer.username} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FaUser className="text-white" />
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-4xl font-bold text-white">{gamer?.username}</h1>
                  {gamer?.isProfessional && (
                    <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                      Professional
                    </span>
                  )}
                </div>
                
                {gamer?.title && (
                  <p className="text-xl text-yellow-400 mb-2">{gamer.title}</p>
                )}
                
                <div className="flex items-center gap-4 text-white/70">
                  {gamer?.location && (
                    <div className="flex items-center gap-1">
                      <FaMapMarkerAlt />
                      <span>{gamer.location}</span>
                    </div>
                  )}
                  
                  {gamer?.memberSince && (
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt />
                      <span>Member since {gamer.memberSince}</span>
                    </div>
                  )}
                  
                  {gamer?.website && (
                    <a 
                      href={gamer.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-yellow-400 transition-colors"
                    >
                      <FaGlobe />
                      <span>Website</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/gamer/${gamer?.username || slug || id}`)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <FaGamepad />
                  Gamer Profile
                </button>
                <button
                  onClick={handleExportResume}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                >
                  <FaDownload />
                  Export Resume
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg transition-colors"
                >
                  <FaShare />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'projects', label: 'Projects' },
              { id: 'experience', label: 'Experience' },
              { id: 'achievements', label: 'Achievements' }
            ].map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`py-4 px-2 border-b-2 transition-colors ${
                  activeSection === section.id
                    ? 'border-yellow-500 text-yellow-400'
                    : 'border-transparent text-white/70 hover:text-white'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeSection === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* About */}
            <div className="lg:col-span-2">
              <div className="glass-effect rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">About</h3>
                <p className="text-white/70 leading-relaxed">
                  {gamer?.bio || 'Game industry professional with extensive experience in game design, development, and production. Passionate about creating engaging player experiences and innovative gameplay mechanics.'}
                </p>
              </div>

              {/* Latest Projects */}
              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Latest Projects</h3>
                <div className="space-y-4">
                  {contributions.slice(0, 3).map(project => (
                    <div key={project._id} className="flex gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="w-16 h-20 bg-gray-800 rounded-lg flex items-center justify-center">
                        <FaGamepad className="text-white/40" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{project.title}</h4>
                        <p className="text-yellow-400 text-sm mb-2">{project.userRole}</p>
                        <p className="text-white/60 text-sm">{project.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-400 mb-1">
                          <FaStar />
                          <span className="text-sm">{project.ggdbRating}</span>
                        </div>
                        <p className="text-white/60 text-xs">{new Date(project.releaseDate).getFullYear()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Professional Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">Total Projects</span>
                    <span className="text-yellow-400 font-bold">{stats?.totalProjects || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Average Rating</span>
                    <span className="text-yellow-400 font-bold">{stats?.averageRating || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Platforms</span>
                    <span className="text-yellow-400 font-bold">{stats?.platformsWorkedOn?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Genres</span>
                    <span className="text-yellow-400 font-bold">{stats?.genresWorkedOn?.length || 0}</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Skills & Expertise</h3>
                <div className="space-y-2">
                  {Object.entries(stats?.roleBreakdown || {}).map(([role, count]) => (
                    <div key={role} className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">{role}</span>
                      <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs">
                        {count} project{count > 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              {gamer?.socials && gamer.socials.length > 0 && (
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Connect</h3>
                  <div className="space-y-3">
                    {gamer.socials.map((social, index) => (
                      <a
                        key={index}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: social.color }}>
                          {social.icon}
                        </div>
                        <span className="text-white/70">{social.platform}</span>
                        <FaExternalLinkAlt className="text-white/40 ml-auto" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contributions.map(project => (
              <div key={project._id} className="glass-effect rounded-xl overflow-hidden hover:scale-105 transition-all duration-300">
                <div className="h-48 bg-gray-800 flex items-center justify-center">
                  <FaGamepad className="text-4xl text-white/40" />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-white mb-2">{project.title}</h4>
                  <p className="text-yellow-400 text-sm mb-2">{project.userRole}</p>
                  <p className="text-white/60 text-sm mb-3">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <FaStar />
                      <span className="text-sm">{project.ggdbRating}</span>
                    </div>
                    <span className="text-white/60 text-xs">{new Date(project.releaseDate).getFullYear()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Other sections would be implemented similarly */}
      </div>
    </div>
  );
};

export default PublicGamerPortfolio;