import React from "react";
import { FaGamepad, FaChartBar } from "react-icons/fa";

const QuickAccessSection = () => {
    return (
        <div>
            <h3 className="text-sm font-semibold text-white mb-3">Quick Access</h3>
            <div className="flex gap-3">
                <a
                    href="#library"
                    onClick={e => {
                        e.preventDefault();
                        window.dispatchEvent(new CustomEvent('switchTab', { detail: 'library' }));
                    }}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                >
                    <FaGamepad size={14} />
                    Game Library
                </a>
                <span className="text-white/30">•</span>
                <a
                    href="#stats"
                    onClick={e => {
                        e.preventDefault();
                        window.dispatchEvent(new CustomEvent('switchTab', { detail: 'stats' }));
                    }}
                    className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors text-sm"
                >
                    <FaChartBar size={14} />
                    Statistics
                </a>
            </div>
        </div>
    );
};

export default QuickAccessSection;
