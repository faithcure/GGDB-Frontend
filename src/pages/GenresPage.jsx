import React, { useState, useEffect } from 'react';
import {
    FaTags,
    FaGamepad,
    FaStar,
    FaFire,
    FaCrown,
    FaRocket,
    FaHeart,
    FaSkull,
    FaPuzzlePiece,
    FaCar,
    FaFootballBall,
    FaGhost,
    FaSearch,
    FaFilter,
    FaSort,
    FaChevronDown,
    FaPlay,
    FaEye,
    FaThumbsUp,
    FaTrophy
} from 'react-icons/fa';

const GenresPage = () => {
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [games, setGames] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('popularity');
    const [showSubgenres, setShowSubgenres] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // Genre definitions with comprehensive data
    const genreDefinitions = [
        {
            id: 'action',
            name: 'Action',
            icon: <FaRocket />,
            color: 'from-red-500 to-orange-500',
            description: 'Fast-paced games emphasizing combat, reflexes, and hand-eye coordination.',
            characteristics: ['Combat', 'Reflexes', 'Fast-paced', 'Skill-based'],
            subgenres: ['Hack and Slash', 'Beat em up', 'Fighting', 'Shooter'],
            gamesCount: 1247,
            avgRating: 8.2,
            topGames: ['DOOM Eternal', 'Devil May Cry 5', 'Sekiro'],
            popularity: 95
        },
        {
            id: 'adventure',
            name: 'Adventure',
            icon: <FaStar />,
            color: 'from-blue-500 to-cyan-500',
            description: 'Story-driven games focusing on exploration, puzzle-solving, and narrative.',
            characteristics: ['Exploration', 'Story', 'Puzzles', 'Character Development'],
            subgenres: ['Point & Click', 'Text Adventure', 'Visual Novel', 'Interactive Fiction'],
            gamesCount: 892,
            avgRating: 8.4,
            topGames: ['The Last of Us', 'Life is Strange', 'Monkey Island'],
            popularity: 88
        },
        {
            id: 'rpg',
            name: 'Role-Playing (RPG)',
            icon: <FaCrown />,
            color: 'from-purple-500 to-pink-500',
            description: 'Character progression and development with deep storytelling elements.',
            characteristics: ['Character Progression', 'Stats', 'Customization', 'Epic Stories'],
            subgenres: ['JRPG', 'Western RPG', 'Action RPG', 'Tactical RPG'],
            gamesCount: 756,
            avgRating: 8.7,
            topGames: ['The Witcher 3', 'Elden Ring', 'Final Fantasy XIV'],
            popularity: 92
        },
        {
            id: 'strategy',
            name: 'Strategy',
            icon: <FaTrophy />,
            color: 'from-green-500 to-emerald-500',
            description: 'Games requiring tactical thinking, planning, and resource management.',
            characteristics: ['Tactical Thinking', 'Planning', 'Resource Management', 'Decision Making'],
            subgenres: ['Real-time Strategy', 'Turn-based Strategy', '4X', 'Tower Defense'],
            gamesCount: 523,
            avgRating: 8.1,
            topGames: ['Civilization VI', 'StarCraft II', 'Total War'],
            popularity: 76
        },
        {
            id: 'simulation',
            name: 'Simulation',
            icon: <FaGamepad />,
            color: 'from-teal-500 to-blue-500',
            description: 'Games that simulate real-world activities or create virtual worlds.',
            characteristics: ['Realism', 'Management', 'Building', 'Life Simulation'],
            subgenres: ['Life Simulation', 'Business Sim', 'Vehicle Sim', 'City Builder'],
            gamesCount: 445,
            avgRating: 7.8,
            topGames: ['The Sims 4', 'Cities: Skylines', 'Animal Crossing'],
            popularity: 72
        },
        {
            id: 'sports',
            name: 'Sports',
            icon: <FaFootballBall />,
            color: 'from-orange-500 to-red-500',
            description: 'Games based on real or fictional sports and competitive activities.',
            characteristics: ['Competition', 'Skill', 'Teamwork', 'Athletics'],
            subgenres: ['Football', 'Basketball', 'Racing', 'Extreme Sports'],
            gamesCount: 389,
            avgRating: 7.5,
            topGames: ['FIFA 24', 'NBA 2K24', 'Gran Turismo 7'],
            popularity: 68
        },
        {
            id: 'racing',
            name: 'Racing',
            icon: <FaCar />,
            color: 'from-yellow-500 to-orange-500',
            description: 'High-speed competitions featuring various types of vehicles.',
            characteristics: ['Speed', 'Precision', 'Competition', 'Vehicles'],
            subgenres: ['Arcade Racing', 'Simulation Racing', 'Kart Racing', 'Street Racing'],
            gamesCount: 267,
            avgRating: 7.9,
            topGames: ['Forza Horizon 5', 'Mario Kart 8', 'F1 23'],
            popularity: 71
        },
        {
            id: 'puzzle',
            name: 'Puzzle',
            icon: <FaPuzzlePiece />,
            color: 'from-indigo-500 to-purple-500',
            description: 'Games that challenge problem-solving skills and logical thinking.',
            characteristics: ['Logic', 'Problem Solving', 'Pattern Recognition', 'Mental Challenge'],
            subgenres: ['Match-3', 'Physics Puzzle', 'Logic Puzzle', 'Tile Matching'],
            gamesCount: 834,
            avgRating: 8.0,
            topGames: ['Portal 2', 'Tetris Effect', 'The Witness'],
            popularity: 79
        },
        {
            id: 'horror',
            name: 'Horror',
            icon: <FaGhost />,
            color: 'from-gray-700 to-red-900',
            description: 'Games designed to frighten, unsettle, and create suspenseful atmosphere.',
            characteristics: ['Fear', 'Suspense', 'Atmosphere', 'Psychological'],
            subgenres: ['Survival Horror', 'Psychological Horror', 'Action Horror', 'Gothic Horror'],
            gamesCount: 298,
            avgRating: 8.3,
            topGames: ['Resident Evil 4', 'Silent Hill 2', 'Phasmophobia'],
            popularity: 74
        },
        {
            id: 'indie',
            name: 'Indie',
            icon: <FaHeart />,
            color: 'from-pink-500 to-rose-500',
            description: 'Independent games created by small teams with creative freedom.',
            characteristics: ['Creativity', 'Innovation', 'Artistic', 'Experimental'],
            subgenres: ['Art Game', 'Experimental', 'Narrative Indie', 'Retro-style'],
            gamesCount: 1456,
            avgRating: 8.1,
            topGames: ['Hades', 'Celeste', 'Hollow Knight'],
            popularity: 85
        }
    ];

    // Mock games data for each genre
    const mockGamesData = {
        'action': [
            { id: 1, title: 'DOOM Eternal', rating: 8.8, cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2a9v.webp', year: 2020 },
            { id: 2, title: 'Devil May Cry 5', rating: 8.7, cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1tmu.webp', year: 2019 },
            { id: 3, title: 'Sekiro', rating: 9.0, cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wx5.webp', year: 2019 }
        ],
        'rpg': [
            { id: 4, title: 'The Witcher 3', rating: 9.3, cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.webp', year: 2015 },
            { id: 5, title: 'Elden Ring', rating: 9.5, cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.webp', year: 2022 },
            { id: 6, title: 'Persona 5', rating: 9.2, cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r0n.webp', year: 2016 }
        ],
        'indie': [
            { id: 7, title: 'Hades', rating: 9.0, cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2i8f.webp', year: 2020 },
            { id: 8, title: 'Celeste', rating: 8.9, cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1tqh.webp', year: 2018 },
            { id: 9, title: 'Hollow Knight', rating: 9.1, cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1rgi.webp', year: 2017 }
        ]
    };

    useEffect(() => {
        setGenres(genreDefinitions);
        setSelectedGenre(genreDefinitions[0]);
        setGames(mockGamesData['action'] || []);
        setFilteredGames(mockGamesData['action'] || []);
    }, []);

    useEffect(() => {
        if (selectedGenre) {
            const genreGames = mockGamesData[selectedGenre.id] || [];
            setGames(genreGames);
            setFilteredGames(genreGames);
        }
    }, [selectedGenre]);

    const handleGenreSelect = (genre) => {
        setSelectedGenre(genre);
        setSearchTerm('');
    };

    const GenreCard = ({ genre, isSelected, onClick }) => (
        <div
            onClick={() => onClick(genre)}
            className={`relative p-6 rounded-xl border cursor-pointer transition-all duration-300 group ${
                isSelected
                    ? 'border-yellow-400 bg-yellow-400/10 scale-105'
                    : 'border-gray-700 bg-gray-900/50 hover:border-gray-600 hover:bg-gray-800/50'
            }`}
        >
            <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${genre.color} rounded-xl flex items-center justify-center text-white`}>
                    {genre.icon}
                </div>
                <div className="flex-1">
                    <h3 className={`text-lg font-bold ${isSelected ? 'text-yellow-400' : 'text-white'} group-hover:text-yellow-400 transition-colors`}>
                        {genre.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{genre.gamesCount} games</span>
                        <div className="flex items-center gap-1">
                            <FaStar className="text-yellow-400 text-xs" />
                            <span>{genre.avgRating}</span>
                        </div>
                    </div>
                </div>

                {/* Popularity indicator */}
                <div className="text-right">
                    <div className={`text-2xl font-bold ${isSelected ? 'text-yellow-400' : 'text-white'}`}>
                        {genre.popularity}
                    </div>
                    <div className="text-xs text-gray-400">Popularity</div>
                </div>
            </div>

            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {genre.description}
            </p>

            {/* Characteristics */}
            <div className="flex flex-wrap gap-2 mb-4">
                {genre.characteristics.slice(0, 4).map((char, idx) => (
                    <span
                        key={idx}
                        className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs"
                    >
            {char}
          </span>
                ))}
            </div>

            {/* Top games preview */}
            <div className="text-sm">
                <div className="text-gray-400 mb-1">Popular games:</div>
                <div className="text-gray-300">
                    {genre.topGames.slice(0, 2).join(', ')}
                    {genre.topGames.length > 2 && '...'}
                </div>
            </div>

            {/* Selection indicator */}
            {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <FaTrophy className="text-black text-xs" />
                </div>
            )}
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
            <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative max-w-7xl mx-auto px-6 py-16">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <FaTags className="text-5xl text-violet-300" />
                            <h1 className="text-6xl font-black">Game Genres</h1>
                        </div>
                        <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                            Explore games by category. From action-packed adventures to mind-bending puzzles.
                        </p>

                        {/* Genre Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                            <StatCard
                                icon={<FaTags className="text-xl text-white" />}
                                label="Total Genres"
                                value={genres.length}
                                color="from-violet-500 to-purple-500"
                            />
                            <StatCard
                                icon={<FaGamepad className="text-xl text-white" />}
                                label="Total Games"
                                value={genres.reduce((sum, genre) => sum + genre.gamesCount, 0).toLocaleString()}
                                color="from-purple-500 to-pink-500"
                            />
                            <StatCard
                                icon={<FaStar className="text-xl text-white" />}
                                label="Average Rating"
                                value={(genres.reduce((sum, genre) => sum + genre.avgRating, 0) / genres.length).toFixed(1)}
                                color="from-pink-500 to-rose-500"
                            />
                            <StatCard
                                icon={<FaFire className="text-xl text-white" />}
                                label="Most Popular"
                                value={genres.sort((a, b) => b.popularity - a.popularity)[0]?.name || 'Action'}
                                color="from-orange-500 to-red-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Genres List */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Browse Genres</h2>
                            <button
                                onClick={() => setShowSubgenres(!showSubgenres)}
                                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                            >
                                {showSubgenres ? 'Hide' : 'Show'} Subgenres
                            </button>
                        </div>

                        <div className="space-y-4 max-h-[80vh] overflow-y-auto scrollbar-hide">
                            {genres.map((genre) => (
                                <GenreCard
                                    key={genre.id}
                                    genre={genre}
                                    isSelected={selectedGenre?.id === genre.id}
                                    onClick={handleGenreSelect}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Selected Genre Details */}
                    <div className="lg:col-span-2">
                        {selectedGenre && (
                            <>
                                {/* Genre Header */}
                                <div className={`p-6 rounded-xl bg-gradient-to-r ${selectedGenre.color} mb-8`}>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-white text-2xl">
                                            {selectedGenre.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-3xl font-black text-white mb-2">{selectedGenre.name}</h2>
                                            <p className="text-white/90 leading-relaxed">{selectedGenre.description}</p>
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-3 gap-4 mt-6">
                                        <div className="text-center p-3 bg-white/10 rounded-lg">
                                            <div className="text-2xl font-bold text-white">{selectedGenre.gamesCount}</div>
                                            <div className="text-white/80 text-sm">Games</div>
                                        </div>
                                        <div className="text-center p-3 bg-white/10 rounded-lg">
                                            <div className="text-2xl font-bold text-white">{selectedGenre.avgRating}</div>
                                            <div className="text-white/80 text-sm">Avg Rating</div>
                                        </div>
                                        <div className="text-center p-3 bg-white/10 rounded-lg">
                                            <div className="text-2xl font-bold text-white">{selectedGenre.popularity}%</div>
                                            <div className="text-white/80 text-sm">Popularity</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Subgenres */}
                                {showSubgenres && (
                                    <div className="mb-8">
                                        <h3 className="text-xl font-bold text-white mb-4">Subgenres</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {selectedGenre.subgenres.map((subgenre, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`px-4 py-2 bg-gradient-to-r ${selectedGenre.color} text-white rounded-full text-sm font-medium hover:scale-105 transition-transform cursor-pointer`}
                                                >
                          {subgenre}
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Characteristics */}
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold text-white mb-4">Key Characteristics</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {selectedGenre.characteristics.map((char, idx) => (
                                            <div key={idx} className="p-3 bg-gray-900/50 rounded-lg border border-gray-800 text-center">
                                                <div className="text-white font-medium">{char}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Games in Genre */}
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-white">Popular {selectedGenre.name} Games</h3>
                                        <button className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
                                            View All →
                                        </button>
                                    </div>

                                    {games.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {games.map((game) => (
                                                <div key={game.id} className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-400/50 transition-all duration-300">
                                                    <img
                                                        src={game.cover}
                                                        alt={game.title}
                                                        className="w-full h-48 object-cover"
                                                    />
                                                    <div className="p-4">
                                                        <h4 className="text-white font-bold mb-2">{game.title}</h4>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-1">
                                                                <FaStar className="text-yellow-400 text-sm" />
                                                                <span className="text-white">{game.rating}</span>
                                                            </div>
                                                            <span className="text-gray-400 text-sm">{game.year}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-gray-400">
                                            <FaGamepad className="text-4xl mx-auto mb-4" />
                                            <p>No games available for this genre yet.</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom Scrollbar */}
            <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
};

export default GenresPage;