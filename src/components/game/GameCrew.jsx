// src/components/game/GameCrew.jsx - Updated with roles array support
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import EditContributorsModal from "../game/EditContributorsModal";
import axios from "axios";
import { API_BASE } from "../../config/api";


// Helper function to check if user is logged in
const isLoggedIn = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        return user && user._id;
    } catch {
        return false;
    }
};

const generateFallbackImage = (name) => {
    const safeName = name && typeof name === 'string' ? name : 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(safeName)}&background=random&color=fff&size=48`;
};

// 🆕 Helper function to format crew member roles for display
const formatCrewRoles = (crewMember) => {
    // 🆕 NEW FORMAT: Check if roles array exists
    if (crewMember.roles && Array.isArray(crewMember.roles) && crewMember.roles.length > 0) {
        return crewMember.roles.map(role => role.name).join(' & ');
    }

    // 🔧 BACKWARD COMPATIBILITY: Use legacy role field
    if (crewMember.role) {
        return crewMember.role;
    }

    return 'Contributor';
};

// 🆕 Helper function to get primary department
const getPrimaryDepartment = (crewMember) => {
    // 🆕 NEW FORMAT: Get first department from roles array
    if (crewMember.roles && Array.isArray(crewMember.roles) && crewMember.roles.length > 0) {
        return crewMember.roles[0].department || null;
    }

    // 🔧 BACKWARD COMPATIBILITY: Use legacy department field
    return crewMember.department || null;
};

// 🆕 Helper function to get all departments for a crew member
const getAllDepartments = (crewMember) => {
    // 🆕 NEW FORMAT: Extract all departments from roles array
    if (crewMember.roles && Array.isArray(crewMember.roles) && crewMember.roles.length > 0) {
        const departments = [...new Set(crewMember.roles.map(role => role.department))];
        return departments.filter(dept => dept && dept.trim() !== ""); // Remove empty departments
    }

    // 🔧 BACKWARD COMPATIBILITY: Use legacy department field
    return crewMember.department && crewMember.department.trim() !== "" ? [crewMember.department] : [];
};

const GameCrew = ({ crewList, gameId, onCrewUpdate }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentCrewList, setCurrentCrewList] = useState(crewList || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const userIsLoggedIn = isLoggedIn();

    // Sync with props when they change
    useEffect(() => {
        setCurrentCrewList(crewList || []);
    }, [crewList]);

    // Fetch latest crew data from backend
    const fetchCrewData = async () => {
        if (!gameId) return;

        try {
            const response = await axios.get(`${API_BASE}/api/games/${gameId}/contributors`);
            const { crewList: latestCrewList } = response.data;
            setCurrentCrewList(latestCrewList || []);
            setError(null);
        } catch (error) {
            console.error("Error fetching crew data:", error);
            setError("Failed to load crew data");
        }
    };

    // Load fresh data when component mounts
    useEffect(() => {
        fetchCrewData();
    }, [gameId]);

    const handleEditContributors = () => {
        setIsEditModalOpen(true);
    };

    const handleSaveContributors = async (updatedList) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                setCurrentCrewList(updatedList);
                if (onCrewUpdate) {
                    onCrewUpdate(updatedList);
                }
                return;
            }

            // Save to backend
            await axios.put(`${API_BASE}/api/games/${gameId}/contributors`, {
                crewList: updatedList
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("✅ Contributors saved successfully");
            setCurrentCrewList(updatedList);
            setError(null);

            // Notify parent component if callback provided
            if (onCrewUpdate) {
                onCrewUpdate(updatedList);
            }

        } catch (error) {
            console.error("❌ Error saving contributors:", error);
            setError("Failed to save contributors");
            // Still update local state for better UX
            setCurrentCrewList(updatedList);
        } finally {
            setLoading(false);
        }
    };

    // Show only first 4 contributors
    const displayedCrew = currentCrewList.slice(0, 4);
    const remainingCount = currentCrewList.length - 4;

    // Show component even if no crew, but with different content
    const hasAnyCrew = currentCrewList?.length > 0;

    return (
        <section className="max-w-7xl mx-auto px-6 py-10 border-t border-gray-800">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Crew & Contributors</h2>

                {/* Edit Contributors Button - Visible to all logged-in users */}
                {userIsLoggedIn && (
                    <button
                        onClick={handleEditContributors}
                        disabled={loading}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-white/70 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaEdit className="text-sm group-hover:rotate-12 transition-transform duration-200" />
                        <span className="font-medium text-sm">Edit Contributors</span>
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                    <button
                        onClick={fetchCrewData}
                        className="text-red-300 hover:text-red-200 text-xs underline mt-1"
                    >
                        Try again
                    </button>
                </div>
            )}

            <div className="grid sm:grid-cols-2 gap-6">
                {hasAnyCrew ? (
                    displayedCrew.map((person, index) => {
                        // 🆕 Enhanced crew member display
                        const displayRoles = formatCrewRoles(person);
                        const primaryDepartment = getPrimaryDepartment(person);
                        const allDepartments = getAllDepartments(person);

                        return (
                            <div
                                key={person.id || index}
                                className="flex items-center gap-4 bg-white/5 p-4 rounded-lg hover:bg-white/10 transition group"
                            >
                                <img
                                    src={person.image || generateFallbackImage(person.name)}
                                    alt={person.name}
                                    className="w-12 h-12 rounded-full object-cover border border-white/20"
                                    onError={(e) => {
                                        console.log('Image load failed for:', e.target.src);
                                        e.target.src = generateFallbackImage(person.name);
                                        e.target.onerror = null; // Prevent infinite loop
                                    }}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Link
                                            to={`/person/${encodeURIComponent(person.name.toLowerCase().replace(/\s+/g, "-"))}`}
                                            className="text-white font-medium leading-tight truncate hover:underline hover:text-yellow-400 transition-colors"
                                        >
                                            {person.name}
                                        </Link>
                                        {/* 🆕 Verified user indicator */}
                                        {person.isRegisteredUser && (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                                                ✓
                                            </span>
                                        )}
                                    </div>

                                    {/* 🆕 Enhanced role display */}
                                    <p className="text-white/60 text-sm truncate" title={displayRoles}>
                                        {displayRoles}
                                    </p>

                                    {/* 🆕 Department indicator (for multiple departments) */}
                                    {allDepartments.length > 1 && (
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="text-xs text-white/40">
                                                {allDepartments.slice(0, 2).join(', ')}
                                                {allDepartments.length > 2 && ` +${allDepartments.length - 2}`}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* 🆕 Department color indicator */}
                                {primaryDepartment && (
                                    <div className="flex flex-col items-end gap-1">
                                        <div
                                            className="w-3 h-3 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"
                                            style={{
                                                backgroundColor: getDepartmentColor(primaryDepartment)
                                            }}
                                            title={`Primary: ${primaryDepartment}`}
                                        />
                                        {allDepartments.length > 1 && (
                                            <span className="text-xs text-white/40">
                                                +{allDepartments.length - 1}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-2 text-center py-8 text-white/60">
                        <p className="text-lg">No crew information available yet.</p>
                        <p className="text-sm mt-2">Contributors can be added by registered users.</p>
                    </div>
                )}
            </div>

            <div className="mt-12 space-y-4 border-t border-white/10 pt-6">
                <div className="flex justify-between items-center text-white/90">
                    <Link to={`/game/${gameId}/cast-crew`} className="font-semibold text-yellow-400 hover:underline">
                        {hasAnyCrew && remainingCount > 0
                            ? `All cast & crew (+${remainingCount} more)`
                            : "All cast & crew"
                        }
                    </Link>
                    <span className="text-white/50 text-lg">›</span>
                </div>
                <div className="flex justify-between items-center text-white/90">
                    <span className="font-semibold">Production, box office & more at GGDBPro</span>
                    <span className="text-white/50 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3h7v7m0 0L10 21l-7-7 11-11z" />
                        </svg>
                    </span>
                </div>
            </div>

            {/* Edit Contributors Modal - Available to all logged-in users */}
            {userIsLoggedIn && (
                <EditContributorsModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    gameId={gameId}
                    crewList={currentCrewList}
                    onSave={handleSaveContributors}
                />
            )}
        </section>
    );
};

// 🆕 Helper function to get department color
const getDepartmentColor = (department) => {
    const colors = {
        'Art': '#8B5CF6',          // Purple
        'Programming': '#3B82F6',  // Blue
        'Design': '#10B981',       // Green
        'Audio': '#F59E0B',        // Orange
        'Production': '#EF4444',   // Red
        'Marketing': '#EC4899',    // Pink
        'QA': '#06B6D4',          // Cyan
        'Art & Design': '#8B5CF6', // Purple (legacy compatibility)
        'Game Design': '#10B981'   // Green (legacy compatibility)
    };
    return colors[department] || '#6B7280'; // Default gray for unknown departments
};

export default GameCrew;