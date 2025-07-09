import React, { useState, useEffect } from 'react';
import {
    FaTrophy,
    FaStar,
    FaFilter,
    FaSort,
    FaChevronDown,
    FaSearch
} from 'react-icons/fa';
import GameCard from '../components/common/GameCard';

const TopRatedPage = () => {
    const [games, setGames] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('rating');
    const [filterGenre, setFilterGenre] = useState('all');
    const [filterYear, setFilterYear] = useState('all');
    const [filterPlatform, setFilterPlatform] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [availableGenres, setAvailableGenres] = useState([]);
    const [availablePlatforms, setAvailablePlatforms] = useState([]);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // Fetch games from database
    useEffect(() => {
        const fetchTopRatedGames = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${API_URL}/api/games`);
                if (!response.ok) {
                    throw new Error('Failed to fetch games');
                }

                const data = await response.json();
                console.log('API Response:', data); // Debug için

                // API direkt array döndürüyor
                const gamesArray = Array.isArray(data) ? data : [];

                const ratedGames = gamesArray
                    .filter(game => game.ggdbRating && game.ggdbRating > 0)
                    .sort((a, b) => (b.ggdbRating || 0) - (a.ggdbRating || 0));

                setGames(ratedGames);
                setFilteredGames(ratedGames);

                // Array kontrolü ekle
                if (Array.isArray(ratedGames)) {
                    const genres = [...new Set(ratedGames.flatMap(game => game.genres || []))];
                    const platforms = [...new Set(ratedGames.flatMap(game => game.platforms || []))];

                    setAvailableGenres(genres.filter(Boolean));
                    setAvailablePlatforms(platforms.filter(Boolean));
                }

            } catch (err) {
                console.error('Error fetching top rated games:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTopRatedGames();
    }, [API_URL]);

    useEffect(() => {
        let filtered = [...games];

        if (searchTerm) {
            filtered = filtered.filter(game =>
                game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (game.studio && game.studio.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (game.developer && game.developer.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (filterGenre !== 'all') {
            filtered = filtered.filter(game =>
                game.genres && game.genres.some(g => g.toLowerCase() === filterGenre.toLowerCase())
            );
        }

        if (filterYear !== 'all') {
            const year = parseInt(filterYear);
            filtered = filtered.filter(game =>
                game.releaseDate && new Date(game.releaseDate).getFullYear() === year
            );
        }

        if (filterPlatform !== 'all') {
            filtered = filtered.filter(game =>
                game.platforms && game.platforms.some(p => p.toLowerCase() === filterPlatform.toLowerCase())
            );
        }

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    return (b.ggdbRating || 0) - (a.ggdbRating || 0);
                case 'popularity':
                    return (b.likes || 0) - (a.likes || 0);
                case 'release':
                    return new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0);
                case 'votes':
                    return (b.ratingCount || 0) - (a.ratingCount || 0);
                default:
                    return (b.ggdbRating || 0) - (a.ggdbRating || 0);
            }
        });

        setFilteredGames(filtered);
    }, [games, searchTerm, filterGenre, filterYear, filterPlatform, sortBy]);

    const getCountryFlag = (country) => {
        const flags = {
            'us': '🇺🇸',
            'jp': '🇯🇵',
            'pl': '🇵🇱',
            'uk': '🇬🇧',
            'de': '🇩🇪',
            'fr': '🇫🇷'
        };
        return flags[country] || '🌍';
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative max-w-7xl mx-auto px-6 py-16">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <FaTrophy className="text-4xl text-yellow-300" />
                            <h1 className="text-5xl font-black">Top Rated Games</h1>
                        </div>
                        <p className="text-xl text-yellow-100 mb-8 max-w-2xl mx-auto">
                            Discover the highest rated games according to our community and critics.
                            These masterpieces have earned their place in gaming history.
                        </p>
                        <div className="flex items-center justify-center gap-6 text-yellow-200">
                            <div className="text-center">
                                <div className="text-2xl font-bold">{filteredGames.length}</div>
                                <div className="text-sm">Games</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">
                                    {filteredGames.length > 0
                                        ? (filteredGames.reduce((sum, game) => sum + (game.ggdbRating || 0), 0) / filteredGames.length).toFixed(1)
                                        : '0.0'
                                    }
                                </div>
                                <div className="text-sm">Avg Rating</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">
                                    {formatNumber(filteredGames.reduce((sum, game) => sum + (game.ratingCount || 0), 0))}
                                </div>
                                <div className="text-sm">Reviews</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search games or developers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white appearance-none cursor-pointer focus:border-yellow-400 focus:outline-none"
                                >
                                    <option value="rating">Highest Rated</option>
                                    <option value="popularity">Most Popular</option>
                                    <option value="release">Newest First</option>
                                    <option value="votes">Most Voted</option>
                                </select>
                                <FaSort className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>

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

                    {showFilters && (
                        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                                    <select
                                        value={filterGenre}
                                        onChange={(e) => setFilterGenre(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-yellow-400 focus:outline-none"
                                    >
                                        <option value="all">All Genres</option>
                                        {availableGenres.map(genre => (
                                            <option key={genre} value={genre}>{genre}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Release Year</label>
                                    <select
                                        value={filterYear}
                                        onChange={(e) => setFilterYear(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-yellow-400 focus:outline-none"
                                    >
                                        <option value="all">All Years</option>
                                        <option value="2024">2024</option>
                                        <option value="2023">2023</option>
                                        <option value="2022">2022</option>
                                        <option value="2021">2021</option>
                                        <option value="2020">2020</option>
                                        <option value="2019">2019</option>
                                        <option value="2018">2018</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
                                    <select
                                        value={filterPlatform}
                                        onChange={(e) => setFilterPlatform(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-yellow-400 focus:outline-none"
                                    >
                                        <option value="all">All Platforms</option>
                                        {availablePlatforms.map(platform => (
                                            <option key={platform} value={platform}>{platform}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-gray-900/50 rounded-xl overflow-hidden animate-pulse">
                                <div className="h-64 bg-gray-800" />
                                <div className="p-6">
                                    <div className="h-6 bg-gray-800 rounded mb-2" />
                                    <div className="h-4 bg-gray-800 rounded mb-4 w-2/3" />
                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <div className="h-8 bg-gray-800 rounded" />
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
                        <h3 className="text-2xl font-bold text-white mb-2">Error Loading Games</h3>
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
                        <div className="text-6xl mb-4">🎮</div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Games Found</h3>
                        <p className="text-gray-400">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredGames.map((game, index) => (
                            <GameCard
                                key={game._id}
                                _id={game._id}
                                image={game.coverImage}
                                title={game.title}
                                rating={game.ggdbRating || 0}
                                votes={game.ratingCount || 0}
                                metacritic={game.metacritic || 0}
                                studio={game.studio || game.developer || 'Unknown Studio'}
                                country={game.country || 'us'}
                                year={game.releaseDate ? new Date(game.releaseDate).getFullYear() : 2024}
                                genres={game.genres || []}
                                platforms={game.platforms || []}
                                reviews={game.ratingCount || 0}
                                rank={index + 1}
                                isTopRated={true}
                            />
                        ))}
                    </div>
                )}
            </div>

            {!loading && filteredGames.length > 0 && (
                <div className="text-center py-8">
                    <button className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                        Load More Games
                    </button>
                </div>
            )}
        </div>
    );
};

export default TopRatedPage;