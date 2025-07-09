import React, { useState, useEffect } from "react";
import { FaUserEdit, FaTimes, FaCheckCircle, FaEdit, FaCamera, FaGamepad, FaPalette, FaCode } from "react-icons/fa";

const ProfileCompleteBanner = ({ gamer, progress: initialProgress, message, onClick, onDismiss, onNavigate }) => {
    const [progress, setProgress] = useState(initialProgress || 0);
    const [isVisible, setIsVisible] = useState(true);
    const [animatedProgress, setAnimatedProgress] = useState(0);

    // Progress calculation based on gamer data
    const calculateProgress = (gamerData) => {
        if (!gamerData) return 0;

        const fields = [
            { key: 'bio', weight: 20, condition: (data) => data.bio && data.bio.trim().length >= 50 },
            { key: 'avatar', weight: 15, condition: (data) => data.avatar && data.avatar !== '' },
            { key: 'coverImage', weight: 10, condition: (data) => data.coverImage && data.coverImage !== '' },
            { key: 'platforms', weight: 20, condition: (data) => data.platforms && data.platforms.length >= 3 },
            { key: 'favoriteGenres', weight: 15, condition: (data) => data.favoriteGenres && data.favoriteGenres.length >= 5 },
            { key: 'favoriteConsoles', weight: 10, condition: (data) => data.favoriteConsoles && data.favoriteConsoles.length >= 2 },
            { key: 'socials', weight: 10, condition: (data) => data.socials && data.socials.length >= 2 }
        ];

        const completedWeight = fields.reduce((total, field) => {
            return total + (field.condition(gamerData) ? field.weight : 0);
        }, 0);

        return Math.min(100, completedWeight);
    };

    // Update progress when gamer data changes
    useEffect(() => {
        const newProgress = calculateProgress(gamer);
        setProgress(newProgress);
    }, [gamer]);

    // Animated progress bar
    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedProgress(progress);
        }, 300);
        return () => clearTimeout(timer);
    }, [progress]);

    // Missing fields detection
    const getMissingFields = () => {
        if (!gamer) return [];

        const missing = [];

        if (!gamer.bio || gamer.bio.trim().length < 50) {
            missing.push({
                name: 'Bio',
                icon: <FaEdit size={14} />,
                description: 'Tell your story',
                action: 'Add bio'
            });
        }

        if (!gamer.avatar) {
            missing.push({
                name: 'Avatar',
                icon: <FaCamera size={14} />,
                description: 'Upload profile picture',
                action: 'Add avatar'
            });
        }

        if (!gamer.platforms || gamer.platforms.length < 3) {
            missing.push({
                name: 'Gaming Platforms',
                icon: <FaGamepad size={14} />,
                description: 'Connect your gaming accounts',
                action: 'Add platforms'
            });
        }

        if (!gamer.favoriteGenres || gamer.favoriteGenres.length < 5) {
            missing.push({
                name: 'Favorite Genres',
                icon: <FaPalette size={14} />,
                description: 'Show your gaming preferences',
                action: 'Add genres'
            });
        }

        return missing.slice(0, 3); // Show max 3 missing items
    };

    const handleDismiss = () => {
        setIsVisible(false);
        if (onDismiss) onDismiss();
    };

    const handleNavigate = () => {
        if (onClick) {
            onClick(); // Mevcut onClick mantığını kullan
        } else if (onNavigate) {
            onNavigate('/dashboard');
        }
    };

    const getProgressColor = () => {
        if (progress >= 80) return 'from-green-500 to-emerald-500';
        if (progress >= 60) return 'from-yellow-500 to-orange-500';
        if (progress >= 40) return 'from-blue-500 to-cyan-500';
        return 'from-red-500 to-pink-500';
    };

    const getBackgroundGradient = () => {
        if (progress >= 80) return 'from-green-500/10 to-emerald-500/5';
        if (progress >= 60) return 'from-yellow-500/10 to-orange-500/5';
        if (progress >= 40) return 'from-blue-500/10 to-cyan-500/5';
        return 'from-red-500/10 to-pink-500/5';
    };

    if (!isVisible || progress >= 95) return null;

    const missingFields = getMissingFields();

    return (
        <div className={`relative overflow-hidden rounded-2xl shadow-xl mb-8 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
            {/* Animated background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getBackgroundGradient()} backdrop-blur-sm`}>
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${getProgressColor()} shadow-lg`}>
                            <FaUserEdit size={24} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">
                                {progress >= 80 ? '🎉 Almost Complete!' :
                                    progress >= 60 ? '💪 Great Progress!' :
                                        progress >= 40 ? '🚀 Keep Going!' :
                                            '⭐ Let\'s Get Started!'}
                            </h3>
                            <p className="text-white/80 text-sm">
                                {message || `Your profile is ${progress}% complete. ${progress < 80 ? 'Stand out in the gaming community!' : ''}`}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleDismiss}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all"
                        title="Dismiss"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-white/80 text-sm font-medium">Profile Completion</span>
                        <span className="text-white font-bold text-sm">{progress}%</span>
                    </div>
                    <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                        <div
                            className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-1000 ease-out relative`}
                            style={{ width: `${animatedProgress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Missing Fields */}
                {missingFields.length > 0 && onClick && (
                    <div className="mb-6">
                        <h4 className="text-white/90 text-sm font-medium mb-3">Next Steps:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {missingFields.map((field, index) => (
                                <button
                                    key={field.name}
                                    onClick={() => {
                                        // Smart navigation - ilk eksik alanı aç
                                        if (field.name === 'Bio' && onClick) {
                                            onClick();
                                        }
                                    }}
                                    className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:border-white/20 cursor-pointer"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-white/60">{field.icon}</span>
                                        <span className="text-white text-sm font-medium">{field.name}</span>
                                    </div>
                                    <p className="text-white/60 text-xs text-left">{field.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}



                {/* Developer-focused tip */}
                {gamer?.userTypes?.includes('developer') && progress < 80 && (
                    <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                        <div className="flex items-center gap-2 mb-1">
                            <FaCode className="text-purple-400" size={14} />
                            <span className="text-purple-300 text-sm font-medium">Developer Tip</span>
                        </div>
                        <p className="text-white/70 text-xs">
                            Showcase your VFX and game development work to attract collaborators and opportunities!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileCompleteBanner;