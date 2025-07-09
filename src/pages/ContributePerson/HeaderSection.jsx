// src/pages/ContributePerson/HeaderSection.jsx - Enhanced with ProfileHeader features
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaEdit, FaMapMarkerAlt, FaCalendarAlt, FaGlobe, FaLinkedin, FaTwitter, FaInstagram, FaStar, FaCheckCircle, FaExternalLinkAlt, FaUsers, FaTwitch, FaYoutube, FaDiscord, FaGithub } from "react-icons/fa";
import ImageWithFallback from "./ImageWithFallback";
import Badge from "./Badge";
import FollowButton from "../../components/social/FollowButton";

// Resim validasyon kuralları
const IMAGE_RULES = {
    maxWidth: 800,
    maxHeight: 800,
    maxFileSize: 5,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
    compressedMaxWidth: 400,
    compressQuality: 0.85
};

const predefinedCovers = [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1556438064-2d7646166914?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3"
];

const SOCIAL_COLORS = {
    linkedin: "#0A66C2",
    twitter: "#1DA1F2",
    instagram: "#E1306C",
    website: "#FFD600",
    youtube: "#FF0000",
    twitch: "#9146FF",
    discord: "#7289DA",
    github: "#f0f6fc"
};

// 🆕 Enhanced image processing functions
const validateImageFile = (file) => {
    const errors = [];
    if (!IMAGE_RULES.allowedTypes.includes(file.type)) {
        errors.push(`Sadece JPG ve PNG dosyaları kabul edilir. Seçilen dosya: ${file.type}`);
    }
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > IMAGE_RULES.maxFileSize) {
        errors.push(`Dosya boyutu ${IMAGE_RULES.maxFileSize}MB'dan küçük olmalıdır. Seçilen dosya: ${fileSizeMB.toFixed(2)}MB`);
    }
    return { isValid: errors.length === 0, errors };
};

const processImage = (file) => {
    return new Promise((resolve, reject) => {
        const fileValidation = validateImageFile(file);
        if (!fileValidation.isValid) {
            reject(new Error(fileValidation.errors.join('\n')));
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            let { width, height } = img;
            const maxSize = IMAGE_RULES.compressedMaxWidth;

            if (width > height) {
                if (width > maxSize) {
                    height = (height * maxSize) / width;
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width = (width * maxSize) / height;
                    height = maxSize;
                }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            const compressedDataUrl = canvas.toDataURL('image/jpeg', IMAGE_RULES.compressQuality);
            resolve({
                dataUrl: compressedDataUrl,
                originalSize: {
                    width: img.width,
                    height: img.height,
                    fileSize: (file.size / (1024 * 1024)).toFixed(2) + 'MB'
                },
                finalSize: {
                    width: Math.round(width),
                    height: Math.round(height),
                    fileSize: ((compressedDataUrl.length * 0.75) / (1024 * 1024)).toFixed(2) + 'MB'
                }
            });
        };

        img.onerror = () => {
            reject(new Error('Resim yüklenirken hata oluştu. Lütfen geçerli bir resim dosyası seçin.'));
        };

        img.src = URL.createObjectURL(file);
    });
};

const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
        case 'professional': return <FaCheckCircle className="text-blue-400" />;
        case 'gamer': return <FaStar className="text-purple-400" />;
        case 'streamer': return <FaCamera className="text-red-400" />;
        default: return <FaStar className="text-gray-400" />;
    }
};

const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
        case 'professional': return "bg-blue-500/20 text-blue-400 border-blue-400/50";
        case 'gamer': return "bg-purple-500/20 text-purple-400 border-purple-400/50";
        case 'streamer': return "bg-red-500/20 text-red-400 border-red-400/50";
        default: return "bg-gray-500/20 text-gray-400 border-gray-400/50";
    }
};

// 🆕 Enhanced social icon function
const getSocialIcon = (platform) => {
    const icons = {
        Twitter: FaTwitter,
        Instagram: FaInstagram,
        YouTube: FaYoutube,
        Twitch: FaTwitch,
        Discord: FaDiscord,
        LinkedIn: FaLinkedin,
        GitHub: FaGithub,
        website: FaGlobe
    };

    const IconComponent = icons[platform] || FaGlobe;
    return <IconComponent className="w-4 h-4" />;
};

const getSocialColor = (platform) => {
    return SOCIAL_COLORS[platform?.toLowerCase()] || "#6B7280";
};

