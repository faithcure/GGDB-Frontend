import React, { useState, useEffect } from "react";
import { FaEdit, FaCheck, FaTimes, FaDesktop, FaPlus, FaKeyboard, FaLightbulb, FaGamepad, FaTv, FaMobile } from "react-icons/fa";
import { CONSOLES_LIST } from "../../../../../data/gameConstants";
import axios from "axios";
import { API_BASE } from "../../../../../config/api";


const ConsolesSection = ({ gamer, setGamer, editingSection, setEditingSection }) => {
    const [selectedConsoles, setSelectedConsoles] = useState([]);
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

    // Update selectedConsoles when gamer consoles change
    useEffect(() => {
        if (gamer?.favoriteConsoles && editingSection !== 'consoles') {
            const consoleKeys = gamer.favoriteConsoles.map(c => {
                if (typeof c === 'string') return c;
                return c.key || c.name?.toLowerCase() || c;
            });
            setSelectedConsoles(consoleKeys);
        }
    }, [gamer?.favoriteConsoles, editingSection]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (editingSection === 'consoles') {
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
    }, [editingSection, selectedConsoles]);

    const startEditing = () => {
        const currentConsoles = gamer?.favoriteConsoles?.map(c => {
            if (typeof c === 'string') return c;
            return c.key || c.name?.toLowerCase() || c;
        }) || [];
        setSelectedConsoles(currentConsoles);
        setEditingSection('consoles');
        setSearchFilter("");
        setValidationError("");
    };

    const toggleSelection = (item) => {
        setSelectedConsoles(prev =>
            prev.includes(item)
                ? prev.filter(i => i !== item)
                : [...prev, item]
        );
    };

    const saveEdit = async () => {
        if (selectedConsoles.length === 0) {
            setValidationError("Please select at least one console");
            return;
        }

        if (selectedConsoles.length > 20) {
            setValidationError("Maximum 20 consoles allowed");
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

            // Console verilerini backend için hazırla
            const consolesData = selectedConsoles.map(consoleKey => {
                const found = CONSOLES_LIST.find(c => c.key === consoleKey);
                return {
                    name: found?.label || consoleKey,
                    key: consoleKey,
                    generation: found?.generation || 'Unknown',
                    addedAt: new Date()
                };
            });

            console.log("🔄 Updating consoles:", consolesData);

            // Backend'e console güncellemesi gönder
            const response = await axios.put(
                `${API_BASE}/api/auth/me`,
                { favoriteConsoles: consolesData },
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

            console.log("✅ Consoles successfully updated and state synchronized");

        } catch (error) {
            console.error("❌ Consoles update failed:", error);

            if (error.response) {
                console.error("❌ Response data:", error.response.data);
                console.error("❌ Response status:", error.response.status);
            }

            if (error.response?.status === 401) {
                setValidationError("Session expired. Please login again.");
                localStorage.removeItem("token");
            } else if (error.response?.status === 400) {
                setValidationError(error.response.data.message || "Invalid console data");
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
        setSelectedConsoles(gamer?.favoriteConsoles?.map(c => c.key || c.name?.toLowerCase() || c) || []);
        setSearchFilter("");
        setShowTips(false);
        setValidationError("");
    };

    const isEmptyConsoles = !gamer?.favoriteConsoles || gamer.favoriteConsoles.length === 0;
    const hasChanges = JSON.stringify(selectedConsoles.sort()) !== JSON.stringify((gamer?.favoriteConsoles?.map(c => {
        if (typeof c === 'string') return c;
        return c.key || c.name?.toLowerCase() || c;
    }) || []).sort());

    // Filter consoles based on search
    const filteredConsoles = CONSOLES_LIST.filter(console =>
        console.label.toLowerCase().includes(searchFilter.toLowerCase())
    );

    // Console generation examples
    const consoleGenerations = [
        { category: "Current Gen", consoles: ["ps5", "xbox-series", "nintendo-switch"] },
        { category: "Classic", consoles: ["ps4", "xbox-one", "nintendo-3ds"] },
        { category: "Retro", consoles: ["ps2", "xbox-original", "nintendo-64"] }
    ];

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
                    ✓ Consoles updated successfully!
                </div>
            )}

            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-white">Favorite Consoles</h3>
                {!isEmptyConsoles && editingSection !== 'consoles' && (
                    <button
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all border border-white/10 hover:border-white/20"
                        onClick={startEditing}
                        title="Edit consoles (Click to edit)"
                    >
                        <FaEdit size={12} />
                    </button>
                )}
                {editingSection === 'consoles' && (
                    <button
                        onClick={() => setShowTips(!showTips)}
                        className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        <FaLightbulb size={10} />
                        {showTips ? 'Hide tips' : 'Show tips'}
                    </button>
                )}
            </div>

            {editingSection === 'consoles' ? (
                <div className="space-y-4">
                    {/* Helpful Tips */}
                    {showTips && (
                        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                            <h4 className="text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                                <FaLightbulb size={12} />
                                Console selection tips:
                            </h4>
                            <ul className="text-xs text-white/70 space-y-1">
                                <li>• Add consoles you own or regularly play on</li>
                                <li>• Include both current and retro favorites</li>
                                <li>• Your console list helps others find compatible teammates</li>
                                <li>• Nostalgic choices can spark great conversations</li>
                                <li>• Maximum 20 consoles allowed</li>
                            </ul>
                        </div>
                    )}

                    {/* Quick Select by Generation */}
                    <div className="space-y-3">
                        <p className="text-xs text-white/50">Quick start by generation:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {consoleGenerations.map((generation, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedConsoles(generation.consoles)}
                                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 rounded-lg transition-all text-left"
                                >
                                    <p className="text-white text-xs font-medium mb-1">{generation.category}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {generation.consoles.map((consoleKey, i) => {
                                            const consoleObj = CONSOLES_LIST.find(c => c.key === consoleKey);
                                            return (
                                                <span key={i} className="text-xs text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full">
                                                    {consoleObj?.label || consoleKey}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Selected Consoles Display */}
                    {selectedConsoles.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs text-white/50">Selected consoles:</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedConsoles.map((consoleKey) => {
                                    const console = CONSOLES_LIST.find(c => c.key === consoleKey);
                                    return (
                                        <button
                                            key={consoleKey}
                                            onClick={() => toggleSelection(consoleKey)}
                                            className="flex items-center gap-2 px-3 py-1 bg-purple-600/30 border-purple-500 text-white rounded-full text-xs transition-all hover:bg-purple-600/40 border"
                                        >
                                            {console?.icon}
                                            {console?.label || consoleKey}
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
                            placeholder="Search consoles..."
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

                    {/* Consoles Grid */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-white/50">
                                {searchFilter ? `Found ${filteredConsoles.length} consoles` : 'All consoles'}
                            </p>
                            <p className="text-xs text-purple-400">
                                {selectedConsoles.length}/20 selected
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto custom-scrollbar">
                            {filteredConsoles.map(console => (
                                <button
                                    key={console.key}
                                    onClick={() => toggleSelection(console.key)}
                                    disabled={!selectedConsoles.includes(console.key) && selectedConsoles.length >= 20}
                                    className={`flex items-center gap-3 p-3 rounded-lg text-sm transition-all ${
                                        selectedConsoles.includes(console.key)
                                            ? 'bg-purple-600/30 border-purple-500 text-white scale-95'
                                            : selectedConsoles.length >= 20
                                                ? 'glass-dark border-white/10 text-white/30 cursor-not-allowed opacity-50'
                                                : 'glass-dark border-white/10 text-white/70 hover:bg-white/5 hover:scale-95'
                                    } border`}
                                >
                                    {console.icon}
                                    {console.label}
                                    {selectedConsoles.includes(console.key) && (
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

                    {/* Selection Info & Keyboard shortcuts */}
                    <div className="flex items-center gap-4 text-xs text-white/40">
                        <div className="flex items-center gap-1">
                            <FaKeyboard size={10} />
                            <span>Ctrl+Enter to save</span>
                        </div>
                        <div>Esc to cancel</div>
                        <div className="ml-auto">
                            <span className={`${selectedConsoles.length >= 20 ? 'text-yellow-400' : 'text-purple-400'}`}>
                                {selectedConsoles.length}/20 selected
                            </span>
                        </div>
                    </div>

                    {/* Smart button states */}
                    <div className="flex gap-2">
                        <button
                            onClick={saveEdit}
                            disabled={isLoading || !hasChanges || selectedConsoles.length === 0}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                                isLoading || !hasChanges || selectedConsoles.length === 0
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
                                    Save {selectedConsoles.length > 0 && `(${selectedConsoles.length})`}
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
            ) : isEmptyConsoles ? (
                <div className="space-y-4">
                    {/* More engaging empty state */}
                    <button
                        onClick={startEditing}
                        className="group relative flex items-center gap-4 p-6 glass-dark rounded-lg border border-white/10 hover:border-purple-500/30 hover:bg-white/5 transition-all duration-300 w-full overflow-hidden"
                    >
                        {/* Animated background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                            <FaDesktop className="text-purple-400 group-hover:text-purple-300 transition-colors" size={18} />
                        </div>
                        <div className="relative text-left flex-1">
                            <p className="text-white font-medium text-base mb-1 group-hover:text-purple-100 transition-colors">Add your favorite consoles</p>
                            <p className="text-white/60 text-sm">Share your gaming hardware journey</p>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center gap-1">
                                    <FaGamepad className="text-purple-400/60" size={12} />
                                    <FaTv className="text-blue-400/60" size={12} />
                                    <FaMobile className="text-green-400/60" size={12} />
                                </div>
                                <span className="text-xs text-white/50">All generations available</span>
                            </div>
                        </div>
                        <div className="relative text-purple-400 group-hover:text-purple-300 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>

                    {/* Additional context */}
                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <div className="flex items-start gap-3">
                            <FaDesktop className="text-orange-400 mt-0.5" size={14} />
                            <div>
                                <p className="text-orange-300 text-sm font-medium mb-1">Gaming nostalgia</p>
                                <p className="text-white/70 text-xs leading-relaxed">
                                    Your console history tells your gaming story and helps find others with shared experiences.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {gamer.favoriteConsoles.map((console, i) => {
                            const key = typeof console === 'string' ? console : (console.key || console.name);
                            const name = typeof console === 'string' ? console : console.name;
                            const consoleObj = CONSOLES_LIST.find(c => c.key === key || c.label === name);

                            if (!consoleObj && !name) return null;

                            return (
                                <div key={i} className="flex items-center justify-between p-4 glass-dark border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className="text-white/60 text-lg">
                                            {consoleObj?.icon || <FaGamepad />}
                                        </div>
                                        <div className="text-white font-medium">
                                            {consoleObj?.label || name || key}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <button
                        onClick={startEditing}
                        className="flex items-center gap-2 p-3 glass-dark rounded-lg border border-dashed border-white/20 hover:border-purple-500/50 hover:bg-white/5 transition-all w-full justify-center text-white/60 hover:text-purple-400"
                    >
                        <FaPlus size={14} />
                        Add more consoles
                    </button>

                    {/* Console heritage bonus */}
                    <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                        <div className="flex items-center gap-2">
                            <FaGamepad className="text-indigo-400" size={14} />
                            <p className="text-indigo-300 text-sm font-medium">Gaming heritage!</p>
                        </div>
                        <p className="text-white/70 text-xs mt-1">
                            You have {gamer.favoriteConsoles.length} console{gamer.favoriteConsoles.length !== 1 ? 's' : ''} - awesome gaming history!
                        </p>
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
            `}</style>
        </div>
    );
};

export default ConsolesSection;