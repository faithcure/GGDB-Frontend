import React, { useState, useEffect } from "react";
import { FaEdit, FaCheck, FaTimes, FaGamepad, FaPlus, FaUsers, FaKeyboard, FaLightbulb, FaTrophy } from "react-icons/fa";
import { PLATFORM_LIST } from "../../../../../data/gameConstants";
import axios from "axios";
import { API_BASE } from "../../../../../config/api";


const PlatformsSection = ({ gamer, setGamer, editingSection, setEditingSection, canEdit = false }) => {
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
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

    // Update selectedPlatforms when gamer platforms change
    useEffect(() => {
        if (gamer?.platforms && editingSection !== 'platforms') {
            const platformKeys = gamer.platforms.map(p => {
                if (typeof p === 'string') return p;
                return p.key || p.name?.toLowerCase() || p;
            });
            setSelectedPlatforms(platformKeys);
        }
    }, [gamer?.platforms, editingSection]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (editingSection === 'platforms') {
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
    }, [editingSection, selectedPlatforms]);

    const startEditing = () => {
        const currentPlatforms = gamer?.platforms?.map(p => {
            if (typeof p === 'string') return p;
            return p.key || p.name?.toLowerCase() || p;
        }) || [];
        setSelectedPlatforms(currentPlatforms);
        setEditingSection('platforms');
        setSearchFilter("");
        setValidationError("");
    };

    const toggleSelection = (item) => {
        setSelectedPlatforms(prev =>
            prev.includes(item)
                ? prev.filter(i => i !== item)
                : [...prev, item]
        );
    };

    const saveEdit = async () => {
        if (selectedPlatforms.length === 0) {
            setValidationError("Please select at least one platform");
            return;
        }

        if (selectedPlatforms.length > 10) {
            setValidationError("Maximum 10 platforms allowed");
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

            // Platform verilerini backend için hazırla
            const platformsData = selectedPlatforms.map(platformKey => {
                const found = PLATFORM_LIST.find(p => p.key === platformKey);
                return {
                    key: platformKey,
                    name: found?.label || platformKey,
                    verified: false // Başlangıçta false, daha sonra doğrulanabilir
                };
            });

            console.log("🔄 Updating platforms:", platformsData);

            const response = await axios.put(
                `${API_BASE}/api/auth/me`,
                { platforms: platformsData },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("✅ Backend response:", response.data);

            // Backend response handling - farklı formatları destekle
            let updatedUser = null;

            if (response.data.user) {
                // Response format: { message: "...", user: {...} }
                updatedUser = response.data.user;
            } else if (response.data && response.data._id) {
                // Response format: { _id: "...", username: "...", platforms: [...] }
                updatedUser = response.data;
            } else {
                // Fallback: mevcut user'ı güncelle
                updatedUser = { ...gamer, platforms: platformsData };
            }

            console.log("🔄 Setting updated user:", updatedUser);

            // State'i güncelle
            setGamer(updatedUser);
            setEditingSection(null);
            setShowToast(true);

            console.log("✅ Platforms successfully updated and state synchronized");

        } catch (error) {
            console.error("❌ Platforms update failed:", error);

            if (error.response) {
                console.error("❌ Response data:", error.response.data);
                console.error("❌ Response status:", error.response.status);
            }

            if (error.response?.status === 401) {
                setValidationError("Session expired. Please login again.");
                localStorage.removeItem("token");
            } else if (error.response?.status === 400) {
                setValidationError(error.response.data.message || "Invalid platform data");
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
        setSelectedPlatforms(gamer?.platforms?.map(p => p.key || p.name?.toLowerCase() || p) || []);
        setSearchFilter("");
        setShowTips(false);
        setValidationError("");
    };

    const isEmptyPlatforms = !gamer?.platforms || gamer.platforms.length === 0;
    const hasChanges = JSON.stringify(selectedPlatforms.sort()) !== JSON.stringify((gamer?.platforms?.map(p => {
        if (typeof p === 'string') return p;
        return p.key || p.name?.toLowerCase() || p;
    }) || []).sort());

    // Filter platforms based on search
    const filteredPlatforms = PLATFORM_LIST.filter(platform =>
        platform.label.toLowerCase().includes(searchFilter.toLowerCase())
    );

    // Popular platforms for quick selection - mevcut PLATFORM_LIST'e göre
    const popularPlatforms = ['steam', 'epic', 'gog', 'psstore', 'xboxstore', 'nintendoeshop'];
    const quickSelectPlatforms = PLATFORM_LIST.filter(p => popularPlatforms.includes(p.key));

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
                    ✓ Platforms updated successfully!
                </div>
            )}

            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-white">Gaming Platforms</h3>
                {canEdit && !isEmptyPlatforms && editingSection !== 'platforms' && (
                    <button
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all border border-white/10 hover:border-white/20"
                        onClick={startEditing}
                        title="Edit platforms (Click to edit)"
                    >
                        <FaEdit size={12} />
                    </button>
                )}
                {editingSection === 'platforms' && (
                    <button
                        onClick={() => setShowTips(!showTips)}
                        className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        <FaLightbulb size={10} />
                        {showTips ? 'Hide tips' : 'Show tips'}
                    </button>
                )}
            </div>

            {editingSection === 'platforms' && (
                <div className="space-y-4">
                    {/* Helpful Tips */}
                    {showTips && (
                        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                            <h4 className="text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                                <FaLightbulb size={12} />
                                Platform selection tips:
                            </h4>
                            <ul className="text-xs text-white/70 space-y-1">
                                <li>• Add platforms you actively play on</li>
                                <li>• More platforms = more potential teammates</li>
                                <li>• Cross-platform games work better with multiple selections</li>
                                <li>• Maximum 10 platforms allowed</li>
                                <li>• You can always update this later</li>
                            </ul>
                        </div>
                    )}

                    {/* Quick Select Selected Platforms */}
                    {selectedPlatforms.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs text-white/50">Selected platforms:</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedPlatforms.map((platformKey) => {
                                    const platform = PLATFORM_LIST.find(p => p.key === platformKey);
                                    return (
                                        <button
                                            key={platformKey}
                                            onClick={() => toggleSelection(platformKey)}
                                            className="flex items-center gap-2 px-3 py-1 bg-purple-600/30 border-purple-500 text-white rounded-full text-xs transition-all hover:bg-purple-600/40 border"
                                        >
                                            {platform?.icon}
                                            {platform?.label}
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
                            placeholder="Search platforms..."
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

                    {/* Platform Grid */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-white/50">
                                {searchFilter ? `Found ${filteredPlatforms.length} platforms` : 'All platforms'}
                            </p>
                            <p className="text-xs text-purple-400">
                                {selectedPlatforms.length}/10 selected
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto custom-scrollbar">
                            {filteredPlatforms.map(platform => (
                                <button
                                    key={platform.key}
                                    onClick={() => toggleSelection(platform.key)}
                                    disabled={!selectedPlatforms.includes(platform.key) && selectedPlatforms.length >= 10}
                                    className={`flex items-center gap-2 p-3 rounded-lg text-sm transition-all ${
                                        selectedPlatforms.includes(platform.key)
                                            ? 'bg-purple-600/30 border-purple-500 text-white scale-95'
                                            : selectedPlatforms.length >= 10
                                                ? 'glass-dark border-white/10 text-white/30 cursor-not-allowed opacity-50'
                                                : 'glass-dark border-white/10 text-white/70 hover:bg-white/5 hover:scale-95'
                                    } border`}
                                >
                                    {platform.icon}
                                    {platform.label}
                                    {selectedPlatforms.includes(platform.key) && (
                                        <FaCheck size={10} className="ml-auto text-purple-300" />
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

                    {/* Selection Counter & Progress */}
                    <div className="flex items-center gap-4 text-xs text-white/40">
                        <div className="flex items-center gap-1">
                            <FaKeyboard size={10} />
                            <span>Ctrl+Enter to save</span>
                        </div>
                        <div>Esc to cancel</div>
                        <div className="ml-auto">
                            <span className={`${selectedPlatforms.length >= 10 ? 'text-yellow-400' : 'text-purple-400'}`}>
                                {selectedPlatforms.length}/10 selected
                            </span>
                        </div>
                    </div>

                    {/* Smart button states */}
                    <div className="flex gap-2">
                        <button
                            onClick={saveEdit}
                            disabled={isLoading || !hasChanges || selectedPlatforms.length === 0}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                                isLoading || !hasChanges || selectedPlatforms.length === 0
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
                                    Save {selectedPlatforms.length > 0 && `(${selectedPlatforms.length})`}
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
            )}

            {canEdit && isEmptyPlatforms && (
                <div className="space-y-4">
                    {/* More engaging empty state */}
                    <button
                        onClick={startEditing}
                        className="group relative flex items-center gap-4 p-6 glass-dark rounded-lg border border-white/10 hover:border-purple-500/30 hover:bg-white/5 transition-all duration-300 w-full overflow-hidden"
                    >
                        {/* Animated background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                            <FaGamepad className="text-purple-400 group-hover:text-purple-300 transition-colors" size={18} />
                        </div>
                        <div className="relative text-left flex-1">
                            <p className="text-white font-medium text-base mb-1 group-hover:text-purple-100 transition-colors">Add your gaming platforms</p>
                            <p className="text-white/60 text-sm">Let others know where you play</p>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex -space-x-1">
                                    {quickSelectPlatforms.slice(0, 4).map((platform, i) => (
                                        <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400/60 to-blue-400/60 border border-white/20 flex items-center justify-center text-xs">
                                            {platform.icon}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-xs text-white/50">{PLATFORM_LIST.length}+ platforms available</span>
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
                            <FaUsers className="text-blue-400 mt-0.5" size={14} />
                            <div>
                                <p className="text-blue-300 text-sm font-medium mb-1">Cross-platform gaming</p>
                                <p className="text-white/70 text-xs leading-relaxed">
                                    Adding multiple platforms helps you find teammates for cross-platform games and shows your gaming versatility.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!isEmptyPlatforms && (
                <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {gamer.platforms.map((platform, i) => {
                            const platformKey = typeof platform === 'string' ? platform : platform.key;
                            const platformName = typeof platform === 'string' ? platform : platform.name;
                            const isVerified = typeof platform === 'object' ? platform.verified : false;
                            const username = typeof platform === 'object' ? platform.username : '';

                            const foundPlatform = PLATFORM_LIST.find(p =>
                                p.key === platformKey ||
                                p.key === platformName?.toLowerCase() ||
                                p.label === platformName
                            );

                            return (
                                <div key={i} className="flex items-center justify-between p-4 glass-dark rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className="text-white/60 text-lg">{foundPlatform?.icon || <FaGamepad />}</div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-medium">
                                                    {foundPlatform?.label || platformName || platformKey}
                                                </span>
                                                {isVerified && (
                                                    <div className="w-2 h-2 bg-green-400 rounded-full" title="Verified"></div>
                                                )}
                                            </div>
                                            {username && (
                                                <span className="text-white/50 text-xs">@{username}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {canEdit && (
                      <button
                          onClick={startEditing}
                          className="flex items-center gap-2 p-3 glass-dark rounded-lg border border-dashed border-white/20 hover:border-purple-500/50 hover:bg-white/5 transition-all w-full justify-center text-white/60 hover:text-purple-400"
                      >
                          <FaPlus size={14} />
                          Add more platforms
                      </button>
                    )}

                    {/* Contextual edit hint */}
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-center gap-2">
                            <FaTrophy className="text-green-400" size={14} />
                            <p className="text-green-300 text-sm font-medium">Platform diversity bonus!</p>
                        </div>
                        <p className="text-white/70 text-xs mt-1">
                            You have {gamer.platforms.length} platform{gamer.platforms.length !== 1 ? 's' : ''} - great for finding cross-platform teammates!
                        </p>
                    </div>
                </div>
            )}

            {isEmptyPlatforms && !canEdit && (
                // Read-only empty state
                <div className="p-6 glass-dark rounded-lg border border-white/10 text-center">
                    <FaGamepad className="text-white/40 text-2xl mx-auto mb-3" />
                    <p className="text-white/60 text-sm">No gaming platforms added yet</p>
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
            `}</style>
        </div>
    );
};

export default PlatformsSection;