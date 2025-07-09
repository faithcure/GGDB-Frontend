// sidebar/StoreLinks.jsx
import React from "react";
import {
    FaDownload,
    FaSteam,
    FaPlay,
    FaGlobe,
    FaGamepad,
    FaExternalLinkAlt
} from "react-icons/fa";
import Section from "./Section";

const StoreLinks = ({ storeLinks }) => {
    const storeIcons = {
        "Steam": FaSteam,
        "Epic Games": FaPlay,
        "GOG": FaGlobe,
        "Xbox": FaGamepad
    };

    return (
        <Section title="Available On" icon={FaDownload}>
            <div className="space-y-3">
                {storeLinks.map((store, index) => {
                    const Icon = storeIcons[store.platform] || FaExternalLinkAlt;

                    return (
                        <button
                            key={index}
                            className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded border border-white/10 hover:border-white/20 transition-all duration-300 text-white/80 hover:text-white group"
                        >
                            <div className="flex items-center gap-3">
                                <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium">{store.platform}</span>
                            </div>
                            <span className="text-sm font-bold">{store.price}</span>
                        </button>
                    );
                })}
            </div>
        </Section>
    );
};

export default StoreLinks;