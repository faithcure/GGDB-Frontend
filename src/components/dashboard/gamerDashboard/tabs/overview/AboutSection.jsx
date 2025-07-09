import React, { useState, useEffect } from "react";
import {
    FaEdit, FaCheck, FaTimes, FaUser, FaGamepad, FaHeart, FaKeyboard,
    FaLightbulb, FaUniversity, FaBriefcase, FaRocket, FaGraduationCap,
    FaBuilding, FaProjectDiagram
} from "react-icons/fa";
import axios from "axios";
import { API_BASE } from "../../../../../config/api";


const AboutSection = ({ gamer, setGamer, editingSection, setEditingSection, canEdit = false }) => {
    const [editingBio, setEditingBio] = useState(gamer?.bio || "");
    const [editingEducation, setEditingEducation] = useState(gamer?.education || "");
    const [editingCurrentWork, setEditingCurrentWork] = useState(gamer?.currentWork || "");
    const [editingCurrentProjects, setEditingCurrentProjects] = useState(gamer?.currentProjects || "");
    const [editingCareerGoals, setEditingCareerGoals] = useState(gamer?.careerGoals || "");
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [validationError, setValidationError] = useState("");
    const [showTips, setShowTips] = useState(true);

    const MAX_CHARS = {
        bio: 500,
        education: 200,
        currentWork: 200,
        currentProjects: 300,
        careerGoals: 250
    };

    // Toast effect
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    // Update editing states when gamer data changes
    useEffect(() => {
        if (gamer && editingSection !== 'bio') {
            setEditingBio(gamer.bio || "");
            setEditingEducation(gamer.education || "");
            setEditingCurrentWork(gamer.currentWork || "");
            setEditingCurrentProjects(gamer.currentProjects || "");
            setEditingCareerGoals(gamer.careerGoals || "");
        }
    }, [gamer, editingSection]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (editingSection === 'bio') {
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
        // eslint-disable-next-line
    }, [editingSection, editingBio, editingEducation, editingCurrentWork, editingCurrentProjects, editingCareerGoals]);

    // ----------- Fonksiyonlar -----------
    const cancelEditing = () => {
        setEditingSection(null);
        setEditingBio(gamer?.bio || "");
        setEditingEducation(gamer?.education || "");
        setEditingCurrentWork(gamer?.currentWork || "");
        setEditingCurrentProjects(gamer?.currentProjects || "");
        setEditingCareerGoals(gamer?.careerGoals || "");
        setValidationError("");
        setShowTips(false);
    };

    const saveEdit = async () => {
        const trimmedBio = editingBio.trim();
        const trimmedEducation = editingEducation.trim();
        const trimmedCurrentWork = editingCurrentWork.trim();
        const trimmedCurrentProjects = editingCurrentProjects.trim();
        const trimmedCareerGoals = editingCareerGoals.trim();

        // Validation
        if (trimmedBio && trimmedBio.length < 50) {
            setValidationError("Bio should be at least 50 characters long");
            return;
        }

        if (trimmedBio.length > MAX_CHARS.bio) {
            setValidationError(`Bio cannot exceed ${MAX_CHARS.bio} characters`);
            return;
        }

        if (trimmedEducation.length > MAX_CHARS.education) {
            setValidationError(`Education cannot exceed ${MAX_CHARS.education} characters`);
            return;
        }

        if (trimmedCurrentWork.length > MAX_CHARS.currentWork) {
            setValidationError(`Current work cannot exceed ${MAX_CHARS.currentWork} characters`);
            return;
        }

        if (trimmedCurrentProjects.length > MAX_CHARS.currentProjects) {
            setValidationError(`Current projects cannot exceed ${MAX_CHARS.currentProjects} characters`);
            return;
        }

        if (trimmedCareerGoals.length > MAX_CHARS.careerGoals) {
            setValidationError(`Career goals cannot exceed ${MAX_CHARS.careerGoals} characters`);
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

            const response = await axios.put(
                `${API_BASE}/api/auth/me`,
                {
                    bio: trimmedBio,
                    education: trimmedEducation,
                    currentWork: trimmedCurrentWork,
                    currentProjects: trimmedCurrentProjects,
                    careerGoals: trimmedCareerGoals
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            let updatedUser = null;
            if (response.data.user) {
                updatedUser = response.data.user;
            } else if (response.data && response.data._id) {
                updatedUser = response.data;
            } else {
                updatedUser = {
                    ...gamer,
                    bio: trimmedBio,
                    education: trimmedEducation,
                    currentWork: trimmedCurrentWork,
                    currentProjects: trimmedCurrentProjects,
                    careerGoals: trimmedCareerGoals
                };
            }

            setGamer(updatedUser);
            setEditingSection(null);
            setShowToast(true);

        } catch (error) {
            if (error.response?.status === 401) {
                setValidationError("Session expired. Please login again.");
                localStorage.removeItem("token");
            } else if (error.response?.status === 400) {
                setValidationError(error.response.data.message || "Invalid data");
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

    const clearAllFields = () => {
        setEditingBio('');
        setEditingEducation('');
        setEditingCurrentWork('');
        setEditingCurrentProjects('');
        setEditingCareerGoals('');
    };

    const clearAllData = async () => {
        if (!window.confirm('⚠️ This will permanently delete all your About section data. Are you sure you want to continue?')) {
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

            const response = await axios.put(
                `${API_BASE}/api/auth/me`,
                {
                    bio: "",
                    education: "",
                    currentWork: "",
                    currentProjects: "",
                    careerGoals: ""
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            let updatedUser = null;
            if (response.data.user) {
                updatedUser = response.data.user;
            } else if (response.data && response.data._id) {
                updatedUser = response.data;
            } else {
                updatedUser = {
                    ...gamer,
                    bio: "",
                    education: "",
                    currentWork: "",
                    currentProjects: "",
                    careerGoals: ""
                };
            }

            setGamer(updatedUser);
            clearAllFields();
            setEditingSection(null);
            setShowToast(true);

        } catch (error) {
            setValidationError("Failed to clear data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const startEditing = () => {
        setEditingSection('bio');
        setEditingBio(gamer?.bio || "");
        setEditingEducation(gamer?.education || "");
        setEditingCurrentWork(gamer?.currentWork || "");
        setEditingCurrentProjects(gamer?.currentProjects || "");
        setEditingCareerGoals(gamer?.careerGoals || "");
        setValidationError("");
    };

    const isEmptyAbout = (!gamer?.bio || gamer.bio.trim() === "") &&
        (!gamer?.education || gamer.education.trim() === "") &&
        (!gamer?.currentWork || gamer.currentWork.trim() === "") &&
        (!gamer?.currentProjects || gamer.currentProjects.trim() === "") &&
        (!gamer?.careerGoals || gamer.careerGoals.trim() === "");

    const hasChanges = editingBio.trim() !== (gamer?.bio || "").trim() ||
        editingEducation.trim() !== (gamer?.education || "").trim() ||
        editingCurrentWork.trim() !== (gamer?.currentWork || "").trim() ||
        editingCurrentProjects.trim() !== (gamer?.currentProjects || "").trim() ||
        editingCareerGoals.trim() !== (gamer?.careerGoals || "").trim();

    const samplePrompts = {
        bio: [
            "I'm a VFX artist and game developer who loves creating immersive visual experiences...",
            "Passionate coder building interactive games and stunning visual effects...",
            "Game developer specializing in visual storytelling and technical artistry..."
        ],
        education: [
            "Computer Science - Istanbul Technical University",
            "Game Design - Bahçeşehir University",
            "Digital Arts - Sabancı University"
        ],
        currentWork: [
            "Senior VFX Artist at Ubisoft Istanbul",
            "Indie Game Developer & Freelancer",
            "Technical Artist at Peak Games"
        ],
        currentProjects: [
            "Working on an indie RPG with unique visual effects system",
            "Developing VFX tools for Unity and Unreal Engine",
            "Creating a mobile game with advanced particle systems"
        ],
        careerGoals: [
            "Lead VFX artist at a AAA game studio",
            "Start my own indie game development studio",
            "Specialize in real-time rendering and game optimization"
        ]
    };

    if (!gamer) {
        return (
            <div className="glass-effect rounded-xl p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-white/10 rounded w-1/4 mb-4"></div>
                    <div className="h-20 bg-white/10 rounded"></div>
                </div>
            </div>
        );
    }

return (
    <div className="glass-effect rounded-xl p-6 relative">
        {/* Success Toast */}
        {showToast && (
            <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse z-10">
                ✓ About section updated successfully!
            </div>
        )}

        <div className="flex items-center gap-3 mb-6">
            <h2 className="text-lg font-semibold text-white">About</h2>
            <div className="px-2 py-1 bg-purple-500/20 rounded-full">
                <span className="text-purple-300 text-xs font-medium">Profile</span>
            </div>
            {canEdit && !isEmptyAbout && editingSection !== 'bio' && (
                <button
                    className="ml-auto p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all border border-white/10 hover:border-white/20"
                    onClick={startEditing}
                    title="Edit about section"
                >
                    <FaEdit size={12} />
                </button>
            )}
        </div>

        <div className="mb-8">
            {editingSection === 'bio' && (
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to clear all editing fields? This will reset your current changes.')) {
                                clearAllFields();
                            }
                        }}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
                    >
                        <FaTimes size={10} />
                        Clear All Fields
                    </button>
                    <button
                        onClick={() => setShowTips(!showTips)}
                        className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        <FaLightbulb size={10} />
                        {showTips ? 'Hide tips' : 'Show tips'}
                    </button>
                </div>
            )}

            {editingSection === 'bio' ? (
                <div className="space-y-6">
                    {/* Helpful Tips */}
                    {showTips && (
                        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                            <h4 className="text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                                <FaLightbulb size={12} />
                                Tips for a great profile:
                            </h4>
                            <ul className="text-xs text-white/70 space-y-1">
                                <li>• Share your passion for VFX and game development</li>
                                <li>• Mention your technical skills and tools you use</li>
                                <li>• Include your educational background</li>
                                <li>• Talk about current projects you're working on</li>
                                <li>• Share your career aspirations</li>
                                <li>• Keep it authentic and engaging</li>
                            </ul>
                        </div>
                    )}

                    {/* Bio Section */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-white">
                            <FaUser size={14} className="text-purple-400" />
                            About Me
                        </label>
                        <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                                {samplePrompts.bio.map((prompt, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setEditingBio(prompt)}
                                        className="text-xs px-3 py-1 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/80 rounded-full border border-white/10 hover:border-white/20 transition-all"
                                    >
                                        "{prompt.substring(0, 40)}..."
                                    </button>
                                ))}
                            </div>
                            <div className="relative">
                                    <textarea
                                        value={editingBio}
                                        onChange={e => setEditingBio(e.target.value)}
                                        placeholder="Tell the community about your passion for VFX and game development..."
                                        className="w-full h-32 p-4 glass-dark rounded-lg border border-white/10 text-white placeholder-white/50 resize-none focus:outline-none focus:border-purple-500/50 transition-colors"
                                        disabled={isLoading}
                                    />
                                <div className="absolute bottom-2 right-2 text-xs text-white/40">
                                        <span className={editingBio.length > MAX_CHARS.bio * 0.8 ? 'text-yellow-400' : editingBio.length > MAX_CHARS.bio ? 'text-red-400' : ''}>
                                            {editingBio.length}/{MAX_CHARS.bio}
                                        </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Education Section */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-white">
                            <FaGraduationCap size={14} className="text-blue-400" />
                            Education
                        </label>
                        <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                                {samplePrompts.education.map((prompt, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setEditingEducation(prompt)}
                                        className="text-xs px-3 py-1 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/80 rounded-full border border-white/10 hover:border-white/20 transition-all"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={editingEducation}
                                    onChange={e => setEditingEducation(e.target.value)}
                                    placeholder="e.g., Computer Science - Istanbul Technical University"
                                    className="w-full p-3 glass-dark rounded-lg border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-blue-500/50 transition-colors"
                                    disabled={isLoading}
                                />
                                <div className="absolute bottom-2 right-2 text-xs text-white/40">
                                        <span className={editingEducation.length > MAX_CHARS.education * 0.8 ? 'text-yellow-400' : editingEducation.length > MAX_CHARS.education ? 'text-red-400' : ''}>
                                            {editingEducation.length}/{MAX_CHARS.education}
                                        </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Current Work Section */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-white">
                            <FaBriefcase size={14} className="text-green-400" />
                            Current Work
                        </label>
                        <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                                {samplePrompts.currentWork.map((prompt, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setEditingCurrentWork(prompt)}
                                        className="text-xs px-3 py-1 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/80 rounded-full border border-white/10 hover:border-white/20 transition-all"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={editingCurrentWork}
                                    onChange={e => setEditingCurrentWork(e.target.value)}
                                    placeholder="e.g., Senior VFX Artist at Ubisoft Istanbul"
                                    className="w-full p-3 glass-dark rounded-lg border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-green-500/50 transition-colors"
                                    disabled={isLoading}
                                />
                                <div className="absolute bottom-2 right-2 text-xs text-white/40">
                                        <span className={editingCurrentWork.length > MAX_CHARS.currentWork * 0.8 ? 'text-yellow-400' : editingCurrentWork.length > MAX_CHARS.currentWork ? 'text-red-400' : ''}>
                                            {editingCurrentWork.length}/{MAX_CHARS.currentWork}
                                        </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Current Projects Section */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-white">
                            <FaProjectDiagram size={14} className="text-orange-400" />
                            Current Projects
                        </label>
                        <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                                {samplePrompts.currentProjects.map((prompt, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setEditingCurrentProjects(prompt)}
                                        className="text-xs px-3 py-1 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/80 rounded-full border border-white/10 hover:border-white/20 transition-all"
                                    >
                                        "{prompt.substring(0, 30)}..."
                                    </button>
                                ))}
                            </div>
                            <div className="relative">
                                    <textarea
                                        value={editingCurrentProjects}
                                        onChange={e => setEditingCurrentProjects(e.target.value)}
                                        placeholder="Tell us about your current game projects, VFX work, or tools you're developing..."
                                        className="w-full h-24 p-4 glass-dark rounded-lg border border-white/10 text-white placeholder-white/50 resize-none focus:outline-none focus:border-orange-500/50 transition-colors"
                                        disabled={isLoading}
                                    />
                                <div className="absolute bottom-2 right-2 text-xs text-white/40">
                                        <span className={editingCurrentProjects.length > MAX_CHARS.currentProjects * 0.8 ? 'text-yellow-400' : editingCurrentProjects.length > MAX_CHARS.currentProjects ? 'text-red-400' : ''}>
                                            {editingCurrentProjects.length}/{MAX_CHARS.currentProjects}
                                        </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Career Goals Section */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-white">
                            <FaRocket size={14} className="text-pink-400" />
                            Career Goals
                        </label>
                        <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                                {samplePrompts.careerGoals.map((prompt, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setEditingCareerGoals(prompt)}
                                        className="text-xs px-3 py-1 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/80 rounded-full border border-white/10 hover:border-white/20 transition-all"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                            <div className="relative">
                                    <textarea
                                        value={editingCareerGoals}
                                        onChange={e => setEditingCareerGoals(e.target.value)}
                                        placeholder="What are your career aspirations in the gaming industry?"
                                        className="w-full h-20 p-4 glass-dark rounded-lg border border-white/10 text-white placeholder-white/50 resize-none focus:outline-none focus:border-pink-500/50 transition-colors"
                                        disabled={isLoading}
                                    />
                                <div className="absolute bottom-2 right-2 text-xs text-white/40">
                                        <span className={editingCareerGoals.length > MAX_CHARS.careerGoals * 0.8 ? 'text-yellow-400' : editingCareerGoals.length > MAX_CHARS.careerGoals ? 'text-red-400' : ''}>
                                            {editingCareerGoals.length}/{MAX_CHARS.careerGoals}
                                        </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Validation Messages */}
                    {validationError && (
                        <div className="text-red-400 text-xs flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <FaTimes size={10} />
                            {validationError}
                        </div>
                    )}

                    {/* Keyboard shortcuts info */}
                    <div className="flex items-center gap-4 text-xs text-white/40">
                        <div className="flex items-center gap-1">
                            <FaKeyboard size={10} />
                            <span>Ctrl+Enter to save</span>
                        </div>
                        <div>Esc to cancel</div>
                    </div>

                    {/* Smart button states */}
                    <div className="flex gap-2">
                        <button
                            onClick={saveEdit}
                            disabled={isLoading || !hasChanges}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                                isLoading || !hasChanges
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
                                    Save Changes
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
            ) : isEmptyAbout ? (
                <div className="space-y-4">
                    {/* More engaging empty state */}
                    <button
                        onClick={startEditing}
                        className="group relative flex items-center gap-4 p-6 glass-dark rounded-lg border border-white/10 hover:border-purple-500/30 hover:bg-white/5 transition-all duration-300 w-full overflow-hidden"
                    >
                        {/* Animated background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                            <FaEdit className="text-purple-400 group-hover:text-purple-300 transition-colors" size={18} />
                        </div>
                        <div className="relative text-left flex-1">
                            <p className="text-white font-medium text-base mb-1 group-hover:text-purple-100 transition-colors">Create your professional profile</p>
                            <p className="text-white/60 text-sm">Share your VFX and game development journey</p>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex -space-x-1">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400/60 to-blue-400/60 border border-white/20"></div>
                                    ))}
                                </div>
                                <span className="text-xs text-white/50">Stand out in the industry</span>
                            </div>
                        </div>
                        <div className="relative text-purple-400 group-hover:text-purple-300 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Bio Display */}
                    {gamer.bio && gamer.bio.trim() && (
                        <div className="p-4 glass-dark rounded-lg border border-white/10 hover:border-white/20 transition-colors group">
                            <div className="flex items-center gap-2 mb-3">
                                <FaUser className="text-purple-400" size={14} />
                                <h4 className="text-white font-medium text-sm">About Me</h4>
                            </div>
                            <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{gamer.bio}</p>
                        </div>
                    )}

                    {/* Education Display */}
                    {gamer.education && gamer.education.trim() && (
                        <div className="p-4 glass-dark rounded-lg border border-white/10 hover:border-white/20 transition-colors group">
                            <div className="flex items-center gap-2 mb-3">
                                <FaGraduationCap className="text-blue-400" size={14} />
                                <h4 className="text-white font-medium text-sm">Education</h4>
                            </div>
                            <p className="text-white/80">{gamer.education}</p>
                        </div>
                    )}

                    {/* Current Work Display */}
                    {gamer.currentWork && gamer.currentWork.trim() && (
                        <div className="p-4 glass-dark rounded-lg border border-white/10 hover:border-white/20 transition-colors group">
                            <div className="flex items-center gap-2 mb-3">
                                <FaBriefcase className="text-green-400" size={14} />
                                <h4 className="text-white font-medium text-sm">Current Work</h4>
                            </div>
                            <p className="text-white/80">{gamer.currentWork}</p>
                        </div>
                    )}

                    {/* Current Projects Display */}
                    {gamer.currentProjects && gamer.currentProjects.trim() && (
                        <div className="p-4 glass-dark rounded-lg border border-white/10 hover:border-white/20 transition-colors group">
                            <div className="flex items-center gap-2 mb-3">
                                <FaProjectDiagram className="text-orange-400" size={14} />
                                <h4 className="text-white font-medium text-sm">Current Projects</h4>
                            </div>
                            <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{gamer.currentProjects}</p>
                        </div>
                    )}

                    {/* Career Goals Display */}
                    {gamer.careerGoals && gamer.careerGoals.trim() && (
                        <div className="p-4 glass-dark rounded-lg border border-white/10 hover:border-white/20 transition-colors group">
                            <div className="flex items-center gap-2 mb-3">
                                <FaRocket className="text-pink-400" size={14} />
                                <h4 className="text-white font-medium text-sm">Career Goals</h4>
                            </div>
                            <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{gamer.careerGoals}</p>
                        </div>
                    )}

                    {/* Contextual edit hint */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-3 pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-white/50">Click the edit button above to update your profile</p>
                            <button
                                onClick={clearAllData}
                                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
                                title="Permanently delete all about section data"
                            >
                                <FaTimes size={10} />
                                Clear Saved Data
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Additional context for empty state */}
        {canEdit && isEmptyAbout && (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-300 text-sm font-medium mb-2">Why complete your professional profile?</p>
                <div className="text-white/70 text-xs leading-relaxed space-y-1">
                    <p>• <strong>Education:</strong> Show your academic background and credentials</p>
                    <p>• <strong>Current Work:</strong> Let others know where you work or your current role</p>
                    <p>• <strong>Projects:</strong> Showcase what you're currently developing</p>
                    <p>• <strong>Goals:</strong> Share your career aspirations and connect with like-minded professionals</p>
                </div>
            </div>
        )}
    </div>
);
};

export default AboutSection;