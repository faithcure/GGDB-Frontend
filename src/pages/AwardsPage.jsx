import React, { useState, useEffect } from 'react';
import {
    FaTrophy,
    FaStar,
    FaFilter,
    FaSort,
    FaCalendar,
    FaMedal,
    FaCrown,
    FaAward,
    FaGlobe,
    FaSearch,
    FaChevronDown,
    FaGamepad
} from 'react-icons/fa';

const AwardsPage = () => {
    const [games, setGames] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
    const [awards, setAwards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('recent');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterYear, setFilterYear] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedTab, setSelectedTab] = useState('overview');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // Mock award categories for better display
    const awardCategories = [
        { id: 'goty', name: 'Game of the Year', icon: '🏆', color: 'from-yellow-400 to-orange-500' },
        { id: 'best-narrative', name: 'Best Narrative', icon: '📖', color: 'from-purple-400 to-pink-500' },
        { id: 'best-art', name: 'Best Art Direction', icon: '🎨', color: 'from-blue-400 to-cyan-500' },
        { id: 'best-audio', name: 'Best Audio', icon: '🎵', color: 'from-green-400 to-emerald-500' },
        { id: 'best-indie', name: 'Best Indie Game', icon: '💎', color: 'from-indigo-400 to-purple-500' },
        { id: 'innovation', name: 'Innovation Award', icon: '🚀', color: 'from-red-400 to-pink-500' },
        { id: 'peoples-choice', name: "People's Choice", icon: '👥', color: 'from-teal-400 to-blue-500' }
    ];

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

    // Fetch games with awards
    useEffect(() => {
        const fetchAwardsData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${API_URL}/api/games`);
                if (!response.ok) {
                    throw new Error('Failed to fetch games');
                }

                const data = await response.json();
                const gamesArray = Array.isArray(data) ? data : [];

                // Filter games that have awards
                const gamesWithAwards = gamesArray.filter(game =>
                    game.awards && game.awards.length > 0
                );

                // Flatten all awards with game info
                const allAwards = [];
                gamesWithAwards.forEach(game => {
                    game.awards.forEach(award => {
                        allAwards.push({
                            ...award,
                            gameId: game._id,
                            gameTitle: game.title,
                            gameCover: game.coverImage,
                            gameRating: game.ggdbRating,
                            gameStudio: game.studio || game.developer
                        });
                    });
                });

                setGames(gamesWithAwards);
                setAwards(allAwards);
                setFilteredGames(gamesWithAwards);

            } catch (err) {
                console.error('Error fetching awards data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAwardsData();
    }, [API_URL]);

    // Filter and sort logic
    useEffect(() => {
        let filtered = [...games];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(game =>
                game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (game.studio && game.studio.toLowerCase().includes(searchTerm.toLowerCase())) ||
                game.awards.some(award => award.title && award.title.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Category filter
        if (filterCategory !== 'all') {
            filtered = filtered.filter(game =>
                game.awards.some(award =>
                    award.category && award.category.toLowerCase().includes(filterCategory.toLowerCase())
                )
            );
        }

        // Year filter
        if (filterYear !== 'all') {
            const year = parseInt(filterYear);
            filtered = filtered.filter(game =>
                game.awards.some(award =>
                    award.date && award.date.includes(year.toString())
                )
            );
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'recent':
                    const latestA = Math.max(...a.awards.map(award => new Date(award.date || '2020').getFullYear()));
                    const latestB = Math.max(...b.awards.map(award => new Date(award.date || '2020').getFullYear()));
                    return latestB - latestA;
                case 'rating':
                    return (b.ggdbRating || 0) - (a.ggdbRating || 0);
                case 'awards':
                    return (b.awards?.length || 0) - (a.awards?.length || 0);
                case 'alphabetical':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

        setFilteredGames(filtered);
    }, [games, searchTerm, filterCategory, filterYear, sortBy]);

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const getAwardIcon = (category) => {
        const cat = awardCategories.find(c =>
            category && category.toLowerCase().includes(c.id.toLowerCase())
        );
        return cat ? cat.icon : '🏆';
    };

    const getAwardColor = (category) => {
        const cat = awardCategories.find(c =>
            category && category.toLowerCase().includes(c.id.toLowerCase())
        );
        return cat ? cat.color : 'from-yellow-400 to-orange-500';
    };

    const AwardCard = ({ game }) => (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="relative">
                <img
                    src={game.coverImage || 'https://placehold.co/400x600/2a2a2a/ffffff?text=No+Image'}
                    alt={game.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Award Count Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full font-bold text-sm">
                    {game.awards.length} {game.awards.length === 1 ? 'Award' : 'Awards'}
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                    {game.title}
                </h3>

                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <span>{game.studio || 'Unknown Studio'}</span>
                    {game.ggdbRating && (
                        <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                                <FaStar className="text-yellow-400 text-xs" />
                                <span>{parseFloat(game.ggdbRating).toFixed(1)}</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Awards List */}
                <div className="space-y-2">
                    {game.awards.slice(0, 3).map((award, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 bg-gray-800/50 rounded-lg">
                            <span className="text-lg">{getAwardIcon(award.category)}</span>
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-white text-sm">{award.title}</div>
                                <div className="text-xs text-gray-400">
                                    {award.category && <span>{award.category}</span>}
                                    {award.date && award.category && <span> • </span>}
                                    {award.date && <span>{award.date}</span>}
                                </div>
                            </div>
                        </div>
                    ))}

                    {game.awards.length > 3 && (
                        <div className="text-center pt-2">
              <span className="text-yellow-400 text-sm font-medium">
                +{game.awards.length - 3} more awards
              </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const StatsCard = ({ icon, label, value, color = "from-blue-500 to-cyan-500" }) => (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center mb-4`}>
                {icon}
            </div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-gray-400 text-sm">{label}</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative max-w-7xl mx-auto px-6 py-16">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <FaTrophy className="text-5xl text-yellow-300" />
                            <h1 className="text-6xl font-black">Gaming Awards</h1>
                        </div>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Celebrating excellence in gaming. Discover award-winning titles that have shaped the industry.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
                            <StatsCard
                                icon={<FaTrophy className="text-xl text-white" />}
                                label="Total Awards"
                                value={awards.length}
                                color="from-yellow-400 to-orange-500"
                            />
                            <StatsCard
                                icon={<FaGamepad className="text-xl text-white" />}
                                label="Award-Winning Games"
                                value={filteredGames.length}
                                color="from-purple-500 to-pink-500"
                            />
                            <StatsCard
                                icon={<FaStar className="text-xl text-white" />}
                                label="Categories"
                                value={awardCategories.length}
                                color="from-green-500 to-emerald-500"
                            />
                            <StatsCard
                                icon={<FaCalendar className="text-xl text-white" />}
                                label="Years Covered"
                                value={years.length}
                                color="from-blue-500 to-cyan-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex space-x-8">
                        {[
                            { id: 'overview', label: 'All Awards', icon: <FaTrophy /> },
                            { id: 'categories', label: 'Categories', icon: <FaAward /> },
                            { id: 'timeline', label: 'Timeline', icon: <FaCalendar /> }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setSelectedTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                                    selectedTab === tab.id
                                        ? 'border-yellow-400 text-yellow-400'
                                        : 'border-transparent text-gray-400 hover:text-white'
                                }`}
                            >
                                {tab.icon}
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-900/30 backdrop-blur-sm border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search games, studios, or awards..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
                            />
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-4">
                            {/* Sort */}
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white appearance-none cursor-pointer focus:border-yellow-400 focus:outline-none"
                                >
                                    <option value="recent">Most Recent</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="awards">Most Awards</option>
                                    <option value="alphabetical">A-Z</option>
                                </select>
                                <FaSort className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                                    showFilters
                                        ? 'bg-yellow-600 border-yellow-500 text-white'
                                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-yellow-400'
                                }`}
                            >
                                <FaFilter />
                                <span>Filters</span>
                                <FaChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                    <select
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-yellow-400 focus:outline-none"
                                    >
                                        <option value="all">All Categories</option>
                                        {awardCategories.map(category => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                                    <select
                                        value={filterYear}
                                        onChange={(e) => setFilterYear(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-yellow-400 focus:outline-none"
                                    >
                                        <option value="all">All Years</option>
                                        {years.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-gray-900/50 rounded-xl overflow-hidden animate-pulse">
                                <div className="h-48 bg-gray-800" />
                                <div className="p-6">
                                    <div className="h-6 bg-gray-800 rounded mb-2" />
                                    <div className="h-4 bg-gray-800 rounded mb-4 w-2/3" />
                                    <div className="space-y-2">
                                        <div className="h-8 bg-gray-800 rounded" />
                                        <div className="h-8 bg-gray-800 rounded" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h3 className="text-2xl font-bold text-white mb-2">Error Loading Awards</h3>
                        <p className="text-gray-400 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredGames.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🏆</div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Awards Found</h3>
                        <p className="text-gray-400">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    <>
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-white">
                                {filteredGames.length} Award-Winning {filteredGames.length === 1 ? 'Game' : 'Games'}
                            </h2>
                            <div className="text-gray-400">
                                Total: {awards.length} awards across {filteredGames.length} games
                            </div>
                        </div>

                        {/* Games Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredGames.map((game) => (
                                <AwardCard key={game._id} game={game} />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Load More */}
            {!loading && filteredGames.length > 0 && (
                <div className="text-center py-8">
                    <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                        Load More Games
                    </button>
                </div>
            )}
        </div>
    );
};

export default AwardsPage;