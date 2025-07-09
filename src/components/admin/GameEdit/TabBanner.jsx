// src/components/admin/GameEdit/TabBanner.jsx - Enhanced with RAWG/IGDB Integration
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../../../config/api";

const RAWG_KEY = import.meta.env.VITE_RAWG_API_KEY;

const TabBanner = ({ formData, setFormData, editMode }) => {
    const [availableImages, setAvailableImages] = useState([]);
    const [availableVideos, setAvailableVideos] = useState([]);
    const [showGallerySelector, setShowGallerySelector] = useState(false);
    const [showVideoSelector, setShowVideoSelector] = useState(false);
    const [selectedImageType, setSelectedImageType] = useState('featuredBackground');

    // External source states
    const [showRAWGModal, setShowRAWGModal] = useState(false);
    const [showIGDBModal, setShowIGDBModal] = useState(false);
    const [loadingRAWG, setLoadingRAWG] = useState(false);
    const [loadingIGDB, setLoadingIGDB] = useState(false);
    const [rawgResults, setRawgResults] = useState([]);
    const [igdbResults, setIgdbResults] = useState([]);
    const [externalSourceType, setExternalSourceType] = useState(''); // 'featured', 'poster', 'trailer'

    const overrides = formData.bannerOverrides || {};

    // Extract all images and videos from gallery and game data
    useEffect(() => {
        const images = [];
        const videos = [];

        // Add main game images
        if (formData.coverImage) {
            images.push({
                url: formData.coverImage,
                source: 'coverImage',
                title: 'Cover Image',
                type: 'image',
                meta: [{ label: 'Type', value: 'Cover' }]
            });
        }

        if (formData.bannerImage) {
            images.push({
                url: formData.bannerImage,
                source: 'bannerImage',
                title: 'Banner Image',
                type: 'image',
                meta: [{ label: 'Type', value: 'Banner' }]
            });
        }

        // Add main trailer
        if (formData.trailerUrl) {
            videos.push({
                url: formData.trailerUrl,
                source: 'trailerUrl',
                title: 'Main Trailer',
                type: 'video',
                meta: [{ label: 'Type', value: 'Main Trailer' }]
            });
        }

        // Add gallery content
        if (formData.gallery && formData.gallery.length > 0) {
            formData.gallery.forEach((item, index) => {
                if (item.type === 'image' || item.url?.match(/\.(jpg|jpeg|png|webp)$/i)) {
                    images.push({
                        ...item,
                        source: 'gallery',
                        title: item.title || `Gallery Image ${index + 1}`,
                        meta: [
                            ...(item.meta || []),
                            { label: 'Source', value: formData.dataSource || 'Manual' }
                        ]
                    });
                } else if (item.type === 'video' ||
                    item.url?.includes('youtube.com') ||
                    item.url?.includes('youtu.be') ||
                    item.url?.match(/\.(mp4|webm|ogg)$/i)) {
                    videos.push({
                        ...item,
                        source: 'gallery',
                        title: item.title || `Gallery Video ${index + 1}`,
                        type: 'video',
                        meta: [
                            ...(item.meta || []),
                            { label: 'Source', value: formData.dataSource || 'Manual' }
                        ]
                    });
                }
            });
        }

        // Sort by preference
        images.sort((a, b) => getImageScore(b) - getImageScore(a));
        videos.sort((a, b) => getVideoScore(b) - getVideoScore(a));

        setAvailableImages(images);
        setAvailableVideos(videos);
    }, [formData.gallery, formData.coverImage, formData.bannerImage, formData.trailerUrl, formData.dataSource]);

    // Score images by suitability
    const getImageScore = (image) => {
        let score = 0;
        const meta = image.meta || [];

        if (meta.some(m => m.label === 'Orientation' && m.value === 'Landscape')) score += 10;
        if (meta.some(m => m.label === 'Type' && ['Banner', 'Background', 'Screenshot'].includes(m.value))) score += 8;
        if (image.source === 'bannerImage') score += 6;
        if (image.source === 'gallery') score += 4;
        if (image.source === 'coverImage') score += 2;

        return score;
    };

    // Score videos by suitability
    const getVideoScore = (video) => {
        let score = 0;
        const meta = video.meta || [];

        if (meta.some(m => m.label === 'Type' && m.value === 'Trailer')) score += 10;
        if (video.url?.includes('youtube.com') || video.url?.includes('youtu.be')) score += 8;
        if (video.source === 'trailerUrl') score += 6;
        if (video.source === 'gallery') score += 4;

        return score;
    };

    // External source handlers
    const fetchFromRAWG = async (type) => {
        if (!formData.title) {
            alert("Game title is required for RAWG search");
            return;
        }

        setLoadingRAWG(true);
        setExternalSourceType(type);

        try {
            // Search for the game
            const searchRes = await axios.get(
                `https://api.rawg.io/api/games?key=${RAWG_KEY}&search=${encodeURIComponent(formData.title)}`
            );

            if (searchRes.data.results && searchRes.data.results.length > 0) {
                const gameId = searchRes.data.results[0].id;

                // Fetch game details and media
                const [gameRes, screenshotRes] = await Promise.all([
                    axios.get(`https://api.rawg.io/api/games/${gameId}?key=${RAWG_KEY}`),
                    axios.get(`https://api.rawg.io/api/games/${gameId}/screenshots?key=${RAWG_KEY}`)
                ]);

                const results = [];

                // Add main background image
                if (gameRes.data.background_image) {
                    results.push({
                        url: gameRes.data.background_image,
                        title: "Main Background",
                        type: "image",
                        source: "RAWG",
                        meta: [
                            { label: "Type", value: "Background" },
                            { label: "Source", value: "RAWG" },
                            { label: "Orientation", value: "Landscape" }
                        ]
                    });
                }

                // Add screenshots
                if (screenshotRes.data.results) {
                    screenshotRes.data.results.forEach((screenshot, index) => {
                        results.push({
                            url: screenshot.image,
                            title: `Screenshot ${index + 1}`,
                            type: "image",
                            source: "RAWG",
                            meta: [
                                { label: "Type", value: "Screenshot" },
                                { label: "Source", value: "RAWG" },
                                { label: "Orientation", value: "Landscape" }
                            ]
                        });
                    });
                }

                setRawgResults(results);
                setShowRAWGModal(true);
            } else {
                alert("No game found on RAWG with this title");
            }
        } catch (error) {
            console.error("RAWG fetch error:", error);
            alert("Failed to fetch from RAWG. Please try again.");
        } finally {
            setLoadingRAWG(false);
        }
    };

    const fetchFromIGDB = async (type) => {
        if (!formData.title) {
            alert("Game title is required for IGDB search");
            return;
        }

        setLoadingIGDB(true);
        setExternalSourceType(type);

        try {
            // Search for the game
            const searchRes = await axios.get(`${API_BASE}/api/igdb/search?query=${encodeURIComponent(formData.title)}`);

            if (searchRes.data && searchRes.data.length > 0) {
                const gameId = searchRes.data[0].id;

                // Fetch detailed game data
                const gameRes = await axios.get(`${API_BASE}/api/igdb/game/${gameId}`);
                const gameData = gameRes.data;

                const results = [];

                // Add cover image
                if (gameData.cover?.url) {
                    results.push({
                        url: `https:${gameData.cover.url.replace('t_thumb', 't_cover_big')}`,
                        title: "Cover Image",
                        type: "image",
                        source: "IGDB",
                        meta: [
                            { label: "Type", value: "Cover" },
                            { label: "Source", value: "IGDB" },
                            { label: "Orientation", value: "Portrait" }
                        ]
                    });
                }

                // Add artworks (best for featured backgrounds)
                if (gameData.artworks) {
                    gameData.artworks.forEach((artwork, index) => {
                        results.push({
                            url: `https:${artwork.url.replace('t_thumb', 't_1080p')}`,
                            title: `Artwork ${index + 1}`,
                            type: "image",
                            source: "IGDB",
                            meta: [
                                { label: "Type", value: "Artwork" },
                                { label: "Source", value: "IGDB" },
                                { label: "Orientation", value: "Landscape" },
                                { label: "Quality", value: "High Resolution" }
                            ]
                        });
                    });
                }

                // Add screenshots
                if (gameData.screenshots) {
                    gameData.screenshots.forEach((screenshot, index) => {
                        results.push({
                            url: `https:${screenshot.url.replace('t_thumb', 't_screenshot_huge')}`,
                            title: `Screenshot ${index + 1}`,
                            type: "image",
                            source: "IGDB",
                            meta: [
                                { label: "Type", value: "Screenshot" },
                                { label: "Source", value: "IGDB" },
                                { label: "Orientation", value: "Landscape" }
                            ]
                        });
                    });
                }

                // Add videos (for trailer selection)
                if (gameData.videos && type === 'trailer') {
                    gameData.videos.forEach((video, index) => {
                        if (video.video_id) {
                            results.push({
                                url: `https://www.youtube.com/watch?v=${video.video_id}`,
                                title: video.name || `Trailer ${index + 1}`,
                                type: "video",
                                source: "IGDB",
                                meta: [
                                    { label: "Type", value: "Trailer" },
                                    { label: "Source", value: "IGDB" },
                                    { label: "Platform", value: "YouTube" }
                                ]
                            });
                        }
                    });
                }

                setIgdbResults(results);
                setShowIGDBModal(true);
            } else {
                alert("No game found on IGDB with this title");
            }
        } catch (error) {
            console.error("IGDB fetch error:", error);
            alert("Failed to fetch from IGDB. Please try again.");
        } finally {
            setLoadingIGDB(false);
        }
    };

    const handleExternalSelection = (item) => {
        const { url, type } = item;

        if (externalSourceType === 'trailer') {
            handleChange('trailerUrl', url);
        } else if (externalSourceType === 'featured') {
            handleChange('featuredBackground', url);
        } else if (externalSourceType === 'poster') {
            handleChange('posterImage', url);
        }

        // Close modals
        setShowRAWGModal(false);
        setShowIGDBModal(false);
        setRawgResults([]);
        setIgdbResults([]);
    };

    const handleChange = (field, value) => {
        setFormData({
            ...formData,
            bannerOverrides: {
                ...overrides,
                [field]: value,
            },
        });
    };

    const handleImageSelect = (imageUrl, type) => {
        handleChange(type, imageUrl);
        setShowGallerySelector(false);
    };

    const handleVideoSelect = (videoUrl) => {
        handleChange('trailerUrl', videoUrl);
        setShowVideoSelector(false);
    };

    // Youtube thumbnail helper
    const getYoutubeId = (url = "") => {
        const match = url.match(
            /(?:youtube\.com\/(?:[^/]+\/.+|(?:v|embed)\/|.*[?&]v=)|youtu\.be\/)([^"&?/s]{11})/
        );
        return match ? match[1] : "";
    };

    // Get video thumbnail
    const getVideoThumbnail = (video) => {
        if (video.url?.includes("youtube.com") || video.url?.includes("youtu.be")) {
            const id = getYoutubeId(video.url);
            return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
        }
        return null;
    };

    // Render external source grid
    const renderExternalGrid = (results, isVideo = false) => {
        if (results.length === 0) {
            return (
                <div className="text-center py-8 text-zinc-400">
                    <div className="text-4xl mb-4">{isVideo ? "🎬" : "📷"}</div>
                    <p>No {isVideo ? "videos" : "images"} found for "{formData.title}"</p>
                    <p className="text-sm mt-2">Try searching with a different game title or check spelling</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.map((item, index) => (
                    <div
                        key={index}
                        className="relative group cursor-pointer border border-zinc-700 rounded-lg overflow-hidden hover:border-yellow-400 transition-colors"
                        onClick={() => handleExternalSelection(item)}
                    >
                        {isVideo ? (
                            getVideoThumbnail(item) ? (
                                <img
                                    src={getVideoThumbnail(item)}
                                    alt={item.title}
                                    className="w-full h-32 object-cover"
                                    onError={e => (e.target.style.display = "none")}
                                />
                            ) : (
                                <div className="w-full h-32 bg-zinc-800 flex items-center justify-center">
                                    <div className="text-center text-zinc-400">
                                        <div className="text-2xl mb-1">🎬</div>
                                        <div className="text-xs">Video</div>
                                    </div>
                                </div>
                            )
                        ) : (
                            <img
                                src={item.url}
                                alt={item.title}
                                className="w-full h-32 object-cover"
                                onError={e => (e.target.style.display = "none")}
                            />
                        )}

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                            <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                Select
                            </span>
                        </div>

                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {item.source === 'RAWG' ? '🎯' : '🎮'} {item.source}
                        </div>

                        {item.meta?.some(m => m.label === 'Type' && ['Banner', 'Background', 'Artwork'].includes(m.value)) && (
                            <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                                ⭐ Recommended
                            </div>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-2">
                            <div className="truncate">{item.title}</div>
                            {item.meta?.find(m => m.label === 'Type')?.value && (
                                <div className="text-zinc-400 text-[10px]">
                                    {item.meta.find(m => m.label === 'Type').value}
                                </div>
                            )}
                        </div>

                        {isVideo && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="bg-red-600/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M6.3 4.1L15.4 9.5c.5.3.5 1.1 0 1.4L6.3 15.9c-.6.4-1.3-.1-1.3-.7V4.8c0-.6.7-1.1 1.3-.7z"/>
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    // Enhanced trailer preview with video selection
    const renderTrailerPreview = () => {
        const url = overrides.trailerUrl;
        const hasVideoOptions = availableVideos.length > 0;

        if (!url) {
            return (
                <div className="relative group">
                    <div
                        className={`w-40 h-24 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-zinc-400 text-xs border border-zinc-700 shadow-inner ${hasVideoOptions ? 'border-dashed cursor-pointer hover:border-red-400' : ''}`}
                        onClick={() => hasVideoOptions && setShowVideoSelector(true)}
                    >
                        <div className="text-center">
                            <div className="text-lg mb-1">🎬</div>
                            {hasVideoOptions ? (
                                <>
                                    <div>Click to select</div>
                                    <div className="text-xs mt-1 text-zinc-500">
                                        {availableVideos.length} videos available
                                    </div>
                                </>
                            ) : (
                                <div>Default Trailer</div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        if (url.includes("youtube.com") || url.includes("youtu.be")) {
            const id = getYoutubeId(url);
            return (
                <div className="relative group">
                    <img
                        src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`}
                        alt="YouTube Trailer"
                        className="w-40 h-24 object-cover rounded-lg shadow-lg border-2 border-zinc-700 group-hover:border-red-400 transition-all duration-300 group-hover:shadow-red-400/25"
                        onError={e => (e.target.style.display = "none")}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-red-600/90 rounded-full p-2 shadow-lg">
                            <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6.3 4.1L15.4 9.5c.5.3.5 1.1 0 1.4L6.3 15.9c-.6.4-1.3-.1-1.3-.7V4.8c0-.6.7-1.1 1.3-.7z"/>
                            </svg>
                        </div>
                    </div>
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                        YouTube
                    </div>
                    {editMode && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowVideoSelector(true)}
                                    className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-500"
                                >
                                    Change
                                </button>
                                <button
                                    onClick={() => handleChange('trailerUrl', '')}
                                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-gray-500"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="relative group">
                <div className="w-40 h-24 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-zinc-400 text-xs border border-zinc-700">
                    <div className="text-center">
                        <div className="text-lg mb-1">🎬</div>
                        <div>Custom Video</div>
                    </div>
                </div>
                {editMode && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowVideoSelector(true)}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-500"
                            >
                                Change
                            </button>
                            <button
                                onClick={() => handleChange('trailerUrl', '')}
                                className="bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-gray-500"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Featured Section Background Preview
    const renderFeaturedSectionPreview = () => {
        const url = overrides.featuredBackground;
        if (!url) {
            return (
                <div className="relative group cursor-pointer" onClick={() => {
                    setSelectedImageType('featuredBackground');
                    setShowGallerySelector(true);
                }}>
                    <div className="w-full h-32 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-zinc-400 text-sm border border-zinc-700 shadow-inner border-dashed">
                        <div className="text-center">
                            <div className="text-2xl mb-2">🌟</div>
                            <div>Click to select Featured Section background</div>
                            <div className="text-xs mt-1 text-zinc-500">
                                {availableImages.length > 0 ? `${availableImages.length} images available` : 'No images available'}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="relative group">
                <img
                    src={url}
                    alt="Featured Section Background"
                    className="w-full h-32 object-cover rounded-lg shadow-lg border-2 border-zinc-700 group-hover:border-yellow-400 transition-all duration-300 group-hover:shadow-yellow-400/25"
                    onError={e => (e.target.style.display = "none")}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setSelectedImageType('featuredBackground');
                                setShowGallerySelector(true);
                            }}
                            className="bg-yellow-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-yellow-500"
                        >
                            Change
                        </button>
                        <button
                            onClick={() => handleChange('featuredBackground', '')}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-500"
                        >
                            Remove
                        </button>
                    </div>
                </div>
                <div className="absolute top-3 left-3 bg-yellow-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    🌟 Featured Override
                </div>
            </div>
        );
    };

    // Enhanced poster preview
    const renderPosterPreview = () => {
        const url = overrides.posterImage;
        if (!url) {
            return (
                <div className="relative group cursor-pointer" onClick={() => {
                    setSelectedImageType('posterImage');
                    setShowGallerySelector(true);
                }}>
                    <div className="w-24 h-36 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-zinc-400 text-xs border border-zinc-700 shadow-inner border-dashed">
                        <div className="text-center">
                            <div className="text-lg mb-1">🖼️</div>
                            <div>Click to</div>
                            <div>select</div>
                            <div>poster</div>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="relative group">
                <img
                    src={url}
                    alt="Poster Preview"
                    className="w-24 h-36 object-cover rounded-lg shadow-lg border-2 border-zinc-700 group-hover:border-cyan-400 transition-all duration-300 group-hover:shadow-cyan-400/25"
                    onError={e => (e.target.style.display = "none")}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={() => {
                                setSelectedImageType('posterImage');
                                setShowGallerySelector(true);
                            }}
                            className="bg-cyan-600 text-white px-2 py-1 rounded text-xs font-medium hover:bg-cyan-500"
                        >
                            Change
                        </button>
                        <button
                            onClick={() => handleChange('posterImage', '')}
                            className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium hover:bg-red-500"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">
                    🎬 Banner & Media Override
                </h2>
                <p className="text-zinc-400">
                    Customize visual elements and override game media
                </p>
                {(availableImages.length > 0 || availableVideos.length > 0) && (
                    <div className="mt-2 text-sm text-green-400">
                        ✅ {availableImages.length} images + {availableVideos.length} videos available
                        {formData.dataSource && formData.dataSource !== 'manual' && (
                            <span className="ml-1 text-blue-400">(from {formData.dataSource.toUpperCase()})</span>
                        )}
                    </div>
                )}
            </div>

            {/* Requirements Notice */}
            {editMode && !formData.title && (
                <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div>
                            <p className="text-amber-300 font-semibold">Game Title Required</p>
                            <p className="text-amber-200/80 text-sm">
                                Please set a game title in the Overview tab to use external media sources.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* RAWG Modal */}
            {showRAWGModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="text-2xl">🎯</span>
                                Import from RAWG
                                <span className="text-sm font-normal text-zinc-400">
                                    for {externalSourceType === 'featured' ? 'Featured Background' :
                                    externalSourceType === 'poster' ? 'Poster Image' : 'Trailer Video'}
                                </span>
                            </h3>
                            <button
                                onClick={() => {
                                    setShowRAWGModal(false);
                                    setRawgResults([]);
                                }}
                                className="text-zinc-400 hover:text-white text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        {renderExternalGrid(rawgResults, externalSourceType === 'trailer')}
                    </div>
                </div>
            )}

            {/* IGDB Modal */}
            {showIGDBModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="text-2xl">🎮</span>
                                Import from IGDB
                                <span className="text-sm font-normal text-zinc-400">
                                    for {externalSourceType === 'featured' ? 'Featured Background' :
                                    externalSourceType === 'poster' ? 'Poster Image' : 'Trailer Video'}
                                </span>
                            </h3>
                            <button
                                onClick={() => {
                                    setShowIGDBModal(false);
                                    setIgdbResults([]);
                                }}
                                className="text-zinc-400 hover:text-white text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        {renderExternalGrid(igdbResults, externalSourceType === 'trailer')}
                    </div>
                </div>
            )}

            {/* Video Selector Modal */}
            {showVideoSelector && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">
                                Select Trailer Video
                            </h3>
                            <button
                                onClick={() => setShowVideoSelector(false)}
                                className="text-zinc-400 hover:text-white text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        {availableVideos.length === 0 ? (
                            <div className="text-center py-8 text-zinc-400">
                                <div className="text-4xl mb-4">🎬</div>
                                <p>No videos available. Add videos via Gallery tab or import from IGDB.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {availableVideos.map((video, index) => {
                                    const thumbnail = getVideoThumbnail(video);

                                    return (
                                        <div
                                            key={index}
                                            className="relative group cursor-pointer border border-zinc-700 rounded-lg overflow-hidden hover:border-red-400 transition-colors"
                                            onClick={() => handleVideoSelect(video.url)}
                                        >
                                            {thumbnail ? (
                                                <img
                                                    src={thumbnail}
                                                    alt={video.title}
                                                    className="w-full h-32 object-cover"
                                                    onError={e => (e.target.style.display = "none")}
                                                />
                                            ) : (
                                                <div className="w-full h-32 bg-zinc-800 flex items-center justify-center">
                                                    <div className="text-center text-zinc-400">
                                                        <div className="text-2xl mb-1">🎬</div>
                                                        <div className="text-xs">Video</div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Play button overlay */}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                                                <div className="bg-red-600/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M6.3 4.1L15.4 9.5c.5.3.5 1.1 0 1.4L6.3 15.9c-.6.4-1.3-.1-1.3-.7V4.8c0-.6.7-1.1 1.3-.7z"/>
                                                    </svg>
                                                </div>
                                            </div>

                                            {/* Video info */}
                                            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                                🎬 {video.source === 'gallery' ? 'Gallery' : video.source === 'trailerUrl' ? 'Main' : video.source}
                                            </div>

                                            {/* Source indicator */}
                                            {video.meta?.find(m => m.label === 'Source')?.value && (
                                                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                                    {video.meta.find(m => m.label === 'Source').value}
                                                </div>
                                            )}

                                            <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-2">
                                                <div className="truncate font-medium">{video.title}</div>
                                                {video.meta?.find(m => m.label === 'Type')?.value && (
                                                    <div className="text-zinc-400 text-[10px]">
                                                        {video.meta.find(m => m.label === 'Type').value}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Image Gallery Selector Modal */}
            {showGallerySelector && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">
                                Select {selectedImageType === 'featuredBackground' ? 'Featured Background' : 'Poster Image'}
                            </h3>
                            <button
                                onClick={() => setShowGallerySelector(false)}
                                className="text-zinc-400 hover:text-white text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        {availableImages.length === 0 ? (
                            <div className="text-center py-8 text-zinc-400">
                                <div className="text-4xl mb-4">📷</div>
                                <p>No images available. Add images via Gallery tab or import from RAWG/IGDB.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {availableImages.map((image, index) => (
                                    <div
                                        key={index}
                                        className="relative group cursor-pointer border border-zinc-700 rounded-lg overflow-hidden hover:border-yellow-400 transition-colors"
                                        onClick={() => handleImageSelect(image.url, selectedImageType)}
                                    >
                                        <img
                                            src={image.url}
                                            alt={image.title}
                                            className="w-full h-32 object-cover"
                                            onError={e => (e.target.style.display = "none")}
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Select
                      </span>
                                        </div>
                                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                            {image.source === 'gallery' ? '🖼️' : image.source === 'bannerImage' ? '🎯' : '📷'} {image.source}
                                        </div>
                                        {image.meta?.some(m => m.label === 'Type' && ['Banner', 'Background', 'Landscape'].includes(m.value)) && (
                                            <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                                                ⭐ Recommended
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-2">
                                            <div className="truncate">{image.title}</div>
                                            {image.meta?.find(m => m.label === 'Type')?.value && (
                                                <div className="text-zinc-400 text-[10px]">
                                                    {image.meta.find(m => m.label === 'Type').value}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Featured Section Background */}
            <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 rounded-2xl p-8 border border-zinc-700/50 shadow-2xl">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-yellow-400 mb-2 flex items-center gap-2">
                        <span>🌟</span>
                        Featured Section Background
                    </h3>
                    <p className="text-zinc-400 text-sm">
                        Background image to be used when featured on the main page
                    </p>
                    {availableImages.length > 0 && (
                        <p className="text-green-400 text-xs mt-1">
                            💡 {availableImages.length} images available - click to select
                        </p>
                    )}
                </div>

                <div className="space-y-4">
                    {renderFeaturedSectionPreview()}

                    {editMode && (
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={overrides.featuredBackground || ""}
                                onChange={(e) => handleChange("featuredBackground", e.target.value)}
                                placeholder="High resolution background URL for featured section (1920x1080 recommended)"
                                className="w-full bg-zinc-800 border border-zinc-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setSelectedImageType('featuredBackground');
                                        setShowGallerySelector(true);
                                    }}
                                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-500 transition-colors"
                                    disabled={availableImages.length === 0}
                                >
                                    📷 Select from Gallery ({availableImages.length})
                                </button>

                                {/* External Source Buttons */}
                                <button
                                    onClick={() => fetchFromRAWG('featured')}
                                    disabled={loadingRAWG || !formData.title}
                                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2"
                                >
                                    {loadingRAWG ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <span>🎯</span>
                                    )}
                                    {loadingRAWG ? "Searching..." : "Import from RAWG"}
                                </button>

                                <button
                                    onClick={() => fetchFromIGDB('featured')}
                                    disabled={loadingIGDB || !formData.title}
                                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2"
                                >
                                    {loadingIGDB ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <span>🎮</span>
                                    )}
                                    {loadingIGDB ? "Searching..." : "Import from IGDB"}
                                </button>
                            </div>
                            <p className="text-xs text-zinc-500">
                                💡 Tip: Horizontal, high resolution and dramatic images are ideal for featured section
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Poster & Trailer */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Poster Area */}
                <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 rounded-2xl p-6 border border-zinc-700/50 shadow-xl">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-cyan-400 mb-2 flex items-center gap-2">
                            <span>🖼️</span>
                            Poster Image
                        </h3>
                        <p className="text-zinc-400 text-sm">
                            Poster to be used in game cards and detail pages
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        {renderPosterPreview()}

                        {editMode && (
                            <div className="w-full space-y-2">
                                <input
                                    type="text"
                                    value={overrides.posterImage || ""}
                                    onChange={(e) => handleChange("posterImage", e.target.value)}
                                    placeholder="Poster URL (vertical format recommended)"
                                    className="w-full bg-zinc-800 border border-zinc-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedImageType('posterImage');
                                            setShowGallerySelector(true);
                                        }}
                                        className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-500 transition-colors"
                                        disabled={availableImages.length === 0}
                                    >
                                        📷 Select from Gallery ({availableImages.length})
                                    </button>
                                </div>

                                {/* External Source Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => fetchFromRAWG('poster')}
                                        disabled={loadingRAWG || !formData.title}
                                        className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center justify-center gap-2"
                                    >
                                        {loadingRAWG ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <span>🎯</span>
                                        )}
                                        RAWG
                                    </button>

                                    <button
                                        onClick={() => fetchFromIGDB('poster')}
                                        disabled={loadingIGDB || !formData.title}
                                        className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center justify-center gap-2"
                                    >
                                        {loadingIGDB ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <span>🎮</span>
                                        )}
                                        IGDB
                                    </button>
                                </div>

                                <p className="text-xs text-zinc-500">
                                    📐 Recommended size: 300x400 or 2:3 ratio vertical image
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Enhanced Trailer Area with Video Selection */}
                <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 rounded-2xl p-6 border border-zinc-700/50 shadow-xl">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-red-400 mb-2 flex items-center gap-2">
                            <span>🎬</span>
                            Trailer / Video
                        </h3>
                        <p className="text-zinc-400 text-sm">
                            Game trailer or gameplay footage
                        </p>
                        {availableVideos.length > 0 && (
                            <p className="text-green-400 text-xs mt-1">
                                🎥 {availableVideos.length} videos available
                                {formData.dataSource && formData.dataSource !== 'manual' && (
                                    <span className="ml-1">(from {formData.dataSource.toUpperCase()})</span>
                                )}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        {renderTrailerPreview()}

                        {editMode && (
                            <div className="w-full space-y-2">
                                <input
                                    type="text"
                                    value={overrides.trailerUrl || ""}
                                    onChange={(e) => handleChange("trailerUrl", e.target.value)}
                                    placeholder="YouTube, MP4 or image URL"
                                    className="w-full bg-zinc-800 border border-zinc-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200"
                                />

                                {/* Video Selection Button - Only show if videos available */}
                                {availableVideos.length > 0 && (
                                    <button
                                        onClick={() => setShowVideoSelector(true)}
                                        className="w-full bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-500 transition-colors flex items-center justify-center gap-2"
                                    >
                                        🎬 Select from Available Videos ({availableVideos.length})
                                    </button>
                                )}

                                {/* External Source Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => fetchFromRAWG('trailer')}
                                        disabled={loadingRAWG || !formData.title}
                                        className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center justify-center gap-2"
                                    >
                                        {loadingRAWG ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <span>🎯</span>
                                        )}
                                        RAWG
                                    </button>

                                    <button
                                        onClick={() => fetchFromIGDB('trailer')}
                                        disabled={loadingIGDB || !formData.title}
                                        className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center justify-center gap-2"
                                    >
                                        {loadingIGDB ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <span>🎮</span>
                                        )}
                                        IGDB
                                    </button>
                                </div>

                                <p className="text-xs text-zinc-500">
                                    📹 Supported formats: YouTube, MP4, WebM, OGG, JPG, PNG
                                </p>

                                {/* Enhanced info for IGDB sourced games */}
                                {formData.dataSource === 'igdb' && availableVideos.length > 0 && (
                                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                                        <div className="flex items-start gap-2">
                                            <div className="text-blue-400 text-sm">🎮</div>
                                            <div className="text-xs text-blue-300">
                                                <strong>IGDB Integration:</strong> This game was imported from IGDB and has {availableVideos.length} trailer(s)/video(s).
                                                Click the button above to select from IGDB videos.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {formData.dataSource === 'rawg' && availableVideos.length > 0 && (
                                    <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3">
                                        <div className="flex items-start gap-2">
                                            <div className="text-cyan-400 text-sm">🎯</div>
                                            <div className="text-xs text-cyan-300">
                                                <strong>RAWG Integration:</strong> This game was imported from RAWG and has {availableVideos.length} video(s).
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Enhanced Info Box */}
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/30">
                <div className="flex items-start gap-3">
                    <div className="text-2xl">💡</div>
                    <div>
                        <h4 className="font-semibold text-blue-300 mb-2">Enhanced Override System</h4>
                        <ul className="text-zinc-300 text-sm space-y-1">
                            <li>• <strong>Manual URL:</strong> Add custom images/videos by entering URL directly</li>
                            <li>• <strong>Gallery Selection:</strong> Choose from RAWG/IGDB imported media</li>
                            <li>• <strong>External Import:</strong> Search and import directly from RAWG/IGDB</li>
                            <li>• <strong>Smart Recommendations:</strong> System suggests suitable images/videos</li>
                            <li>• <strong>Featured Override:</strong> Custom background for main page</li>
                            <li>• <strong>Live Preview:</strong> See changes instantly</li>
                        </ul>

                        {/* Data source specific tips */}
                        {formData.dataSource === 'igdb' && (
                            <div className="mt-3 p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
                                <div className="text-purple-300 text-sm font-medium mb-1">🎮 IGDB Special Features:</div>
                                <ul className="text-purple-200 text-xs space-y-1">
                                    <li>✅ High quality official trailers</li>
                                    <li>✅ Artworks and screenshots</li>
                                    <li>✅ Metadata categorized media</li>
                                    <li>✅ YouTube integration</li>
                                </ul>
                            </div>
                        )}

                        {formData.dataSource === 'rawg' && (
                            <div className="mt-3 p-3 bg-cyan-900/20 rounded-lg border border-cyan-500/30">
                                <div className="text-cyan-300 text-sm font-medium mb-1">🎯 RAWG Special Features:</div>
                                <ul className="text-cyan-200 text-xs space-y-1">
                                    <li>✅ Extensive screenshot collection</li>
                                    <li>✅ Gameplay videos</li>
                                    <li>✅ Community-driven content</li>
                                    <li>✅ Platform-specific media</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TabBanner;