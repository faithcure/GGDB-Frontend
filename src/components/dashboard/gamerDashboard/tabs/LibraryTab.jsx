import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../../../config/api";
import {
    FaSearch,
    FaFilter,
    FaSort,
    FaHeart,
    FaHeartBroken,
    FaClock,
    FaCheckCircle,
    FaPlayCircle,
    FaGamepad,
    FaStar,
    FaCalendarAlt,
    FaTrophy,
    FaDownload,
    FaSpinner,
    FaEye,
    FaThumbsUp,
    FaThumbsDown
} from "react-icons/fa";

const LibraryTab = ({ userId }) => {
    const navigate = useNavigate();

    // State management
    const [activeCollection, setActiveCollection] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('recent');
    const [userLibrary, setUserLibrary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [stats, setStats] = useState({
        totalGames: 0,
        totalPlaytime: 0,
        avgRating: 0,
        thisMonth: 0
    });


    // Fetch user's complete library with game details and user activities
    useEffect(() => {
        const fetchUserLibrary = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                // 1. Fetch all user activities using the correct endpoint
                let activities = [];
                try {
                    const activitiesResponse = await fetch(`${API_BASE}/api/user-activity/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (activitiesResponse.ok) {
                        activities = await activitiesResponse.json();
                    } else if (activitiesResponse.status === 404) {
                        // No activities found for user - this is normal
                        activities = [];
                    }
                } catch (activitiesError) {
                    // Network error or other issues - continue without activities
                    activities = [];
                }
                console.log('📊 User activities:', activities);

                // 2. Get unique game IDs from activities
                const gameIds = [...new Set(activities.map(act => act.gameId))];
                console.log('🎮 Unique game IDs:', gameIds);

                if (gameIds.length === 0) {
                    setUserLibrary([]);
                    calculateStats([]);
                    return;
                }

                // 3. Fetch game details for all games user has interacted with
                const gamesResponse = await fetch(`${API_BASE}/api/games`);
                const gamesData = await gamesResponse.json();
                const allGames = gamesData?.data || gamesData;

                // Filter games to only those the user has interacted with
                const userGames = allGames.filter(game => gameIds.includes(game._id));
                console.log('🎮 User games found:', userGames.length);

                // 4. Merge activities with game data
                const enrichedLibrary = userGames.map(game => {
                    // Find user's activities for this game
                    const gameActivities = activities.filter(act => act.gameId === game._id);

                    // Determine game status based on activities
                    const liked = gameActivities.some(act => act.activityType === 'like');
                    const loved = gameActivities.some(act => act.activityType === 'loved');
                    const disliked = gameActivities.some(act => act.activityType === 'dislike');
                    const planToPlay = gameActivities.some(act => act.activityType === 'plantoplay');
                    const progressActivities = gameActivities.filter(act => act.activityType === 'progress');
                    const latestProgress = progressActivities.length > 0
                        ? Math.max(...progressActivities.map(act => act.progress || 0))
                        : 0;

                    let status = 'unknown';
                    if (loved) status = 'loved';
                    else if (liked) status = 'liked';
                    else if (disliked) status = 'disliked';
                    else if (planToPlay) status = 'plantoplay';
                    else if (latestProgress > 0) {
                        status = latestProgress >= 100 ? 'finished' : 'playing';
                    }

                    // Calculate estimated playtime from progress updates
                    const estimatedPlaytime = progressActivities.length > 0
                        ? Math.round(progressActivities.length * 2.5) // Rough estimate
                        : 0;

                    // Get most recent activity date
                    const activityDates = gameActivities.map(act => new Date(act.date));
                    const lastActivity = activityDates.length > 0 ? Math.max(...activityDates) : null;

                    return {
                        id: game._id,
                        title: game.title,
                        image: game.coverImage || game.gallery?.[0]?.url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=400&fit=crop',
                        platform: game.platforms?.[0] || 'PC',
                        genre: game.genres?.[0] || 'Unknown',
                        year: game.releaseDate ? new Date(game.releaseDate).getFullYear() : 2023,
                        rating: game.ggdbRating || 0,
                        metacriticScore: game.metacriticScore || 0,
                        playtime: estimatedPlaytime,
                        progress: latestProgress,
                        status: status,
                        lastPlayed: lastActivity ? formatLastPlayed(new Date(lastActivity)) : 'Never',
                        addedAt: gameActivities.length > 0
                            ? Math.min(...gameActivities.map(act => new Date(act.date)))
                            : new Date(),
                        // Game metadata
                        summary: game.summary,
                        developer: game.developer,
                        publisher: game.publisher,
                        // Activity counts
                        activityCount: gameActivities.length
                    };
                });

                console.log('📚 Enriched library:', enrichedLibrary);
                setUserLibrary(enrichedLibrary);
                calculateStats(enrichedLibrary);

            } catch (error) {
                console.error('❌ Failed to fetch user library:', error);
                setUserLibrary([]);
                calculateStats([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUserLibrary();
    }, [userId]);

    // Calculate library statistics
    const calculateStats = (library) => {
        const totalGames = library.length;
        const totalPlaytime = library.reduce((sum, game) => sum + (game.playtime || 0), 0);
        const gamesWithRating = library.filter(game => game.rating > 0);
        const avgRating = gamesWithRating.length > 0
            ? gamesWithRating.reduce((sum, game) => sum + game.rating, 0) / gamesWithRating.length
            : 0;

        // Calculate games added this month
        const thisMonth = library.filter(game => {
            if (!game.addedAt) return false;
            const addedDate = new Date(game.addedAt);
            const now = new Date();
            return addedDate.getMonth() === now.getMonth() && addedDate.getFullYear() === now.getFullYear();
        }).length;

        setStats({
            totalGames,
            totalPlaytime,
            avgRating: Math.round(avgRating * 10) / 10,
            thisMonth
        });
    };

    // Format last played date
    const formatLastPlayed = (date) => {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    // Collection counts (memoized for performance)
    const collections = useMemo(() => {
        const counts = userLibrary.reduce((acc, game) => {
            acc[game.status] = (acc[game.status] || 0) + 1;
            return acc;
        }, {});

        return [
            { key: 'all', label: 'All Games', icon: <FaGamepad />, count: userLibrary.length },
            { key: 'liked', label: 'Liked', icon: <FaThumbsUp />, count: counts.liked || 0 },
            { key: 'loved', label: 'Loved', icon: <div className="relative w-4 h-4 flex items-center justify-center"><FaThumbsUp className="absolute transform -translate-x-0.5 -translate-y-0.5" size={12} style={{filter: 'drop-shadow(1px 1px 0px rgba(0,0,0,0.6))'}} /><FaThumbsUp className="absolute transform translate-x-0.5 translate-y-0.5" size={12} style={{filter: 'drop-shadow(-1px -1px 0px rgba(0,0,0,0.6))'}} /></div>, count: counts.loved || 0 },
            { key: 'disliked', label: 'Disliked', icon: <FaThumbsDown />, count: counts.disliked || 0 },
            { key: 'plantoplay', label: 'Plan to Play', icon: <FaClock />, count: counts.plantoplay || 0 },
            { key: 'finished', label: 'Finished', icon: <FaCheckCircle />, count: counts.finished || 0 },
            { key: 'playing', label: 'Currently Playing', icon: <FaPlayCircle />, count: counts.playing || 0 }
        ];
    }, [userLibrary]);

    const sortOptions = [
        { key: 'recent', label: 'Recently Played' },
        { key: 'name', label: 'Name A-Z' },
        { key: 'rating', label: 'Game Rating' },
        { key: 'playtime', label: 'Playtime' },
        { key: 'added', label: 'Date Added' }
    ];

    // Filtered and sorted games
    const filteredAndSortedGames = useMemo(() => {
        let filtered = userLibrary.filter(game => {
            const matchesCollection = activeCollection === 'all' || game.status === activeCollection;
            const matchesSearch = game.title?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCollection && matchesSearch;
        });

        // Sort games
        return filtered.sort((a, b) => {
            switch(sortBy) {
                case 'name':
                    return (a.title || '').localeCompare(b.title || '');
                case 'rating':
                    return (b.rating || 0) - (a.rating || 0);
                case 'playtime':
                    return (b.playtime || 0) - (a.playtime || 0);
                case 'added':
                    return new Date(b.addedAt || 0) - new Date(a.addedAt || 0);
                case 'recent':
                default:
                    return new Date(b.lastPlayed || 0) - new Date(a.lastPlayed || 0);
            }
        });
    }, [userLibrary, activeCollection, searchTerm, sortBy]);

    // Update game progress
    const updateGameProgress = async (gameId, progress) => {
        setUpdating(gameId);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE}/api/user-activity/progress`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ gameId, progress })
            });

            if (response.ok) {
                // Determine status based on progress
                const newStatus = progress >= 100 ? 'finished' : 'playing';

                // Update local state
                setUserLibrary(prev => prev.map(game =>
                    game.id === gameId ? { ...game, progress, status: newStatus } : game
                ));
            }
        } catch (error) {
            console.error('Failed to update progress:', error);
        } finally {
            setUpdating(null);
        }
    };

    // Update game status using existing endpoints
    const updateGameStatus = async (gameId, newStatus) => {
        setUpdating(gameId);
        try {
            const token = localStorage.getItem("token");
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            // Remove old status first (if exists)
            const oldGame = userLibrary.find(g => g.id === gameId);

            // Add new status based on selection
            let response;
            switch(newStatus) {
                case 'liked':
                    response = await fetch(`${API_BASE}/api/user-activity/like`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({ gameId })
                    });
                    break;
                case 'loved':
                    response = await fetch(`${API_BASE}/api/user-activity/loved`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({ gameId })
                    });
                    break;
                case 'disliked':
                    response = await fetch(`${API_BASE}/api/user-activity/dislike`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({ gameId })
                    });
                    break;
                case 'plantoplay':
                    response = await fetch(`${API_BASE}/api/user-activity/plantoplay`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({ gameId })
                    });
                    break;
                case 'finished':
                    response = await fetch(`${API_BASE}/api/user-activity/progress`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({ gameId, progress: 100 })
                    });
                    break;
                case 'playing':
                    response = await fetch(`${API_BASE}/api/user-activity/progress`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({ gameId, progress: 50 })
                    });
                    break;
                default:
                    // Remove all statuses for 'unknown'
                    break;
            }

            if (response && response.ok) {
                // Update local state
                setUserLibrary(prev => prev.map(game =>
                    game.id === gameId ? { ...game, status: newStatus } : game
                ));
            }
        } catch (error) {
            console.error('Failed to update game status:', error);
        } finally {
            setUpdating(null);
        }
    };

    // Navigate to game page
    const goToGame = (gameId) => {
        navigate(`/game/${gameId}`);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'liked': return 'text-red-400';
            case 'loved': return 'text-yellow-400';
            case 'disliked': return 'text-blue-400';
            case 'plantoplay': return 'text-purple-400';
            case 'finished': return 'text-green-400';
            case 'playing': return 'text-cyan-400';
            default: return 'text-white/60';
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'liked': return <FaThumbsUp />;
            case 'loved': return (
                <div className="relative w-4 h-4 flex items-center justify-center">
                    <FaThumbsUp className="absolute transform -translate-x-0.5 -translate-y-0.5" size={12} style={{filter: 'drop-shadow(1px 1px 0px rgba(0,0,0,0.6))'}} />
                    <FaThumbsUp className="absolute transform translate-x-0.5 translate-y-0.5" size={12} style={{filter: 'drop-shadow(-1px -1px 0px rgba(0,0,0,0.6))'}} />
                </div>
            );
            case 'disliked': return <FaThumbsDown />;
            case 'plantoplay': return <FaClock />;
            case 'finished': return <FaCheckCircle />;
            case 'playing': return <FaPlayCircle />;
            default: return <FaGamepad />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <FaSpinner className="animate-spin text-4xl text-yellow-500" />
                <span className="ml-3 text-white">Loading your library...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-slide-in">
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-white">My Game Library</h2>

                {/* Search and Controls */}
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="flex items-center gap-2 glass-dark rounded-lg px-4 py-2 flex-1 lg:flex-none lg:w-80">
                        <FaSearch className="text-white/40" />
                        <input
                            type="text"
                            placeholder="Search your library..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="text-sm outline-none bg-transparent text-white placeholder-white/40 flex-1"
                        />
                    </div>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="text-sm text-white/60 hover:text-white transition-colors px-3 py-2 rounded-lg bg-transparent border border-white/20"
                    >
                        {sortOptions.map(option => (
                            <option key={option.key} value={option.key} className="bg-gray-800 text-white">
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Collections Filter */}
            <div className="flex flex-wrap gap-3">
                {collections.map((collection) => (
                    <button
                        key={collection.key}
                        onClick={() => setActiveCollection(collection.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            activeCollection === collection.key
                                ? 'bg-yellow-500 text-black'
                                : 'glass-dark text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        {collection.icon}
                        <span>{collection.label}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                            activeCollection === collection.key ? 'bg-black/20' : 'bg-white/20'
                        }`}>
              {collection.count}
            </span>
                    </button>
                ))}
            </div>

            {/* Library Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Games", value: stats.totalGames.toString(), icon: <FaGamepad />, color: "from-blue-500 to-blue-600" },
                    { label: "Est. Playtime", value: `${stats.totalPlaytime}h`, icon: <FaClock />, color: "from-green-500 to-green-600" },
                    { label: "Avg. Rating", value: `${stats.avgRating}/10`, icon: <FaStar />, color: "from-yellow-500 to-yellow-600" },
                    { label: "This Month", value: `+${stats.thisMonth}`, icon: <FaCalendarAlt />, color: "from-purple-500 to-purple-600" }
                ].map((stat, i) => (
                    <div key={i} className="glass-effect rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-white`}>
                                {stat.icon}
                            </div>
                            <div>
                                <div className="text-lg font-bold text-white">{stat.value}</div>
                                <div className="text-xs text-white/60">{stat.label}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Games Grid */}
            <div className="glass-effect rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">
                        {collections.find(c => c.key === activeCollection)?.label || 'Games'}
                        <span className="text-white/60 ml-2">({filteredAndSortedGames.length})</span>
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredAndSortedGames.map((game) => (
                        <div key={game.id} className="group relative">
                            <div className="glass-dark rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 h-full flex flex-col">
                                {/* Game Cover */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={game.image}
                                        alt={game.title}
                                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                                        onClick={() => goToGame(game.id)}
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=400&fit=crop';
                                        }}
                                    />

                                    {/* Status Badge */}
                                    <div className={`absolute top-3 right-3 p-2 rounded-lg bg-black/50 backdrop-blur-sm ${getStatusColor(game.status)}`}>
                                        {getStatusIcon(game.status)}
                                    </div>

                                    {/* Progress Bar - Always Visible */}
                                    {game.progress >= 0 && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2">
                                            <div className="flex items-center justify-between text-xs text-white mb-1">
                                                <span>Progress</span>
                                                <span>{game.progress}%</span>
                                            </div>
                                            <div className="w-full bg-white/20 rounded-full h-1">
                                                <div
                                                    className="h-1 bg-yellow-500 rounded-full transition-all duration-500"
                                                    style={{ width: `${game.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Activity Count */}
                                    {game.activityCount > 0 && (
                                        <div className="absolute top-3 left-3 flex items-center gap-1 text-xs bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-white">
                                            <FaEye className="text-blue-400" />
                                            <span>{game.activityCount}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Game Info */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between mb-2">
                                        <h4
                                            className="font-semibold text-white text-sm group-hover:text-yellow-400 transition-colors cursor-pointer"
                                            onClick={() => goToGame(game.id)}
                                        >
                                            {game.title}
                                        </h4>
                                        <div className="flex items-center gap-1">
                                            {game.rating > 0 && (
                                                <div className="flex items-center gap-1 text-xs">
                                                    <FaStar className="text-yellow-500" />
                                                    <span className="text-white/60">{game.rating}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1 text-xs text-white/50">
                                        {/* Developer/Publisher */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/60">Developer:</span>
                                            <span className="text-white/80 truncate ml-1">{game.developer || game.publisher || 'Unknown'}</span>
                                        </div>

                                        {/* GGDB Rating */}
                                        {game.rating > 0 && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-white/60">GGDB:</span>
                                                <div className="flex items-center gap-1">
                                                    <FaStar className="text-yellow-500" />
                                                    <span className="text-white/80">{game.rating}/10</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Metacritic Score (if available) */}
                                        {game.metacriticScore > 0 && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-white/60">Metacritic:</span>
                                                <span className={`text-white/80 ${game.metacriticScore >= 75 ? 'text-green-400' : game.metacriticScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {game.metacriticScore}/100
                        </span>
                                            </div>
                                        )}

                                        {/* User Status */}
                                        <div className="pt-1 border-t border-white/10">
                                            <div className="flex items-center justify-between">
                                                <span className="text-white/60">Status:</span>
                                                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(game.status)} bg-black/20`}>
                          {game.status === 'liked' ? 'Liked' :
                              game.status === 'loved' ? 'Loved' :
                                  game.status === 'disliked' ? 'Disliked' :
                                      game.status === 'plantoplay' ? 'Plan to Play' :
                                          game.status === 'playing' ? 'Playing' :
                                              game.status === 'finished' ? 'Finished' : 'No Status'}
                        </span>
                                            </div>

                                            {/* Progress for Playing/Finished games */}
                                            {(game.status === 'playing' || game.status === 'finished') && game.progress > 0 && (
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-white/60">Progress:</span>
                                                    <span className="text-white/80">{game.progress}%</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Interactive Status Controls */}
                                    <div className="flex items-center gap-2 mt-auto pt-3">
                                        <button
                                            onClick={() => goToGame(game.id)}
                                            className="flex-1 py-1 px-2 bg-yellow-500 text-black rounded text-xs font-medium hover:bg-yellow-600 transition-colors"
                                        >
                                            Go to Game
                                        </button>
                                    </div>

                                    {/* Status Update Controls */}
                                    <div className="flex items-center justify-between gap-2 mt-2">
                                        {/* Like/Loved/Dislike/Plan to Play Buttons */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateGameStatus(game.id, game.status === 'liked' ? 'unknown' : 'liked')}
                                                disabled={updating === game.id}
                                                className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium border transition-all ${
                                                    game.status === 'liked'
                                                        ? 'bg-red-500/20 text-red-400 border-red-400/50 shadow-lg shadow-red-500/20'
                                                        : 'bg-gray-800/50 text-gray-400 border-gray-600/50 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                                                }`}
                                            >
                                                <FaThumbsUp className="w-3 h-3" />
                                            </button>

                                            <button
                                                onClick={() => updateGameStatus(game.id, game.status === 'loved' ? 'unknown' : 'loved')}
                                                disabled={updating === game.id}
                                                className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium border transition-all ${
                                                    game.status === 'loved'
                                                        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-400/50 shadow-lg shadow-yellow-500/20'
                                                        : 'bg-gray-800/50 text-gray-400 border-gray-600/50 hover:bg-yellow-500/10 hover:text-yellow-400 hover:border-yellow-500/30'
                                                }`}
                                            >
                                                <div className="relative w-3 h-3 flex items-center justify-center">
                                                    <FaThumbsUp className="absolute transform -translate-x-0.5 -translate-y-0.5" size={8} style={{filter: 'drop-shadow(0.5px 0.5px 0px rgba(0,0,0,0.8))'}} />
                                                    <FaThumbsUp className="absolute transform translate-x-0.5 translate-y-0.5" size={8} style={{filter: 'drop-shadow(-0.5px -0.5px 0px rgba(0,0,0,0.8))'}} />
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => updateGameStatus(game.id, game.status === 'disliked' ? 'unknown' : 'disliked')}
                                                disabled={updating === game.id}
                                                className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium border transition-all ${
                                                    game.status === 'disliked'
                                                        ? 'bg-blue-500/20 text-blue-400 border-blue-400/50 shadow-lg shadow-blue-500/20'
                                                        : 'bg-gray-800/50 text-gray-400 border-gray-600/50 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30'
                                                }`}
                                            >
                                                <FaThumbsDown className="w-3 h-3" />
                                            </button>

                                            <button
                                                onClick={() => updateGameStatus(game.id, game.status === 'plantoplay' ? 'unknown' : 'plantoplay')}
                                                disabled={updating === game.id}
                                                className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium border transition-all ${
                                                    game.status === 'plantoplay'
                                                        ? 'bg-purple-500/20 text-purple-400 border-purple-400/50 shadow-lg shadow-purple-500/20'
                                                        : 'bg-gray-800/50 text-gray-400 border-gray-600/50 hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-500/30'
                                                }`}
                                            >
                                                <FaClock className="w-3 h-3" />
                                            </button>
                                        </div>

                                        {/* Progress Control or Play Button */}
                                        <div className="flex-1 ml-2">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={game.progress}
                                                    onChange={(e) => updateGameProgress(game.id, parseInt(e.target.value))}
                                                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                                    style={{
                                                        background: `linear-gradient(to right, #eab308 ${game.progress}%, #374151 ${game.progress}%)`
                                                    }}
                                                />
                                                <span className="text-xs text-white/60 w-10 text-right font-mono">{game.progress}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Update Loading */}
                                    {updating === game.id && (
                                        <div className="flex items-center justify-center mt-2">
                                            <FaSpinner className="animate-spin text-yellow-500 text-xs" />
                                            <span className="ml-1 text-xs text-white/60">Updating...</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredAndSortedGames.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <FaGamepad className="text-4xl text-white/20 mx-auto mb-4" />
                        <p className="text-white/60">
                            {userLibrary.length === 0
                                ? "Your library is empty. Start exploring games to build your collection!"
                                : "No games found matching your criteria"
                            }
                        </p>
                        <p className="text-white/40 text-sm mt-1">
                            {userLibrary.length === 0
                                ? "Like, dislike, or add games to your plan to play list to see them here."
                                : "Try adjusting your search or filters"
                            }
                        </p>
                        <div className="mt-4">
                            <button
                                onClick={() => navigate('/')}
                                className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors"
                            >
                                Explore Games
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LibraryTab;