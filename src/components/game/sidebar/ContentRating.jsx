// sidebar/ContentRating.jsx
import React from "react";
import {
    FaFlag,
    FaSkullCrossbones,
    FaExclamationTriangle,
    FaHeart,
    FaCannabis
} from "react-icons/fa";
import Section from "./Section";

const ContentRating = () => {
    const contentDescriptors = [
        {
            icon: FaSkullCrossbones,
            label: "Intense Violence",
            color: "red",
            bgColor: "bg-red-500/10",
            borderColor: "border-red-500/20"
        },
        {
            icon: FaExclamationTriangle,
            label: "Strong Language",
            color: "yellow",
            bgColor: "bg-yellow-500/10",
            borderColor: "border-yellow-500/20"
        },
        {
            icon: FaHeart,
            label: "Sexual Themes",
            color: "pink",
            bgColor: "bg-pink-500/10",
            borderColor: "border-pink-500/20"
        },
        {
            icon: FaCannabis,
            label: "Use of Drugs and Alcohol",
            color: "green",
            bgColor: "bg-green-500/10",
            borderColor: "border-green-500/20"
        }
    ];

    return (
        <Section title="Content Rating" icon={FaFlag}>
            <div className="space-y-2">
                <h4 className="text-white/70 text-xs uppercase tracking-wide font-medium mb-3">
                    Content Descriptors
                </h4>
                <div className="grid grid-cols-1 gap-2">
                    {contentDescriptors.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={index}
                                className={`flex items-center gap-3 p-2 ${item.bgColor} rounded border ${item.borderColor}`}
                            >
                                <Icon className={`w-3 h-3 text-${item.color}-400`} />
                                <span className="text-xs text-white/80">{item.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Section>
    );
};

export default ContentRating;