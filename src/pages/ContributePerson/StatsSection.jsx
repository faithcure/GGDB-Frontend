// src/pages/ContributePerson/StatsSection.jsx
import React from "react";
import { FaTrophy, FaGamepad, FaStar, FaFire, FaCode, FaPaintBrush, FaUsers, FaClock, FaCalendarAlt, FaChartLine } from "react-icons/fa";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";

const StatCard = ({ icon, title, value, subtitle, color = "purple", trend = null }) => {
    const colorClasses = {
        purple: "from-purple-500/20 to-purple-600/20 border-purple-400/30 text-purple-400",
        blue: "from-blue-500/20 to-blue-600/20 border-blue-400/30 text-blue-400",
        green: "from-green-500/20 to-green-600/20 border-green-400/30 text-green-400",
        yellow: "from-yellow-500/20 to-yellow-600/20 border-yellow-400/30 text-yellow-400",
        pink: "from-pink-500/20 to-pink-600/20 border-pink-400/30 text-pink-400",
        orange: "from-orange-500/20 to-orange-600/20 border-orange-400/30 text-orange-400"
    };

    return (
        <div className={`relative group bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-br ${colorClasses[color]} rounded-lg border`}>
                        {icon}
                    </div>
                    {trend && (
                        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${trend > 0 ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20'}`}>
                            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
                        </div>
                    )}
                </div>
                
                <div className="space-y-2">
                    <h3 className="text-white/80 text-sm font-medium">{title}</h3>
                    <p className="text-white text-2xl font-bold">{value}</p>
                    {subtitle && <p className="text-white/50 text-xs">{subtitle}</p>}
                </div>
            </div>
        </div>
    );
};

const AchievementBadge = ({ icon, title, description, rarity = "common", unlocked = true }) => {
    const rarityClasses = {
        common: unlocked ? "from-gray-500/20 to-gray-600/20 border-gray-400/30 text-gray-400" : "from-gray-500/10 to-gray-600/10 border-gray-400/20 text-gray-600",
        rare: unlocked ? "from-blue-500/20 to-blue-600/20 border-blue-400/30 text-blue-400" : "from-blue-500/10 to-blue-600/10 border-blue-400/20 text-blue-600",
        epic: unlocked ? "from-purple-500/20 to-purple-600/20 border-purple-400/30 text-purple-400" : "from-purple-500/10 to-purple-600/10 border-purple-400/20 text-purple-600",
        legendary: unlocked ? "from-yellow-500/20 to-yellow-600/20 border-yellow-400/30 text-yellow-400" : "from-yellow-500/10 to-yellow-600/10 border-yellow-400/20 text-yellow-600"
    };

    return (
        <div className={`group relative bg-gradient-to-br ${rarityClasses[rarity]} backdrop-blur-sm rounded-xl p-4 border transition-all duration-300 hover:scale-105 ${unlocked ? 'hover:shadow-xl' : 'opacity-50'}`}>
            {/* Sparkle effect for unlocked achievements */}
            {unlocked && (
                <div className="absolute -top-1 -right-1">
                    <HiSparkles className="text-yellow-400 text-sm animate-pulse" />
                </div>
            )}
            
            <div className="text-center space-y-3">
                <div className={`w-12 h-12 mx-auto p-3 bg-gradient-to-br ${rarityClasses[rarity]} rounded-lg border`}>
                    {icon}
                </div>
                <div>
                    <h4 className={`text-sm font-bold ${unlocked ? 'text-white' : 'text-white/40'}`}>{title}</h4>
                    <p className={`text-xs mt-1 ${unlocked ? 'text-white/60' : 'text-white/30'}`}>{description}</p>
                </div>
            </div>
        </div>
    );
};

const StatsSection = ({ gamer, contributions = [] }) => {
    // Calculate stats from contributions
    const totalProjects = contributions.length;
    const totalRating = contributions.reduce((sum, contrib) => sum + (contrib.ggdbRating || 0), 0);
    const avgRating = totalProjects > 0 ? (totalRating / totalProjects).toFixed(1) : 0;
    
    // Group by departments
    const departments = {};
    contributions.forEach(contrib => {
        if (contrib.allDepartments) {
            contrib.allDepartments.forEach(dept => {
                departments[dept] = (departments[dept] || 0) + 1;
            });
        } else if (contrib.department) {
            departments[contrib.department] = (departments[contrib.department] || 0) + 1;
        }
    });
    
    const topDepartment = Object.entries(departments).sort(([,a], [,b]) => b - a)[0]?.[0] || "Developer";
    const joinYear = gamer?.createdAt ? new Date(gamer.createdAt).getFullYear() : new Date().getFullYear();
    const yearsActive = new Date().getFullYear() - joinYear + 1;

    // Sample achievements - in real app, these would come from backend
    const achievements = [
        { icon: <FaGamepad />, title: "First Steps", description: "Complete your first project", rarity: "common", unlocked: totalProjects > 0 },
        { icon: <FaTrophy />, title: "Rising Star", description: "Get 5 projects", rarity: "rare", unlocked: totalProjects >= 5 },
        { icon: <FaStar />, title: "Quality Master", description: "Maintain 8+ average rating", rarity: "epic", unlocked: avgRating >= 8 },
        { icon: <FaFire />, title: "Prolific Creator", description: "Work on 10+ projects", rarity: "legendary", unlocked: totalProjects >= 10 },
        { icon: <HiLightningBolt />, title: "Speed Demon", description: "Ship 3 projects in a year", rarity: "epic", unlocked: false },
        { icon: <FaUsers />, title: "Team Player", description: "Collaborate with 20+ people", rarity: "rare", unlocked: false }
    ];

    return (
        <section className="space-y-8">
            {/* Section Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-400/30">
                        <FaChartLine className="text-blue-400 text-xl" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
                            Stats & Achievements
                        </h2>
                        <p className="text-white/60 text-sm mt-1">Performance metrics and milestones</p>
                    </div>
                </div>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<FaGamepad className="text-xl" />}
                    title="Total Projects"
                    value={totalProjects}
                    subtitle="Games contributed to"
                    color="purple"
                    trend={totalProjects > 5 ? 15 : null}
                />
                <StatCard
                    icon={<FaStar className="text-xl" />}
                    title="Average Rating"
                    value={avgRating}
                    subtitle="Project quality score"
                    color="yellow"
                    trend={avgRating > 7 ? 8 : null}
                />
                <StatCard
                    icon={<FaCode className="text-xl" />}
                    title="Primary Role"
                    value={topDepartment}
                    subtitle="Most active department"
                    color="blue"
                />
                <StatCard
                    icon={<FaCalendarAlt className="text-xl" />}
                    title="Years Active"
                    value={yearsActive}
                    subtitle={`Since ${joinYear}`}
                    color="green"
                />
            </div>

            {/* Department Breakdown */}
            {Object.keys(departments).length > 0 && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <FaPaintBrush className="text-purple-400" />
                        Department Breakdown
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(departments).map(([dept, count]) => (
                            <div key={dept} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10">
                                <span className="text-white/80 text-sm font-medium">{dept}</span>
                                <span className="text-white font-bold">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Achievements */}
            <div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <FaTrophy className="text-yellow-400" />
                    Achievements
                    <span className="text-sm text-white/50 font-normal ml-2">
                        ({achievements.filter(a => a.unlocked).length}/{achievements.length})
                    </span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {achievements.map((achievement, i) => (
                        <AchievementBadge key={i} {...achievement} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;