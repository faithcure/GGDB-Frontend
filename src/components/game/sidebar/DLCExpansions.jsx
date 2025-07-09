// sidebar/DLCExpansions.jsx
import React from "react";
import { FaTrophy } from "react-icons/fa";
import Section from "./Section";

const DLCExpansions = ({ dlcs }) => {
    return (
        <Section title="DLC & Expansions" icon={FaTrophy}>
            <div className="space-y-3">
                {dlcs.map((dlc, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10 hover:bg-white/10 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${dlc.released ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                            <span className="text-sm font-medium text-white/90">{dlc.name}</span>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                            dlc.released
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
              {dlc.price}
            </span>
                    </div>
                ))}
            </div>
        </Section>
    );
};

export default DLCExpansions;