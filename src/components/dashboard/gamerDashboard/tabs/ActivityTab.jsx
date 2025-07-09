import React, { useState, useEffect } from "react";
import { API_BASE } from "../../../../config/api";
import {
    Heart,
    HeartCrack,
    Clock,
    Gamepad2,
    Star,
    Trophy,
    MessageSquare,
    Loader2,
    Eye,
    Filter,
    ChevronDown,
    ExternalLink,
    Calendar,
    Monitor,
    Percent,
    ThumbsUp,
    Award,
    PlayCircle,
    Target,
    Grid3X3,
    List,
    Sparkles,
    MoreHorizontal
} from "lucide-react";

const ActivityTab = ({ userId }) => {
    console.log('🔥 ActivityTab component loaded with userId:', userId);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [timeRange, setTimeRange] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [expandedItems, setExpandedItems] = useState(new Set());
    const [viewMode, setViewMode] = useState('list'); // 'list', 'grid', or 'minimal'
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = viewMode === 'minimal' ? 20 : 12;


    // Enhanced activity configurations
    const activityConfig = {
        'like': {
            icon: <Heart className="w-5 h-5" />,
            color: 'text-green-400',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/30',
            title: '❤️ Liked',
            priority: 3
        },
        'dislike': {
            icon: <HeartCrack className="w-5 h-5" />,
            color: 'text-red-400',
            bgColor: 'bg-red-500/10',
            borderColor: 'border-red-500/30',
            title: '💔 Disliked',
            priority: 2
        },
        'progress': {
            icon: <Gamepad2 className="w-5 h-5" />,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/30',
            title: '🎮 Progress',
            priority: 5
        },
        'plantoplay': {
            icon: <Clock className="w-5 h-5" />,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500/30',
            title: '📌 Plan to Play',
            priority: 1
        },
        'review': {
            icon: <MessageSquare className="w-5 h-5" />,
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/10',
            borderColor: 'border-yellow-500/30',
            title: '✍️ Review',
            priority: 6
        },
        'achievement': {
            icon: <Trophy className="w-5 h-5" />,
            color: 'text-orange-400',
            bgColor: 'bg-orange-500/10',
            borderColor: 'border-orange-500/30',
            title: '🏆 Achievement',
            priority: 7
        },
        'session': {
            icon: <PlayCircle className="w-5 h-5" />,
            color: 'text-cyan-400',
            bgColor: 'bg-cyan-500/10',
            borderColor: 'border-cyan-500/30',
            title: '⏱️ Session',
            priority: 4
        },
        'rating': {
            icon: <Star className="w-5 h-5" />,
            color: 'text-amber-400',
            bgColor: 'bg-amber-500/10',
            borderColor: 'border-amber-500/30',
            title: '⭐ Rating',
            priority: 4
        }
    };

    const filterOptions = [
        { value: 'all', label: 'All Activities', icon: <Eye className="w-4 h-4" /> },
        { value: 'like', label: 'Liked Games', icon: <Heart className="w-4 h-4" /> },
        { value: 'progress', label: 'Progress Updates', icon: <Gamepad2 className="w-4 h-4" /> },
        { value: 'review', label: 'Reviews', icon: <MessageSquare className="w-4 h-4" /> },
        { value: 'rating', label: 'Ratings', icon: <Star className="w-4 h-4" /> },
        { value: 'achievement', label: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
        { value: 'plantoplay', label: 'Plan to Play', icon: <Clock className="w-4 h-4" /> }
    ];

    const timeRangeOptions = [
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' }
    ];

    // Fetch enhanced activities including ratings
    useEffect(() => {
        console.log('🔥 ActivityTab useEffect triggered with userId:', userId);
        const fetchActivities = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const token = localStorage.getItem("token");
                if (!token) {
                    setError('Authentication required');
                    return;
                }

                // 1. Fetch user activities
                let activitiesData = [];
                try {
                    const activitiesResponse = await fetch(`${API_BASE}/api/user-activity/${userId}?limit=50`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (activitiesResponse.ok) {
                        activitiesData = await activitiesResponse.json();
                        console.log('🔥 ActivityTab - Raw API data:', activitiesData);
                    } else if (activitiesResponse.status === 404) {
                        // No activities found for user - this is normal
                        activitiesData = [];
                    }
                } catch (activitiesError) {
                    // Network error or other issues - continue without activities
                    activitiesData = [];
                }

                // 2. Fetch user ratings to include in activities
                let ratingsData = [];
                try {
                    const ratingsResponse = await fetch(`${API_BASE}/api/ratings/user/${userId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (ratingsResponse.ok) {
                        ratingsData = await ratingsResponse.json();
                        console.log('🔥 Ratings data:', ratingsData);
                    } else if (ratingsResponse.status === 404) {
                        // No ratings found for user - this is normal
                        ratingsData = [];
                    }
                } catch (ratingsError) {
                    // Network error or other issues - continue without ratings
                    ratingsData = [];
                }

                // 3. Convert ratings to activity format and merge
                const ratingActivities = ratingsData.map(rating => ({
                    _id: `rating_${rating._id}`,
                    userId: rating.userId,
                    gameId: rating.gameId,
                    activityType: 'rating',
                    date: rating.createdAt || rating.updatedAt,
                    rating: rating.avarageScore,
                    scores: rating.scores,
                    reviewText: rating.reviewText,
                    gameTitle: rating.gameTitle,
                    gameCover: '', // Will be fetched if needed
                    liked: rating.liked
                }));

                // 4. Merge activities and ratings, sort by date
                const allActivities = [...activitiesData, ...ratingActivities]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 50); // Limit to 50 total

                // 5. Enrich with game data for missing titles (skip 404s silently)
                const activitiesWithGameData = [];

                for (const activity of allActivities) {
                    if (!activity.gameTitle && activity.gameId) {
                        try {
                            const gameResponse = await fetch(`${API_BASE}/api/games/${activity.gameId}`);
                            if (gameResponse.ok) {
                                const gameData = await gameResponse.json();
                                activitiesWithGameData.push({
                                    ...activity,
                                    gameTitle: gameData.title,
                                    gameCover: gameData.coverImage,
                                    gameGenres: gameData.genres,
                                    gamePlatforms: gameData.platforms
                                });
                            } else if (gameResponse.status === 404) {
                                // Game deleted - skip this activity completely
                                continue;
                            } else {
                                // Other HTTP errors - add activity with fallback title
                                activitiesWithGameData.push({
                                    ...activity,
                                    gameTitle: 'Unknown Game',
                                    gameCover: null
                                });
                            }
                        } catch (err) {
                            // Network error - add activity with fallback title
                            activitiesWithGameData.push({
                                ...activity,
                                gameTitle: 'Unknown Game',
                                gameCover: null
                            });
                        }
                    } else {
                        // Game info already exists or no gameId
                        activitiesWithGameData.push(activity);
                    }
                }

                setActivities(activitiesWithGameData);

            } catch (error) {
                console.error('Failed to fetch activities:', error);
                setError(`Failed to load activities: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [userId]);

    // Filter activities
    const filteredActivities = activities.filter(activity => {
        // Type filter
        if (filter !== 'all' && activity.activityType !== filter) {
            return false;
        }

        // Time range filter
        if (timeRange !== 'all') {
            const activityDate = new Date(activity.date);
            const now = new Date();

            switch (timeRange) {
                case 'today':
                    return activityDate.toDateString() === now.toDateString();
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return activityDate >= weekAgo;
                case 'month':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return activityDate >= monthAgo;
                default:
                    return true;
            }
        }

        return true;
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedActivities = filteredActivities.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, timeRange]);

    // Group activities by date for minimal view
    const groupActivitiesByDate = (activities) => {
        const groups = {};
        activities.forEach(activity => {
            const date = new Date(activity.date).toDateString();
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(activity);
        });
        return groups;
    };

    // Format time ago
    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));

        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    // Format date for grouping
    const formatDateGroup = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    // Get activity message
    const getActivityMessage = (activity) => {
        const gameTitle = activity.gameTitle || 'a game';
        const progress = activity.progress || 0;

        switch(activity.activityType) {
            case 'like':
                return `Liked "${gameTitle}"`;
            case 'dislike':
                return `Disliked "${gameTitle}"`;
            case 'progress':
                if (progress >= 90) return `🏆 Completed "${gameTitle}"`;
                if (progress > 0) return `🎮 ${progress}% progress in "${gameTitle}"`;
                return `🎯 Started playing "${gameTitle}"`;
            case 'plantoplay':
                return `📌 Added "${gameTitle}" to Plan to Play`;
            case 'review':
                return `✍️ Reviewed "${gameTitle}"`;
            case 'rating':
                return `⭐ Rated "${gameTitle}" ${activity.rating}/10`;
            case 'achievement':
                return `🏆 Unlocked achievement in "${gameTitle}"`;
            case 'session':
                const duration = activity.sessionDuration || 0;
                return `⏱️ Played "${gameTitle}" for ${Math.floor(duration/60)}h ${duration%60}m`;
            default:
                return `Activity in "${gameTitle}"`;
        }
    };

    // Toggle expanded view
    const toggleExpanded = (activityId, event) => {
        event.stopPropagation(); // Prevent game navigation
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(activityId)) {
            newExpanded.delete(activityId);
        } else {
            newExpanded.add(activityId);
        }
        setExpandedItems(newExpanded);
    };

    // Minimal timeline component
    const MinimalActivityItem = ({ activity, config }) => (
        <div 
            className={`timeline-item flex items-center gap-3 py-3 px-3 hover:bg-white/5 rounded-lg transition-all duration-300 cursor-pointer group ${config.color}`}
            onClick={() => {
                if (activity.gameId) {
                    window.open(`/game/${activity.gameId}`, '_blank');
                }
            }}
        >
            {/* Activity icon */}
            <div className={`w-7 h-7 flex items-center justify-center flex-shrink-0 ${config.color} bg-white/5 rounded-lg border border-white/10 group-hover:border-white/20 transition-all duration-300`}>
                {config.icon}
            </div>
            
            {/* Activity content */}
            <div className="flex-1 min-w-0 flex items-center gap-3">
                <span className="text-white/90">
                    {getActivityMessage(activity)}
                </span>
                
                {/* Rating score if it's a rating */}
                {activity.activityType === 'rating' && (
                    <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-yellow-400 text-xs font-medium">{activity.rating}/10</span>
                    </div>
                )}
                
                {/* Progress if it's progress activity */}
                {activity.activityType === 'progress' && activity.progress > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                style={{ width: `${activity.progress}%` }}
                            />
                        </div>
                        <span className="text-white/60 text-xs">{activity.progress}%</span>
                    </div>
                )}
            </div>
            
            {/* Time */}
            <div className="text-white/40 text-xs flex-shrink-0 group-hover:text-white/60 transition-colors">
                {formatTimeAgo(activity.date)}
            </div>
        </div>
    );

    // Date separator for timeline
    const DateSeparator = ({ date }) => (
        <div className="timeline-item flex items-center gap-3 py-2 px-3 my-2">
            <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-lg shadow-lg">
                <Calendar className="w-4 h-4 text-black" />
            </div>
            <div className="flex-1">
                <h3 className="text-white font-semibold text-sm">{formatDateGroup(date)}</h3>
                <div className="w-full h-px bg-gradient-to-r from-white/20 via-white/10 to-transparent mt-1"></div>
            </div>
        </div>
    );

    // Grid card component for cleaner layout
    const GridActivityCard = ({ activity, config }) => (
        <div
            className={`glass-dark rounded-xl p-4 border transition-all hover:bg-white/5 cursor-pointer ${config.borderColor} h-fit`}
            onClick={() => {
                if (activity.gameId) {
                    window.open(`/game/${activity.gameId}`, '_blank');
                }
            }}
        >
            {/* Game cover - full width at top */}
            {activity.gameCover && (
                <div className="w-full h-40 rounded-lg overflow-hidden mb-4">
                    <img
                        src={activity.gameCover}
                        alt={activity.gameTitle}
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.style.display = 'none'}
                    />
                </div>
            )}

            {/* Activity type badge */}
            <div className="flex items-center justify-center mb-3">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${config.bgColor} ${config.borderColor} border`}>
                    {config.icon}
                    <span className={config.color}>{config.title}</span>
                </div>
            </div>

            {/* Game title */}
            <h3 className="text-white font-semibold text-center mb-2 line-clamp-2">
                {activity.gameTitle || 'Unknown Game'}
            </h3>

            {/* Activity message */}
            <p className="text-white/70 text-sm text-center mb-3 line-clamp-2">
                {getActivityMessage(activity)}
            </p>

            {/* Progress bar for progress type */}
            {activity.activityType === 'progress' && activity.progress > 0 && (
                <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-white/60 text-xs">Progress</span>
                        <span className="text-white/80 text-xs font-medium">{activity.progress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                            className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${activity.progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Rating score for rating type */}
            {activity.activityType === 'rating' && (
                <div className="flex items-center justify-center gap-2 mb-3 p-2 bg-yellow-500/10 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-yellow-400 font-bold">{activity.rating}/10</span>
                </div>
            )}

            {/* Date */}
            <div className="flex items-center justify-center gap-1 text-white/50 text-xs pt-2 border-t border-white/10">
                <Calendar className="w-3 h-3" />
                <span>{formatTimeAgo(activity.date)}</span>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="glass-effect rounded-xl p-6 animate-slide-in">
                <div className="flex items-center justify-center min-h-64">
                    <Loader2 className="animate-spin w-6 h-6 text-yellow-500" />
                    <span className="ml-3 text-white">Loading activities...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-effect rounded-xl p-6 animate-slide-in">
                <div className="text-center py-12">
                    <div className="text-red-400 mb-4">❌ Error</div>
                    <p className="text-white/60">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-effect rounded-xl p-6 animate-slide-in">
            {/* Header with filters */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold text-white">Your Activity</h2>
                    <span className="text-sm text-white/50 bg-white/10 px-2 py-1 rounded-full">
                        {filteredActivities.length} activities
                        {totalPages > 1 && (
                            <span className="ml-1 text-yellow-400">• Page {currentPage}/{totalPages}</span>
                        )}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-white/10 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-colors ${
                                viewMode === 'list' 
                                    ? 'bg-yellow-500 text-black' 
                                    : 'text-white/70 hover:text-white'
                            }`}
                            title="List View"
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-colors ${
                                viewMode === 'grid' 
                                    ? 'bg-yellow-500 text-black' 
                                    : 'text-white/70 hover:text-white'
                            }`}
                            title="Grid View"
                        >
                            <Grid3X3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('minimal')}
                            className={`p-2 rounded-md transition-colors ${
                                viewMode === 'minimal' 
                                    ? 'bg-yellow-500 text-black' 
                                    : 'text-white/70 hover:text-white'
                            }`}
                            title="Minimal View"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <Filter className="w-4 h-4" />
                        <span className="text-sm">Filters</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Activity Type</label>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500/50"
                            >
                                {filterOptions.map(option => (
                                    <option key={option.value} value={option.value} className="bg-gray-800">
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Time Range</label>
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500/50"
                            >
                                {timeRangeOptions.map(option => (
                                    <option key={option.value} value={option.value} className="bg-gray-800">
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Activities list */}
            <div className={
                viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                    : viewMode === 'minimal'
                    ? 'space-y-1 timeline-container'
                    : 'space-y-4'
            }>
                {paginatedActivities.length > 0 ? (
                    paginatedActivities.map((activity) => {
                        const config = activityConfig[activity.activityType];
                        if (!config) return null;

                        // Use appropriate layout based on view mode
                        if (viewMode === 'grid') {
                            return (
                                <GridActivityCard 
                                    key={activity._id} 
                                    activity={activity} 
                                    config={config} 
                                />
                            );
                        }

                        if (viewMode === 'minimal') {
                            // Check if this is the first activity of a new day
                            const currentDate = new Date(activity.date).toDateString();
                            const previousActivity = paginatedActivities[paginatedActivities.indexOf(activity) - 1];
                            const previousDate = previousActivity ? new Date(previousActivity.date).toDateString() : null;
                            const isNewDay = currentDate !== previousDate;

                            return (
                                <React.Fragment key={activity._id}>
                                    {isNewDay && (
                                        <DateSeparator date={activity.date} />
                                    )}
                                    <MinimalActivityItem 
                                        activity={activity} 
                                        config={config} 
                                    />
                                </React.Fragment>
                            );
                        }

                        const isExpanded = expandedItems.has(activity._id);

                        return (
                            <div
                                key={activity._id}
                                className={`glass-dark rounded-lg p-4 border transition-all hover:bg-white/5 cursor-pointer ${config.borderColor}`}
                                onClick={() => {
                                    if (activity.gameId) {
                                        window.open(`/game/${activity.gameId}`, '_blank');
                                    }
                                }}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Game cover */}
                                    {activity.gameCover && (
                                        <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={activity.gameCover}
                                                alt={activity.gameTitle}
                                                className="w-full h-full object-cover"
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className={`font-medium ${config.color}`}>
                                                {config.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-white/50 text-sm">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatTimeAgo(activity.date)}</span>
                                            </div>
                                        </div>

                                        <p className="text-white text-sm mb-2">
                                            {getActivityMessage(activity)}
                                        </p>

                                        {/* Progress bar for progress activities */}
                                        {activity.activityType === 'progress' && activity.progress > 0 && (
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="flex-1 bg-white/20 rounded-full h-2">
                                                    <div
                                                        className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                                                        style={{ width: `${activity.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-white/70 text-sm font-medium">
                                                    {activity.progress}%
                                                </span>
                                            </div>
                                        )}

                                        {/* Review content preview */}
                                        {activity.activityType === 'review' && (activity.reviewText || activity.comment) && (
                                            <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10">
                                                <p className="text-white/80 text-sm italic">
                                                    "{(activity.reviewText || activity.comment).length > 100
                                                    ? (activity.reviewText || activity.comment).substring(0, 100) + '...'
                                                    : (activity.reviewText || activity.comment)}"
                                                </p>
                                                {activity.rating && (
                                                    <div className="flex items-center gap-1 mt-2">
                                                        <Star className="w-4 h-4 text-yellow-400" />
                                                        <span className="text-yellow-400 font-medium">
                                                            {activity.rating}/10
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="text-xs text-white/40 mt-1">
                                                    Review written on {new Date(activity.date).toLocaleDateString()}
                                                </div>
                                            </div>
                                        )}

                                        {/* Rating display */}
                                        {activity.activityType === 'rating' && (
                                            <div className="mt-2 p-4 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-lg border border-yellow-500/20">
                                                {/* Header with overall rating */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                                                            <Sparkles className="w-5 h-5 text-yellow-400" />
                                                        </div>
                                                        <span className="text-white font-semibold">Rating</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-2 rounded-lg">
                                                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                                        <span className="text-yellow-400 font-bold text-xl">
                                                            {activity.rating}
                                                        </span>
                                                        <span className="text-yellow-400/70 font-medium">/10</span>
                                                    </div>
                                                </div>

                                                {/* Detailed scores grid */}
                                                {activity.scores && Object.keys(activity.scores).some(key => activity.scores[key] > 0) && (
                                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                                        {Object.entries(activity.scores).map(([key, value]) => (
                                                            value > 0 && (
                                                                <div key={key} className="bg-white/5 rounded-lg p-2">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-white/80 text-sm capitalize font-medium">{key}</span>
                                                                        <div className="flex items-center gap-1">
                                                                            <div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden">
                                                                                <div 
                                                                                    className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full transition-all duration-500"
                                                                                    style={{ width: `${(value / 10) * 100}%` }}
                                                                                />
                                                                            </div>
                                                                            <span className="text-yellow-400 text-sm font-semibold min-w-[2rem]">{value}/10</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Review text if exists */}
                                                {activity.reviewText && (
                                                    <div className="bg-white/5 rounded-lg p-3 border-l-2 border-yellow-500/50 mb-3">
                                                        <p className="text-white/90 text-sm leading-relaxed">
                                                            "{activity.reviewText.length > 120
                                                            ? activity.reviewText.substring(0, 120) + '...'
                                                            : activity.reviewText}"
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Like indicator */}
                                                {activity.liked !== null && (
                                                    <div className="flex items-center justify-center gap-2 pt-2 border-t border-white/10">
                                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                                                            activity.liked 
                                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                        }`}>
                                                            {activity.liked ? (
                                                                <>
                                                                    <ThumbsUp className="w-4 h-4" />
                                                                    <span>Recommended</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ThumbsUp className="w-4 h-4 rotate-180" />
                                                                    <span>Not Recommended</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}


                                        {/* Expandable details */}
                                        {(activity.achievements?.length > 0 || activity.sessionDuration > 0) && (
                                            <button
                                                onClick={(e) => toggleExpanded(activity._id, e)}
                                                className="mt-2 text-white/50 hover:text-white/80 text-sm flex items-center gap-1 transition-colors"
                                            >
                                                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                {isExpanded ? 'Less details' : 'More details'}
                                            </button>
                                        )}

                                        {/* Expanded content */}
                                        {isExpanded && (
                                            <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10 space-y-2">
                                                {activity.sessionDuration > 0 && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <PlayCircle className="w-4 h-4 text-cyan-400" />
                                                        <span className="text-white/70">
                                                            Session: {Math.floor(activity.sessionDuration/60)}h {activity.sessionDuration%60}m
                                                        </span>
                                                    </div>
                                                )}

                                                {activity.achievements?.length > 0 && (
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Trophy className="w-4 h-4 text-yellow-400" />
                                                            <span className="text-white/70">Achievements:</span>
                                                        </div>
                                                        {activity.achievements.map((achievement, idx) => (
                                                            <div key={idx} className="ml-6 text-sm text-white/60">
                                                                • {achievement.name || achievement}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-12">
                        <Eye className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <p className="text-white/60">No activities found</p>
                        <p className="text-white/40 text-sm mt-1">
                            {filter !== 'all' || timeRange !== 'all'
                                ? 'Try adjusting your filters or start gaming to see activity here.'
                                : 'Start liking games, updating progress, or writing reviews to see activity here.'
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                            currentPage === 1 
                                ? 'bg-white/5 text-white/30 cursor-not-allowed' 
                                : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                    >
                        ←
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                            // Show first page, last page, current page and pages around current
                            const showPage = page === 1 || page === totalPages || 
                                           (page >= currentPage - 1 && page <= currentPage + 1);
                            
                            if (!showPage) {
                                if (page === currentPage - 2 || page === currentPage + 2) {
                                    return <span key={page} className="text-white/30 px-2">...</span>;
                                }
                                return null;
                            }

                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                                        currentPage === page
                                            ? 'bg-yellow-500 text-black font-medium'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                            currentPage === totalPages 
                                ? 'bg-white/5 text-white/30 cursor-not-allowed' 
                                : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                    >
                        →
                    </button>

                    <div className="ml-4 text-sm text-white/50">
                        Page {currentPage} of {totalPages} • {filteredActivities.length} total activities
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityTab;