// sidebar/CommunityLinks.jsx
import React from "react";
import {
    FaUsers,
    FaTwitter,
    FaYoutube,
    FaDiscord,
    FaReddit
} from "react-icons/fa";
import Section from "./Section";

const CommunityLinks = () => {
    const socialLinks = [
        { icon: FaTwitter, color: "hover:text-blue-400" },
        { icon: FaYoutube, color: "hover:text-red-400" },
        { icon: FaDiscord, color: "hover:text-indigo-400" },
        { icon: FaReddit, color: "hover:text-orange-400" }
    ];

    return (
        <Section title="Community & Media" icon={FaUsers}>
            <div className="flex justify-center gap-4">
                {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                        <button
                            key={index}
                            className={`p-3 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-all duration-300 text-white/60 ${social.color} hover:scale-110`}
                        >
                            <Icon className="w-4 h-4" />
                        </button>
                    );
                })}
            </div>
        </Section>
    );
};

export default CommunityLinks;