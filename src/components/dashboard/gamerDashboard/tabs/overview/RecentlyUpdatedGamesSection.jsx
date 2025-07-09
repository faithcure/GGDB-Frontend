import React, { useState, useEffect } from "react";
import { FaStar, FaHeart, FaHeartBroken, FaClock, FaCheck, FaExternalLinkAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../../../../config/api";

const SimpleGamesList = ({ gamer }) => {
    const navigate = useNavigate();
    const [recentGames, setRecentGames] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchRecentlyUpdatedGames = async () => {
            if (!gamer?._id) return;

            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                // Fetch user activities to get recently updated games
                const activitiesResponse = await fetch(`${API_BASE}/api/user-activity/${gamer._id}?limit=20`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (activitiesResponse.ok) {
                    const activities = await activitiesResponse.json();
                    
                    // Group activities by game and get unique games with latest activity
                    const gameMap = new Map();
                    activities.forEach(activity => {
                        if (activity.gameId && activity.gameTitle) {
                            if (!gameMap.has(activity.gameId) || 
                                new Date(activity.date) > new Date(gameMap.get(activity.gameId).lastActivity)) {
                                gameMap.set(activity.gameId, {
                                    gameId: activity.gameId,
                                    title: activity.gameTitle,
                                    lastActivity: activity.date,
                                    activityType: activity.activityType,
                                    progress: activity.progress,
                                    rating: activity.avarageScore || activity.rating,
                                    liked: activity.activityType === 'like',
                                    disliked: activity.activityType === 'dislike',
                                    planToPlay: activity.activityType === 'plantoplay',
                                    completed: activity.progress >= 100
                                });
                            }
                        }
                    });

                    // Convert to array and sort by last activity
                    const games = Array.from(gameMap.values())
                        .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity))
                        .slice(0, 5); // Show only 5 recent games

                    setRecentGames(games);
                }
            } catch (error) {
                console.error('Failed to fetch recently updated games:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentlyUpdatedGames();
    }, [gamer._id, API_BASE]);

    const getStatusIcons = (game) => {
        const icons = [];

        if (game.planToPlay) {
            icons.push(
                <div key="plan" className="flex items-center gap-1">
                    <FaClock className="text-blue-400" size={14} />
                    <span className="text-xs text-blue-400">Plan to Play</span>
                </div>
            );
        }

        if (game.completed || game.progress === 100) {
            icons.push(
                <div key="completed" className="flex items-center gap-1">
                    <FaCheck className="text-green-400" size={14} />
                    <span className="text-xs text-green-400">Completed</span>
                </div>
            );
        } else if (game.progress > 0) {
            icons.push(
                <div key="progress" className="flex items-center gap-1">
                    <span className="text-xs text-yellow-400">({game.progress}%)</span>
                </div>
            );
        }

        if (game.liked) {
            icons.push(
                <div key="liked" className="flex items-center gap-1">
                    <FaHeart className="text-pink-400" size={14} />
                    <span className="text-xs text-pink-400">Liked</span>
                </div>
            );
        }

        if (game.disliked) {
            icons.push(
                <div key="disliked" className="flex items-center gap-1">
                    <FaHeartBroken className="text-red-400" size={14} />
                    <span className="text-xs text-red-400">Disliked</span>
                </div>
            );
        }

        return icons;
    };

    return (
        <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-white">Recently Updated Games</h2>
                    <div className="px-2 py-1 bg-purple-500/20 rounded-full">
                        <span className="text-purple-300 text-xs font-medium">{recentGames.length} Games</span>
                    </div>
                </div>
                <button 
                    onClick={() => navigate('/dashboard?tab=library')}
                    className="flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                    View Library
                    <FaExternalLinkAlt size={12} />
                </button>
            </div>

            {loading ? (
                <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="glass-dark rounded-lg p-3 animate-pulse">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-10 bg-white/10 rounded"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-white/5 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : recentGames.length > 0 ? (
                <div className="space-y-2">
                    {recentGames.map(game => (
                        <div 
                            key={game.gameId} 
                            className="glass-dark rounded-lg p-3 flex items-center gap-3 hover:bg-white/5 transition-all cursor-pointer border border-white/10 hover:border-purple-500/30"
                            onClick={() => window.open(`/game/${game.gameId}`, '_blank')}
                        >
                            <div className="w-8 h-10 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded border border-white/10 flex items-center justify-center">
                                <span className="text-white/60 text-xs font-bold">
                                    {game.title.charAt(0).toUpperCase()}
                                </span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-white truncate mb-1 text-sm">{game.title}</h3>

                                <div className="flex items-center gap-2">
                                    {getStatusIcons(game)}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {game.rating && (
                                    <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-lg">
                                        <FaStar className="text-yellow-400 text-xs" />
                                        <span className="font-medium text-white text-xs">{game.rating}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <FaClock className="text-white/20 text-4xl mx-auto mb-3" />
                    <p className="text-white/60 text-sm">No recent game activity</p>
                    <p className="text-white/40 text-xs mt-1">Start gaming to see recently updated games!</p>
                </div>
            )}

            <div className="mt-6">
                <button 
                    onClick={() => navigate('/dashboard?tab=library')}
                    className="flex items-center gap-2 w-full p-3 glass-dark rounded-lg border border-dashed border-white/20 hover:border-purple-500/50 hover:bg-white/5 transition-all text-white/60 hover:text-purple-400 justify-center"
                >
                    <span>Go to Game Library</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default SimpleGamesList;