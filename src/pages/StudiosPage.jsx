import React, { useState, useEffect } from 'react';
import {
    FaBuilding,
    FaGamepad,
    FaStar,
    FaTrophy,
    FaUsers,
    FaCalendar,
    FaGlobe,
    FaMapMarkerAlt,
    FaSearch,
    FaFilter,
    FaSort,
    FaChevronDown,
    FaHeart,
    FaEye,
    FaPlay,
    FaCrown,
    FaFire
} from 'react-icons/fa';

const StudiosPage = () => {
    const [studios, setStudios] = useState([]);
    const [filteredStudios, setFilteredStudios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // developer, publisher, both
    const [filterSize, setFilterSize] = useState('all'); // indie, mid, aaa
    const [filterRegion, setFilterRegion] = useState('all');
    const [sortBy, setSortBy] = useState('popularity');
    const [showFilters, setShowFilters] = useState(false);

    // Mock studios data
    const mockStudios = [
        {
            id: 1,
            name: 'Naughty Dog',
            logo: 'https://images.igdb.com/igdb/image/upload/t_logo_med/cl1ot.webp',
            type: 'Developer',
            size: 'AAA',
            founded: 1984,
            location: 'Santa Monica, California, USA',
            country: 'us',
            website: 'https://www.naughtydog.com',
            description: 'Naughty Dog is known for creating critically acclaimed games with emotional storytelling and cutting-edge technology.',
            specialties: ['Action-Adventure', 'Storytelling', 'Character Development'],
            employees: '300-500',
            gamesCount: 15,
            totalSales: '40M+',
            averageRating: 9.2,
            isVerified: true,
            isPublic: true,
            featuredGames: [
                { title: 'The Last of Us Part II', rating: 9.3, year: 2020 },
                { title: 'Uncharted 4', rating: 9.0, year: 2016 },
                { title: 'The Last of Us', rating: 9.5, year: 2013 }
            ],
            achievements: [
                'Game of the Year 2020',
                'Best Narrative Design',
                'Technical Excellence Award'
            ],
            socialMedia: {
                twitter: '@Naughty_Dog',
                instagram: '@naughtydog_inc'
            }
        },
        {
            id: 2,
            name: 'FromSoftware',
            logo: 'https://images.igdb.com/igdb/image/upload/t_logo_med/cl21h.webp',
            type: 'Developer',
            size: 'Mid-tier',
            founded: 1986,
            location: 'Tokyo, Japan',
            country: 'jp',
            website: 'https://www.fromsoftware.jp',
            description: 'FromSoftware is renowned for creating challenging action RPGs with intricate world-building and innovative gameplay mechanics.',
            specialties: ['Action RPG', 'Dark Fantasy', 'Challenging Gameplay'],
            employees: '100-300',
            gamesCount: 28,
            totalSales: '30M+',
            averageRating: 8.9,
            isVerified: true,
            isPublic: true,
            featuredGames: [
                { title: 'Elden Ring', rating: 9.5, year: 2022 },
                { title: 'Dark Souls III', rating: 8.8, year: 2016 },
                { title: 'Bloodborne', rating: 9.1, year: 2015 }
            ],
            achievements: [
                'Game of the Year 2022',
                'Best Art Direction',
                'Most Innovative Gameplay'
            ],
            socialMedia: {
                twitter: '@fromsoftware_pr'
            }
        },
        {
            id: 3,
            name: 'Supergiant Games',
            logo: 'https://images.igdb.com/igdb/image/upload/t_logo_med/cl2s1.webp',
            type: 'Developer',
            size: 'Indie',
            founded: 2009,
            location: 'San Francisco, California, USA',
            country: 'us',
            website: 'https://www.supergiantgames.com',
            description: 'Supergiant Games creates beautiful, hand-crafted indie games with stunning art and exceptional audio design.',
            specialties: ['Indie Games', 'Art Direction', 'Audio Design'],
            employees: '20-50',
            gamesCount: 4,
            totalSales: '5M+',
            averageRating: 8.7,
            isVerified: true,
            isPublic: true,
            featuredGames: [
                { title: 'Hades', rating: 9.0, year: 2020 },
                { title: 'Transistor', rating: 8.5, year: 2014 },
                { title: 'Bastion', rating: 8.3, year: 2011 }
            ],
            achievements: [
                'Best Indie Game 2020',
                'Excellence in Audio',
                'IGF Grand Prize'
            ],
            socialMedia: {
                twitter: '@SupergiantGames'
            }
        },
        {
            id: 4,
            name: 'Electronic Arts',
            logo: 'https://images.igdb.com/igdb/image/upload/t_logo_med/cl7ks.webp',
            type: 'Publisher',
            size: 'AAA',
            founded: 1982,
            location: 'Redwood City, California, USA',
            country: 'us',
            website: 'https://www.ea.com',
            description: 'Electronic Arts is one of the largest video game publishers in the world, known for sports games and blockbuster franchises.',
            specialties: ['Sports Games', 'AAA Publishing', 'Live Services'],
            employees: '9000+',
            gamesCount: 200,
            totalSales: '1B+',
            averageRating: 7.5,
            isVerified: true,
            isPublic: true,
            featuredGames: [
                { title: 'FIFA 24', rating: 8.0, year: 2023 },
                { title: 'Apex Legends', rating: 8.5, year: 2019 },
                { title: 'The Sims 4', rating: 7.8, year: 2014 }
            ],
            achievements: [
                'Best Sports Game Publisher',
                'Most Successful Live Service',
                'Industry Innovation Award'
            ],
            socialMedia: {
                twitter: '@EA',
                instagram: '@ea'
            }
        },
        {
            id: 5,
            name: 'Team Cherry',
            logo: 'https://images.igdb.com/igdb/image/upload/t_logo_med/cl9xt.webp',
            type: 'Developer',
            size: 'Indie',
            founded: 2014,
            location: 'Adelaide, Australia',
            country: 'au',
            website: 'https://teamcherry.com.au',
            description: 'Team Cherry is a small indie studio known for creating the critically acclaimed Metroidvania game Hollow Knight.',
            specialties: ['Metroidvania', '2D Platformer', 'Hand-drawn Art'],
            employees: '3-10',
            gamesCount: 1,
            totalSales: '3M+',
            averageRating: 9.1,
            isVerified: true,
            isPublic: true,
            featuredGames: [
                { title: 'Hollow Knight', rating: 9.1, year: 2017 }
            ],
            achievements: [
                'Best Indie Game 2017',
                'Excellence in Art',
                'Players Choice Award'
            ],
            socialMedia: {
                twitter: '@TeamCherryGames'
            }
        },
        {
            id: 6,
            name: 'CD Projekt RED',
            logo: 'https://images.igdb.com/igdb/image/upload/t_logo_med/cl4jw.webp',
            type: 'Developer',
            size: 'AAA',
            founded: 2002,
            location: 'Warsaw, Poland',
            country: 'pl',
            website: 'https://en.cdprojektred.com',
            description: 'CD Projekt RED is known for creating open-world RPGs with deep storytelling and player choice.',
            specialties: ['Open World RPG', 'Narrative Design', 'Player Choice'],
            employees: '500-1000',
            gamesCount: 8,
            totalSales: '50M+',
            averageRating: 8.6,
            isVerified: true,
            isPublic: true,
            featuredGames: [
                { title: 'The Witcher 3', rating: 9.3, year: 2015 },
                { title: 'Cyberpunk 2077', rating: 8.1, year: 2020 },
                { title: 'The Witcher 2', rating: 8.7, year: 2011 }
            ],
            achievements: [
                'Game of the Year 2015',
                'Best RPG Developer',
                'Open World Excellence'
            ],
            socialMedia: {
                twitter: '@CDPROJEKTRED'
            }
        }
    ];

    useEffect(() => {
        setStudios(mockStudios);
        setFilteredStudios(mockStudios);
    }, []);

    // Filter and sort logic
    useEffect(() => {
        let filtered = [...studios];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(studio =>
                studio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                studio.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                studio.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Type filter
        if (filterType !== 'all') {
            filtered = filtered.filter(studio =>
                studio.type.toLowerCase() === filterType.toLowerCase()
            );
        }

        // Size filter
        if (filterSize !== 'all') {
            filtered = filtered.filter(studio =>
                studio.size.toLowerCase().includes(filterSize.toLowerCase())
            );
        }

        // Region filter
        if (filterRegion !== 'all') {
            filtered = filtered.filter(studio =>
                studio.country === filterRegion
            );
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'popularity':
                    return b.averageRating - a.averageRating;
                case 'games':
                    return b.gamesCount - a.gamesCount;
                case 'founded':
                    return b.founded - a.founded;
                case 'alphabetical':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

        setFilteredStudios(filtered);
    }, [studios, searchTerm, filterType, filterSize, filterRegion, sortBy]);

    const getCountryFlag = (country) => {
        const flags = {
            'us': '🇺🇸',
            'jp': '🇯🇵',
            'au': '🇦🇺',
            'pl': '🇵🇱',
            'uk': '🇬🇧',
            'de': '🇩🇪',
            'fr': '🇫🇷',
            'ca': '🇨🇦'
        };
        return flags[country] || '🌍';
    };

    const getSizeColor = (size) => {
        switch (size.toLowerCase()) {
            case 'indie': return 'from-green-500 to-emerald-500';
            case 'mid-tier': return 'from-blue-500 to-cyan-500';
            case 'aaa': return 'from-purple-500 to-pink-500';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const StudioCard = ({ studio }) => (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-400/50 transition-all duration-300 group">
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-r from-gray-800 to-gray-900">
                <div className="flex items-start gap-4">
                    <div className="relative">
                        <img
                            src={studio.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(studio.name)}&background=random&color=fff&size=80`}
                            alt={studio.name}
                            className="w-16 h-16 rounded-lg object-cover ring-2 ring-gray-700 group-hover:ring-yellow-400/50 transition-all duration-300"
                            onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(studio.name)}&background=random&color=fff&size=80`;
                            }}
                        />
                        {studio.isVerified && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <FaCrown className="text-white text-xs" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                                {studio.name}
                            </h3>
                            <div className={`bg-gradient-to-r ${getSizeColor(studio.size)} px-2 py-1 rounded-full`}>
                                <span className="text-white text-xs font-bold">{studio.size}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                            <span>{getCountryFlag(studio.country)}</span>
                            <FaMapMarkerAlt className="text-xs" />
                            <span>{studio.location}</span>
                            <span>•</span>
                            <FaCalendar className="text-xs" />
                            <span>Est. {studio.founded}</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <FaStar className="text-yellow-400 text-sm" />
                                <span className="text-white font-medium">{studio.averageRating.toFixed(1)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-400 text-sm">
                                <FaGamepad className="text-xs" />
                                <span>{studio.gamesCount} games</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-400 text-sm">
                                <FaUsers className="text-xs" />
                                <span>{studio.employees}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-2">
                    {studio.description}
                </p>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {studio.specialties.slice(0, 3).map((specialty, idx) => (
                        <span
                            key={idx}
                            className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs"
                        >
              {specialty}
            </span>
                    ))}
                </div>

                {/* Featured Games */}
                <div className="mb-4">
                    <h4 className="text-white font-medium text-sm mb-2">Notable Games</h4>
                    <div className="space-y-1">
                        {studio.featuredGames.slice(0, 3).map((game, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                                <span className="text-gray-300">{game.title}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">({game.year})</span>
                                    <div className="flex items-center gap-1">
                                        <FaStar className="text-yellow-400 text-xs" />
                                        <span className="text-yellow-400">{game.rating}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                        <div className="text-lg font-bold text-white">{studio.totalSales}</div>
                        <div className="text-gray-400 text-xs">Total Sales</div>
                    </div>
                    <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                        <div className="text-lg font-bold text-white">{studio.gamesCount}</div>
                        <div className="text-gray-400 text-xs">Games</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors">
                        <FaEye className="inline mr-2" />
                        View Profile
                    </button>
                    <button className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-red-400 rounded-lg transition-colors">
                        <FaHeart />
                    </button>
                    {studio.website && (
                        <button className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-blue-400 rounded-lg transition-colors">
                            <FaGlobe />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    const StatCard = ({ icon, label, value, color = "from-blue-500 to-cyan-500" }) => (
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
            <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative max-w-7xl mx-auto px-6 py-16">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <FaBuilding className="text-5xl text-cyan-300" />
                            <h1 className="text-6xl font-black">Game Studios</h1>
                        </div>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Discover the creative powerhouses behind your favorite games. From indie gems to AAA blockbusters.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                            <StatCard
                                icon={<FaBuilding className="text-xl text-white" />}
                                label="Total Studios"
                                value={filteredStudios.length}
                                color="from-indigo-500 to-purple-500"
                            />
                            <StatCard
                                icon={<FaGamepad className="text-xl text-white" />}
                                label="Games Created"
                                value={filteredStudios.reduce((sum, studio) => sum + studio.gamesCount, 0)}
                                color="from-blue-500 to-cyan-500"
                            />
                            <StatCard
                                icon={<FaTrophy className="text-xl text-white" />}
                                label="AAA Studios"
                                value={filteredStudios.filter(s => s.size === 'AAA').length}
                                color="from-purple-500 to-pink-500"
                            />
                            <StatCard
                                icon={<FaHeart className="text-xl text-white" />}
                                label="Indie Studios"
                                value={filteredStudios.filter(s => s.size === 'Indie').length}
                                color="from-green-500 to-emerald-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search studios, locations, specialties..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                            />
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-4">
                            {/* Sort */}
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white appearance-none cursor-pointer focus:border-cyan-400 focus:outline-none"
                                >
                                    <option value="popularity">Most Popular</option>
                                    <option value="games">Most Games</option>
                                    <option value="founded">Newest First</option>
                                    <option value="alphabetical">A-Z</option>
                                </select>
                                <FaSort className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                                    showFilters
                                        ? 'bg-cyan-600 border-cyan-500 text-white'
                                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-cyan-400'
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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                                    <select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="developer">Developer</option>
                                        <option value="publisher">Publisher</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Size</label>
                                    <select
                                        value={filterSize}
                                        onChange={(e) => setFilterSize(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                                    >
                                        <option value="all">All Sizes</option>
                                        <option value="indie">Indie</option>
                                        <option value="mid">Mid-tier</option>
                                        <option value="aaa">AAA</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Region</label>
                                    <select
                                        value={filterRegion}
                                        onChange={(e) => setFilterRegion(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                                    >
                                        <option value="all">All Regions</option>
                                        <option value="us">🇺🇸 United States</option>
                                        <option value="jp">🇯🇵 Japan</option>
                                        <option value="pl">🇵🇱 Poland</option>
                                        <option value="au">🇦🇺 Australia</option>
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
                                <div className="h-32 bg-gray-800" />
                                <div className="p-6">
                                    <div className="h-6 bg-gray-800 rounded mb-2" />
                                    <div className="h-4 bg-gray-800 rounded mb-4 w-2/3" />
                                    <div className="space-y-2">
                                        <div className="h-3 bg-gray-800 rounded" />
                                        <div className="h-3 bg-gray-800 rounded w-3/4" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredStudios.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🏢</div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Studios Found</h3>
                        <p className="text-gray-400">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    <>
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-white">
                                {filteredStudios.length} {filteredStudios.length === 1 ? 'Studio' : 'Studios'}
                            </h2>
                            <div className="text-gray-400">
                                Showing developers, publishers, and hybrid studios
                            </div>
                        </div>

                        {/* Studios Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredStudios.map((studio) => (
                                <StudioCard key={studio.id} studio={studio} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StudiosPage;