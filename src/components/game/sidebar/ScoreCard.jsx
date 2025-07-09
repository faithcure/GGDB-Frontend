// sidebar/ScoreCard.jsx
import React, { useState, useEffect } from "react";
import { FaStar, FaTrophy, FaHeart, FaBookmark, FaUsers, FaCheckCircle, FaBullseye, FaUserAlt } from "react-icons/fa";
import { calculateGameMatch, getMatchColor, getMatchDescription, getMatchReasons } from "../../../services/matchCalculator";
import { useUser } from "../../../context/UserContext";
import Tippy from '@tippyjs/react';
import { API_BASE } from "../../../config/api";

const ScoreCard = ({ gameData, averageRating, ratingCount }) => {
    const { user } = useUser();
    const [communityStats, setCommunityStats] = useState({
        liked: 0,
        disliked: 0,
        planToPlay: 0,
        completed: 0
    });
    const [reviewCount, setReviewCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [matchPercentage, setMatchPercentage] = useState(null);
    const [matchReasons, setMatchReasons] = useState([]);
    const [calculatingMatch, setCalculatingMatch] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Debug için console'a yazdır
    console.log('ScoreCard API_BASE:', API_BASE);
    console.log('GameData ID:', gameData?._id);

    // Topluluk istatistiklerini çek (Optimized - tek API çağrısı)
    useEffect(() => {
        const fetchCommunityStats = async () => {
            // gameData._id veya gameData.id'yi kontrol et
            const gameId = gameData?._id || gameData?.id;

            if (!gameId) {
                console.warn('ScoreCard: No gameData._id or gameData.id provided');
                console.log('ScoreCard: gameData structure:', gameData);
                return;
            }

            try {
                setLoading(true);
                console.log(`ScoreCard: Fetching stats for game ${gameId}`);

                // Tek API çağrısı ile tüm istatistikleri çek
                const response = await fetch(`${API_BASE}/api/user-activity/stats/all/${gameId}`);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('ScoreCard: Received stats data:', data);

                setCommunityStats({
                    liked: data.liked || 0,
                    disliked: data.disliked || 0,
                    planToPlay: data.planToPlay || 0,
                    completed: data.completed || 0
                });

            } catch (error) {
                console.error("ScoreCard: Failed to fetch community stats:", error);

                // Fallback: Bireysel API çağrıları yap
                try {
                    console.log('ScoreCard: Trying fallback individual API calls...');

                    const [likedRes, dislikedRes, planRes, completedRes] = await Promise.all([
                        fetch(`${API_BASE}/api/user-activity/stats/liked/${gameId}`),
                        fetch(`${API_BASE}/api/user-activity/stats/disliked/${gameId}`),
                        fetch(`${API_BASE}/api/user-activity/stats/plantoplay/${gameId}`),
                        fetch(`${API_BASE}/api/user-activity/stats/completed/${gameId}`)
                    ]);

                    // Response'ları kontrol et
                    if (!likedRes.ok || !dislikedRes.ok || !planRes.ok || !completedRes.ok) {
                        throw new Error('One or more fallback API calls failed');
                    }

                    const [likedData, dislikedData, planData, completedData] = await Promise.all([
                        likedRes.json(),
                        dislikedRes.json(),
                        planRes.json(),
                        completedRes.json()
                    ]);

                    console.log('ScoreCard: Fallback data received:', {
                        liked: likedData,
                        disliked: dislikedData,
                        planToPlay: planData,
                        completed: completedData
                    });

                    setCommunityStats({
                        liked: likedData.count || 0,
                        disliked: dislikedData.count || 0,
                        planToPlay: planData.count || 0,
                        completed: completedData.count || 0
                    });
                } catch (fallbackError) {
                    console.error("ScoreCard: Fallback API calls also failed:", fallbackError);
                    // Hata durumunda sıfır değerleri kullan
                    setCommunityStats({
                        liked: 0,
                        disliked: 0,
                        planToPlay: 0,
                        completed: 0
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        const fetchReviewCount = async () => {
            // gameData._id veya gameData.id'yi kontrol et
            const gameId = gameData?._id || gameData?.id;

            if (!gameId) {
                return;
            }

            try {
                console.log(`ScoreCard: Fetching review count for game ${gameId}`);
                const response = await fetch(`${API_BASE}/api/reviews/${gameId}`);

                if (response.ok) {
                    const reviews = await response.json();
                    setReviewCount(reviews.length || 0);
                    console.log('ScoreCard: Review count:', reviews.length);
                } else {
                    console.warn('ScoreCard: Failed to fetch reviews');
                    setReviewCount(0);
                }
            } catch (error) {
                console.error("ScoreCard: Failed to fetch review count:", error);
                setReviewCount(0);
            }
        };

        fetchCommunityStats();
        fetchReviewCount();
    }, [gameData?._id, gameData?.id, API_BASE]); // ✅ Her iki ID tipini de dependency olarak ekle

    // Calculate match percentage when user or game changes
    useEffect(() => {
        const calculateMatch = async () => {
            if (!user || !gameData) {
                setMatchPercentage(null);
                setMatchReasons([]);
                return;
            }

            try {
                setCalculatingMatch(true);
                console.log('ScoreCard: Calculating match for user:', user.username, 'game:', gameData.title);
                
                const match = await calculateGameMatch(user, gameData);
                const reasons = getMatchReasons(user, gameData, match);
                
                setMatchPercentage(match);
                setMatchReasons(reasons);
                
                console.log('ScoreCard: Match calculated:', match, 'reasons:', reasons);
            } catch (error) {
                console.error('ScoreCard: Error calculating match:', error);
                setMatchPercentage(null);
                setMatchReasons([]);
            } finally {
                setCalculatingMatch(false);
            }
        };

        calculateMatch();
    }, [user, gameData?._id, gameData?.title]);

    // Vote sayısını formatla (örn: 1234 -> 1.2K)
    const formatVoteCount = (count) => {
        if (!count || count === 0) return "0";
        if (count < 1000) return count.toString();
        if (count < 1000000) return (count / 1000).toFixed(1) + "K";
        return (count / 1000000).toFixed(1) + "M";
    };

    // Pozitif oy yüzdesi hesapla
    const calculatePositivePercentage = () => {
        const total = communityStats.liked + communityStats.disliked;
        if (total === 0) return "-";

        const percentage = Math.round((communityStats.liked / total) * 100);
        return `${percentage}% positive`;
    };

    // Toplam aktivite sayısı
    const getTotalActivity = () => {
        return communityStats.liked + communityStats.disliked +
            communityStats.planToPlay + communityStats.completed;
    };

    return (
        <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300">
            <div className="flex items-center justify-between">
                {/* GGDB Score */}
                <div className="text-center flex-1">
                    <div className="relative inline-block mb-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border-2 border-yellow-400/40 flex items-center justify-center">
                            <FaStar className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                            <span className="text-black text-xs font-bold">G</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-3xl font-black text-white">{gameData.ggdbRating || "-"}</span>
                            <span className="text-lg text-white/60 font-medium">/10</span>
                        </div>
                        <p className="text-xs text-yellow-400 font-semibold tracking-wide">GGDB SCORE</p>
                        <p className="text-xs text-white/60">
                            {ratingCount > 0 ? `${ratingCount} vote${ratingCount > 1 ? 's' : ''}` : "-"}
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-px h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent mx-4"></div>

                {/* User Match Score */}
                {user ? (
                    <div className="text-center flex-1">
                        <div className="relative inline-block mb-3">
                            <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                matchPercentage 
                                    ? `bg-gradient-to-br ${getMatchColor(matchPercentage).includes('emerald') ? 'from-emerald-400/20 to-emerald-600/20 border-emerald-400/40' :
                                       getMatchColor(matchPercentage).includes('green') ? 'from-green-400/20 to-green-600/20 border-green-400/40' :
                                       getMatchColor(matchPercentage).includes('yellow') ? 'from-yellow-400/20 to-yellow-600/20 border-yellow-400/40' :
                                       getMatchColor(matchPercentage).includes('orange') ? 'from-orange-400/20 to-orange-600/20 border-orange-400/40' :
                                       'from-red-400/20 to-red-600/20 border-red-400/40'}`
                                    : 'from-gray-400/20 to-gray-600/20 border-gray-400/40'
                            }`}>
                                {calculatingMatch ? (
                                    <div className="animate-spin w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full"></div>
                                ) : (
                                    <FaBullseye className={`w-6 h-6 ${matchPercentage ? getMatchColor(matchPercentage) : 'text-gray-400'}`} />
                                )}
                            </div>
                            <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${
                                matchPercentage 
                                    ? getMatchColor(matchPercentage).includes('emerald') ? 'bg-emerald-400' :
                                      getMatchColor(matchPercentage).includes('green') ? 'bg-green-400' :
                                      getMatchColor(matchPercentage).includes('yellow') ? 'bg-yellow-400' :
                                      getMatchColor(matchPercentage).includes('orange') ? 'bg-orange-400' :
                                      'bg-red-400'
                                    : 'bg-gray-400'
                            }`}>
                                <FaUserAlt className="text-black text-xs" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-baseline justify-center gap-1">
                                <span className={`text-3xl font-black transition-colors duration-300 ${
                                    matchPercentage ? getMatchColor(matchPercentage) : 'text-white'
                                }`}>
                                    {calculatingMatch ? "..." : (matchPercentage || "-")}
                                </span>
                                {matchPercentage && (
                                    <span className="text-lg text-white/60 font-medium">%</span>
                                )}
                            </div>
                            <p className={`text-xs font-semibold tracking-wide ${
                                matchPercentage ? getMatchColor(matchPercentage) : 'text-gray-400'
                            }`}>
                                MATCH
                            </p>
                            <p className="text-xs text-white/60">
                                {calculatingMatch ? "Calculating..." : getMatchDescription(matchPercentage)}
                            </p>
                            {matchReasons.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-white/10">
                                    <p className="text-xs text-white/50 leading-relaxed">
                                        {matchReasons[0]}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <Tippy
                        content={
                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 max-w-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                                    <span className="text-white font-semibold">Personal Match System</span>
                                </div>
                                <p className="text-gray-300 text-sm mb-3">
                                    Get a personalized compatibility score based on your gaming preferences, favorite genres, and playing history!
                                </p>
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <span>Genre preferences analysis</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                        <span>Platform compatibility</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                        <span>Community activity insights</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowAuthModal(true)}
                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all"
                                >
                                    Sign in to see your match
                                </button>
                            </div>
                        }
                        placement="top"
                        interactive={true}
                        trigger="mouseenter focus"
                    >
                        <div className="text-center flex-1 cursor-pointer">
                            <div className="relative inline-block mb-3">
                                <div className="w-16 h-16 rounded-full border-2 border-blue-400/40 bg-gradient-to-br from-blue-400/20 to-blue-600/20 flex items-center justify-center hover:border-blue-400/60 transition-all duration-300">
                                    <span className="text-3xl text-blue-400">?</span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center">
                                    <FaUserAlt className="text-black text-xs" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-3xl font-black text-blue-400">?</span>
                                    <span className="text-lg text-white/60 font-medium">%</span>
                                </div>
                                <p className="text-xs font-semibold tracking-wide text-blue-400">
                                    MATCH
                                </p>
                                <p className="text-xs text-white/60">
                                    Sign in to discover
                                </p>
                            </div>
                        </div>
                    </Tippy>
                )}

                {/* Divider */}
                <div className="w-px h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent mx-4"></div>

                {/* Metacritic Score */}
                <div className="text-center flex-1">
                    <div className="relative inline-block mb-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-600/20 border-2 border-green-400/40 flex items-center justify-center">
                            <FaTrophy className="w-6 h-6 text-green-400" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                            <span className="text-black text-xs font-bold">M</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-3xl font-black text-white">{gameData.metacriticScore || "-"}</span>
                            <span className="text-lg text-white/60 font-medium">/100</span>
                        </div>
                        <p className="text-xs text-green-400 font-semibold tracking-wide">METACRITIC</p>
                        <p className="text-xs text-white/60">
                            {gameData.metacriticScore ? "Official Score" : "-"}
                        </p>
                    </div>
                </div>
            </div>

            {/* GGDB Community Stats */}
            <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs text-white/70 uppercase tracking-wide font-medium">GGDB Community</h4>
                    <div className="flex items-center gap-2">
                        {loading && (
                            <div className="animate-spin w-3 h-3 border border-white/20 border-t-white/60 rounded-full"></div>
                        )}
                        <span className="text-xs text-white/50">
                            {getTotalActivity()} total
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FaHeart className="w-3 h-3 text-red-400" />
                                <span className="text-white/80">Liked</span>
                            </div>
                            <span className="text-white font-semibold">
                                {loading ? "-" : formatVoteCount(communityStats.liked)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FaBookmark className="w-3 h-3 text-blue-400" />
                                <span className="text-white/80">Plan to Play</span>
                            </div>
                            <span className="text-white font-semibold">
                                {loading ? "-" : formatVoteCount(communityStats.planToPlay)}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FaUsers className="w-3 h-3 text-gray-400" />
                                <span className="text-white/80">Disliked</span>
                            </div>
                            <span className="text-white font-semibold">
                                {loading ? "-" : formatVoteCount(communityStats.disliked)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FaCheckCircle className="w-3 h-3 text-green-400" />
                                <span className="text-white/80">Completed</span>
                            </div>
                            <span className="text-white font-semibold">
                                {loading ? "-" : formatVoteCount(communityStats.completed)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* User Reviews Count */}
                {!loading && (
                    <div className="mt-3 pt-2 border-t border-white/5">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-white/60">User Reviews</span>
                            <span className="text-white/80 font-medium">
                                {reviewCount > 0 ? `${reviewCount} review${reviewCount > 1 ? 's' : ''}` : "No reviews yet"}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScoreCard;