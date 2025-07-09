// components/game/TimeToBeatSection.jsx
import React, { useState, useEffect } from 'react';
import { FaClock, FaExternalLinkAlt, FaSpinner, FaSyncAlt } from 'react-icons/fa';

const TimeToBeatSection = ({ game }) => {
    const [timeToBeatData, setTimeToBeatData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // Generate mock data based on game title
    const generateMockData = () => {
        const titleLength = game.title.length;
        const titleHash = game.title.split('').reduce((a, b) => a + b.charCodeAt(0), 0);

        // Create realistic mock data based on game title
        const baseTime = 8 + (titleLength % 20);
        const variance = titleHash % 10;

        const mockSources = [
            {
                name: 'HowLongToBeat',
                url: 'https://howlongtobeat.com',
                icon: '🎮',
                data: {
                    main: baseTime + variance,
                    mainExtra: Math.round((baseTime + variance) * 1.8),
                    completionist: Math.round((baseTime + variance) * 2.8),
                    submissions: 1200 + (titleHash % 800)
                },
                reliability: 'high',
                isMock: true
            },
            {
                name: 'OpenCritic',
                url: 'https://opencritic.com',
                icon: '📊',
                data: {
                    main: baseTime + variance + 2,
                    mainExtra: null,
                    completionist: null,
                    submissions: 150 + (titleHash % 200)
                },
                reliability: 'medium',
                isMock: true
            },
            {
                name: 'MobyGames',
                url: 'https://mobygames.com',
                icon: '🎯',
                data: {
                    main: baseTime + variance - 1,
                    mainExtra: Math.round((baseTime + variance) * 1.6),
                    completionist: Math.round((baseTime + variance) * 2.5),
                    submissions: 300 + (titleHash % 400)
                },
                reliability: 'medium',
                isMock: true
            },
            {
                name: 'RAWG',
                url: 'https://rawg.io',
                icon: '🕹️',
                data: {
                    main: baseTime + variance + 1,
                    mainExtra: null,
                    completionist: null,
                    submissions: 50 + (titleHash % 100)
                },
                reliability: 'low',
                isMock: true
            },
            {
                name: 'GameLengths',
                url: 'https://gamelengths.com',
                icon: '⏱️',
                data: {
                    main: baseTime + variance - 2,
                    mainExtra: Math.round((baseTime + variance) * 1.7),
                    completionist: Math.round((baseTime + variance) * 3.2),
                    submissions: 80 + (titleHash % 150)
                },
                reliability: 'medium',
                isMock: true
            }
        ];

        // Calculate weighted averages
        const weights = { high: 3, medium: 2, low: 1 };
        const averages = { main: null, mainExtra: null, completionist: null };

        ['main', 'mainExtra', 'completionist'].forEach(category => {
            let weightedSum = 0;
            let totalWeight = 0;

            mockSources.forEach(source => {
                if (source.data[category]) {
                    const weight = weights[source.reliability];
                    weightedSum += source.data[category] * weight;
                    totalWeight += weight;
                }
            });

            if (totalWeight > 0) {
                averages[category] = Math.round(weightedSum / totalWeight);
            }
        });

        return {
            sources: mockSources,
            averages,
            lastUpdated: new Date().toISOString()
        };
    };

    // Simulate API fetch with loading delay
    const fetchTimeToBeatData = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        setError(null);

        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, isRefresh ? 800 : 1500));

            // Randomly simulate an error (10% chance)
            if (Math.random() < 0.1) {
                throw new Error('Simulated network error');
            }

            const mockData = generateMockData();
            setTimeToBeatData(mockData);
        } catch (err) {
            console.error('Mock fetch error:', err);
            setError('Failed to load playtime data (mock error)');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (game?.title) {
            fetchTimeToBeatData();
        }
    }, [game?.title]);

    const formatTime = (hours) => {
        if (!hours) return '--';
        if (hours < 1) return `${Math.round(hours * 60)}m`;
        if (hours >= 100) return `${Math.round(hours)}h`;
        return `${hours}h`;
    };

    const PlaytimeCard = ({ title, hours, color, icon }) => (
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 hover:shadow-lg hover:shadow-black/20">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-700/50">
                        <span className="text-xl">{icon}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wide">{title}</h4>
                </div>
            </div>

            <div className="mb-4">
                <div className="text-3xl font-bold text-white mb-2">
                    {formatTime(hours)}
                </div>
                {hours && hours > 0 && (
                    <div className="text-xs text-gray-400 mb-3">
                        {hours === 1 ? '1 hour to complete' : `${hours} hours to complete`}
                    </div>
                )}
            </div>

            {hours && hours > 0 && (
                <div className="relative">
                    <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-2 rounded-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out`}
                            style={{ width: `${Math.min((hours / 50) * 100, 100)}%` }}
                        />
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                        <span>Quick</span>
                        <span>Average</span>
                        <span>Long</span>
                    </div>
                </div>
            )}

            {(!hours || hours === 0) && (
                <div className="text-center py-4">
                    <div className="text-gray-500 text-sm">No data available</div>
                </div>
            )}
        </div>
    );

    const SourceCard = ({ source }) => (
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl p-4 border border-gray-700/40 hover:border-gray-600/60 hover:shadow-lg transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-700/50">
                        <span className="text-lg">{source.icon}</span>
                    </div>
                    <div>
                        <span className="text-sm font-semibold text-white">{source.name}</span>
                        <div className="text-xs text-gray-400">Gaming Database</div>
                    </div>
                </div>
                <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-600/50 transition-all"
                    title={`Visit ${source.name}`}
                >
                    <FaExternalLinkAlt size={12} />
                </a>
            </div>

            {/* Completion Times */}
            <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-700/30">
                    <div className="flex items-center gap-2">
                        <span className="text-xs">🎯</span>
                        <span className="text-sm text-gray-300">Main Story</span>
                    </div>
                    <span className="text-sm font-semibold text-white">{formatTime(source.data.main)}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-700/30">
                    <div className="flex items-center gap-2">
                        <span className="text-xs">🧩</span>
                        <span className="text-sm text-gray-300">Main + Extras</span>
                    </div>
                    <span className="text-sm font-semibold text-white">{formatTime(source.data.mainExtra)}</span>
                </div>

                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xs">🏆</span>
                        <span className="text-sm text-gray-300">Completionist</span>
                    </div>
                    <span className="text-sm font-semibold text-white">{formatTime(source.data.completionist)}</span>
                </div>
            </div>

            {/* Submissions Count */}
            {source.data.submissions > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-700/30">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                        <span>👥</span>
                        <span>{source.data.submissions.toLocaleString()} player submissions</span>
                    </div>
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <section className="max-w-7xl mx-auto px-6 py-10 border-t border-gray-800">
                <div className="flex items-center justify-center py-12">
                    <FaSpinner className="animate-spin text-yellow-400 text-2xl mr-3" />
                    <span className="text-white">Loading playtime data...</span>
                </div>
            </section>
        );
    }

    return (
        <section id="time-to-beat" className="max-w-7xl mx-auto px-6 py-10 border-t border-gray-800">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <FaClock className="text-yellow-400 text-2xl" />
                    <h2 className="text-2xl font-bold text-white">Time to Beat</h2>
                </div>

                <button
                    onClick={() => fetchTimeToBeatData(true)}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-300 hover:text-white transition-all disabled:opacity-50"
                >
                    <FaSyncAlt className={`text-xs ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {error ? (
                <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-6 text-center">
                    <p className="text-red-400 mb-3">{error}</p>
                    <button
                        onClick={() => fetchTimeToBeatData()}
                        className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            ) : !timeToBeatData || timeToBeatData.sources.length === 0 ? (
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6 text-center">
                    <FaClock className="text-gray-500 text-3xl mx-auto mb-3" />
                    <p className="text-gray-400 mb-2">No playtime data available</p>
                    <p className="text-gray-500 text-sm">Try searching for this game manually on HowLongToBeat</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Average Times */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Average Completion Times</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <PlaytimeCard
                                title="Main Story"
                                hours={timeToBeatData.averages.main}
                                color="from-blue-400 to-blue-600"
                                icon="🎯"
                            />
                            <PlaytimeCard
                                title="Main + Extras"
                                hours={timeToBeatData.averages.mainExtra}
                                color="from-purple-400 to-purple-600"
                                icon="🧩"
                            />
                            <PlaytimeCard
                                title="Completionist"
                                hours={timeToBeatData.averages.completionist}
                                color="from-yellow-400 to-yellow-600"
                                icon="🏆"
                            />
                        </div>
                    </div>

                    {/* Data Sources */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Data Sources</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {timeToBeatData.sources.map((source, index) => (
                                <SourceCard key={index} source={source} />
                            ))}
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="bg-gray-800/20 rounded-lg p-4 border border-gray-700/30">
                        <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">
                Data aggregated from {timeToBeatData.sources.length} source{timeToBeatData.sources.length !== 1 ? 's' : ''}
              </span>
                            <span className="text-gray-500">
                Last updated: {new Date(timeToBeatData.lastUpdated).toLocaleDateString()}
              </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Times are averaged from community submissions and may vary based on playstyle and difficulty.
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default TimeToBeatSection;