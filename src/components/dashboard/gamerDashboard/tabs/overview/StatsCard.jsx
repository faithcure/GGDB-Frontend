import React from "react";
import { FaEdit } from "react-icons/fa";

const StatsCard = ({ gamer, setEditingSection }) => {
    const isEmptyGenres = !gamer.favoriteGenres || gamer.favoriteGenres.length === 0;
    return (
        <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
                <h3 className="text-sm font-semibold text-white">Gaming Stats</h3>
                <div className="relative group">
                    <button
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all border border-white/10 hover:border-white/20"
                        onClick={() => setEditingSection && setEditingSection('stats')}
                    >
                        <FaEdit size={12} />
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <div className="bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-white/20">
                            Edit gaming stats
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white/60">Completion Rate</span>
                        <span className="text-sm font-medium text-white">{gamer.stats?.completionRate || 0}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${gamer.stats?.completionRate || 0}%` }}
                        />
                    </div>
                </div>
                <div className="pt-4 border-t border-white/10">
                    <h4 className="text-sm font-medium text-white/70 mb-4 uppercase tracking-wide">Favorite Genres</h4>
                    {isEmptyGenres ? (
                        <div className="text-center py-6">
                            <p className="text-white/40 text-sm">No genres selected yet</p>
                            <button
                                onClick={() => setEditingSection && setEditingSection('genres')}
                                className="mt-3 text-purple-400 hover:text-purple-300 text-sm transition-colors"
                            >
                                Add genres
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {gamer.favoriteGenres.map((genre, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-white/80 font-medium">{genre.name}</span>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-20 bg-white/10 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${genre.percentage}%`,
                                                    backgroundColor: genre.color
                                                }}
                                            />
                                        </div>
                                        <span className="text-white/50 text-sm w-8 text-right">
                      {genre.percentage}%
                    </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
