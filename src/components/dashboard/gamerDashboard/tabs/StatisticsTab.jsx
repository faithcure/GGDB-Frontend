import React, { useState, useEffect } from "react";
import { 
  FaClock, 
  FaGamepad, 
  FaEdit, 
  FaChartLine, 
  FaFire, 
  FaTrophy,
  FaCalendarAlt,
  FaUsers,
  FaStar,
  FaBullseye,
  FaArrowUp,
  FaArrowDown,
  FaMedal,
  FaPlayCircle,
  FaHeart,
  FaHeartBroken,
  FaListAlt,
  FaSync,
  FaRocket,
  FaChartPie,
  FaChartBar,
  FaThumbsUp,
  FaThumbsDown
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar
} from 'recharts';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_BASE } from "../../../../config/api";

const StatisticsTab = ({ gamer }) => {
  const [activeTimeframe, setActiveTimeframe] = useState('monthly');
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Real data state
  const [userStats, setUserStats] = useState(null);
  const [gamingStats, setGamingStats] = useState(null);
  const [genreStats, setGenreStats] = useState(null);
  const [socialStats, setSocialStats] = useState(null);
  const [trendStats, setTrendStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  

  // Fetch comprehensive user statistics
  useEffect(() => {
    if (gamer?._id) {
      fetchAllStats();
    }
  }, [gamer?._id]);

  const fetchAllStats = async () => {
    if (!gamer?._id) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      console.log('📊 Fetching comprehensive user statistics...');
      
      // Fetch all statistics in parallel
      const [overviewRes, gamingRes, genreRes, socialRes, trendsRes, recommendationsRes] = await Promise.all([
        axios.get(`${API_BASE}/api/stats/overview/${gamer._id}`, { headers }),
        axios.get(`${API_BASE}/api/stats/gaming/${gamer._id}`, { headers }),
        axios.get(`${API_BASE}/api/stats/genres/${gamer._id}`, { headers }),
        axios.get(`${API_BASE}/api/stats/social/${gamer._id}`, { headers }),
        axios.get(`${API_BASE}/api/stats/trends/${gamer._id}?period=${activeTimeframe}`, { headers }),
        axios.get(`${API_BASE}/api/stats/recommendations/${gamer._id}`, { headers })
      ]);
      
      // Set all the statistics data
      setUserStats(overviewRes.data.data);
      setGamingStats(gamingRes.data.data);
      setGenreStats(genreRes.data.data);
      setSocialStats(socialRes.data.data);
      setTrendStats(trendsRes.data.data);
      setRecommendations(recommendationsRes.data.data.recommendations);
      
      console.log('✅ All statistics loaded successfully');
      
    } catch (error) {
      console.error('❌ Error fetching user statistics:', error);
      
      // If stats don't exist, try to generate them
      if (error.response?.status === 404) {
        console.log('📊 Stats not found, generating new ones...');
        await refreshStats();
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    if (!gamer?._id) return;
    
    try {
      setRefreshing(true);
      const token = localStorage.getItem('token');
      
      console.log('🔄 Refreshing user statistics...');
      
      await axios.post(`${API_BASE}/api/stats/refresh/${gamer._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refetch all data after refresh
      await fetchAllStats();
      
      console.log('✅ Statistics refreshed successfully');
      
    } catch (error) {
      console.error('❌ Error refreshing statistics:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Helper functions for data formatting
  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getChangeColor = (value) => {
    if (value > 0) return 'text-green-400';
    if (value < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getChangeIcon = (value) => {
    if (value > 0) return <FaArrowUp />;
    if (value < 0) return <FaArrowDown />;
    return null;
  };

  const CHART_COLORS = ['#FCD34D', '#60A5FA', '#34D399', '#F87171', '#A78BFA', '#FB7185', '#FBBF24', '#10B981'];

  const timeframes = [
    { key: 'weekly', label: 'Weekly', icon: <FaCalendarAlt /> },
    { key: 'monthly', label: 'Monthly', icon: <FaChartLine /> },
    { key: 'yearly', label: 'Yearly', icon: <FaTrophy /> }
  ];

  const sections = [
    { key: 'overview', label: 'Overview', icon: <FaChartPie /> },
    { key: 'gaming', label: 'Gaming', icon: <FaGamepad /> },
    { key: 'genres', label: 'Genres', icon: <FaChartBar /> },
    { key: 'social', label: 'Social', icon: <FaUsers /> },
    { key: 'trends', label: 'Trends', icon: <FaChartLine /> },
    { key: 'recommendations', label: 'Recommendations', icon: <FaRocket /> }
  ];

  // Loading component
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading your gaming statistics...</p>
        </div>
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <FaChartLine className="text-6xl text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Statistics Available</h3>
          <p className="text-white/60 mb-6">We need some gaming activity to generate your statistics.</p>
          <button
            onClick={refreshStats}
            disabled={refreshing}
            className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black font-medium rounded-lg transition-colors mx-auto"
          >
            <FaSync className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Generating...' : 'Generate Statistics'}
          </button>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon, gradient, change, trend, description }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-xl p-6 relative overflow-hidden group hover:scale-105 transition-all duration-300"
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-bl-full"></div>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-green-500/20 text-green-400' : 
            trend === 'down' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
          }`}>
            {getChangeIcon(trend === 'up' ? 1 : trend === 'down' ? -1 : 0)}
            {change}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">
        {value}
      </div>
      <div className="text-sm text-white/60">{title}</div>
      {description && (
        <div className="text-xs text-white/40 mt-2">{description}</div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Gaming Statistics</h2>
          <p className="text-white/60">Comprehensive analysis of your gaming journey</p>
        </div>
        <button
          onClick={refreshStats}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black rounded-lg transition-colors"
        >
          <FaSync className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Updating...' : 'Refresh'}
        </button>
      </div>

      {/* Section Navigation */}
      <div className="glass-effect rounded-xl p-4">
        <div className="flex flex-wrap gap-2">
          {sections.map(section => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                activeSection === section.key
                  ? 'bg-yellow-500 text-black font-medium'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Playtime"
              value={formatTime(userStats.gaming?.totalPlaytime || 0)}
              icon={<FaClock />}
              gradient="from-blue-500 to-blue-600"
              description="Time spent playing games"
            />
            <StatCard
              title="Games Played"
              value={userStats.gaming?.totalGames || 0}
              icon={<FaGamepad />}
              gradient="from-green-500 to-green-600"
              description="Unique games in your library"
            />
            <StatCard
              title="Reviews Written"
              value={userStats.ratings?.totalReviews || 0}
              icon={<FaEdit />}
              gradient="from-yellow-500 to-yellow-600"
              description="Your contributions to the community"
            />
            <StatCard
              title="Completion Rate"
              value={`${Math.round(userStats.gaming?.completionRate || 0)}%`}
              icon={<FaTrophy />}
              gradient="from-purple-500 to-purple-600"
              description="Games completed vs started"
            />
          </div>

          {/* Gaming Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Games Liked"
              value={userStats.gaming?.gamesLiked || 0}
              icon={<FaThumbsUp />}
              gradient="from-green-500 to-green-600"
            />
            <StatCard
              title="Games Loved"
              value={userStats.gaming?.gamesLoved || 0}
              icon={<FaHeart />}
              gradient="from-red-500 to-red-600"
            />
            <StatCard
              title="Average Rating"
              value={userStats.ratings?.averageRating?.toFixed(1) || '0.0'}
              icon={<FaStar />}
              gradient="from-yellow-500 to-yellow-600"
            />
          </div>
        </motion.div>
      )}

      {/* Gaming Section */}
      {activeSection === 'gaming' && gamingStats && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Gaming Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Games */}
            <div className="glass-effect rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaTrophy className="text-yellow-500" />
                Most Played Games
              </h3>
              <div className="space-y-3">
                {gamingStats.topGames?.slice(0, 5).map((game, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-white">{game._id}</div>
                        <div className="text-white/60 text-sm">{game.sessionsCount} sessions</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-yellow-400">{formatTime(game.totalPlaytime)}</div>
                      <div className="text-white/60 text-sm">avg: {formatTime(game.averageSession)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Distribution */}
            <div className="glass-effect rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaGamepad className="text-blue-500" />
                Platform Usage
              </h3>
              <div className="space-y-3">
                {userStats.gaming?.platformStats?.map((platform, index) => (
                  <div key={index} className="">
                    <div className="flex justify-between mb-1">
                      <span className="text-white text-sm">{platform.platform}</span>
                      <span className="text-white/60 text-sm">{Math.round(platform.percentage)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${platform.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gaming Habits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Sessions"
              value={formatNumber(userStats.gaming?.totalSessions || 0)}
              icon={<FaPlayCircle />}
              gradient="from-blue-500 to-blue-600"
            />
            <StatCard
              title="Avg Session"
              value={formatTime(userStats.gaming?.averageSessionDuration || 0)}
              icon={<FaClock />}
              gradient="from-green-500 to-green-600"
            />
            <StatCard
              title="Games Completed"
              value={userStats.gaming?.gamesCompleted || 0}
              icon={<FaTrophy />}
              gradient="from-yellow-500 to-yellow-600"
            />
            <StatCard
              title="Games Dropped"
              value={userStats.gaming?.gamesDropped || 0}
              icon={<FaHeartBroken />}
              gradient="from-red-500 to-red-600"
            />
          </div>
        </motion.div>
      )}

      {/* Genres Section */}
      {activeSection === 'genres' && genreStats && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Genre Distribution Pie Chart */}
            <div className="glass-effect rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaChartPie className="text-blue-500" />
                Genre Distribution
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genreStats.genreStats?.topGenres?.slice(0, 6).map((genre, index) => ({
                        name: genre.name,
                        value: genre.playTime,
                        fill: CHART_COLORS[index % CHART_COLORS.length]
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {genreStats.genreStats?.topGenres?.slice(0, 6).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151', 
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                      formatter={(value) => [`${formatTime(value)}`, 'Playtime']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Genres List */}
            <div className="glass-effect rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaListAlt className="text-green-500" />
                Favorite Genres
              </h3>
              <div className="space-y-3">
                {genreStats.genreStats?.topGenres?.slice(0, 8).map((genre, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                      ></div>
                      <div>
                        <div className="font-medium text-white">{genre.name}</div>
                        <div className="text-white/60 text-sm">{genre.gamesCount} games</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-yellow-400">{formatTime(genre.playTime)}</div>
                      <div className="text-white/60 text-sm">{Math.round(genre.percentage)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Games */}
          {genreStats.recommendations?.suggestedGames?.length > 0 && (
            <div className="glass-effect rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaRocket className="text-purple-500" />
                Explore New Genres
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {genreStats.recommendations.suggestedGames.slice(0, 6).map((game, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                    <div className="font-medium text-white mb-1">{game.title}</div>
                    <div className="text-yellow-400 text-sm mb-2">★ {game.ggdbRating}</div>
                    <div className="text-white/60 text-xs">
                      {game.genres?.slice(0, 2).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Social Section */}
      {activeSection === 'social' && socialStats && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Reviews Written"
              value={socialStats.reviewsWritten || 0}
              icon={<FaEdit />}
              gradient="from-blue-500 to-blue-600"
            />
            <StatCard
              title="Helpful Reviews"
              value={socialStats.helpfulReviews || 0}
              icon={<FaThumbsUp />}
              gradient="from-green-500 to-green-600"
            />
            <StatCard
              title="Review Likes"
              value={socialStats.reviewLikes || 0}
              icon={<FaHeart />}
              gradient="from-red-500 to-red-600"
            />
            <StatCard
              title="Connections"
              value={socialStats.connections || 0}
              icon={<FaUsers />}
              gradient="from-purple-500 to-purple-600"
            />
          </div>

          {/* Recent Reviews */}
          {socialStats.recentReviews?.length > 0 && (
            <div className="glass-effect rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaEdit className="text-blue-500" />
                Recent Reviews
              </h3>
              <div className="space-y-4">
                {socialStats.recentReviews.map((review, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-white/5 rounded-lg">
                    <div className="w-12 h-16 bg-gray-800 rounded flex items-center justify-center">
                      <FaGamepad className="text-white/40" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{review.gameId?.title || 'Unknown Game'}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < review.rating ? '' : 'opacity-30'} />
                          ))}
                        </div>
                        <span className="text-white/60 text-sm">
                          {review.likedBy?.length || 0} likes
                        </span>
                      </div>
                      <p className="text-white/70 text-sm mt-2 line-clamp-2">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Trends Section */}
      {activeSection === 'trends' && trendStats && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Timeframe Selection */}
          <div className="flex gap-2">
            {timeframes.map(tf => (
              <button
                key={tf.key}
                onClick={() => setActiveTimeframe(tf.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                  activeTimeframe === tf.key
                    ? 'bg-yellow-500 text-black font-medium'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {tf.icon}
                {tf.label}
              </button>
            ))}
          </div>

          {/* Trends Chart */}
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaChartLine className="text-blue-500" />
              Gaming Activity Trends
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendStats.trends}>
                  <defs>
                    <linearGradient id="colorTrends" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FCD34D" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#FCD34D" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey={activeTimeframe === 'weekly' ? 'week' : activeTimeframe === 'yearly' ? 'year' : 'month'}
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151', 
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                    formatter={(value) => [`${formatTime(value)}`, 'Playtime']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="totalTime" 
                    stroke="#FCD34D" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorTrends)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recommendations Section */}
      {activeSection === 'recommendations' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaRocket className="text-purple-500" />
              Personalized Recommendations
            </h3>
            {recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.slice(0, 9).map((rec, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-white">{rec.game?.title}</div>
                      <div className="text-green-400 text-sm font-medium">
                        {Math.round(rec.matchPercentage)}% match
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-yellow-400">
                        <FaStar />
                      </div>
                      <span className="text-white/70 text-sm">{rec.game?.ggdbRating}</span>
                    </div>
                    <div className="text-white/60 text-xs mb-2">
                      {rec.game?.genres?.slice(0, 2).join(', ')}
                    </div>
                    {rec.reason && (
                      <div className="text-white/50 text-xs">
                        {rec.reason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaRocket className="text-4xl text-white/20 mx-auto mb-3" />
                <p className="text-white/60">Play more games to get personalized recommendations!</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default StatisticsTab;