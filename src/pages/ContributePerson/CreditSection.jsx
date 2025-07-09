// src/pages/ContributePerson/CreditSection.jsx
import React from "react";
import { FaChevronDown, FaStar } from "react-icons/fa";
import ImageWithFallback from "./ImageWithFallback";

const CreditSection = ({ credits, expandedSections, toggleSection }) => (
    <section>
        <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-2">Credits</h2>
        <div className="space-y-6">
            {Object.entries(credits).map(([category, { upcoming = [], previous = [] }]) => {
                const isExpanded = expandedSections[category];
                return (
                    <div key={category}>
                        <button
                            onClick={() => toggleSection(category)}
                            className="w-full flex items-center justify-between bg-white/10 px-4 py-3 hover:bg-white/15 transition-colors border border-white/10 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-semibold text-yellow-400">{category}</h3>
                                <span className="text-sm text-white/50 font-normal">
                  {(upcoming.length + previous.length)} {(upcoming.length + previous.length) === 1 ? 'project' : 'projects'}
                </span>
                            </div>
                            <FaChevronDown className={`w-5 h-5 text-white/70 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        {isExpanded && (
                            <div className="pt-4 animate-fadeIn">
                                {upcoming.length > 0 && (
                                    <div className="mb-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-2 h-2 bg-blue-400"></div>
                                            <h4 className="text-base font-medium text-blue-400">In Development</h4>
                                        </div>
                                        <div className="h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent mb-4"></div>
                                        <div className="space-y-3">
                                            {upcoming.map((work, i) => (
                                                <div key={i} className="flex items-center gap-4 py-2 px-4 hover:bg-white/5 transition-colors rounded-lg">
                                                    <ImageWithFallback
                                                        src={work.poster}
                                                        alt={work.title}
                                                        className="w-12 h-16 object-cover bg-gray-800 rounded"
                                                    />
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-white">{work.title}</h4>
                                                        <p className="text-white/60 text-sm">{work.role}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-white/70 text-sm">{work.year}</div>
                                                        {work.rating && (
                                                            <div className="flex items-center gap-1 justify-end mt-1">
                                                                <FaStar className="text-yellow-400 w-3 h-3" />
                                                                <span className="text-yellow-400 text-sm">{work.rating}</span>
                                                            </div>
                                                        )}
                                                        {work.status && (
                                                            <div className="text-xs text-blue-400 mt-1">{work.status}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {previous.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-2 h-2 bg-white/40"></div>
                                            <h4 className="text-base font-medium text-white/70">Previous Work</h4>
                                        </div>
                                        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4"></div>
                                        <div className="space-y-3">
                                            {previous.map((work, i) => (
                                                <div key={i} className="flex items-center gap-4 py-2 px-4 hover:bg-white/5 transition-colors rounded-lg">
                                                    <ImageWithFallback
                                                        src={work.poster}
                                                        alt={work.title}
                                                        className="w-12 h-16 object-cover bg-gray-800 rounded"
                                                    />
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-white">{work.title}</h4>
                                                        <p className="text-white/60 text-sm">{work.role}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-white/70 text-sm">{work.year}</div>
                                                        {work.rating && (
                                                            <div className="flex items-center gap-1 justify-end mt-1">
                                                                <FaStar className="text-yellow-400 w-3 h-3" />
                                                                <span className="text-yellow-400 text-sm">{work.rating}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    </section>
);

export default CreditSection;