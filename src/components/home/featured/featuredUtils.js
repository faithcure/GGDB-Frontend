// src/components/home/featured/featuredUtils.js

import {
    FaSteam, FaWindows, FaStore, FaAmazon, FaItchIo,
    FaPlaystation, FaXbox, FaApple
} from "react-icons/fa";
import { SiNintendo, SiUbisoft, SiEa, SiEpicgames } from "react-icons/si";

// Platform icon mapping
export const storeIconMap = {
    steam: FaSteam,
    epicgames: FaStore,
    gog: FaWindows,
    amazon: FaAmazon,
    amazongames: FaAmazon,
    itchio: FaItchIo,
    playstationstore: FaPlaystation,
    ps: FaPlaystation,
    xbox: FaXbox,
    xboxstore: FaXbox,
    microsoftstore: FaWindows,
    apple: FaApple,
    appstore: FaApple,
    nintendo: SiNintendo,
    nintendoeshop: SiNintendo,
    nintendostore: SiNintendo,
    ubisoft: SiUbisoft,
    uplay: SiUbisoft,
    ea: SiEa,
    eagames: SiEa,
    epic: SiEpicgames,
};

// Platform name normalizer
export const normalizePlatform = (name = "") =>
    name
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace("store", "store")
        .replace("eshop", "eshop")
        .replace(/[^a-z]/g, "");

// Get store icon component
export const getStoreIcon = (platform, size = 20, color = "#ffffff") => {
    const Icon = storeIconMap[platform];
    if (!Icon) return null;
    return <Icon size={size} color={color} className="storeicon" />;
};

// Progress motivational messages
export const getMotivationMessage = (progress) => {
    if (progress === 0) return "";
    if (progress <= 10) return "Getting started! 🎮";
    if (progress <= 25) return "Nice! 😊";
    if (progress <= 50) return "Halfway there! 🔥";
    if (progress <= 75) return "Almost done! 💪";
    if (progress <= 90) return "SO CLOSE! ⭐";
    if (progress < 100) return "INCREDIBLE! 🚀";
    return "LEGENDARY! 🏆";
};

// Progress status messages
export const getProgressMessage = (progress) => {
    if (progress === 0) return "";
    if (progress <= 10) return "JUST STARTED";
    if (progress <= 25) return "WARMING UP";
    if (progress <= 40) return "MAKING PROGRESS";
    if (progress <= 50) return "HALFWAY THERE";
    if (progress <= 65) return "GOING STRONG";
    if (progress <= 75) return "ALMOST THERE";
    if (progress <= 90) return "FINAL STRETCH";
    if (progress < 100) return "SO CLOSE";
    return "COMPLETED";
};

// Progress button styling
export const getProgressButtonStyle = (progress) => {
    if (progress === 0) {
        return "bg-gray-800/40 backdrop-blur-sm text-gray-200 hover:bg-green-600/70";
    }
    if (progress === 100) {
        return "bg-green-600/70 text-white border-green-500";
    }
    return "bg-blue-600/70 text-white border-blue-500";
};

// Render store icons component
export const renderStoreIcons = (links = []) => {
    if (!Array.isArray(links) || links.length === 0) return null;

    return (
        <div className="flex flex-col gap-1 mt-4">
            <div className="w-full h-px bg-white/10 mb-2"></div>
            <div className="flex items-center gap-3">
                <span className="text-white/60 text-sm">Available Platforms:</span>
                {links.slice(0, 6).map((store, idx) => {
                    const normPlatform = normalizePlatform(store.platform);
                    const icon = getStoreIcon(normPlatform, 20, "#ffffff");
                    if (!icon) return null;
                    return (
                        <a
                            key={store.platform + idx}
                            href={store.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={store.platform}
                            className="group transition-all duration-300 hover:scale-125"
                            style={{ display: "inline-flex" }}
                        >
                            {icon}
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

// Game data formatters
export const formatGameData = (games) => {
    return games.slice().reverse().slice(0, 12).map((g, i) => ({
        ...g,
        trailer: g.trailer || (i === 0 ? "https://www.w3schools.com/html/mov_bbb.mp4" : null),
        match: 90 + Math.floor(Math.random() * 10),
        isHot: Math.random() > 0.7,
        playersCount: Math.floor(Math.random() * 50000) + 10000
    }));
};

// Default fallback game
export const getDefaultGame = () => ({
    _id: 1,
    title: "Quiet Waters",
    coverImage: "https://placehold.co/600x900/1a1a2e/eee?text=Quiet+Waters",
    bannerImage: "https://placehold.co/1920x1080/1a1a2e/eee?text=Quiet+Waters+Banner",
    studio: "Minimal Games",
    releaseDate: "2025-02-20",
    ggdbRating: 8.3,
    metacriticScore: 88,
    genres: ["Puzzle", "Relaxing"],
    description: "Calm your mind with this beautiful minimalist puzzle journey that takes you through serene landscapes and challenging puzzles.",
    story: "In a world where chaos reigns, find peace through intricate puzzles and stunning visuals. Every level brings you closer to inner tranquility.",
    trailer: "https://www.w3schools.com/html/mov_bbb.mp4",
    ratingCount: 1250,
    votes: 1250,
    match: 98,
    isHot: true,
    playersCount: 23456
});

// Constants
export const FEATURED_CONFIG = {
    AUTO_ROTATE_INTERVAL: 10000,
    TRANSITION_DURATION: 300,
    MAX_GAMES: 12
};