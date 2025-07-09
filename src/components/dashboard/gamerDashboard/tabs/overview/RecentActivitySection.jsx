import React, { useState, useEffect } from "react";
import { FaEdit, FaStar, FaExternalLinkAlt } from "react-icons/fa";
import { API_BASE } from "../../../../../config/api";
import { 
    Heart, 
    HeartCrack, 
    Clock, 
    Gamepad2, 
    Star, 
    Trophy, 
    MessageSquare, 
    Calendar,
    PlayCircle 
} from "lucide-react";

const RecentActivitySection = ({ gamer, setActiveTab }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);


    // Activity type configurations matching ActivityTab
    const activityConfig = {
        'like': {
            icon: <Heart className="w-4 h-4" />,
            color: 'text-green-400',
            bgColor: 'bg-green-500/10',
            title: 'Liked'
        },
        'dislike': {
            icon: <HeartCrack className="w-4 h-4" />,
            color: 'text-red-400',
            bgColor: 'bg-red-500/10',
            title: 'Disliked'
        },
        'progress': {
            icon: <Gamepad2 className="w-4 h-4" />,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            title: 'Progress'
        },
        'plantoplay': {
            icon: <Clock className="w-4 h-4" />,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10',
            title: 'Plan to Play'
        },
        'review': {
            icon: <MessageSquare className="w-4 h-4" />,
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/10',
            title: 'Review'
        },
        'rating': {
            icon: <Star className="w-4 h-4" />,
            color: 'text-amber-400',
            bgColor: 'bg-amber-500/10',
            title: 'Rating'
        }
    };

    useEffect(() => {
        const fetchRecentActivities = async () => {
            if (!gamer?._id) return;

            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                // Fetch user activities
                const activitiesResponse = await fetch(`${API_BASE}/api/user-activity/${gamer._id}?limit=5`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (activitiesResponse.ok) {
                    const activitiesData = await activitiesResponse.json();
                    setActivities(activitiesData);
                }
            } catch (error) {
                console.error('Failed to fetch recent activities:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentActivities();
    }, [gamer._id, API_BASE]);

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const getActivityMessage = (activity) => {
        const gameTitle = activity.gameTitle || 'a game';
        
        switch(activity.activityType) {
            case 'like':
                return `Liked "${gameTitle}"`;
            case 'dislike':
                return `Disliked "${gameTitle}"`;
            case 'progress':
                if (activity.progress >= 90) return `Completed "${gameTitle}"`;
                if (activity.progress > 0) return `${activity.progress}% progress in "${gameTitle}"`;
                return `Started playing "${gameTitle}"`;
            case 'plantoplay':
                return `Added "${gameTitle}" to Plan to Play`;
            case 'review':
                return `Reviewed "${gameTitle}"`;
            case 'rating':
                return `Rated "${gameTitle}" ${activity.avarageScore || activity.rating}/10`;
            default:
                return `Activity in "${gameTitle}"`;
        }
    };

    return (
        <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                    <div className="px-2 py-1 bg-blue-500/20 rounded-full">
                        <span className="text-blue-300 text-xs font-medium">Latest</span>
                    </div>
                </div>
                <button 
                    onClick={() => setActiveTab('activity')}
                    className="flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                    View All
                    <FaExternalLinkAlt size={12} />
                </button>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="glass-dark rounded-lg p-4 animate-pulse">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-white/10 rounded-lg"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-white/5 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : activities.length > 0 ? (
                <div className="space-y-3">
                    {activities.map((activity) => {
                        const config = activityConfig[activity.activityType];
                        if (!config) return null;

                        return (
                            <div 
                                key={activity._id} 
                                className="glass-dark rounded-lg p-4 flex items-start gap-4 hover:bg-white/5 transition-colors cursor-pointer border border-white/10 hover:border-white/20"
                                onClick={() => {
                                    if (activity.gameId) {
                                        window.open(`/game/${activity.gameId}`, '_blank');
                                    }
                                }}
                            >
                                <div className={`w-8 h-8 ${config.bgColor} rounded-lg flex items-center justify-center ${config.color} border border-white/10`}>
                                    {config.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white mb-1">
                                        {getActivityMessage(activity)}
                                    </p>
                                    
                                    {/* Progress bar for progress activities */}
                                    {activity.activityType === 'progress' && activity.progress > 0 && (
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex-1 bg-white/20 rounded-full h-1.5 max-w-24">
                                                <div
                                                    className="h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                                    style={{ width: `${activity.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-white/60">{activity.progress}%</span>
                                        </div>
                                    )}

                                    {/* Rating score for rating activities */}
                                    {activity.activityType === 'rating' && (
                                        <div className="flex items-center gap-1 mb-2">
                                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                            <span className="text-yellow-400 text-xs font-medium">
                                                {activity.avarageScore || activity.rating}/10
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 text-xs text-white/40">
                                        <Calendar className="w-3 h-3" />
                                        <span>{formatTimeAgo(activity.date)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-8">
                    <PlayCircle className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/60 text-sm">No recent activity</p>
                    <p className="text-white/40 text-xs mt-1">Start gaming to see activity here!</p>
                </div>
            )}
        </div>
    );
};

export default RecentActivitySection;