const HeaderSection = ({
                           gamer,
                           coverImage,
                           setCoverImage
                           // 🚫 onProfileSave kaldırıldı - PersonDetailPage'de editing yok
                       }) => {
    // 🚫 Editing state'leri kaldırıldı
    const navigate = useNavigate();

    // 🚫 Image processing functions kaldırıldı - PersonDetailPage'de editing yok

    // 🚫 isOwnProfile check kaldırıldı - PersonDetailPage'de editing yok

    return (
        <div className="relative overflow-hidden">
            {/* Background with cover image */}
            <div className="relative h-[340px] md:h-[440px]">
                <div className="absolute inset-0 bg-center bg-cover profile-blur-bg"
                     style={{ backgroundImage: `url(${coverImage})`, filter: "blur(2px) scale(1.04)" }} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-black via-black/80 to-transparent" />
            </div>

            {/* Profile Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 -mt-36 sm:-mt-44">
                <div className="flex flex-col sm:flex-row sm:items-end gap-6 pb-6">
                    {/* Avatar Section */}
                    <div className="relative group">
                        <ImageWithFallback
                            src={gamer.avatar || "https://placehold.co/200x200?text=Avatar"}
                            alt={gamer.username || "Avatar"}
                            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-yellow-400 shadow-2xl object-cover bg-white"
                            style={{ boxShadow: "0 0 0 8px rgba(255,221,51,0.2)" }}
                        />

                        {/* 🆕 Online status indicator */}
                        <div className="absolute bottom-2 right-2 glass-effect text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            Online
                        </div>

                        {/* 🚫 Edit buttons KALDIRILDI - PersonDetailPage'de editing yok */}
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1 flex items-center gap-2">
                                    {gamer.username}
                                </h1>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {gamer.title && gamer.title.split(',').map((titlePart, idx) => (
                                            <span key={idx} className="text-xl text-white/80 font-medium">
                                                {titlePart.trim()}
                                                {idx < gamer.title.split(',').length - 1 && <span className="ml-2 text-white/60">•</span>}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="h-4 w-px bg-white/40"></div>
                                    <div className="flex gap-2">
                                        {(gamer.userTypes || []).filter(userType => userType != null).map((userType, i) => {
                                            // String ise basit badge göster
                                            if (typeof userType === 'string' && userType.trim()) {
                                                const typeStyle = getTypeColor(userType);
                                                return (
                                                    <span key={i} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${typeStyle}`}>
                                                        {getTypeIcon(userType)}
                                                        {userType.charAt(0).toUpperCase() + userType.slice(1)}
                                                    </span>
                                                );
                                            }
                                            // Object ise Badge component kullan
                                            if (userType && typeof userType === 'object' && (userType.icon || userType.type || userType.title)) {
                                                return (
                                                    <Badge key={i} icon={userType.icon || "👤"} text={userType.type || userType.title || "Unknown"} colorClass={userType.colorClass || "text-gray-400"} />
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 🆕 Enhanced profile details */}
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-white/70 text-sm mb-3">
                            <span className="flex items-center gap-1">
                                <FaMapMarkerAlt />
                                {gamer.country || "Location Unknown"}
                            </span>
                            <span className="flex items-center gap-1">
                                <FaCalendarAlt />
                                Member since {gamer.createdAt ? new Date(gamer.createdAt).getFullYear() : "2024"}
                            </span>
                            <span className="flex items-center gap-1">
                                <FaStar className="text-yellow-400" />
                                Level {gamer.level || "1"} • {gamer.rank || "Beginner"}
                            </span>
                            {gamer.website && (
                                <>
                                    <span className="mx-2 text-white/50">|</span>
                                    <a href={gamer.website.startsWith('http') ? gamer.website : `https://${gamer.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                        <FaGlobe size={12} />
                                        {gamer.website}
                                    </a>
                                </>
                            )}
                        </div>

                        {/* 🆕 Role badges */}
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-3">
                            {(gamer.roles || []).map((role, i) => (
                                <span key={i} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-xs text-white border border-white/20 transition-colors cursor-pointer font-medium">
                                    <FaStar className="w-3 h-3 text-yellow-400" />
                                    {role.name || role}
                                </span>
                            ))}
                        </div>

                        {/* 🆕 Action buttons and social links */}
                        <div className="flex items-center gap-4 justify-center sm:justify-start">
                            {/* Social Links */}
                            <div className="flex gap-3">
                                {(gamer.socials || []).map((social, i) => {
                                    const color = getSocialColor(social.platform);
                                    return (
                                        <a key={i}
                                           href={social.link}
                                           title={social.platform}
                                           target="_blank"
                                           rel="noopener noreferrer"
                                           className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all hover:scale-110"
                                           style={{ backgroundColor: `${color}22` }}>
                                            {getSocialIcon(social.platform)}
                                        </a>
                                    );
                                })}

                                {/* More links button */}
                                <button className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all hover:scale-110 bg-white/10 hover:bg-white/20 border border-white/20"
                                        title="More links">
                                    <FaExternalLinkAlt size={14} />
                                </button>
                            </div>

                            <div className="h-6 w-px bg-white/30"></div>

                            {/* Social Action Buttons */}
                            <div className="flex items-center gap-3">
                                {/* Follow/Connect Button */}
                                <FollowButton 
                                    targetUserId={gamer._id || gamer.id}
                                    targetUsername={gamer.username}
                                    size="small"
                                    showMessageButton={true}
                                    connectionType="follow"
                                />
                                
                                {/* Go to Gamer Page Button */}
                                <button
                                    onClick={() => navigate(`/dashboard/${gamer.username}`)}
                                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                    <FaUsers size={12} />
                                    <span>Gamer Page</span>
                                    <FaExternalLinkAlt size={10} className="opacity-80" />
                                </button>
                            </div>

                            {/* 🚫 Edit Profile Button KALDIRILDI - Sadece GamerDashboard'da olacak */}
                        </div>
                    </div>
                </div>

                {/* 🆕 Profile completion border */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mt-8 mb-4"></div>
            </div>

            {/* 🚫 Cover Edit Modal KALDIRILDI - PersonDetailPage'de editing yok */}

            {/* 🚫 Edit Profile Modal KALDIRILDI - PersonDetailPage'de editing yok */}
        </div>
    );
};

export default HeaderSection;