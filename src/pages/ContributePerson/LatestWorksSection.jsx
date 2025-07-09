// src/pages/ContributePerson/LatestWorksSection.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaGamepad, FaHeart, FaClock, FaHeartBroken, FaPlay, FaTrophy, FaFire, FaCode, FaPaintBrush } from "react-icons/fa";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "flag-icons/css/flag-icons.min.css";
import ImageWithFallback from "./ImageWithFallback";

const fallbackImage = "https://placehold.co/300x450?text=No+Image";

const WorkCard = ({ work, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isLoaded, setIsLoaded] = useState(false);

    const cardRef = useRef(null);
    const imageRef = useRef(null);
    const glowRef = useRef(null);
    const navigate = useNavigate();

    // Load animation
    useEffect(() => {
        setTimeout(() => setIsLoaded(true), index * 150);
    }, [index]);

    const getMetacriticColor = (score) => {
        if (score >= 85) return "from-emerald-400 to-green-500";
        if (score >= 75) return "from-green-400 to-emerald-500";
        if (score >= 60) return "from-yellow-400 to-orange-400";
        if (score >= 50) return "from-orange-400 to-red-400";
        return "from-red-400 to-red-600";
    };

    const getRatingColor = (rating) => {
        if (rating >= 9) return "from-purple-400 to-pink-400";
        if (rating >= 8) return "from-blue-400 to-purple-400";
        if (rating >= 7) return "from-green-400 to-blue-400";
        if (rating >= 6) return "from-yellow-400 to-green-400";
        return "from-orange-400 to-yellow-400";
    };

    const getRoleIcon = (role) => {
        const roleStr = role?.toLowerCase() || '';
        if (roleStr.includes('developer') || roleStr.includes('programmer')) return <FaCode className="text-blue-400" />;
        if (roleStr.includes('artist') || roleStr.includes('designer')) return <FaPaintBrush className="text-purple-400" />;
        if (roleStr.includes('director')) return <FaTrophy className="text-yellow-400" />;
        return <FaGamepad className="text-green-400" />;
    };

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setMousePosition({ x, y });

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;

        if (imageRef.current) {
            const offsetX = (x - centerX) / 15;
            const offsetY = (y - centerY) / 15;
            imageRef.current.style.transform = `scale(1.15) translate(${offsetX}px, ${offsetY}px)`;
        }

        if (glowRef.current) {
            glowRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`;
        }
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (cardRef.current) {
            cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        }
        if (imageRef.current) {
            imageRef.current.style.transform = "scale(1.1) translate(0, 0)";
        }
        if (glowRef.current) {
            glowRef.current.style.background = "transparent";
        }
    };

    const handleGameClick = () => {
        if (work._id) {
            // Add click animation
            if (cardRef.current) {
                cardRef.current.style.transform = "perspective(1000px) scale3d(0.95, 0.95, 0.95)";
                setTimeout(() => {
                    navigate(`/game/${work._id}`);
                }, 150);
            }
        }
    };

    // Determine if it's a new or trending project
    const isNew = work.releaseDate && new Date(work.releaseDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const isTrending = work.ggdbRating && work.ggdbRating >= 8.5;

    return (
        <div className="relative group">
            {/* Main Card */}
            <div
                ref={cardRef}
                className={`
                    relative w-full aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer 
                    transition-all duration-500 ease-out transform-gpu shadow-xl
                    ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                    hover:shadow-2xl will-change-transform
                `}
                onClick={handleGameClick}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    transformStyle: "preserve-3d",
                    animationDelay: `${index * 0.1}s`
                }}
            >
                {/* Glow Effect */}
                <div
                    ref={glowRef}
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
                />

                {/* Holographic Border */}
                <div className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-full h-full rounded-2xl bg-slate-900" />
                </div>

                {/* Background Image */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <ImageWithFallback
                        ref={imageRef}
                        src={work.coverImage || fallbackImage}
                        alt={work.title}
                        className="w-full h-full object-cover transition-all duration-700 ease-out"
                        style={{
                            filter: isHovered ? "brightness(1.1) contrast(1.1) saturate(1.2)" : "brightness(0.8)"
                        }}
                    />

                    {/* Dynamic Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                    {/* Shimmer Effect */}
                    <div
                        className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full transition-transform duration-1000 ${isHovered ? 'translate-x-full' : ''}`}
                        style={{ transform: 'skewX(-25deg)' }}
                    />
                </div>

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                    {isNew && (
                        <div className="flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 rounded-full text-white text-xs font-bold">
                            <HiSparkles className="text-sm" />
                            NEW
                        </div>
                    )}
                    {isTrending && (
                        <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 rounded-full text-white text-xs font-bold">
                            <FaFire className="text-sm" />
                            TRENDING
                        </div>
                    )}
                </div>

                {/* Rating Score - Minimal */}
                {work.ggdbRating && work.ggdbRating > 0 && (
                    <div className="absolute top-4 right-4 z-20">
                        <div className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                            <FaStar className="text-yellow-400 text-sm" />
                            <span className="text-yellow-400 font-bold text-sm">
                                {parseFloat(work.ggdbRating).toFixed(1)}
                            </span>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 z-10">
                    {/* Header Info */}
                    <div className="flex-1" />

                    {/* Main Content */}
                    <div className="space-y-4">
                        {/* Title & Year */}
                        <div className="space-y-2">
                            <h3 className="font-bold text-xl text-white drop-shadow-lg line-clamp-2 leading-tight">
                                {work.title}
                            </h3>
                            <div className="flex items-center gap-3 text-white/80">
                                {work.releaseDate && (
                                    <span className="text-sm bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                                        {new Date(work.releaseDate).getFullYear()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Role Badge */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10">
                                {getRoleIcon(work.userRole || work.contributorRole)}
                                <span className="text-white/90 text-sm font-medium">
                                    {work.userRole || work.contributorRole || "Contributor"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LatestWorksSection = ({ contributions, loading }) => {
    return (
        <section className="relative">
            {/* Enhanced Styles */}
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fadeSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(30px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
                
                .animate-fadeSlideIn {
                    animation: fadeSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: linear-gradient(45deg, #10b981, #059669);
                    cursor: pointer;
                    box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
                }
                
                .slider::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: linear-gradient(45deg, #10b981, #059669);
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
                }
            `}</style>

            {/* Section Header */}
            <div className="mb-10">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                    Latest Works
                </h2>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="relative">
                        <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-8 h-8 border-4 border-transparent border-t-pink-500 rounded-full animate-spin animation-delay-150"></div>
                    </div>
                    <span className="ml-4 text-white/70 text-lg font-medium">
                        Loading contributions...
                    </span>
                </div>
            ) : contributions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {contributions.map((work, i) => (
                        <div
                            key={work._id || i}
                            className="animate-fadeSlideIn"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <WorkCard work={work} index={i} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24">
                    <div className="relative mb-8">
                        <div className="w-20 h-20 mx-auto mb-6 relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
                            <div className="relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-4 border border-white/10">
                                <svg className="w-12 h-12 mx-auto text-white/40" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <h3 className="text-white/80 text-xl font-bold mb-3">No contributions yet</h3>
                    <p className="text-white/50 text-base max-w-md mx-auto leading-relaxed">
                        Start contributing to games to showcase your amazing work here and build your portfolio
                    </p>
                </div>
            )}
        </section>
    );
};

export default LatestWorksSection;