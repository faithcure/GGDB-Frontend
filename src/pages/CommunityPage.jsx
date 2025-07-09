import React, { useState, useEffect } from 'react';
import {
    FaUsers,
    FaComments,
    FaFire,
    FaStar,
    FaGamepad,
    FaTrophy,
    FaHeart,
    FaUser,
    FaCalendar,
    FaEye,
    FaThumbsUp,
    FaPlay,
    FaCrown,
    FaGift,
    FaBookmark,
    FaShare,
    FaFilter,
    FaSearch,
    FaChevronRight,
    FaArrowUp,
    FaPlus,
    FaBell,
    FaChartLine,
    FaClock,
    FaMapMarkerAlt,
    FaVideo,
    FaMedal,
    FaRocket,
    FaLightbulb
} from 'react-icons/fa';

const CommunityPage = () => {
    const [activeTab, setActiveTab] = useState('feed');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [showNotifications, setShowNotifications] = useState(false);

    // Mock data
    const communityStats = {
        totalMembers: 24567,
        activeToday: 3456,
        gamesDiscussed: 8921,
        reviewsThisWeek: 1234,
        onlineNow: 892,
        discussions: 567
    };

    const activities = [
        {
            id: 1,
            type: 'review',
            user: {
                username: 'GameMaster_Pro',
                avatar: 'https://ui-avatars.com/api/?name=GameMaster&background=6366f1&color=fff',
                level: 42,
                isVerified: true
            },
            game: {
                title: 'Baldur\'s Gate 3',
                cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5s2n.webp',
                rating: 9.2
            },
            content: 'Absolutely mind-blowing RPG experience! The character development and story choices are incredible. Every decision feels meaningful and the voice acting is top-tier. This is easily one of the best RPGs of the decade.',
            rating: 9.5,
            timestamp: '2 hours ago',
            likes: 156,
            comments: 34,
            shares: 12
        },
        {
            id: 2,
            type: 'achievement',
            user: {
                username: 'SpeedRunner_Elite',
                avatar: 'https://ui-avatars.com/api/?name=SpeedRunner&background=f59e0b&color=fff',
                level: 38,
                isVerified: false
            },
            game: {
                title: 'Celeste',
                cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1tmu.webp'
            },
            content: 'Just broke my personal record! Completed any% speedrun in 28:34. The golden strawberry grind was worth it!',
            achievement: 'Sub-30 Minutes Any%',
            timestamp: '4 hours ago',
            likes: 89,
            comments: 18,
            shares: 6
        },
        {
            id: 3,
            type: 'discussion',
            user: {
                username: 'IndieGameCritic',
                avatar: 'https://ui-avatars.com/api/?name=Indie&background=ef4444&color=fff',
                level: 35,
                isVerified: true
            },
            content: 'Hot take: Indie games are carrying the industry right now. AAA studios are playing it too safe while indies are pushing boundaries. What do you think?',
            timestamp: '6 hours ago',
            likes: 234,
            comments: 78,
            shares: 45,
            tags: ['indie', 'gaming-industry', 'discussion'],
            category: 'Gaming Industry'
        },
        {
            id: 4,
            type: 'stream',
            user: {
                username: 'LiveGamer_TV',
                avatar: 'https://ui-avatars.com/api/?name=Live&background=8b5cf6&color=fff',
                level: 29,
                isVerified: true
            },
            game: {
                title: 'Elden Ring',
                cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.webp'
            },
            content: 'Going live now! Attempting a no-death run of Elden Ring. Come join the chaos!',
            viewerCount: 1247,
            isLive: true,
            timestamp: '30 minutes ago',
            likes: 67,
            comments: 23
        },
        {
            id: 5,
            type: 'list',
            user: {
                username: 'RetroCollector',
                avatar: 'https://ui-avatars.com/api/?name=Retro&background=10b981&color=fff',
                level: 45,
                isVerified: false
            },
            content: 'Created a new list: "Hidden Gems from the PS2 Era" - 25 games that deserve more recognition!',
            listTitle: 'Hidden Gems from the PS2 Era',
            gameCount: 25,
            timestamp: '1 day ago',
            likes: 178,
            comments: 42,
            shares: 28
        }
    ];

    const topMembers = [
        {
            id: 1,
            username: 'GamingLegend_2024',
            avatar: 'https://ui-avatars.com/api/?name=Legend&background=6366f1&color=fff',
            level: 50,
            gamesPlayed: 456,
            reviewsWritten: 234,
            followers: 5420,
            isVerified: true,
            badge: 'Elite Reviewer',
            badgeColor: 'from-purple-500 to-pink-500',
            reputation: 9876
        },
        {
            id: 2,
            username: 'ProGamer_Supreme',
            avatar: 'https://ui-avatars.com/api/?name=Pro&background=f59e0b&color=fff',
            level: 47,
            gamesPlayed: 378,
            reviewsWritten: 189,
            followers: 4230,
            isVerified: true,
            badge: 'Master Curator',
            badgeColor: 'from-orange-500 to-red-500',
            reputation: 8543
        },
        {
            id: 3,
            username: 'IndieExplorer_X',
            avatar: 'https://ui-avatars.com/api/?name=Explorer&background=ef4444&color=fff',
            level: 44,
            gamesPlayed: 289,
            reviewsWritten: 156,
            followers: 3890,
            isVerified: false,
            badge: 'Indie Specialist',
            badgeColor: 'from-blue-500 to-cyan-500',
            reputation: 7234
        }
    ];

    const upcomingEvents = [
        {
            id: 1,
            title: 'GGDB Game Awards 2025',
            date: '2025-07-15',
            time: '20:00',
            type: 'Awards Ceremony',
            participants: 2340,
            image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
            description: 'Annual community-voted game awards'
        },
        {
            id: 2,
            title: 'Indie Game Showcase',
            date: '2025-07-08',
            time: '18:30',
            type: 'Live Event',
            participants: 890,
            image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400',
            description: 'Discover the next big indie games'
        },
        {
            id: 3,
            title: 'Speedrun Championship',
            date: '2025-07-22',
            time: '15:00',
            type: 'Tournament',
            participants: 156,
            image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
            description: 'Compete for the fastest times'
        }
    ];

    const ActivityCard = ({ activity }) => {
        const getActivityIcon = () => {
            switch (activity.type) {
                case 'review': return <FaStar className="text-yellow-400" />;
                case 'achievement': return <FaTrophy className="text-orange-400" />;
                case 'discussion': return <FaComments className="text-blue-400" />;
                case 'stream': return <FaVideo className="text-red-400" />;
                case 'list': return <FaBookmark className="text-purple-400" />;
                default: return <FaGamepad className="text-gray-400" />;
            }
        };

        const getActivityBorder = () => {
            switch (activity.type) {
                case 'review': return 'border-yellow-500/30 hover:border-yellow-500/50';
                case 'achievement': return 'border-orange-500/30 hover:border-orange-500/50';
                case 'discussion': return 'border-blue-500/30 hover:border-blue-500/50';
                case 'stream': return 'border-red-500/30 hover:border-red-500/50';
                case 'list': return 'border-purple-500/30 hover:border-purple-500/50';
                default: return 'border-gray-500/30 hover:border-gray-500/50';
            }
        };

        return (
            <div className={`bg-gray-900/80 backdrop-blur-sm rounded-2xl border ${getActivityBorder()} p-6 hover:shadow-xl transition-all duration-300 group`}>
                <div className="flex items-start gap-4">
                    {/* User Avatar */}
                    <div className="relative flex-shrink-0">
                        <img
                            src={activity.user.avatar}
                            alt={activity.user.username}
                            className="w-12 h-12 rounded-full ring-2 ring-gray-700 group-hover:ring-gray-600 transition-all"
                        />
                        {activity.user.isVerified && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <FaCrown className="text-white text-xs" />
                            </div>
                        )}
                        {activity.isLive && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-2">
                                {getActivityIcon()}
                                <span className="font-bold text-white hover:text-blue-400 transition-colors cursor-pointer">
                                    {activity.user.username}
                                </span>
                                <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
                                    Level {activity.user.level}
                                </span>
                            </div>
                            <span className="text-gray-500 text-sm">•</span>
                            <span className="text-gray-400 text-sm">{activity.timestamp}</span>
                            {activity.isLive && (
                                <div className="flex items-center gap-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                    LIVE
                                </div>
                            )}
                        </div>

                        {/* Game Info */}
                        {activity.game && (
                            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-800/60 rounded-xl group-hover:bg-gray-800/80 transition-all">
                                <img
                                    src={activity.game.cover}
                                    alt={activity.game.title}
                                    className="w-12 h-16 object-cover rounded-lg shadow-lg"
                                />
                                <div className="flex-1">
                                    <div className="font-semibold text-white group-hover:text-blue-400 transition-colors cursor-pointer">
                                        {activity.game.title}
                                    </div>
                                    {activity.rating && (
                                        <div className="flex items-center gap-1 text-sm mt-1">
                                            <FaStar className="text-yellow-400 text-xs" />
                                            <span className="text-yellow-400 font-medium">{activity.rating}/10</span>
                                        </div>
                                    )}
                                    {activity.achievement && (
                                        <div className="flex items-center gap-1 text-sm mt-1">
                                            <FaTrophy className="text-orange-400 text-xs" />
                                            <span className="text-orange-400 font-medium">{activity.achievement}</span>
                                        </div>
                                    )}
                                    {activity.viewerCount && (
                                        <div className="flex items-center gap-1 text-sm mt-1">
                                            <FaEye className="text-red-400 text-xs" />
                                            <span className="text-red-400 font-medium">{activity.viewerCount.toLocaleString()} viewers</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Content */}
                        <p className="text-gray-300 mb-4 leading-relaxed">{activity.content}</p>

                        {/* Tags */}
                        {activity.tags && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {activity.tags.map((tag, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full hover:bg-blue-500/30 transition-colors cursor-pointer">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* List Info */}
                        {activity.listTitle && (
                            <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <FaBookmark className="text-purple-400" />
                                    <span className="font-medium text-purple-300">{activity.listTitle}</span>
                                    <span className="text-purple-400 text-sm">({activity.gameCount} games)</span>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-6 text-sm">
                            <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors group/btn">
                                <FaHeart className="group-hover/btn:scale-110 transition-transform" />
                                <span className="font-medium">{activity.likes}</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors group/btn">
                                <FaComments className="group-hover/btn:scale-110 transition-transform" />
                                <span className="font-medium">{activity.comments}</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors group/btn">
                                <FaShare className="group-hover/btn:scale-110 transition-transform" />
                                <span className="font-medium">{activity.shares || 'Share'}</span>
                            </button>
                            {activity.isLive && (
                                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors">
                                    <FaPlay className="text-xs" />
                                    <span>Watch Live</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const MemberCard = ({ member }) => (
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                    <img
                        src={member.avatar}
                        alt={member.username}
                        className="w-16 h-16 rounded-full ring-2 ring-gray-700 group-hover:ring-gray-600 transition-all"
                    />
                    {member.isVerified && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <FaCrown className="text-white text-xs" />
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors cursor-pointer">
                        {member.username}
                    </h3>
                    <div className="text-sm text-gray-400 mb-2">Level {member.level}</div>
                    {member.badge && (
                        <div className={`inline-block px-3 py-1 bg-gradient-to-r ${member.badgeColor} text-white text-xs rounded-full font-medium`}>
                            {member.badge}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-800/60 rounded-xl group-hover:bg-gray-800/80 transition-all">
                    <div className="text-xl font-bold text-white">{member.gamesPlayed}</div>
                    <div className="text-gray-400 text-sm">Games</div>
                </div>
                <div className="text-center p-3 bg-gray-800/60 rounded-xl group-hover:bg-gray-800/80 transition-all">
                    <div className="text-xl font-bold text-white">{member.reviewsWritten}</div>
                    <div className="text-gray-400 text-sm">Reviews</div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                    <div className="flex items-center gap-1 mb-1">
                        <FaUsers className="text-xs" />
                        {member.followers.toLocaleString()} followers
                    </div>
                    <div className="flex items-center gap-1">
                        <FaChartLine className="text-xs" />
                        {member.reputation.toLocaleString()} reputation
                    </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors hover:shadow-lg">
                    Follow
                </button>
            </div>
        </div>
    );

    const EventCard = ({ event }) => (
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <div className="relative">
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute top-3 right-3 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                    {event.type}
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {event.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3">{event.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                        <FaCalendar className="text-xs" />
                        {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                        <FaClock className="text-xs" />
                        {event.time}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                        <FaUsers className="text-xs" />
                        {event.participants} attending
                    </div>
                    <button className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg transition-colors">
                        Join Event
                    </button>
                </div>
            </div>
        </div>
    );

    const StatCard = ({ icon, label, value, color = "from-blue-500 to-cyan-500", trend }) => (
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 group">
            <div className={`w-14 h-14 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            <div className="flex items-center justify-between">
                <div className="text-gray-400 text-sm">{label}</div>
                {trend && (
                    <div className="flex items-center gap-1 text-green-400 text-xs">
                        <FaArrowUp className="text-xs" />
                        {trend}%
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20" />
                <div className="absolute inset-0 opacity-30">
                    <div className="w-full h-full bg-repeat" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 py-20">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                                <FaUsers className="text-3xl text-white" />
                            </div>
                            <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                                Gaming Community
                            </h1>
                        </div>
                        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Join thousands of passionate gamers sharing experiences, discovering new games, and building lasting friendships through the power of gaming.
                        </p>

                        {/* Community Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            <StatCard
                                icon={<FaUsers className="text-xl text-white" />}
                                label="Total Members"
                                value={communityStats.totalMembers.toLocaleString()}
                                color="from-purple-500 to-pink-500"
                                trend="12"
                            />
                            <StatCard
                                icon={<FaFire className="text-xl text-white" />}
                                label="Online Now"
                                value={communityStats.onlineNow.toLocaleString()}
                                color="from-orange-500 to-red-500"
                                trend="8"
                            />
                            <StatCard
                                icon={<FaGamepad className="text-xl text-white" />}
                                label="Games Discussed"
                                value={communityStats.gamesDiscussed.toLocaleString()}
                                color="from-blue-500 to-indigo-500"
                                trend="15"
                            />
                            <StatCard
                                icon={<FaStar className="text-xl text-white" />}
                                label="Reviews This Week"
                                value={communityStats.reviewsThisWeek.toLocaleString()}
                                color="from-yellow-500 to-orange-500"
                                trend="23"
                            />
                            <StatCard
                                icon={<FaComments className="text-xl text-white" />}
                                label="Active Discussions"
                                value={communityStats.discussions.toLocaleString()}
                                color="from-green-500 to-teal-500"
                                trend="19"
                            />
                            <StatCard
                                icon={<FaRocket className="text-xl text-white" />}
                                label="Active Today"
                                value={communityStats.activeToday.toLocaleString()}
                                color="from-cyan-500 to-blue-500"
                                trend="31"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex space-x-8">
                            {[
                                { id: 'feed', label: 'Community Feed', icon: <FaFire />, count: activities.length },
                                { id: 'members', label: 'Top Members', icon: <FaUsers />, count: topMembers.length },
                                { id: 'events', label: 'Events', icon: <FaCalendar />, count: upcomingEvents.length },
                                { id: 'leaderboard', label: 'Leaderboard', icon: <FaTrophy /> }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all duration-300 ${
                                        activeTab === tab.id
                                            ? 'border-purple-400 text-purple-400 bg-purple-400/10'
                                            : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/50'
                                    }`}
                                >
                                    {tab.icon}
                                    <span className="font-medium">{tab.label}</span>
                                    {tab.count && (
                                        <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all hover:shadow-lg">
                                <FaPlus />
                                <span>Create Post</span>
                            </button>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
                            >
                                <FaBell />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {activeTab === 'feed' && (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Main Feed */}
                        <div className="lg:col-span-3 space-y-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-3xl font-bold text-white">Latest Activity</h2>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search activities..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="bg-gray-800/80 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all"
                                        />
                                    </div>
                                    <select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all"
                                    >
                                        <option value="all">All Activity</option>
                                        <option value="reviews">Reviews</option>
                                        <option value="discussions">Discussions</option>
                                        <option value="achievements">Achievements</option>
                                        <option value="streams">Live Streams</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {activities.map((activity) => (
                                    <ActivityCard key={activity.id} activity={activity} />
                                ))}
                            </div>

                            {/* Load More */}
                            <div className="text-center pt-8">
                                <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-medium transition-all hover:shadow-lg">
                                    Load More Activities
                                </button>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Trending Topics */}
                            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <FaFire className="text-orange-400" />
                                    Trending Topics
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { tag: '#BaldursGate3', posts: 456 },
                                        { tag: '#IndieGaming', posts: 234 },
                                        { tag: '#GameReviews', posts: 189 },
                                        { tag: '#SpeedRun', posts: 167 },
                                        { tag: '#RetroGaming', posts: 134 }
                                    ].map((topic, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-800/50 rounded-xl transition-all cursor-pointer group">
                                            <span className="text-purple-400 group-hover:text-purple-300 transition-colors font-medium">
                                                {topic.tag}
                                            </span>
                                            <span className="text-gray-400 text-sm">{topic.posts} posts</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <FaLightbulb className="text-yellow-400" />
                                    Quick Actions
                                </h3>
                                <div className="space-y-3">
                                    <button className="w-full text-left p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 border border-yellow-500/30 rounded-xl transition-all group">
                                        <div className="flex items-center gap-3">
                                            <FaStar className="text-yellow-400 group-hover:scale-110 transition-transform" />
                                            <div>
                                                <div className="text-white font-medium">Write a Review</div>
                                                <div className="text-gray-400 text-sm">Share your gaming experience</div>
                                            </div>
                                        </div>
                                    </button>
                                    <button className="w-full text-left p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-500/30 rounded-xl transition-all group">
                                        <div className="flex items-center gap-3">
                                            <FaComments className="text-blue-400 group-hover:scale-110 transition-transform" />
                                            <div>
                                                <div className="text-white font-medium">Start Discussion</div>
                                                <div className="text-gray-400 text-sm">Ask questions or share opinions</div>
                                            </div>
                                        </div>
                                    </button>
                                    <button className="w-full text-left p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 rounded-xl transition-all group">
                                        <div className="flex items-center gap-3">
                                            <FaBookmark className="text-purple-400 group-hover:scale-110 transition-transform" />
                                            <div>
                                                <div className="text-white font-medium">Create List</div>
                                                <div className="text-gray-400 text-sm">Curate your favorite games</div>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Live Streams */}
                            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <FaVideo className="text-red-400" />
                                    Live Streams
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { streamer: 'ProGamer_Live', game: 'Elden Ring', viewers: 1234 },
                                        { streamer: 'SpeedRun_Master', game: 'Celeste', viewers: 567 },
                                        { streamer: 'Indie_Explorer', game: 'Hollow Knight', viewers: 345 }
                                    ].map((stream, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 hover:bg-gray-800/50 rounded-xl transition-all cursor-pointer group">
                                            <div className="relative">
                                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-white text-sm font-medium truncate">{stream.streamer}</div>
                                                <div className="text-gray-400 text-xs truncate">{stream.game}</div>
                                            </div>
                                            <div className="text-red-400 text-xs">{stream.viewers}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'members' && (
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-white">Top Community Members</h2>
                            <div className="flex items-center gap-4">
                                <select className="bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-purple-400 focus:outline-none">
                                    <option>This Month</option>
                                    <option>All Time</option>
                                    <option>This Week</option>
                                </select>
                                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors">
                                    <FaUsers />
                                    View All Members
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {topMembers.map((member) => (
                                <MemberCard key={member.id} member={member} />
                            ))}
                        </div>

                        {/* Member Categories */}
                        <div className="mt-12">
                            <h3 className="text-2xl font-bold text-white mb-6">Community Categories</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 text-center hover:border-gray-700 transition-all">
                                    <FaMedal className="text-4xl text-yellow-400 mx-auto mb-4" />
                                    <h4 className="text-lg font-bold text-white mb-2">Top Reviewers</h4>
                                    <p className="text-gray-400 text-sm">Most helpful reviews</p>
                                </div>
                                <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 text-center hover:border-gray-700 transition-all">
                                    <FaRocket className="text-4xl text-purple-400 mx-auto mb-4" />
                                    <h4 className="text-lg font-bold text-white mb-2">Speed Runners</h4>
                                    <p className="text-gray-400 text-sm">Fastest completion times</p>
                                </div>
                                <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 text-center hover:border-gray-700 transition-all">
                                    <FaComments className="text-4xl text-blue-400 mx-auto mb-4" />
                                    <h4 className="text-lg font-bold text-white mb-2">Discussion Leaders</h4>
                                    <p className="text-gray-400 text-sm">Most engaging discussions</p>
                                </div>
                                <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 text-center hover:border-gray-700 transition-all">
                                    <FaBookmark className="text-4xl text-green-400 mx-auto mb-4" />
                                    <h4 className="text-lg font-bold text-white mb-2">List Curators</h4>
                                    <p className="text-gray-400 text-sm">Best game collections</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'events' && (
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-white">Upcoming Events</h2>
                            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors">
                                <FaPlus />
                                Create Event
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {upcomingEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>

                        {/* Event Categories */}
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-6">Event Categories</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6 text-center hover:from-purple-600/30 hover:to-pink-600/30 transition-all cursor-pointer">
                                    <FaTrophy className="text-4xl text-yellow-400 mx-auto mb-4" />
                                    <h4 className="text-lg font-bold text-white mb-2">Tournaments</h4>
                                    <p className="text-gray-300 text-sm">Competitive gaming events</p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-6 text-center hover:from-blue-600/30 hover:to-cyan-600/30 transition-all cursor-pointer">
                                    <FaVideo className="text-4xl text-red-400 mx-auto mb-4" />
                                    <h4 className="text-lg font-bold text-white mb-2">Live Streams</h4>
                                    <p className="text-gray-300 text-sm">Community streaming events</p>
                                </div>
                                <div className="bg-gradient-to-br from-green-600/20 to-teal-600/20 border border-green-500/30 rounded-2xl p-6 text-center hover:from-green-600/30 hover:to-teal-600/30 transition-all cursor-pointer">
                                    <FaUsers className="text-4xl text-green-400 mx-auto mb-4" />
                                    <h4 className="text-lg font-bold text-white mb-2">Meetups</h4>
                                    <p className="text-gray-300 text-sm">Local gaming gatherings</p>
                                </div>
                                <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-2xl p-6 text-center hover:from-orange-600/30 hover:to-red-600/30 transition-all cursor-pointer">
                                    <FaGift className="text-4xl text-orange-400 mx-auto mb-4" />
                                    <h4 className="text-lg font-bold text-white mb-2">Giveaways</h4>
                                    <p className="text-gray-300 text-sm">Free games and prizes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'leaderboard' && (
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-white">Community Leaderboard</h2>
                            <div className="flex items-center gap-4">
                                <select className="bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-purple-400 focus:outline-none">
                                    <option>Overall Ranking</option>
                                    <option>Reviews</option>
                                    <option>Discussions</option>
                                    <option>Collections</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Top 3 Podium */}
                            <div className="lg:col-span-2">
                                <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-8">
                                    <h3 className="text-xl font-bold text-white mb-6 text-center">Top Contributors</h3>
                                    <div className="flex items-end justify-center gap-4 mb-8">
                                        {/* 2nd Place */}
                                        <div className="text-center">
                                            <div className="w-20 h-24 bg-gradient-to-t from-gray-600 to-gray-500 rounded-t-xl flex items-end justify-center pb-2">
                                                <span className="text-white font-bold text-2xl">2</span>
                                            </div>
                                            <img src={topMembers[1].avatar} alt="" className="w-16 h-16 rounded-full mx-auto -mt-8 ring-4 ring-gray-600" />
                                            <div className="text-white font-medium mt-2">{topMembers[1].username}</div>
                                        </div>

                                        {/* 1st Place */}
                                        <div className="text-center">
                                            <div className="w-20 h-32 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-xl flex items-end justify-center pb-2">
                                                <FaCrown className="text-white text-3xl" />
                                            </div>
                                            <img src={topMembers[0].avatar} alt="" className="w-20 h-20 rounded-full mx-auto -mt-10 ring-4 ring-yellow-400" />
                                            <div className="text-white font-bold mt-2">{topMembers[0].username}</div>
                                        </div>

                                        {/* 3rd Place */}
                                        <div className="text-center">
                                            <div className="w-20 h-20 bg-gradient-to-t from-orange-600 to-orange-500 rounded-t-xl flex items-end justify-center pb-2">
                                                <span className="text-white font-bold text-2xl">3</span>
                                            </div>
                                            <img src={topMembers[2].avatar} alt="" className="w-16 h-16 rounded-full mx-auto -mt-8 ring-4 ring-orange-500" />
                                            <div className="text-white font-medium mt-2">{topMembers[2].username}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Leaderboard Stats */}
                            <div className="space-y-6">
                                <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
                                    <h4 className="text-lg font-bold text-white mb-4">Your Ranking</h4>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-purple-400 mb-2">#156</div>
                                        <div className="text-gray-400 text-sm">Out of 24,567 members</div>
                                        <div className="mt-4 text-green-400 text-sm">↑ 12 positions this week</div>
                                    </div>
                                </div>

                                <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
                                    <h4 className="text-lg font-bold text-white mb-4">Categories</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Reviews</span>
                                            <span className="text-yellow-400">#89</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Discussions</span>
                                            <span className="text-blue-400">#234</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Collections</span>
                                            <span className="text-purple-400">#67</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommunityPage;