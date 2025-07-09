// sidebar/GameSidebar.jsx - Ana Component
import React, { useState } from "react";
import {
    FaSteam,
    FaTwitch,
    FaYoutube,
    FaTwitter,
    FaExternalLinkAlt,
    FaSkullCrossbones,
    FaHeart,
    FaExclamationTriangle,
    FaCannabis,
    FaClock,
    FaGlobe,
    FaBookmark,
    FaShare,
    FaEye,
    FaStar,
    FaUsers,
    FaGamepad,
    FaFlag,
    FaPlay,
    FaChevronRight,
    FaTrophy,
    FaAward,
    FaDownload,
    FaDiscord,
    FaReddit,
    FaBolt,
    FaGem,
    FaRocket,
    FaInfinity,
    FaChevronDown
} from "react-icons/fa";

// Import edilecek componentler
import ScoreCard from "./ScoreCard";
import TimeToBeat from "./TimeToBeat";
import LanguageSupport from "./LanguageSupport";
import ContentRating from "./ContentRating";
import GameFeatures from "./GameFeatures";
import SystemRequirements from "./SystemRequirements";
import DLCExpansions from "./DLCExpansions";
import StoreLinks from "./StoreLinks";
import CommunityLinks from "./CommunityLinks";

const GameSidebar = ({ game = {}, averageRating, ratingCount }) => {
    const [expandedSections, setExpandedSections] = useState({
        languages: false,
        sysReqs: false
    });

    console.log('GameSidebar: Received game data:', game);

    // Mock data sadece gerekli alanlar için - ama asıl game objesini ScoreCard'a geçir
    const gameData = {
        // ✅ Asıl game objesinden ID'yi al
        _id: game._id || game.id,
        id: game.id || game._id,
        title: game.title || "Cyberpunk 2077",
        ggdbRating: game.ggdbRating || "8.2",
        metacriticScore: game.metacriticScore || "86",
        playtime: {
            main: game.mainPlaytime || 25,
            extras: game.extrasPlaytime || 45,
            complete: game.completionPlaytime || 85
        },
        features: [
            { label: "Single Player", icon: FaGamepad, active: true },
            { label: "Steam Cloud", icon: FaSteam, active: true },
            { label: "Achievements", icon: FaTrophy, active: true },
            { label: "Controller", icon: FaGamepad, active: true }
        ],
        genres: game.genres || ["Action", "RPG", "Open World"],
        tags: game.tags || ["Cyberpunk", "Futuristic", "Story Rich", "Choices Matter"],
        systemRequirements: {
            minimum: "OS: Windows 10 64-bit\nCPU: Intel i5-3570K\nRAM: 8 GB\nGPU: GTX 780\nStorage: 70 GB",
            recommended: "OS: Windows 11 64-bit\nCPU: Intel i7-12700\nRAM: 16 GB DDR4\nGPU: RTX 3070\nStorage: 70 GB NVMe"
        },
        dlcs: [
            { name: "Phantom Liberty", price: "$29.99", released: true },
            { name: "Future DLC", price: "TBA", released: false }
        ],
        storeLinks: [
            { platform: "Steam", price: "$59.99" },
            { platform: "Epic Games", price: "$59.99" },
            { platform: "GOG", price: "$59.99" },
            { platform: "Xbox", price: "$59.99" }
        ]
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <aside className="w-full md:w-80 xl:w-96 space-y-6 p-4">

            {/* 1. Enhanced Score Display - Asıl game objesini geçir, sahte data değil */}
            <ScoreCard
                gameData={game}
                averageRating={averageRating}
                ratingCount={ratingCount}
            />

            {/* 2. Time to Beat */}
            <TimeToBeat playtime={gameData.playtime} />

            {/* 3. Language Support */}
            <LanguageSupport
                gameData={game}
                expanded={expandedSections.languages}
                onToggle={() => toggleSection('languages')}
            />
            {/* 4. Content Rating */}
            <ContentRating />

            {/* 5. Game Features */}
            <GameFeatures features={gameData.features} />

            {/* 6. System Requirements */}
            <SystemRequirements
                systemRequirements={gameData.systemRequirements}
                expanded={expandedSections.sysReqs}
                onToggle={() => toggleSection('sysReqs')}
            />

            {/* 7. DLC & Expansions */}
            <DLCExpansions dlcs={gameData.dlcs} />

            {/* 8. Store Links */}
            <StoreLinks storeLinks={gameData.storeLinks} />

            {/* 9. Community Links */}
            <CommunityLinks />

            {/* Footer */}
            <div className="text-center pt-4 border-t border-white/10">
                <button className="text-xs text-white/50 hover:text-yellow-400 transition-colors">
                    Report incorrect information
                </button>
            </div>

        </aside>
    );
};

export default GameSidebar;