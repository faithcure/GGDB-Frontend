import React, { useState } from "react";
import axios from "axios";
import { MEDIA_LABELS } from "../../../data/mediaLabels";
import { API_BASE } from "../../../config/api";

const RAWG_KEY = import.meta.env.VITE_RAWG_API_KEY;

// Media Source Modal Component
const MediaSourceModal = ({
                            isOpen,
                            onClose,
                            source,
                            gameTitle,
                            onMediaSelect
                          }) => {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameMedia, setGameMedia] = useState([]);
  const [error, setError] = useState(null);

  // Search for games
  const searchGames = async () => {
    if (!gameTitle?.trim()) return;

    setLoading(true);
    setError(null);

    try {
      let results = [];

      if (source === 'rawg') {
        const response = await axios.get(
            `https://api.rawg.io/api/games?key=${RAWG_KEY}&search=${encodeURIComponent(gameTitle)}&page_size=10`
        );
        results = response.data.results || [];
      } else if (source === 'igdb') {
        const response = await axios.get(
            `${API_BASE}/api/igdb/search?query=${encodeURIComponent(gameTitle)}`
        );
        results = response.data || [];
      }

      setSearchResults(results);
    } catch (err) {
      console.error(`${source.toUpperCase()} search error:`, err);
      setError(`Failed to search ${source.toUpperCase()}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch media for selected game
  const fetchGameMedia = async (game) => {
    setLoading(true);
    setSelectedGame(game);
    setGameMedia([]);

    try {
      let media = [];

      if (source === 'rawg') {
        // Fetch RAWG screenshots and videos
        const [screenshotRes, videoRes] = await Promise.all([
          axios.get(`https://api.rawg.io/api/games/${game.id}/screenshots?key=${RAWG_KEY}`),
          axios.get(`https://api.rawg.io/api/games/${game.id}/movies?key=${RAWG_KEY}`)
        ]);

        // Process screenshots
        const screenshots = (screenshotRes.data?.results || []).map((img, index) => ({
          id: `rawg-screenshot-${index}`,
          url: img.image,
          title: `Screenshot ${index + 1}`,
          type: "image",
          source: "RAWG",
          meta: [
            { label: "Type", value: "Screenshot" },
            { label: "Source", value: "RAWG" },
            { label: "Orientation", value: "Landscape" },
            { label: "Quality", value: "High Resolution" }
          ]
        }));

        // Process videos
        const videos = (videoRes.data?.results || []).map((video, index) => ({
          id: `rawg-video-${index}`,
          url: video.data?.max || video.data?.["480"] || "",
          title: video.name || `Trailer ${index + 1}`,
          type: "video",
          source: "RAWG",
          meta: [
            { label: "Type", value: "Trailer" },
            { label: "Source", value: "RAWG" },
            { label: "Quality", value: "HD" }
          ]
        })).filter(v => v.url);

        media = [...videos, ...screenshots];

      } else if (source === 'igdb') {
        // Fetch detailed IGDB data
        const response = await axios.get(`${API_BASE}/api/igdb/game/${game.id}`);
        const gameData = response.data;

        // Process videos
        const videos = (gameData.videos || []).map((video, index) => ({
          id: `igdb-video-${index}`,
          url: `https://www.youtube.com/watch?v=${video.video_id}`,
          title: video.name || `Trailer ${index + 1}`,
          type: "video",
          source: "IGDB",
          meta: [
            { label: "Type", value: "Trailer" },
            { label: "Source", value: "IGDB" },
            { label: "Platform", value: "YouTube" },
            { label: "Quality", value: "HD" }
          ]
        })).filter(v => v.url.includes('youtube.com'));

        // Process artworks
        const artworks = (gameData.artworks || []).map((artwork, index) => ({
          id: `igdb-artwork-${index}`,
          url: `https:${artwork.url.replace('t_thumb', 't_1080p')}`,
          title: `Artwork ${index + 1}`,
          type: "image",
          source: "IGDB",
          meta: [
            { label: "Type", value: "Artwork" },
            { label: "Source", value: "IGDB" },
            { label: "Orientation", value: "Landscape" },
            { label: "Quality", value: "High Resolution" },
            { label: "Suitable For", value: "Banner" }
          ]
        }));

        // Process screenshots
        const screenshots = (gameData.screenshots || []).map((screenshot, index) => ({
          id: `igdb-screenshot-${index}`,
          url: `https:${screenshot.url.replace('t_thumb', 't_screenshot_huge')}`,
          title: `Screenshot ${index + 1}`,
          type: "image",
          source: "IGDB",
          meta: [
            { label: "Type", value: "Screenshot" },
            { label: "Source", value: "IGDB" },
            { label: "Orientation", value: "Landscape" },
            { label: "Quality", value: "High Resolution" }
          ]
        }));

        media = [...videos, ...artworks, ...screenshots];
      }

      setGameMedia(media);
    } catch (err) {
      console.error(`${source.toUpperCase()} media fetch error:`, err);
      setError(`Failed to fetch media from ${source.toUpperCase()}.`);
    } finally {
      setLoading(false);
    }
  };

  // Toggle media selection
  const toggleMediaSelection = (mediaItem) => {
    setSelectedMedia(prev => {
      const isSelected = prev.some(item => item.id === mediaItem.id);
      if (isSelected) {
        return prev.filter(item => item.id !== mediaItem.id);
      } else {
        return [...prev, mediaItem];
      }
    });
  };

  // Add selected media to gallery
  const handleAddSelected = () => {
    if (selectedMedia.length === 0) return;

    // Format media for gallery
    const formattedMedia = selectedMedia.map(media => ({
      url: media.url,
      title: media.title,
      type: media.type,
      date: new Date().toISOString().split('T')[0],
      meta: media.meta || []
    }));

    onMediaSelect(formattedMedia);
    handleClose();
  };

  // Close modal and reset
  const handleClose = () => {
    setSearchResults([]);
    setSelectedMedia([]);
    setSelectedGame(null);
    setGameMedia([]);
    setError(null);
    onClose();
  };

  // Get YouTube thumbnail
  const getYoutubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+|(?:v|embed)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : "";
  };

  const renderMediaPreview = (item) => {
    if (item.type === "video" && item.url.includes("youtube.com")) {
      const youtubeId = getYoutubeId(item.url);
      return (
          <img
              src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
              alt={item.title}
              className="w-full h-32 object-cover"
              onError={(e) => e.target.style.display = "none"}
          />
      );
    } else if (item.type === "image") {
      return (
          <img
              src={item.url}
              alt={item.title}
              className="w-full h-32 object-cover"
              onError={(e) => e.target.style.display = "none"}
          />
      );
    } else {
      return (
          <div className="w-full h-32 bg-gray-700 flex items-center justify-center">
          <span className="text-gray-400">
            {item.type === "video" ? "🎬" : "🖼️"}
          </span>
          </div>
      );
    }
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-700">
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                {source === 'rawg' ? '🎯' : '🎮'} Import from {source.toUpperCase()}
              </h3>
              <p className="text-gray-400 mt-1">
                Searching for: <span className="text-white font-medium">"{gameTitle}"</span>
              </p>
            </div>
            <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white text-3xl transition-colors"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {/* Error Message */}
            {error && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                  <p className="text-red-300">{error}</p>
                </div>
            )}

            {/* Step 1: Game Search */}
            {!selectedGame && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-white">
                      Step 1: Select Game
                    </h4>
                    <button
                        onClick={searchGames}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            source === 'rawg'
                                ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                                : 'bg-purple-600 hover:bg-purple-700 text-white'
                        } disabled:opacity-50`}
                    >
                      {loading ? 'Searching...' : 'Search Games'}
                    </button>
                  </div>

                  {loading && (
                      <div className="text-center py-8">
                        <div className="animate-spin w-8 h-8 border-3 border-gray-600 border-t-white rounded-full mx-auto mb-3"></div>
                        <p className="text-gray-400">Searching {source.toUpperCase()}...</p>
                      </div>
                  )}

                  {!loading && searchResults.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {searchResults.map((game) => (
                            <div
                                key={game.id}
                                className="bg-gray-800 rounded-xl p-4 cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700 hover:border-gray-600"
                                onClick={() => fetchGameMedia(game)}
                            >
                              <img
                                  src={
                                    source === 'rawg'
                                        ? game.background_image
                                        : game.cover?.url
                                            ? `https:${game.cover.url.replace('t_thumb', 't_cover_small')}`
                                            : "/placeholder-game.jpg"
                                  }
                                  alt={game.name}
                                  className="w-full h-32 object-cover rounded-lg mb-3"
                                  onError={(e) => e.target.src = "/placeholder-game.jpg"}
                              />
                              <h5 className="text-white font-semibold line-clamp-2 mb-1">
                                {game.name}
                              </h5>
                              <p className="text-gray-400 text-sm">
                                {source === 'rawg'
                                    ? new Date(game.released || '').getFullYear() || 'TBA'
                                    : game.first_release_date
                                        ? new Date(game.first_release_date * 1000).getFullYear()
                                        : 'TBA'
                                }
                              </p>
                            </div>
                        ))}
                      </div>
                  )}
                </div>
            )}

            {/* Step 2: Media Selection */}
            {selectedGame && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        Step 2: Select Media
                      </h4>
                      <p className="text-gray-400">
                        From: <span className="text-white">{selectedGame.name}</span>
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                          onClick={() => setSelectedGame(null)}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                      >
                        ← Back to Games
                      </button>
                      <button
                          onClick={handleAddSelected}
                          disabled={selectedMedia.length === 0}
                          className={`px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 ${
                              source === 'rawg'
                                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                                  : 'bg-purple-600 hover:bg-purple-700 text-white'
                          }`}
                      >
                        Add Selected ({selectedMedia.length})
                      </button>
                    </div>
                  </div>

                  {loading && (
                      <div className="text-center py-8">
                        <div className="animate-spin w-8 h-8 border-3 border-gray-600 border-t-white rounded-full mx-auto mb-3"></div>
                        <p className="text-gray-400">Loading media...</p>
                      </div>
                  )}

                  {!loading && gameMedia.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {gameMedia.map((media) => {
                          const isSelected = selectedMedia.some(item => item.id === media.id);

                          return (
                              <div
                                  key={media.id}
                                  className={`relative bg-gray-800 rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${
                                      isSelected
                                          ? (source === 'rawg' ? 'border-cyan-400' : 'border-purple-400')
                                          : 'border-gray-700 hover:border-gray-600'
                                  }`}
                                  onClick={() => toggleMediaSelection(media)}
                              >
                                {/* Preview */}
                                <div className="relative">
                                  {renderMediaPreview(media)}

                                  {/* Selection Indicator */}
                                  {isSelected && (
                                      <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                                          source === 'rawg' ? 'bg-cyan-500' : 'bg-purple-500'
                                      }`}>
                                        <span className="text-white text-sm">✓</span>
                                      </div>
                                  )}

                                  {/* Type Badge */}
                                  <div className="absolute top-2 left-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                media.type === "video"
                                    ? "bg-red-600 text-white"
                                    : "bg-blue-600 text-white"
                            }`}>
                              {media.type === "video" ? "🎬" : "🖼️"}
                            </span>
                                  </div>
                                </div>

                                {/* Info */}
                                <div className="p-3">
                                  <h6 className="text-white font-medium text-sm line-clamp-2 mb-1">
                                    {media.title}
                                  </h6>
                                  <p className="text-gray-400 text-xs">
                                    {media.source} • {media.meta?.find(m => m.label === 'Type')?.value || media.type}
                                  </p>
                                </div>
                              </div>
                          );
                        })}
                      </div>
                  )}

                  {!loading && gameMedia.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <div className="text-4xl mb-4">📷</div>
                        <p>No media found for this game</p>
                      </div>
                  )}
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

// Enhanced TabMedia with API Integration
const TabMedia = ({ formData, setFormData, editMode }) => {
  const [showRAWGModal, setShowRAWGModal] = useState(false);
  const [showIGDBModal, setShowIGDBModal] = useState(false);

  // Original TabMedia functions...
  const getYoutubeId = (url) => {
    const match =
        url.match(
            /(?:youtube\.com\/(?:[^\/]+\/.+|(?:v|embed)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
        ) || [];
    return match[1] || "";
  };

  const getToday = () => new Date().toISOString().slice(0, 10);

  const emptyMedia = (type = "image") => ({
    url: "",
    type,
    date: getToday(),
    meta: [],
  });

  const handleAdd = (type = "image") => {
    setFormData({
      ...formData,
      gallery: [emptyMedia(type), ...(formData.gallery || [])],
    });
  };

  const handleRemove = (idx) => {
    setFormData({
      ...formData,
      gallery: formData.gallery.filter((_, i) => i !== idx),
    });
  };

  const handleChange = (idx, field, value) => {
    const updated = [...formData.gallery];
    if (field === "url") {
      updated[idx] = {
        ...updated[idx],
        url: value,
        type: detectType(value),
      };
    } else {
      updated[idx] = { ...updated[idx], [field]: value };
    }
    setFormData({
      ...formData,
      gallery: updated,
    });
  };

  const detectType = (url) => {
    if (!url) return "image";
    if (
        /\.(mp4|webm|ogg)$/i.test(url) ||
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/.+$/.test(url)
    )
      return "video";
    return "image";
  };

  const handleMetaChange = (mediaIdx, metaIdx, key, value) => {
    const updated = [...formData.gallery];
    const meta = [...(updated[mediaIdx].meta || [])];
    meta[metaIdx] = { ...meta[metaIdx], [key]: value };
    updated[mediaIdx].meta = meta;
    setFormData({ ...formData, gallery: updated });
  };

  const handleAddMeta = (mediaIdx) => {
    const updated = [...formData.gallery];
    const meta = [...(updated[mediaIdx].meta || [])];
    meta.push({ label: "", value: "" });
    updated[mediaIdx].meta = meta;
    setFormData({ ...formData, gallery: updated });
  };

  const handleRemoveMeta = (mediaIdx, metaIdx) => {
    const updated = [...formData.gallery];
    const meta = [...(updated[mediaIdx].meta || [])];
    meta.splice(metaIdx, 1);
    updated[mediaIdx].meta = meta;
    setFormData({ ...formData, gallery: updated });
  };

  // Handle media selection from external sources
  const handleMediaSelect = (selectedMedia) => {
    const currentGallery = formData.gallery || [];
    const updatedGallery = [...selectedMedia, ...currentGallery];

    setFormData({
      ...formData,
      gallery: updatedGallery
    });
  };

  // Media preview rendering
  const isImage = (url) =>
      /\.(jpg|jpeg|png|webp|gif)$/i.test(url) && !/\.mp4|\.webm|\.ogg/.test(url);
  const isVideoFile = (url) => /\.(mp4|webm|ogg)$/i.test(url);
  const isYoutube = (url) =>
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);

  const renderMediaPreview = (item) => {
    if (item.url && isImage(item.url)) {
      return (
          <img
              src={item.url}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => (e.target.style.display = "none")}
          />
      );
    }

    if (item.url && item.type === "video") {
      if (isYoutube(item.url)) {
        return (
            <img
                src={`https://img.youtube.com/vi/${getYoutubeId(item.url)}/mqdefault.jpg`}
                alt="YouTube Thumbnail"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => (e.target.style.display = "none")}
            />
        );
      } else if (isVideoFile(item.url)) {
        return (
            <video
                src={item.url}
                className="w-full h-full object-cover rounded-lg"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
            />
        );
      }
    }

    return (
        <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-3xl mb-2">
              {item.type === "video" ? "🎬" : "🖼️"}
            </div>
            <span className="text-sm">No Preview</span>
          </div>
        </div>
    );
  };

  return (
      <div className="space-y-8">
        {/* Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              🖼️ Gallery & Videos
            </h2>
            <p className="text-gray-400">
              Manage game media, screenshots, artworks, and videos
            </p>
          </div>

          {editMode && (
              <div className="flex flex-wrap gap-3">
                {/* Manual Add Buttons */}
                <button
                    type="button"
                    onClick={() => handleAdd("image")}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg"
                >
                  <span className="text-lg">📷</span>
                  Add Image
                </button>

                <button
                    type="button"
                    onClick={() => handleAdd("video")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg"
                >
                  <span className="text-lg">🎬</span>
                  Add Video
                </button>

                {/* Divider */}
                <div className="border-l border-gray-600 mx-2"></div>

                {/* External Source Buttons */}
                <button
                    type="button"
                    onClick={() => setShowRAWGModal(true)}
                    disabled={!formData.title}
                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg"
                >
                  <span className="text-lg">🎯</span>
                  Add from RAWG
                </button>

                <button
                    type="button"
                    onClick={() => setShowIGDBModal(true)}
                    disabled={!formData.title}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg"
                >
                  <span className="text-lg">🎮</span>
                  Add from IGDB
                </button>
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

        {/* Media Grid */}
        {(formData.gallery && formData.gallery.length > 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {formData.gallery.map((item, idx) => (
                  <div
                      key={idx}
                      className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/20"
                  >
                    {/* Media Preview */}
                    <div className="relative mb-4 aspect-video bg-gray-800 rounded-xl overflow-hidden">
                      {renderMediaPreview(item)}

                      {/* Type Badge */}
                      <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      item.type === "video"
                          ? "bg-red-600 text-white"
                          : "bg-blue-600 text-white"
                  }`}>
                    {item.type === "video" ? "🎬 Video" : "🖼️ Image"}
                  </span>
                      </div>

                      {/* Source Badge */}
                      {item.meta?.find(m => m.label === 'Source')?.value && (
                          <div className="absolute top-3 right-12">
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-purple-600 text-white">
                      {item.meta.find(m => m.label === 'Source').value}
                    </span>
                          </div>
                      )}

                      {/* Delete Button */}
                      {editMode && (
                          <button
                              type="button"
                              onClick={() => handleRemove(idx)}
                              className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                              title="Remove media"
                          >
                            ✕
                          </button>
                      )}

                      {/* Play Button Overlay for Videos */}
                      {item.type === "video" && item.url && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-black/60 rounded-full p-4">
                              <div className="w-8 h-8 border-l-8 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                            </div>
                          </div>
                      )}
                    </div>

                    {/* Media Info */}
                    <div className="space-y-3">
                      {/* URL Input */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Media URL
                        </label>
                        <input
                            type="text"
                            value={item.url}
                            onChange={(e) => handleChange(idx, "url", e.target.value)}
                            placeholder="Paste image or video URL"
                            className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            readOnly={!editMode}
                        />
                      </div>

                      {/* Title Input */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Title
                        </label>
                        <input
                            type="text"
                            value={item.title || ""}
                            onChange={(e) => handleChange(idx, "title", e.target.value)}
                            placeholder="Media title"
                            className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            readOnly={!editMode}
                        />
                      </div>

                      {/* Metadata Section */}
                      <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-cyan-300">Metadata</span>
                          {editMode && (
                              <button
                                  type="button"
                                  onClick={() => handleAddMeta(idx)}
                                  className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold px-2 py-1 rounded transition-colors"
                              >
                                + Add
                              </button>
                          )}
                        </div>

                        {(item.meta || []).length === 0 ? (
                            <div className="text-xs text-gray-500 italic">No metadata</div>
                        ) : (
                            <div className="space-y-2">
                              {(item.meta || []).map((meta, metaIdx) => (
                                  <div key={metaIdx} className="flex gap-2 items-center">
                                    <select
                                        value={meta.label}
                                        onChange={(e) => handleMetaChange(idx, metaIdx, "label", e.target.value)}
                                        className="flex-1 bg-gray-800 border border-gray-600 text-white rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        disabled={!editMode}
                                    >
                                      <option value="">Select Label</option>
                                      {MEDIA_LABELS.map((label) => (
                                          <option key={label} value={label}>{label}</option>
                                      ))}
                                    </select>
                                    <input
                                        type="text"
                                        value={meta.value}
                                        onChange={(e) => handleMetaChange(idx, metaIdx, "value", e.target.value)}
                                        placeholder="Value"
                                        className="flex-1 bg-gray-800 border border-gray-600 text-white rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        readOnly={!editMode}
                                    />
                                    {editMode && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMeta(idx, metaIdx)}
                                            className="bg-red-600 hover:bg-red-700 text-white rounded px-2 py-1 text-xs font-bold transition-colors"
                                            title="Remove metadata"
                                        >
                                          ✕
                                        </button>
                                    )}
                                  </div>
                              ))}
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
              ))}
            </div>
        ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📷</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Media Content</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Start building your game's gallery by adding images, videos, or importing from external sources.
              </p>
              {editMode && (
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button
                        type="button"
                        onClick={() => handleAdd("image")}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2"
                    >
                      📷 Add First Image
                    </button>
                    <button
                        type="button"
                        onClick={() => handleAdd("video")}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2"
                    >
                      🎬 Add First Video
                    </button>
                  </div>
              )}
            </div>
        )}

        {/* External Source Modals */}
        <MediaSourceModal
            isOpen={showRAWGModal}
            onClose={() => setShowRAWGModal(false)}
            source="rawg"
            gameTitle={formData.title}
            onMediaSelect={handleMediaSelect}
        />

        <MediaSourceModal
            isOpen={showIGDBModal}
            onClose={() => setShowIGDBModal(false)}
            source="igdb"
            gameTitle={formData.title}
            onMediaSelect={handleMediaSelect}
        />
      </div>
  );
};

export default TabMedia;