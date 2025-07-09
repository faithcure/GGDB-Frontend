// sidebar/GameFeatures.jsx
import React from "react";
import { FaGamepad } from "react-icons/fa";
import Section from "./Section";

const GameFeatures = ({ features }) => {
    return (
        <Section title="Game Features" icon={FaGamepad}>
            <div className="space-y-2">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <div key={index} className="flex items-center gap-3 py-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                feature.active
                                    ? 'bg-green-500/20 border border-green-500/40'
                                    : 'bg-white/10 border border-white/20'
                            }`}>
                                {feature.active ? (
                                    <span className="text-green-400 text-xs font-bold">✓</span>
                                ) : (
                                    <span className="text-white/40 text-xs">✗</span>
                                )}
                            </div>
                            <Icon className={`w-4 h-4 ${feature.active ? 'text-white/90' : 'text-white/50'}`} />
                            <span className={`text-sm ${feature.active ? 'text-white/90' : 'text-white/60'}`}>
                {feature.label}
              </span>
                        </div>
                    );
                })}
            </div>
        </Section>
    );
};

export default GameFeatures;