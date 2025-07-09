import React, { useState } from "react";
import {
    FaStar,
    FaTimes,
    FaCode,
    FaPalette,
    FaMusic,
    FaCrown,
    FaCheckCircle,
    FaArrowRight,
    FaUsers,
} from "react-icons/fa";

const ProfessionalUpgradeBanner = ({ user, onNavigate, onDismiss }) => {
    const [visible, setVisible] = useState(true);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    // Fonksiyon: Professional Title analiz
    const analyzeProfessionalTitles = () => {
        const userTitle = user?.title || '';
        const selectedTitles = userTitle.split(',').map(t => t.trim()).filter(t => t !== '');

        if (selectedTitles.length === 0) {
            return {
                hasRoles: false,
                message: "Add your professional titles to showcase your expertise",
                cta: "Show the industry what you do!"
            };
        }

        const titleCategories = {
            developer: {
                keywords: ['Developer', 'Programmer', 'Engineer', 'Scripting', 'Frontend', 'Backend', 'Full Stack', 'Unity Developer', 'Unreal Developer'],
                icon: <FaCode className="text-blue-400" />,
                messages: [
                    "Your code powers amazing gaming experiences! 💻",
                    "Every line of code you write shapes the future of gaming! 🚀",
                    "Developers like you are the backbone of the gaming industry! ⚡"
                ]
            },
            artist: {
                keywords: ['Artist', 'Designer', '3D Artist', '2D Artist', 'Concept Artist', 'Character Artist', 'Environment Artist', 'Texture Artist', 'VFX Artist', 'Technical Artist', 'UI Artist'],
                icon: <FaPalette className="text-purple-400" />,
                messages: [
                    "Your artistic vision brings games to life! 🎨",
                    "Every pixel you create tells a story! ✨",
                    "Visual artists like you make games unforgettable! 🌟"
                ]
            },
            animator: {
                keywords: ['Animator', 'Technical Animator', 'Motion Capture', 'Rigging Artist'],
                icon: <FaPalette className="text-pink-400" />,
                messages: [
                    "You breathe life into digital characters! 🎭",
                    "Animation is where art meets magic - and you're the magician! ✨",
                    "Your work makes players feel connected to virtual worlds! 🌍"
                ]
            },
            designer: {
                keywords: ['Game Designer', 'Level Designer', 'System Designer', 'UI/UX Designer', 'Narrative Designer'],
                icon: <FaStar className="text-yellow-400" />,
                messages: [
                    "You architect the experiences that captivate millions! 🏗️",
                    "Great design is invisible - but its impact is everything! 💡",
                    "You turn ideas into interactive adventures! 🗺️"
                ]
            },
            audio: {
                keywords: ['Composer', 'Sound Designer', 'Audio Engineer', 'Musician', 'Audio Director'],
                icon: <FaMusic className="text-green-400" />,
                messages: [
                    "Your sounds create the emotional heartbeat of games! 🎵",
                    "Audio professionals like you set the mood for epic adventures! 🎼",
                    "Every note you compose enhances the player's journey! 🎹"
                ]
            },
            producer: {
                keywords: ['Producer', 'Project Manager', 'Scrum Master', 'Development Director', 'Studio Head'],
                icon: <FaCrown className="text-orange-400" />,
                messages: [
                    "You orchestrate the symphony of game development! 🎯",
                    "Great games exist because of visionary leaders like you! 👑",
                    "You turn creative chaos into shipping masterpieces! 📦"
                ]
            },
            qa: {
                keywords: ['QA', 'Tester', 'Quality Assurance', 'Playtester'],
                icon: <FaCheckCircle className="text-cyan-400" />,
                messages: [
                    "You're the guardian of quality gaming experiences! 🛡️",
                    "Every bug you catch makes games better for millions! 🔍",
                    "QA heroes like you ensure players get polished perfection! ⭐"
                ]
            }
        };

        const userCategories = [];
        const matchedTitles = [];

        selectedTitles.forEach(title => {
            Object.entries(titleCategories).forEach(([category, data]) => {
                if (data.keywords.some(keyword => title.includes(keyword))) {
                    if (!userCategories.includes(category)) {
                        userCategories.push(category);
                    }
                    matchedTitles.push(title);
                }
            });
        });

        if (userCategories.length === 0) {
            return {
                hasRoles: true,
                icon: <FaStar className="text-yellow-400" />,
                title: "Industry Professional",
                message: `${selectedTitles.length > 1 ? 'Your diverse roles make' : 'Your role makes'} you valuable to the gaming industry! 🌟`,
                cta: "Show the world your professional expertise!"
            };
        }

        if (userCategories.length === 1) {
            const category = titleCategories[userCategories[0]];
            const randomMessage = category.messages[Math.floor(Math.random() * category.messages.length)];
            return {
                hasRoles: true,
                icon: category.icon,
                title: `${category.keywords[0]} Professional`,
                message: randomMessage,
                cta: "Get the recognition you deserve in the industry!"
            };
        }

        if (userCategories.length >= 2) {
            // Eğer istersen: iconları alt alta dizmek istersen, dizi olarak döndür: userCategories.map...
            return {
                hasRoles: true,
                icon: <FaCrown className="text-gradient" />,
                title: "Multi-Talented Professional",
                message: `${matchedTitles.length} professional roles? You're a gaming industry powerhouse! 💪⚡`,
                cta: "Your diverse expertise deserves industry-wide recognition!"
            };
        }

        // Default:
        return {
            hasRoles: true,
            icon: <FaStar className="text-yellow-400" />,
            title: "Gaming Professional",
            message: "Your professional titles show your dedication to the industry! 🎯",
            cta: "Connect with other professionals and showcase your work!"
        };
    };

    // Fonksiyon: Kullanıcı tipini tespit et
    const getUserTypeInfo = () => {
        const professionalAnalysis = analyzeProfessionalTitles();
        if (professionalAnalysis.hasRoles) {
            return {
                icon: professionalAnalysis.icon,
                title: professionalAnalysis.title,
                message: professionalAnalysis.message,
                cta: professionalAnalysis.cta
            };
        }
        // Fallback analiz:
        const userTypes = user?.userTypes || [];
        const userRoles = user?.roles || [];
        const username = user?.username?.toLowerCase() || '';
        const bio = user?.bio?.toLowerCase() || '';
        const allText = `${username} ${bio} ${userTypes.join(' ')} ${userRoles.map(r => typeof r === 'string' ? r : r.name || '').join(' ')}`.toLowerCase();
        const contains = (keywords) => keywords.some(keyword => allText.includes(keyword));

        const isGameDeveloper = contains([
            'developer', 'programmer', 'coding', 'unity', 'unreal', 'c#', 'javascript',
            'python', 'game dev', 'software', 'backend', 'frontend', 'fullstack'
        ]);
        const isYouTuber = contains([
            'youtube', 'youtuber', 'content creator', 'streamer', 'influencer',
            'video creator', 'channel', 'subscribers', 'views', 'creator'
        ]);
        const is3DArtist = contains([
            '3d artist', '3d', 'blender', 'maya', 'cinema 4d', 'c4d', '3ds max',
            'zbrush', 'modeling', 'rigging', 'animation', 'sculptor', 'modeler'
        ]);
        const isVFXArtist = contains([
            'vfx', 'visual effects', 'fx artist', 'effects', 'particles', 'shaders',
            'after effects', 'nuke', 'compositing', 'motion graphics'
        ]);
        const isProfessionalGamer = contains([
            'esports', 'pro gamer', 'competitive', 'tournament', 'team captain',
            'professional player', 'league', 'championship', 'ranked', 'sponsor'
        ]);

        const combinations = [];
        if (isGameDeveloper) combinations.push('developer');
        if (isYouTuber) combinations.push('youtuber');
        if (is3DArtist) combinations.push('3dartist');
        if (isVFXArtist) combinations.push('vfxartist');
        if (isProfessionalGamer) combinations.push('progamer');

        if (combinations.length >= 3) {
            return {
                icon: <FaCrown className="text-gradient" />,
                title: "Multi-Talented Creator",
                message: "Showcase your diverse skills across development, content creation, and artistry",
                cta: "Your versatility deserves industry recognition!"
            };
        }
        if (combinations.includes('developer') && combinations.includes('youtuber')) {
            return {
                icon: <FaCode className="text-red-400" />,
                title: "Developer & YouTuber",
                message: "Share your coding journey and build your developer brand",
                cta: "Inspire other developers with your content!"
            };
        }
        if (combinations.includes('developer') && combinations.includes('3dartist')) {
            return {
                icon: <FaPalette className="text-blue-400" />,
                title: "3D Developer & Artist",
                message: "Showcase your technical and artistic game development skills",
                cta: "Show the world your technical artistry!"
            };
        }
        if (combinations.includes('3dartist') && combinations.includes('vfxartist')) {
            return {
                icon: <FaPalette className="text-purple-400" />,
                title: "3D & VFX Artist",
                message: "Display your comprehensive visual arts portfolio",
                cta: "Your visual skills deserve professional recognition!"
            };
        }
        if (combinations.includes('youtuber') && combinations.includes('progamer')) {
            return {
                icon: <FaStar className="text-red-400" />,
                title: "Gaming Content Creator",
                message: "Build your gaming brand and connect with your audience",
                cta: "Grow your influence in the gaming community!"
            };
        }
        if (isGameDeveloper) {
            return {
                icon: <FaCode className="text-blue-400" />,
                title: "Game Developer",
                message: "Showcase your development projects and technical expertise",
                cta: "Show the industry your coding skills!"
            };
        }
        if (isYouTuber) {
            return {
                icon: <FaStar className="text-red-400" />,
                title: "YouTuber & Content Creator",
                message: "Grow your channel and connect with industry professionals",
                cta: "Build your content creator brand!"
            };
        }
        if (is3DArtist) {
            return {
                icon: <FaPalette className="text-cyan-400" />,
                title: "3D Artist",
                message: "Display your 3D modeling, animation, and design work",
                cta: "Showcase your 3D artistry to the world!"
            };
        }
        if (isVFXArtist) {
            return {
                icon: <FaPalette className="text-purple-400" />,
                title: "VFX Artist",
                message: "Showcase your visual effects work and connect with studios",
                cta: "Your VFX skills deserve industry recognition!"
            };
        }
        if (isProfessionalGamer) {
            return {
                icon: <FaStar className="text-yellow-400" />,
                title: "Professional Gamer",
                message: "Build your esports profile and connect with teams",
                cta: "Show your competitive gaming excellence!"
            };
        }
        if (contains(['composer', 'musician', 'sound design', 'audio', 'music producer'])) {
            return {
                icon: <FaMusic className="text-green-400" />,
                title: "Audio Professional",
                message: "Feature your musical compositions and sound design work",
                cta: "Let your audio skills be heard by the industry!"
            };
        }
        if (contains(['gamer', 'gaming', 'player', 'games'])) {
            return {
                icon: <FaStar className="text-orange-400" />,
                title: "Gaming Enthusiast",
                message: "Connect with the gaming community and showcase your passion",
                cta: "Turn your gaming passion into professional opportunities!"
            };
        }
        // Final fallback:
        return {
            icon: <FaCrown className="text-yellow-400" />,
            title: "Gaming Professional",
            message: "Connect with industry professionals and showcase your work",
            cta: "Join the professional gaming community!"
        };
    };

    // Dismiss logic
    const handleDismiss = () => {
        setVisible(false);
        if (onDismiss) onDismiss(dontShowAgain);
    };

    // Upgrade button logic
    const handleUpgrade = () => {
        if (onNavigate) onNavigate('/professional-setup');
    };

    // Eğer profesyonel kullanıcıysa veya görünürlük false ise hiç render etme
    if (!visible || user?.isProfessional) return null;

    const userTypeInfo = getUserTypeInfo();

    return (
        <div className="relative overflow-hidden rounded-2xl shadow-xl mb-8 transition-all duration-500">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/5 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
            </div>
            {/* Content */}
            <div className="relative z-10 p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
                            <FaCheckCircle size={24} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                                Profile Complete!
                                <span className="text-green-400">Ready to go Pro?</span>
                            </h3>
                            <p className="text-white/80 text-base">
                                {user?.hasGameCredits ? (
                                    <>
                                        <span className="text-yellow-400 font-semibold">⭐ You've worked on games!</span> Get official recognition and showcase your professional contributions.
                                    </>
                                ) : userTypeInfo.cta ? (
                                    <>Your gaming profile is complete. {userTypeInfo.cta}</>
                                ) : (
                                    <>Your gaming profile is complete. Now showcase your professional work and get industry recognition - completely free!</>
                                )}
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
                {/* Cast/Crew Detection */}
                {user?.hasGameCredits && (
                    <div className="mb-6">
                        <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30">
                            <div className="flex items-center gap-2 mb-2">
                                <FaStar className="text-yellow-400" size={16} />
                                <h4 className="text-yellow-400 font-bold">Game Industry Professional Detected!</h4>
                            </div>
                            <p className="text-white/90 text-base leading-relaxed">
                                <strong>This upgrade is specifically for industry professionals like you!</strong>
                                <br />
                                Get credited for your work, connect with other professionals, and build your industry portfolio.
                                <br />
                                <span className="text-yellow-300 text-sm">✨ Perfect for cast, crew, developers, artists, composers, and all game contributors</span>
                            </p>
                        </div>
                    </div>
                )}
                {/* User Type Section */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            {userTypeInfo.icon}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white font-semibold text-base">{userTypeInfo.title}</h4>
                            <p className="text-white/60 text-sm">{userTypeInfo.message}</p>
                        </div>
                    </div>
                </div>
                {/* Benefits */}
                <div className="mb-6">
                    <h4 className="text-white/90 text-base font-semibold mb-3">Professional Benefits:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2 mb-1">
                                <FaStar className="text-yellow-400" size={14} />
                                <span className="text-white text-sm font-semibold">Industry Credits</span>
                            </div>
                            <p className="text-white/60 text-sm">Get credited on games you worked on</p>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2 mb-1">
                                <FaCode className="text-blue-400" size={14} />
                                <span className="text-white text-sm font-semibold">Portfolio Showcase</span>
                            </div>
                            <p className="text-white/60 text-sm">Display your professional work</p>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2 mb-1">
                                <FaUsers className="text-green-400" size={14} />
                                <span className="text-white text-sm font-semibold">Professional Network</span>
                            </div>
                            <p className="text-white/60 text-sm">Connect with other industry professionals</p>
                        </div>
                    </div>
                </div>
                {/* Action Buttons */}
                <div className="space-y-4">
                    <button
                        onClick={handleUpgrade}
                        className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 hover:shadow-lg text-white font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <FaCrown size={16} />
                        Create Portfolio & Add Credits
                        <FaArrowRight size={14} />
                    </button>
                    {/* Don't show again checkbox */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-3 cursor-pointer text-white/70 hover:text-white/90 transition-colors">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={dontShowAgain}
                                    onChange={(e) => setDontShowAgain(e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`
                                    w-5 h-5 rounded border-2 transition-all duration-200
                                    ${dontShowAgain
                                    ? 'bg-blue-500 border-blue-400'
                                    : 'border-white/40 hover:border-white/60'
                                }
                                `}>
                                    {dontShowAgain && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <span className="text-base">Don't show this message again</span>
                        </label>
                        <button
                            onClick={handleDismiss}
                            className="px-4 py-2 text-white/60 hover:text-white/80 transition-colors text-base hover:bg-white/5 rounded-lg"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalUpgradeBanner;
