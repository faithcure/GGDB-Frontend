import React, { useState, useEffect } from "react";
import { FaEdit, FaCheck, FaTimes, FaStar, FaPlus, FaKeyboard, FaLightbulb, FaGamepad, FaHeart, FaFire, FaRocket, FaBrain, FaCog, FaUsers, FaEye, FaTrophy, FaChess } from "react-icons/fa";
import { GENRES_LIST } from "../../../../../data/gameConstants";
import axios from "axios";
import { API_BASE } from "../../../../../config/api";


const GenresSection = ({ gamer, setGamer, editingSection, setEditingSection }) => {
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [validationError, setValidationError] = useState("");
    const [showTips, setShowTips] = useState(false);
    const [searchFilter, setSearchFilter] = useState("");

    // Toast effect
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    // Update selectedGenres when gamer genres change
    useEffect(() => {
        if (gamer?.favoriteGenres && editingSection !== 'genres') {
            const genreKeys = gamer.favoriteGenres.map(g => {
                if (typeof g === 'string') return g;
                return g.key || g.name?.toLowerCase() || g;
            });
            setSelectedGenres(genreKeys);
        }
    }, [gamer?.favoriteGenres, editingSection]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (editingSection === 'genres') {
                if (e.ctrlKey && e.key === 'Enter') {
                    e.preventDefault();
                    saveEdit();
                }
                if (e.key === 'Escape') {
                    e.preventDefault();
                    cancelEditing();
                }
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [editingSection, selectedGenres]);

    // Personalized genre analysis function
    const getGenrePersonality = () => {
        if (!gamer?.favoriteGenres || gamer.favoriteGenres.length === 0) return null;

        const genres = gamer.favoriteGenres.map(g => {
            const key = typeof g === 'string' ? g : (g.key || g.name?.toLowerCase());
            const name = typeof g === 'string' ? g : g.name;
            return { key, name };
        });

        const genreKeys = genres.map(g => g.key);

        // Define genre categories and their characteristics
        const genreAnalysis = {
            // Story-driven player
            storyDriven: {
                genres: ['rpg', 'adventure', 'narrative', 'visual-novel', 'mystery'],
                count: genreKeys.filter(g => ['rpg', 'adventure', 'narrative', 'visual-novel', 'mystery'].includes(g)).length,
                personality: {
                    title: "Story Enthusiast",
                    description: "You love immersive narratives and character development",
                    traits: ["Deep storylines", "Character progression", "Emotional connections"],
                    icon: <FaBrain className="text-purple-400" />,
                    color: "from-purple-500/20 to-indigo-500/20",
                    borderColor: "border-purple-500/30",
                    message: "You're drawn to games that tell compelling stories and let you become the hero of epic adventures."
                }
            },

            // Action player
            actionPacked: {
                genres: ['action', 'fps', 'fighting', 'shooter', 'platformer', 'racing'],
                count: genreKeys.filter(g => ['action', 'fps', 'fighting', 'shooter', 'platformer', 'racing'].includes(g)).length,
                personality: {
                    title: "Adrenaline Seeker",
                    description: "You thrive on fast-paced, skill-based gameplay",
                    traits: ["Quick reflexes", "Competitive spirit", "High intensity"],
                    icon: <FaRocket className="text-red-400" />,
                    color: "from-red-500/20 to-orange-500/20",
                    borderColor: "border-red-500/30",
                    message: "You live for the thrill of intense action and testing your reflexes against challenging opponents."
                }
            },

            // Strategic player
            strategic: {
                genres: ['strategy', 'turn-based', 'tower-defense', 'rts', 'grand-strategy', 'puzzle'],
                count: genreKeys.filter(g => ['strategy', 'turn-based', 'tower-defense', 'rts', 'grand-strategy', 'puzzle'].includes(g)).length,
                personality: {
                    title: "Master Tactician",
                    description: "You enjoy planning, thinking ahead, and outsmarting opponents",
                    traits: ["Strategic thinking", "Long-term planning", "Problem solving"],
                    icon: <FaChess className="text-blue-400" />,
                    color: "from-blue-500/20 to-cyan-500/20",
                    borderColor: "border-blue-500/30",
                    message: "You excel at strategic thinking and love games that challenge your mind and planning skills."
                }
            },

            // Social player
            social: {
                genres: ['mmo', 'moba', 'multiplayer', 'co-op', 'party', 'social'],
                count: genreKeys.filter(g => ['mmo', 'moba', 'multiplayer', 'co-op', 'party', 'social'].includes(g)).length,
                personality: {
                    title: "Team Player",
                    description: "You love connecting and competing with other players",
                    traits: ["Teamwork", "Communication", "Social interaction"],
                    icon: <FaUsers className="text-green-400" />,
                    color: "from-green-500/20 to-emerald-500/20",
                    borderColor: "border-green-500/30",
                    message: "You shine when working with others and building communities around shared gaming experiences."
                }
            },

            // Creative player
            creative: {
                genres: ['sandbox', 'simulation', 'building', 'creative', 'management'],
                count: genreKeys.filter(g => ['sandbox', 'simulation', 'building', 'creative', 'management'].includes(g)).length,
                personality: {
                    title: "Creative Builder",
                    description: "You enjoy creating, building, and managing virtual worlds",
                    traits: ["Creativity", "World building", "Management skills"],
                    icon: <FaStar className="text-yellow-400" />,
                    color: "from-yellow-500/20 to-amber-500/20",
                    borderColor: "border-yellow-500/30",
                    message: "You have a creative spirit and love games that let you build, design, and manage your own worlds."
                }
            },

            // Horror/Thriller enthusiast
            thrillSeeker: {
                genres: ['horror', 'thriller', 'survival', 'psychological'],
                count: genreKeys.filter(g => ['horror', 'thriller', 'survival', 'psychological'].includes(g)).length,
                personality: {
                    title: "Thrill Seeker",
                    description: "You're not afraid of intense, psychological experiences",
                    traits: ["Courage", "Emotional resilience", "Immersion"],
                    icon: <FaEye className="text-indigo-400" />,
                    color: "from-indigo-500/20 to-purple-500/20",
                    borderColor: "border-indigo-500/30",
                    message: "You embrace intense psychological experiences and aren't afraid to venture into the unknown."
                }
            }
        };

        // Find the dominant personality type
        const personalities = Object.values(genreAnalysis).filter(p => p.count > 0);
        if (personalities.length === 0) return null;

        // Sort by count and get the top personality
        personalities.sort((a, b) => b.count - a.count);
        const dominant = personalities[0];

        // Check for balanced player (multiple categories with similar counts)
        const isBalanced = personalities.length >= 3 &&
            personalities[0].count - personalities[2].count <= 1;

        if (isBalanced) {
            return {
                title: "Versatile Gamer",
                description: "You enjoy a diverse range of gaming experiences",
                traits: ["Adaptability", "Open-minded", "Variety seeker"],
                icon: <FaTrophy className="text-rainbow" />,
                color: "from-gradient-to-r from-purple-500/20 via-blue-500/20 to-green-500/20",
                borderColor: "border-purple-500/30",
                message: "You're a well-rounded gamer who appreciates different types of gaming experiences and adapts to various playstyles.",
                isBalanced: true
            };
        }

        return {
            ...dominant.personality,
            dominantCount: dominant.count,
            totalGenres: genres.length,
            coverage: Math.round((dominant.count / genres.length) * 100)
        };
    };

    const startEditing = () => {
        const currentGenres = gamer?.favoriteGenres?.map(g => {
            if (typeof g === 'string') return g;
            return g.key || g.name?.toLowerCase() || g;
        }) || [];
        setSelectedGenres(currentGenres);
        setEditingSection('genres');
        setSearchFilter("");
        setValidationError("");
    };

    const toggleSelection = (item) => {
        setSelectedGenres(prev =>
            prev.includes(item)
                ? prev.filter(i => i !== item)
                : [...prev, item]
        );
    };

    const saveEdit = async () => {
        if (selectedGenres.length === 0) {
            setValidationError("Please select at least one genre");
            return;
        }

        if (selectedGenres.length > 15) {
            setValidationError("Maximum 15 genres allowed");
            return;
        }

        setIsLoading(true);
        setValidationError("");

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setValidationError("Authentication required. Please login again.");
                setIsLoading(false);
                return;
            }

            // Genre verilerini backend için hazırla
            const genresData = selectedGenres.map((genreKey, index) => {
                const found = GENRES_LIST.find(g => g.key === genreKey);
                return {
                    name: found?.label || genreKey,
                    key: genreKey,
                    color: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6'][index % 7],
                    percentage: Math.floor(Math.random() * 30) + 10
                };
            });

            console.log("🔄 Updating genres:", genresData);

            // Backend'e genre güncellemesi gönder
            const response = await axios.put(
                `${API_BASE}/api/auth/me`,
                { favoriteGenres: genresData },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("✅ Backend response:", response.data);

            // Backend'den gelen güncellenmiş kullanıcı bilgilerini state'e set et
            if (response.data.user) {
                setGamer(response.data.user);
            } else if (response.data) {
                setGamer(response.data);
            }

            setEditingSection(null);
            setShowToast(true);

            console.log("✅ Genres successfully updated and state synchronized");

        } catch (error) {
            console.error("❌ Genres update failed:", error);

            if (error.response) {
                console.error("❌ Response data:", error.response.data);
                console.error("❌ Response status:", error.response.status);
            }

            if (error.response?.status === 401) {
                setValidationError("Session expired. Please login again.");
                localStorage.removeItem("token");
            } else if (error.response?.status === 400) {
                setValidationError(error.response.data.message || "Invalid genre data");
            } else if (error.response?.status === 500) {
                setValidationError("Server error. Please try again later.");
            } else if (error.code === 'NETWORK_ERROR' || !error.response) {
                setValidationError("Network error. Please check your connection.");
            } else {
                setValidationError(`Update failed: ${error.response?.data?.message || error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const cancelEditing = () => {
        setEditingSection(null);
        setSelectedGenres(gamer?.favoriteGenres?.map(g => g.key || g.name?.toLowerCase() || g) || []);
        setSearchFilter("");
        setShowTips(false);
        setValidationError("");
    };

    const isEmptyGenres = !gamer?.favoriteGenres || gamer.favoriteGenres.length === 0;
    const hasChanges = JSON.stringify(selectedGenres.sort()) !== JSON.stringify((gamer?.favoriteGenres?.map(g => {
        if (typeof g === 'string') return g;
        return g.key || g.name?.toLowerCase() || g;
    }) || []).sort());

    // Filter genres based on search
    const filteredGenres = GENRES_LIST.filter(genre =>
        genre.label.toLowerCase().includes(searchFilter.toLowerCase())
    );

    // Popular genres for quick selection examples - updated for VFX artist/game developer
    const genreExamples = [
        { category: "Visual Spectacle", genres: ["action", "adventure", "platformer"], description: "Games with stunning visuals" },
        { category: "Creative Expression", genres: ["sandbox", "simulation", "building"], description: "Perfect for creative minds" },
        { category: "Technical Challenge", genres: ["strategy", "puzzle", "management"], description: "Complex systems & mechanics" }
    ];

    // Get personality analysis
    const personality = getGenrePersonality();

    if (!gamer) {
        return (
            <div className="mb-8 relative">
                <div className="animate-pulse">
                    <div className="h-4 bg-white/10 rounded w-1/3 mb-4"></div>
                    <div className="h-20 bg-white/10 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-8 relative">
            {/* Success Toast */}
            {showToast && (
                <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse z-10">
                    ✓ Genres updated successfully!
                </div>
            )}

            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-white">Favorite Genres</h3>
                {!isEmptyGenres && editingSection !== 'genres' && (
                    <button
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all border border-white/10 hover:border-white/20"
                        onClick={startEditing}
                        title="Edit genres (Click to edit)"
                    >
                        <FaEdit size={12} />
                    </button>
                )}
                {editingSection === 'genres' && (
                    <button
                        onClick={() => setShowTips(!showTips)}
                        className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        <FaLightbulb size={10} />
                        {showTips ? 'Hide tips' : 'Show tips'}
                    </button>
                )}
            </div>

            {editingSection === 'genres' ? (
                <div className="space-y-4">
                    {/* Helpful Tips */}
                    {showTips && (
                        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                            <h4 className="text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                                <FaLightbulb size={12} />
                                Genre selection tips:
                            </h4>
                            <ul className="text-xs text-white/70 space-y-1">
                                <li>• Choose genres you actively play and enjoy</li>
                                <li>• Mix different types for better matchmaking</li>
                                <li>• Your genres help others understand your playstyle</li>
                                <li>• Maximum 15 genres allowed</li>
                                <li>• You can update these anytime</li>
                            </ul>
                        </div>
                    )}

                    {/* Quick Select Examples - Personalized for VFX/Game Dev */}
                    <div className="space-y-3">
                        <p className="text-xs text-white/50">Quick start for creative professionals:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {genreExamples.map((example, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedGenres(example.genres)}
                                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 rounded-lg transition-all text-left"
                                >
                                    <p className="text-white text-xs font-medium mb-1">{example.category}</p>
                                    <p className="text-white/60 text-xs mb-2">{example.description}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {example.genres.map((genre, i) => {
                                            const genreObj = GENRES_LIST.find(g => g.key === genre);
                                            return (
                                                <span key={i} className="text-xs text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full">
                                                    {genreObj?.label || genre}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Selected Genres Display */}
                    {selectedGenres.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-white/50">Selected genres:</p>
                                <button
                                    onClick={() => setSelectedGenres([])}
                                    className="flex items-center gap-1 px-2 py-1 text-xs text-red-400 hover:text-red-300 transition-colors hover:bg-red-500/10 rounded"
                                >
                                    <FaTimes size={8} />
                                    Clear all
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {selectedGenres.map((genreKey) => {
                                    const genre = GENRES_LIST.find(g => g.key === genreKey);
                                    return (
                                        <button
                                            key={genreKey}
                                            onClick={() => toggleSelection(genreKey)}
                                            className="flex items-center gap-2 px-3 py-1 bg-purple-600/30 border-purple-500 text-white rounded-full text-xs transition-all hover:bg-purple-600/40 border"
                                        >
                                            {genre?.label || genreKey}
                                            <FaTimes size={8} className="text-purple-300" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Search Filter */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search genres..."
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            className="w-full p-3 glass-dark rounded-lg border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-purple-500/50 transition-colors"
                            disabled={isLoading}
                        />
                        {searchFilter && (
                            <button
                                onClick={() => setSearchFilter("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                            >
                                <FaTimes size={12} />
                            </button>
                        )}
                    </div>

                    {/* Genres Grid */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-white/50">
                                {searchFilter ? `Found ${filteredGenres.length} genres` : 'All genres'}
                            </p>
                            <p className="text-xs text-purple-400">
                                {selectedGenres.length}/15 selected
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto custom-scrollbar">
                            {filteredGenres.map(genre => (
                                <button
                                    key={genre.key}
                                    onClick={() => toggleSelection(genre.key)}
                                    disabled={isLoading || (!selectedGenres.includes(genre.key) && selectedGenres.length >= 15)}
                                    className={`p-3 rounded-lg text-sm transition-all ${
                                        selectedGenres.includes(genre.key)
                                            ? 'bg-purple-600/30 border-purple-500 text-white scale-95'
                                            : selectedGenres.length >= 15
                                                ? 'glass-dark border-white/10 text-white/30 cursor-not-allowed opacity-50'
                                                : 'glass-dark border-white/10 text-white/70 hover:bg-white/5 hover:scale-95'
                                    } border`}
                                >
                                    {genre.label}
                                    {selectedGenres.includes(genre.key) && (
                                        <FaCheck size={10} className="ml-auto text-purple-300 float-right mt-0.5" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Validation Messages */}
                    {validationError && (
                        <div className="text-red-400 text-xs flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <FaTimes size={10} />
                            {validationError}
                        </div>
                    )}

                    {/* Selection Info & Keyboard shortcuts */}
                    <div className="flex items-center gap-4 text-xs text-white/40">
                        <div className="flex items-center gap-1">
                            <FaKeyboard size={10} />
                            <span>Ctrl+Enter to save</span>
                        </div>
                        <div>Esc to cancel</div>
                        <div className="ml-auto">
                            <span className={`${selectedGenres.length >= 15 ? 'text-yellow-400' : 'text-purple-400'}`}>
                                {selectedGenres.length}/15 selected
                            </span>
                        </div>
                    </div>

                    {/* Smart button states */}
                    <div className="flex gap-2">
                        <button
                            onClick={saveEdit}
                            disabled={isLoading || !hasChanges || selectedGenres.length === 0}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                                isLoading || !hasChanges || selectedGenres.length === 0
                                    ? 'bg-gray-600/50 text-white/50 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FaCheck size={12} />
                                    Save {selectedGenres.length > 0 && `(${selectedGenres.length})`}
                                </>
                            )}
                        </button>
                        <button
                            onClick={cancelEditing}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
                        >
                            <FaTimes size={12} /> Cancel
                        </button>
                    </div>
                </div>
            ) : isEmptyGenres ? (
                <div className="space-y-4">
                    {/* More engaging empty state */}
                    <button
                        onClick={startEditing}
                        className="group relative flex items-center gap-4 p-6 glass-dark rounded-lg border border-white/10 hover:border-purple-500/30 hover:bg-white/5 transition-all duration-300 w-full overflow-hidden"
                    >
                        {/* Animated background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                            <FaStar className="text-purple-400 group-hover:text-purple-300 transition-colors" size={18} />
                        </div>
                        <div className="relative text-left flex-1">
                            <p className="text-white font-medium text-base mb-1 group-hover:text-purple-100 transition-colors">Add your favorite genres</p>
                            <p className="text-white/60 text-sm">Show your gaming preferences and discover your style</p>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center gap-1">
                                    <FaGamepad className="text-purple-400/60" size={12} />
                                    <FaHeart className="text-pink-400/60" size={12} />
                                    <FaFire className="text-orange-400/60" size={12} />
                                </div>
                                <span className="text-xs text-white/50">20+ genres available</span>
                            </div>
                        </div>
                        <div className="relative text-purple-400 group-hover:text-purple-300 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>

                    {/* Additional context */}
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="flex items-start gap-3">
                            <FaGamepad className="text-blue-400 mt-0.5" size={14} />
                            <div>
                                <p className="text-blue-300 text-sm font-medium mb-1">Discover your gaming personality</p>
                                <p className="text-white/70 text-xs leading-relaxed">
                                    Your favorite genres reveal your gaming style and help us suggest perfect teammates and experiences.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Genre Tags Display */}
                    <div className="flex flex-wrap gap-2">
                        {gamer.favoriteGenres.map((genre, i) => {
                            const key = typeof genre === 'string' ? genre : (genre.key || genre.name);
                            const name = typeof genre === 'string' ? genre : genre.name;
                            const color = typeof genre === 'object' ? genre.color : "#8B5CF6";
                            const genreObj = GENRES_LIST.find(g => g.key === key || g.label === name);

                            return (
                                <span
                                    key={i}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium glass-dark border border-white/10 rounded-full text-white/80 hover:bg-white/5 transition-colors"
                                >
                                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }}></div>
                                    {genreObj?.label || name || key}
                                </span>
                            );
                        })}
                    </div>

                    {/* Personalized Gaming Personality Card */}
                    {personality && (
                        <div className={`p-4 bg-gradient-to-r ${personality.color} border ${personality.borderColor} rounded-lg`}>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                    {personality.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="text-white font-bold text-sm">{personality.title}</h4>
                                        {personality.isBalanced && (
                                            <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full font-medium">
                                                Balanced
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-white/90 text-sm mb-3">{personality.description}</p>
                                    <p className="text-white/80 text-xs leading-relaxed mb-3">{personality.message}</p>

                                    {/* Personality Traits */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {personality.traits.map((trait, index) => (
                                            <span key={index} className="px-2 py-1 bg-white/15 text-white/90 text-xs rounded-full">
                                                {trait}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Stats for non-balanced personalities */}
                                    {!personality.isBalanced && (
                                        <div className="flex items-center gap-4 text-xs text-white/70">
                                            <span>{personality.dominantCount}/{personality.totalGenres} genres match</span>
                                            <span>•</span>
                                            <span>{personality.coverage}% coverage</span>
                                        </div>
                                    )}

                                    {/* Future AI recommendations hint */}
                                    <div className="mt-3 pt-3 border-t border-white/20">
                                        <div className="flex items-center gap-2">
                                            <FaBrain className="text-white/60" size={12} />
                                            <span className="text-white/60 text-xs">
                                                🤖 AI-powered game recommendations coming soon based on your personality!
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={startEditing}
                        className="flex items-center gap-2 p-3 glass-dark rounded-lg border border-dashed border-white/20 hover:border-purple-500/50 hover:bg-white/5 transition-all w-full justify-center text-white/60 hover:text-purple-400"
                    >
                        <FaPlus size={14} />
                        Add more genres
                    </button>

                    {/* Genre diversity bonus */}
                    <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <FaStar className="text-purple-400" size={14} />
                            <p className="text-purple-300 text-sm font-medium">Genre variety!</p>
                        </div>
                        <p className="text-white/70 text-xs">
                            You have {gamer.favoriteGenres.length} favorite genre{gamer.favoriteGenres.length !== 1 ? 's' : ''} - great for diverse gaming experiences!
                        </p>

                        {/* VFX/Game Dev specific encouragement */}
                        {gamer.favoriteGenres.length >= 5 && (
                            <div className="mt-2 pt-2 border-t border-purple-500/30">
                                <p className="text-purple-200 text-xs">
                                    💡 As a VFX artist and game developer, your diverse taste gives you great insight into different visual styles and gameplay mechanics!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(147, 51, 234, 0.5);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(147, 51, 234, 0.7);
                }
                .text-rainbow {
                    background: linear-gradient(45deg, #8B5CF6, #06B6D4, #10B981, #F59E0B);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
            `}</style>
        </div>
    );
};

export default GenresSection;