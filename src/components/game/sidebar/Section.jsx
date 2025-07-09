// sidebar/Section.jsx
import React from "react";
import { FaChevronDown } from "react-icons/fa";

const Section = ({
                     title,
                     icon: Icon,
                     children,
                     collapsible = false,
                     expanded = true,
                     onToggle = null
                 }) => (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5 hover:bg-white/10 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-yellow-400" />
                <h3 className="text-white font-semibold text-sm tracking-wide">{title}</h3>
            </div>
            {collapsible && (
                <button
                    onClick={onToggle}
                    className="p-1 rounded hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                >
                    <FaChevronDown className={`w-3 h-3 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
                </button>
            )}
        </div>
        {(!collapsible || expanded) && children}
    </div>
);

export default Section;