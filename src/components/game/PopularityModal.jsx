import React, { useState, useEffect } from "react";
import { MdTrendingUp, MdClose } from "react-icons/md";
import { FaTimes } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const PopularityModal = ({ isOpen, onClose, game }) => {
  const [popularityData, setPopularityData] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (isOpen && game?._id) {
      fetchPopularityData();
    }
  }, [isOpen, game]);

  const fetchPopularityData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/games/${game._id}/popularity-stats`);
      const data = await response.json();
      setPopularityData(data);
    } catch (error) {
      console.error("Failed to fetch popularity data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-gray-700/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-xl">
              <MdTrendingUp className="text-green-400 text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Popularity Statistics</h2>
              <p className="text-gray-400 text-sm">Detailed analytics and trends</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-all duration-200 p-2 hover:bg-gray-700/50 rounded-xl hover:scale-110"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto scrollbar-hide" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-400 absolute top-0"></div>
              </div>
              <p className="text-gray-400 mt-4 text-lg">Loading popularity data...</p>
            </div>
          ) : popularityData ? (
            <div className="space-y-8">
              {/* Game Info */}
              <div className="flex items-center gap-6 bg-gradient-to-r from-gray-800/50 to-gray-700/30 p-6 rounded-2xl border border-gray-700/30 backdrop-blur-sm">
                <div className="relative">
                  <img 
                    src={game.coverImage} 
                    alt={game.title}
                    className="w-20 h-28 object-cover rounded-xl shadow-lg"
                  />
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    #{popularityData.rank || '?'}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-1">{game.title}</h3>
                  <p className="text-gray-300 text-lg mb-2">
                    {game.releaseDate ? new Date(game.releaseDate).getFullYear() : 'TBA'}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 font-semibold">Currently Trending</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-green-400/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <MdTrendingUp className="text-xl" />
                    </div>
                    <div className="text-xs opacity-75">SCORE</div>
                  </div>
                  <div className="text-3xl font-bold mb-1">{popularityData.currentPopularity || 0}</div>
                  <div className="text-sm opacity-90">Current Popularity</div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-blue-400/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <span className="text-xl">📈</span>
                    </div>
                    <div className="text-xs opacity-75">WEEKLY</div>
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    {popularityData.weeklyChange >= 0 ? '+' : ''}{popularityData.weeklyChange || 0}
                  </div>
                  <div className="text-sm opacity-90">Weekly Change</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-purple-400/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <span className="text-xl">🏆</span>
                    </div>
                    <div className="text-xs opacity-75">GLOBAL</div>
                  </div>
                  <div className="text-3xl font-bold mb-1">#{popularityData.rank || '-'}</div>
                  <div className="text-sm opacity-90">Global Rank</div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-orange-400/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <span className="text-xl">⭐</span>
                    </div>
                    <div className="text-xs opacity-75">PEAK</div>
                  </div>
                  <div className="text-3xl font-bold mb-1">{popularityData.peakPopularity || 0}</div>
                  <div className="text-sm opacity-90">Peak Popularity</div>
                </div>
              </div>

              {/* Popularity Trend Chart */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 p-8 rounded-2xl border border-gray-700/30 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">Popularity Trend</h4>
                    <p className="text-gray-400 text-sm">Last 30 days performance</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-gray-300">Popularity Score</span>
                    </div>
                  </div>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={popularityData.trendData || []}>
                      <defs>
                        <linearGradient id="colorPopularity" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                      />
                      <CartesianGrid strokeDasharray="2 2" stroke="#374151" opacity={0.3} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #10b981',
                          borderRadius: '12px',
                          color: '#fff',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }}
                        labelStyle={{ color: '#10b981' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="popularity"
                        stroke="#10b981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorPopularity)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Activity Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 p-8 rounded-2xl border border-gray-700/30 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500/20 rounded-xl">
                      <span className="text-xl">📊</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">Activity Breakdown</h4>
                      <p className="text-gray-400 text-sm">User engagement metrics</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span className="text-gray-200">Likes</span>
                      </div>
                      <span className="text-red-400 font-bold text-lg">{popularityData.likes || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span className="text-gray-200">Loves</span>
                      </div>
                      <span className="text-yellow-400 font-bold text-lg">{popularityData.loves || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-gray-200">Plan to Play</span>
                      </div>
                      <span className="text-purple-400 font-bold text-lg">{popularityData.planToPlay || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-gray-200">Completed</span>
                      </div>
                      <span className="text-green-400 font-bold text-lg">{popularityData.completed || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 p-8 rounded-2xl border border-gray-700/30 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-500/20 rounded-xl">
                      <span className="text-xl">⚡</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">Engagement Score</h4>
                      <p className="text-gray-400 text-sm">Performance indicators</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl">
                      <span className="text-gray-200">User Activity</span>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-400 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, popularityData.userActivity || 0)}%` }}
                          ></div>
                        </div>
                        <span className="text-blue-400 font-bold text-sm w-10">{popularityData.userActivity || 0}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl">
                      <span className="text-gray-200">Rating Quality</span>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, popularityData.ratingQuality || 0)}%` }}
                          ></div>
                        </div>
                        <span className="text-yellow-400 font-bold text-sm w-10">{popularityData.ratingQuality || 0}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl">
                      <span className="text-gray-200">Recent Trend</span>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        popularityData.trendDirection === 'up' 
                          ? 'bg-green-500/20 text-green-400' 
                          : popularityData.trendDirection === 'down' 
                          ? 'bg-red-500/20 text-red-400' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {popularityData.trendDirection === 'up' ? '📈 Rising' : popularityData.trendDirection === 'down' ? '📉 Falling' : '➡️ Stable'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Popularity Formula */}
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 p-8 rounded-2xl border border-gray-700/30 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-500/20 rounded-xl">
                    <span className="text-xl">🧮</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">How Popularity is Calculated</h4>
                    <p className="text-gray-400 text-sm">Algorithm breakdown</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/40 p-4 rounded-xl border border-gray-600/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <strong className="text-white">User Activity (70%)</strong>
                    </div>
                    <p className="text-gray-300 text-sm">Likes, loves, ratings, and completion rates</p>
                  </div>
                  <div className="bg-gray-700/40 p-4 rounded-xl border border-gray-600/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <strong className="text-white">Quality Score (30%)</strong>
                    </div>
                    <p className="text-gray-300 text-sm">Average rating and review quality</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl border border-green-400/20">
                  <p className="text-green-300 text-sm font-medium">
                    <span className="text-green-400">💡 Formula:</span> 
                    (Activity Score × 0.7) + (Rating Influence × 0.3) = Final Popularity
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="mb-6">
                <MdTrendingUp className="text-gray-500 text-8xl mx-auto mb-4 opacity-50" />
              </div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Popularity Data Available</h3>
              <p className="text-gray-500">This game needs more user activity to generate statistics.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularityModal;