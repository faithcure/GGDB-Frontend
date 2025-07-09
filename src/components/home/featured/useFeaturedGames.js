// src/components/home/featured/useFeaturedGames.js

import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { formatGameData, getDefaultGame, FEATURED_CONFIG } from "./featuredUtils";
import { calculateGameMatch, getMatchColor } from "../../../services/matchCalculator";
import { API_BASE } from "../../../config/api";

export const useFeaturedGames = (user, token) => {
    // Games state
    const [games, setGames] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // User activity state
    const [gameProgress, setGameProgress] = useState({});
    const [gameLikes, setGameLikes] = useState({});
    const [gameLoved, setGameLoved] = useState({});
    const [gameDislikes, setGameDislikes] = useState({});
    const [gamePlans, setGamePlans] = useState({});
    
    // Real-time stats state
    const [gameStats, setGameStats] = useState({});
    const [gameMatches, setGameMatches] = useState({});
    const [loadingStates, setLoadingStates] = useState({
        like: false,
        loved: false,
        dislike: false,
        progress: false
    });
    const [loadingPlan, setLoadingPlan] = useState(false);

    // Progress tracking
    const [isEditingProgress, setIsEditingProgress] = useState(false);
    const [savePendingProgress, setSavePendingProgress] = useState(null);
    const [tempProgress, setTempProgress] = useState(null);

    const activeRequests = useRef(new Set());
    const progressTippy = useRef(null);

    const featured = games[activeIndex] || games[0];

    // Update stats for current game
    const updateGameStats = (gameId, statType, increment = true) => {
        setGameStats(prev => {
            const currentStats = prev[gameId] || {};
            const change = increment ? 1 : -1;
            
            return {
                ...prev,
                [gameId]: {
                    ...currentStats,
                    [`${statType}Count`]: Math.max(0, (currentStats[`${statType}Count`] || 0) + change)
                }
            };
        });
    };

    // Get current stats with real-time updates
    const getCurrentStats = (game) => {
        if (!game) return {};
        const realTimeStats = gameStats[game._id] || {};
        return {
            likesCount: realTimeStats.likesCount ?? game.likesCount ?? 0,
            lovedCount: realTimeStats.lovedCount ?? game.lovedCount ?? 0,
            dislikesCount: realTimeStats.dislikesCount ?? game.dislikesCount ?? 0,
            planToPlayCount: realTimeStats.planToPlayCount ?? game.planToPlayCount ?? 0,
            reviewsCount: game.reviewsCount ?? game.reviews?.length ?? 0
        };
    };

    // Cleanup function for requests
    const cancelActiveRequests = useCallback(() => {
        activeRequests.current.forEach(controller => controller.abort());
        activeRequests.current.clear();
    }, []);

    // Fetch games on mount
    useEffect(() => {
        const fetchGames = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(`${API_BASE}/api/games`);
                const demoGames = formatGameData(res.data);
                setGames(demoGames);
                setError(null);
            } catch (err) {
                setGames([getDefaultGame()]);
                setError("Failed to load games");
            } finally {
                setIsLoading(false);
            }
        };
        fetchGames();
    }, [API_BASE]);

    // Auto-rotate featured game
    useEffect(() => {
        if (games.length > 1 && !isPaused) {
            const interval = setInterval(() => {
                setIsTransitioning(true);
                setTimeout(() => {
                    setActiveIndex(prev => (prev + 1) % games.length);
                    setIsTransitioning(false);
                }, FEATURED_CONFIG.TRANSITION_DURATION);
            }, FEATURED_CONFIG.AUTO_ROTATE_INTERVAL);
            return () => clearInterval(interval);
        }
    }, [games.length, isPaused]);

    // Fetch user activity when featured game changes
    useEffect(() => {
        if (!user || !token || !featured?._id || isEditingProgress) return;

        cancelActiveRequests();

        const timeoutId = setTimeout(() => {
            const fetchUserActivity = async () => {
                const gameId = featured._id;

                // Create abort controllers
                const likeController = new AbortController();
                const lovedController = new AbortController();
                const dislikeController = new AbortController();
                const progressController = new AbortController();
                const planController = new AbortController();

                activeRequests.current.add(likeController);
                activeRequests.current.add(lovedController);
                activeRequests.current.add(dislikeController);
                activeRequests.current.add(progressController);
                activeRequests.current.add(planController);

                try {
                    // Fetch all data in parallel
                    const [likeRes, lovedRes, dislikeRes, progressRes, planRes] = await Promise.allSettled([
                        axios.get(
                            `${API_BASE}/api/user-activity/like/${user._id}/${gameId}`,
                            {
                                headers: { Authorization: `Bearer ${token}` },
                                signal: likeController.signal
                            }
                        ),
                        axios.get(
                            `${API_BASE}/api/user-activity/loved/${user._id}/${gameId}`,
                            {
                                headers: { Authorization: `Bearer ${token}` },
                                signal: lovedController.signal
                            }
                        ),
                        axios.get(
                            `${API_BASE}/api/user-activity/dislike/${user._id}/${gameId}`,
                            {
                                headers: { Authorization: `Bearer ${token}` },
                                signal: dislikeController.signal
                            }
                        ),
                        axios.get(
                            `${API_BASE}/api/user-activity/progress/${user._id}/${gameId}`,
                            {
                                headers: { Authorization: `Bearer ${token}` },
                                signal: progressController.signal
                            }
                        ),
                        axios.get(
                            `${API_BASE}/api/user-activity/plantoplay/${user._id}/${gameId}`,
                            {
                                headers: { Authorization: `Bearer ${token}` },
                                signal: planController.signal
                            }
                        )
                    ]);

                    // Process results
                    if (planRes.status === 'fulfilled') {
                        setGamePlans(prev => ({ ...prev, [gameId]: planRes.value.data.plantoplay }));
                    } else if (!axios.isCancel(planRes.reason)) {
                        setGamePlans(prev => ({ ...prev, [gameId]: false }));
                    }

                    if (likeRes.status === 'fulfilled') {
                        setGameLikes(prev => ({ ...prev, [gameId]: likeRes.value.data.liked }));
                    } else if (!axios.isCancel(likeRes.reason)) {
                        setGameLikes(prev => ({ ...prev, [gameId]: false }));
                    }

                    if (lovedRes.status === 'fulfilled') {
                        setGameLoved(prev => ({ ...prev, [gameId]: lovedRes.value.data.loved }));
                    } else if (!axios.isCancel(lovedRes.reason)) {
                        setGameLoved(prev => ({ ...prev, [gameId]: false }));
                    }

                    if (dislikeRes.status === 'fulfilled') {
                        setGameDislikes(prev => ({ ...prev, [gameId]: dislikeRes.value.data.disliked }));
                    } else if (!axios.isCancel(dislikeRes.reason)) {
                        setGameDislikes(prev => ({ ...prev, [gameId]: false }));
                    }

                    if (progressRes.status === 'fulfilled') {
                        setGameProgress(prev => ({ ...prev, [gameId]: progressRes.value.data.progress || 0 }));
                    } else if (!axios.isCancel(progressRes.reason)) {
                        setGameProgress(prev => ({
                            ...prev,
                            [gameId]: prev[gameId] !== undefined ? prev[gameId] : 0
                        }));
                    }

                    // Calculate match percentage for the game
                    try {
                        const matchPercentage = await calculateGameMatch(user, featured);
                        if (matchPercentage !== null) {
                            setGameMatches(prev => ({ ...prev, [gameId]: matchPercentage }));
                            console.log('FeaturedSection: Match calculated for', featured.title, ':', matchPercentage);
                        }
                    } catch (matchError) {
                        console.error('FeaturedSection: Error calculating match:', matchError);
                    }
                } finally {
                    activeRequests.current.delete(likeController);
                    activeRequests.current.delete(lovedController);
                    activeRequests.current.delete(dislikeController);
                    activeRequests.current.delete(progressController);
                    activeRequests.current.delete(planController);
                }
            };
            fetchUserActivity();
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            cancelActiveRequests();
        };
    }, [featured?._id, user?._id, token, isEditingProgress, API_BASE]);

    // Action handlers
    const handleLike = async () => {
        if (!user || !token || !featured) return false;

        const gameId = featured._id;
        setLoadingStates(prev => ({ ...prev, like: true }));

        try {
            const res = await axios.post(
                `${API_BASE}/api/user-activity/like`,
                { gameId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const wasLiked = gameLikes[gameId];
            const isNowLiked = res.data.liked;
            
            setGameLikes(prev => ({ ...prev, [gameId]: isNowLiked }));
            
            if (isNowLiked) {
                setGameDislikes(prev => ({ ...prev, [gameId]: false }));
                setGameLoved(prev => ({ ...prev, [gameId]: false }));
                // If wasn't liked before and now is liked, increment
                if (!wasLiked) {
                    updateGameStats(gameId, 'likes', true);
                }
            } else {
                // If was liked before and now isn't, decrement
                if (wasLiked) {
                    updateGameStats(gameId, 'likes', false);
                }
            }
            
            return true;
        } catch (err) {
            console.error("Like error:", err);
            return false;
        } finally {
            setLoadingStates(prev => ({ ...prev, like: false }));
        }
    };

    const handleLoved = async () => {
        if (!user || !token || !featured) return false;

        const gameId = featured._id;
        setLoadingStates(prev => ({ ...prev, loved: true }));

        try {
            const res = await axios.post(
                `${API_BASE}/api/user-activity/loved`,
                { gameId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const wasLoved = gameLoved[gameId];
            const isNowLoved = res.data.loved;
            
            setGameLoved(prev => ({ ...prev, [gameId]: isNowLoved }));
            
            if (isNowLoved) {
                setGameDislikes(prev => ({ ...prev, [gameId]: false }));
                setGameLikes(prev => ({ ...prev, [gameId]: false }));
                // If wasn't loved before and now is loved, increment
                if (!wasLoved) {
                    updateGameStats(gameId, 'loved', true);
                }
            } else {
                // If was loved before and now isn't, decrement
                if (wasLoved) {
                    updateGameStats(gameId, 'loved', false);
                }
            }
            
            return true;
        } catch (err) {
            console.error("Loved error:", err);
            return false;
        } finally {
            setLoadingStates(prev => ({ ...prev, loved: false }));
        }
    };

    const handleDislike = async () => {
        if (!user || !token || !featured) return false;

        const gameId = featured._id;
        setLoadingStates(prev => ({ ...prev, dislike: true }));

        try {
            const res = await axios.post(
                `${API_BASE}/api/user-activity/dislike`,
                { gameId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setGameDislikes(prev => ({ ...prev, [gameId]: res.data.disliked }));
            if (res.data.disliked) {
                setGameLikes(prev => ({ ...prev, [gameId]: false }));
                setGameLoved(prev => ({ ...prev, [gameId]: false }));
            }
            return true;
        } catch (err) {
            console.error("Dislike error:", err);
            return false;
        } finally {
            setLoadingStates(prev => ({ ...prev, dislike: false }));
        }
    };

    const handlePlanToPlay = async () => {
        if (!user || !token || !featured) return false;

        const gameId = featured._id;
        setLoadingPlan(true);

        try {
            const res = await axios.post(
                `${API_BASE}/api/user-activity/plantoplay`,
                { gameId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const wasPlanToPlay = gamePlans[gameId];
            const isNowPlanToPlay = res.data.plantoplay;
            
            setGamePlans(prev => ({ ...prev, [gameId]: isNowPlanToPlay }));
            
            // Update plan to play count
            if (!wasPlanToPlay && isNowPlanToPlay) {
                updateGameStats(gameId, 'planToPlay', true);
            } else if (wasPlanToPlay && !isNowPlanToPlay) {
                updateGameStats(gameId, 'planToPlay', false);
            }
            
            return true;
        } catch (err) {
            console.error("Plan to play error:", err);
            return false;
        } finally {
            setLoadingPlan(false);
        }
    };

    const handleProgressTempChange = (progress) => {
        if (!user || !token) return false;
        setTempProgress(progress);
        setSavePendingProgress(progress);
        return true;
    };

    const handleProgressSave = async () => {
        if (!user || !token || savePendingProgress === null || !featured) return false;

        const gameId = featured._id;
        const progress = savePendingProgress;
        const oldProgress = gameProgress[gameId] || 0;
        
        setLoadingStates(prev => ({ ...prev, progress: true }));

        try {
            await axios.post(
                `${API_BASE}/api/user-activity/progress`,
                { gameId, progress },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setGameProgress(prev => ({ ...prev, [gameId]: progress }));
            setTempProgress(null);
            
            // Update players count if going from 0 to >0 or >0 to 0
            if (oldProgress === 0 && progress > 0) {
                updateGameStats(gameId, 'players', true);
            } else if (oldProgress > 0 && progress === 0) {
                updateGameStats(gameId, 'players', false);
            }
            
            return true;
        } catch (err) {
            console.error("Progress save error:", err);
            return false;
        } finally {
            setSavePendingProgress(null);
            setLoadingStates(prev => ({ ...prev, progress: false }));
        }
    };

    const handleProgressSaveAndClose = async () => {
        if (savePendingProgress !== null) {
            await handleProgressSave();
        }
        if (!savePendingProgress) {
            setTempProgress(null);
        }
        setSavePendingProgress(null);
        setIsEditingProgress(false);
        if (progressTippy.current) {
            progressTippy.current.hide();
        }
    };

    const handleGameSelect = (index) => {
        if (index !== activeIndex) {
            if (progressTippy.current) {
                progressTippy.current.hide();
            }

            setIsTransitioning(true);
            setTimeout(() => {
                setActiveIndex(index);
                setIsTransitioning(false);
            }, FEATURED_CONFIG.TRANSITION_DURATION);
        }
    };

    // Getters
    const getDisplayProgress = () => {
        if (tempProgress !== null) {
            return tempProgress;
        }
        return gameProgress[featured?._id] || 0;
    };

    const getCurrentProgress = () => {
        return gameProgress[featured?._id] || 0;
    };

    const isLiked = () => {
        return gameLikes[featured?._id] || false;
    };

    const isLoved = () => {
        return gameLoved[featured?._id] || false;
    };

    const isDisliked = () => {
        return gameDislikes[featured?._id] || false;
    };

    const isPlanToPlay = () => {
        return gamePlans[featured?._id] || false;
    };

    return {
        // Game state
        games,
        featured,
        activeIndex,
        isLoading,
        error,
        isTransitioning,
        isPaused,
        setIsPaused,

        // Progress state
        getDisplayProgress,
        getCurrentProgress,
        isEditingProgress,
        setIsEditingProgress,
        progressTippy,

        // User activity state
        isLiked,
        isLoved,
        isDisliked,
        isPlanToPlay,
        loadingStates,
        loadingPlan,

        // Real-time stats
        getCurrentStats,
        gameMatches,

        // Handlers
        handleLike,
        handleLoved,
        handleDislike,
        handlePlanToPlay,
        handleProgressTempChange,
        handleProgressSaveAndClose,
        handleGameSelect
    };
};