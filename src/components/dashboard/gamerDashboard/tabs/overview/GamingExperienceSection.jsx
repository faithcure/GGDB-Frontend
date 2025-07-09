import React, { useState, useEffect } from "react";
import { FaGamepad, FaHeart, FaHeartBroken, FaClock, FaCalendarAlt, FaTrophy, FaStar, FaFire, FaChartLine } from "react-icons/fa";
import { API_BASE } from "../../../../../config/api";

const GamingExperienceSection = ({ gamer }) => {
    const [animatedStats, setAnimatedStats] = useState({});
    const [showDetails, setShowDetails] = useState(null);
    const [realStats, setRealStats] = useState({});
    const [loading, setLoading] = useState(true);


    // Fetch real gaming statistics
    useEffect(() => {
        const fetchGamingStats = async () => {
            if (!gamer?._id) return;

            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                // Fetch user activities to calculate stats
                const activitiesResponse = await fetch(`${API_BASE}/api/user-activity/${gamer._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (activitiesResponse.ok) {
                    const activities = await activitiesResponse.json();
                    
                    // Calculate statistics from activities
                    const uniqueGames = new Set();
                    let likedGames = 0;
                    let dislikedGames = 0;
                    let planToPlayGames = 0;
                    let totalProgressActivities = 0;
                    let totalHours = 0;

                    activities.forEach(activity => {
                        if (activity.gameId) uniqueGames.add(activity.gameId);
                        
                        switch(activity.activityType) {
                            case 'like':
                                likedGames++;
                                break;
                            case 'dislike':
                                dislikedGames++;
                                break;
                            case 'plantoplay':
                                planToPlayGames++;
                                break;
                            case 'progress':
                                totalProgressActivities++;
                                if (activity.sessionDuration) {
                                    totalHours += activity.sessionDuration / 60; // Convert minutes to hours
                                }
                                break;
                        }
                    });

                    // Calculate level based on total activities and games
                    const level = Math.max(1, Math.floor((uniqueGames.size + activities.length) / 10));

                    const stats = {
                        totalGames: uniqueGames.size,
                        likedGames,
                        dislikedGames,
                        planToPlay: planToPlayGames,
                        totalHours: Math.round(totalHours),
                        level
                    };

                    setRealStats(stats);
                }
            } catch (error) {
                console.error('Failed to fetch gaming stats:', error);
                // Fallback to gamer object stats
                setRealStats({
                    totalGames: gamer.stats?.totalGames || 0,
                    likedGames: gamer.stats?.likedGames || 0,
                    dislikedGames: gamer.stats?.dislikedGames || 0,
                    planToPlay: gamer.stats?.planToPlay || 0,
                    totalHours: gamer.stats?.totalHours || 0,
                    level: gamer.level || 1
                });
            } finally {
                setLoading(false);
            }
        };

        fetchGamingStats();
    }, [gamer._id, API_BASE]);

    // Animate numbers on mount
    useEffect(() => {
        if (!realStats.totalGames && loading) return;

        const stats = realStats;

        Object.keys(stats).forEach(key => {
            let current = 0;
            const target = stats[key];
            const increment = target / 50; // 50 frames animation

            const animate = () => {
                current += increment;
                if (current < target) {
                    setAnimatedStats(prev => ({ ...prev, [key]: Math.floor(current) }));
                    requestAnimationFrame(animate);
                } else {
                    setAnimatedStats(prev => ({ ...prev, [key]: target }));
                }
            };

            setTimeout(() => animate(), Math.random() * 500); // Stagger animations
        });
    }, [realStats, loading]);

    const stats = [
        {
            key: 'totalGames',
            label: 'Games Played',
            value: animatedStats.totalGames || 0,
            icon: FaGamepad,
            color: 'text-blue-400',
            bgColor: 'from-blue-500/20 to-blue-600/20',
            borderColor: 'border-blue-500/30',
            detail: 'Your gaming library keeps growing!',
            nextMilestone: Math.ceil((animatedStats.totalGames || 0) / 50) * 50
        },
        {
            key: 'likedGames',
            label: 'Liked Games',
            value: animatedStats.likedGames || 0,
            icon: FaHeart,
            color: 'text-green-400',
            bgColor: 'from-green-500/20 to-green-600/20',
            borderColor: 'border-green-500/30',
            detail: 'Games that captured your heart',
            percentage: Math.round(((animatedStats.likedGames || 0) / (animatedStats.totalGames || 1)) * 100)
        },
        {
            key: 'dislikedGames',
            label: 'Disliked Games',
            value: animatedStats.dislikedGames || 0,
            icon: FaHeartBroken,
            color: 'text-red-400',
            bgColor: 'from-red-500/20 to-red-600/20',
            borderColor: 'border-red-500/30',
            detail: 'Not every game is for everyone',
            percentage: Math.round(((animatedStats.dislikedGames || 0) / (animatedStats.totalGames || 1)) * 100)
        },
        {
            key: 'planToPlay',
            label: 'Plan to Play',
            value: animatedStats.planToPlay || 0,
            icon: FaCalendarAlt,
            color: 'text-yellow-400',
            bgColor: 'from-yellow-500/20 to-yellow-600/20',
            borderColor: 'border-yellow-500/30',
            detail: 'Your gaming wishlist awaits',
            nextMilestone: Math.ceil((animatedStats.planToPlay || 0) / 10) * 10
        }
    ];

    const mainStats = [
        {
            key: 'totalHours',
            label: 'Total Hours',
            value: `${animatedStats.totalHours || 0}h`,
            icon: FaClock,
            color: 'text-white',
            bgColor: 'from-purple-500/20 to-purple-600/20',
            borderColor: 'border-purple-500/30',
            detail: 'Time invested in your passion',
            daysEquivalent: Math.round((animatedStats.totalHours || 0) / 24)
        },
        {
            key: 'level',
            label: 'Current Level',
            value: animatedStats.level || 1,
            icon: FaTrophy,
            color: 'text-purple-400',
            bgColor: 'from-indigo-500/20 to-indigo-600/20',
            borderColor: 'border-indigo-500/30',
            detail: 'Your gaming mastery level',
            progress: ((animatedStats.level || 1) % 10) * 10,
            nextLevel: (animatedStats.level || 1) + 1
        }
    ];

    const getLevelProgress = () => {
        const level = animatedStats.level || 1;
        return ((level % 10) / 10) * 100;
    };

    const getAchievementHint = (stat) => {
        if (stat.key === 'totalGames' && stat.nextMilestone) {
            return `${stat.nextMilestone - stat.value} games to ${stat.nextMilestone}!`;
        }
        if (stat.key === 'planToPlay' && stat.nextMilestone) {
            return `${stat.nextMilestone - stat.value} more for ${stat.nextMilestone} wishlist!`;
        }
        return null;
    };

    if (loading) {
        return (
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-base font-semibold text-white">Gaming Experience</h3>
                    <div className="px-2 py-1 bg-indigo-500/20 rounded-full animate-pulse">
                        <span className="text-indigo-300 text-xs font-medium">Loading...</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="glass-dark rounded-lg p-4 animate-pulse">
                            <div className="w-6 h-6 bg-white/10 rounded mx-auto mb-2"></div>
                            <div className="h-6 bg-white/10 rounded w-8 mx-auto mb-1"></div>
                            <div className="h-3 bg-white/5 rounded w-12 mx-auto"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
                <h3 className="text-base font-semibold text-white">Gaming Experience</h3>
                <div className="px-2 py-1 bg-indigo-500/20 rounded-full">
                    <span className="text-indigo-300 text-xs font-medium">Live Stats</span>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {stats.map((stat) => (
                    <div
                        key={stat.key}
                        className={`relative group glass-dark rounded-lg p-4 text-center border ${stat.borderColor} hover:bg-white/5 transition-all duration-300 cursor-pointer overflow-hidden`}
                        onMouseEnter={() => setShowDetails(stat.key)}
                        onMouseLeave={() => setShowDetails(null)}
                    >
                        {/* Animated background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                        {/* Content */}
                        <div className="relative z-10">
                            <div className="flex items-center justify-center mb-2">
                                <stat.icon className={`${stat.color} text-lg group-hover:scale-110 transition-transform duration-300`} />
                            </div>
                            <div className={`text-xl font-bold ${stat.color} group-hover:scale-105 transition-transform duration-300`}>
                                {stat.value}
                            </div>
                            <div className="text-xs text-white/50 group-hover:text-white/70 transition-colors">
                                {stat.label}
                            </div>

                            {/* Percentage for liked/disliked */}
                            {stat.percentage !== undefined && (
                                <div className="text-xs text-white/40 mt-1">
                                    {stat.percentage}%
                                </div>
                            )}
                        </div>

                        {/* Hover Detail */}
                        {showDetails === stat.key && (
                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-2 rounded-lg z-20 animate-fadeIn">
                                <div className="text-center">
                                    <p className="text-xs text-white/90 mb-1">{stat.detail}</p>
                                    {getAchievementHint(stat) && (
                                        <p className="text-xs text-yellow-300">
                                            🎯 {getAchievementHint(stat)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Bottom Stats with Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mainStats.map((stat) => (
                    <div
                        key={stat.key}
                        className={`group glass-dark rounded-lg p-4 border ${stat.borderColor} hover:bg-white/5 transition-all duration-300 cursor-pointer overflow-hidden relative`}
                        onMouseEnter={() => setShowDetails(stat.key)}
                        onMouseLeave={() => setShowDetails(null)}
                    >
                        {/* Animated background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <stat.icon className={`${stat.color} text-xl group-hover:scale-110 transition-transform duration-300`} />
                                    <div>
                                        <div className={`text-xl font-bold ${stat.color} group-hover:scale-105 transition-transform duration-300`}>
                                            {stat.value}
                                        </div>
                                        <div className="text-xs text-white/50 group-hover:text-white/70 transition-colors">
                                            {stat.label}
                                        </div>
                                    </div>
                                </div>

                                {/* Achievement indicator */}
                                {stat.key === 'level' && (
                                    <div className="flex items-center gap-1">
                                        <FaStar className="text-yellow-400 text-sm" />
                                        <span className="text-xs text-yellow-300">LV.{stat.nextLevel}</span>
                                    </div>
                                )}
                            </div>

                            {/* Progress bar for level */}
                            {stat.key === 'level' && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-white/50">
                                        <span>Level Progress</span>
                                        <span>{Math.round(getLevelProgress())}%</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${getLevelProgress()}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {/* Hours breakdown */}
                            {stat.key === 'totalHours' && stat.daysEquivalent > 0 && (
                                <div className="flex items-center gap-2 mt-2">
                                    <FaChartLine className="text-white/40 text-xs" />
                                    <span className="text-xs text-white/50">
                                        ≈ {stat.daysEquivalent} days of gaming
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Hover Detail */}
                        {showDetails === stat.key && (
                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-3 rounded-lg z-20 animate-fadeIn">
                                <div className="text-center">
                                    <p className="text-xs text-white/90 mb-1">{stat.detail}</p>
                                    {stat.key === 'level' && (
                                        <p className="text-xs text-purple-300">
                                            🚀 {100 - Math.round(getLevelProgress())}% to level {stat.nextLevel}
                                        </p>
                                    )}
                                    {stat.key === 'totalHours' && stat.daysEquivalent > 30 && (
                                        <p className="text-xs text-blue-300">
                                            🏆 Gaming veteran with {Math.round(stat.daysEquivalent / 30)} months!
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Gaming Journey Summary */}
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <FaFire className="text-orange-400" size={14} />
                    <span className="text-purple-300 text-sm font-medium">Gaming Journey</span>
                </div>
                <p className="text-white/70 text-xs leading-relaxed">
                    {animatedStats.totalGames > 50 ? "Experienced gamer" : "Growing gamer"} with{" "}
                    <span className="text-blue-300">{animatedStats.totalGames || 0} games played</span>,{" "}
                    <span className="text-green-300">{Math.round(((animatedStats.likedGames || 0) / (animatedStats.totalGames || 1)) * 100)}% approval rate</span>, and{" "}
                    <span className="text-purple-300">level {animatedStats.level || 1}</span> mastery.
                    {animatedStats.totalHours > 1000 && " 🏆 Dedicated gaming veteran!"}
                </p>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default GamingExperienceSection;