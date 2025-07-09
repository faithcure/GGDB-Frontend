// 📁 src/components/admin/AddGame.jsx - Enhanced with data source tracking
import React, { useState } from "react";
import axios from "axios";
import { API_BASE } from "../../config/api";

const RAWG_KEY = import.meta.env.VITE_RAWG_API_KEY;

const initialManualData = {
  title: "",
  originalTitle: "",
  releaseDate: "",
  coverImage: "",
  bannerImage: "",  // Add banner image field
  trailerUrl: "",
  tags: [],
  genres: [],
  platforms: [],
  studio: "",
  developer: "",
  publisher: "",
  engine: "",
  franchise: "",
  story: "",
  cast: [],
  crew: [],
  contentWarnings: [],
  awards: [],
  gallery: [],
  languages: { audio: [], subtitles: [], interface: [] },
  storeLinks: [],
  metacriticScore: 0,
  userRating: 0,
  playtime: 0,
  steamLink: "",
  website: "",
  price: 0,
  dlcs: [],
  inspiration: [],
  officialWebsite: "",
  estimatedPlaytime: "",
  systemRequirements: { minimum: "", recommended: "" },
  dataSource: "manual"  // Track data source
};

const AddGame = ({ onGameAdded }) => {
  const [tab, setTab] = useState("rawg");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [manualData, setManualData] = useState(initialManualData);

  // 🎮 Enhanced IGDB Data Transformer with source tracking
  const transformIGDBData = (igdbGame) => {
    console.log("🔄 IGDB verisi dönüştürülüyor:", igdbGame);

    // 🆕 Language Support Processing - BU KISMI EKLE
    const processLanguageSupport = (languageSupports) => {
      if (!languageSupports || languageSupports.length === 0) {
        console.log("⚠️  Dil desteği verisi bulunamadı");
        return {
          audio: [],
          subtitles: [],
          interface: [],
          hasIGDBLanguageData: false
        };
      }

      const processedLanguages = {
        audio: [],
        subtitles: [],
        interface: [],
        hasIGDBLanguageData: true
      };

      languageSupports.forEach(support => {
        const languageName = support.language?.name || 'Unknown Language';
        const supportType = support.language_support_type?.name || 'Unknown';

        console.log(`🌍 Processing: ${languageName} - ${supportType}`);

        // IGDB language support types mapping
        switch (supportType.toLowerCase()) {
          case 'audio':
          case 'voice':
          case 'spoken':
            if (!processedLanguages.audio.includes(languageName)) {
              processedLanguages.audio.push(languageName);
            }
            break;
          case 'subtitles':
          case 'text':
            if (!processedLanguages.subtitles.includes(languageName)) {
              processedLanguages.subtitles.push(languageName);
            }
            break;
          case 'interface':
          case 'menu':
          case 'ui':
            if (!processedLanguages.interface.includes(languageName)) {
              processedLanguages.interface.push(languageName);
            }
            break;
          default:
            // Unknown type - add to interface as fallback
            if (!processedLanguages.interface.includes(languageName)) {
              processedLanguages.interface.push(languageName);
            }
        }
      });

      console.log(`✅ ${languageSupports.length} dil desteği işlendi:`, processedLanguages);
      return processedLanguages;
    };

    const getTrailerUrl = (igdbGame) => {
      if (igdbGame.videos && igdbGame.videos.length > 0) {
        const video = igdbGame.videos[0];
        if (video.video_id) {
          return `https://www.youtube.com/watch?v=${video.video_id}`;
        }
      }

      if (igdbGame.websites && igdbGame.websites.length > 0) {
        const youtubeWebsite = igdbGame.websites.find(site =>
                site.url && (
                    site.url.includes('youtube.com') ||
                    site.url.includes('youtu.be')
                )
        );
        if (youtubeWebsite) {
          return youtubeWebsite.url;
        }
      }
      return "";
    };

    // 🆕 Process language support from IGDB - BU SATIRI EKLE
    const languageData = processLanguageSupport(igdbGame.language_supports);

    return {
      title: igdbGame.name || "",
      originalTitle: igdbGame.name || "",
      releaseDate: igdbGame.first_release_date
          ? new Date(igdbGame.first_release_date * 1000).toISOString().split('T')[0]
          : "",
      coverImage: igdbGame.cover?.url
          ? `https:${igdbGame.cover.url.replace('t_thumb', 't_cover_big')}`
          : "",
      bannerImage: igdbGame.artworks?.[0]?.url
          ? `https:${igdbGame.artworks[0].url.replace('t_thumb', 't_1080p')}`
          : "",
      trailerUrl: getTrailerUrl(igdbGame),

      // Basic Info
      genres: igdbGame.genres?.map(g => g.name) || [],
      platforms: igdbGame.platforms?.map(p => p.name) || [],
      themes: igdbGame.themes?.map(t => t.name) || [],
      keywords: igdbGame.keywords?.map(k => k.name) || [],

      // Companies
      developer: igdbGame.involved_companies?.find(ic => ic.developer)?.company?.name || "",
      publisher: igdbGame.involved_companies?.find(ic => ic.publisher)?.company?.name || "",
      studio: igdbGame.involved_companies?.find(ic => ic.developer)?.company?.name || "",

      // Engine & Franchise
      engine: igdbGame.game_engines?.[0]?.name || "",
      franchise: igdbGame.franchises?.[0]?.name || "",

      // Story
      story: igdbGame.summary || igdbGame.storyline || "",

      // Enhanced Gallery with metadata
      gallery: [
        // Videos
        ...(igdbGame.videos?.map(video => ({
          url: `https://www.youtube.com/watch?v=${video.video_id}`,
          type: "video",
          mediaType: "video",
          title: video.name || "Game Trailer",
          description: `Official trailer from IGDB`,
          dateAdded: igdbGame.first_release_date
              ? new Date(igdbGame.first_release_date * 1000).toISOString().split('T')[0]
              : "",
          source: `https://www.youtube.com/watch?v=${video.video_id}`,
          edited: false,
          meta: [
            { label: "Type", value: "Video Trailer" },
            { label: "Source", value: "IGDB" },
            { label: "Platform", value: "YouTube" },
            { label: "Quality", value: "Official" }
          ]
        })) || []),

        // Artworks
        ...(igdbGame.artworks?.map(artwork => ({
          url: `https:${artwork.url.replace('t_thumb', 't_1080p')}`,
          type: "image",
          mediaType: "image",
          title: "Official Artwork",
          description: `Official artwork from IGDB`,
          dateAdded: igdbGame.first_release_date
              ? new Date(igdbGame.first_release_date * 1000).toISOString().split('T')[0]
              : "",
          source: `https:${artwork.url}`,
          edited: false,
          meta: [
            { label: "Type", value: "Artwork" },
            { label: "Source", value: "IGDB" },
            { label: "Orientation", value: "Landscape" },
            { label: "Quality", value: "High Resolution" }
          ]
        })) || []),

        // Screenshots
        ...(igdbGame.screenshots?.map(screenshot => ({
          url: `https:${screenshot.url.replace('t_thumb', 't_1080p')}`,
          type: "image",
          mediaType: "image",
          title: "Game Screenshot",
          description: `Official screenshot from IGDB`,
          dateAdded: igdbGame.first_release_date
              ? new Date(igdbGame.first_release_date * 1000).toISOString().split('T')[0]
              : "",
          source: `https:${screenshot.url}`,
          edited: false,
          meta: [
            { label: "Type", value: "Screenshot" },
            { label: "Source", value: "IGDB" },
            { label: "Orientation", value: "Landscape" },
            { label: "Quality", value: "High Resolution" }
          ]
        })) || [])
      ],

      // Ratings
      metacriticScore: Math.round(igdbGame.rating || 0),
      userRating: Math.round(igdbGame.rating || 0) / 10,

      // Store Links
      storeLinks: igdbGame.websites?.map(website => {
        const categoryMap = {
          1: 'Official Website',
          13: 'Steam',
          16: 'Epic Games',
          17: 'GOG',
          18: 'Discord'
        };
        const platformName = categoryMap[website.category];
        if (platformName) {
          return {
            platform: platformName,
            url: website.url,
            type: 'digital'
          };
        }
        return null;
      }).filter(link => link !== null) || [],

      // 🆕 Enhanced Language Support from IGDB - BU SATIRI DEĞIŞTIR
      languages: languageData, // Eskiden: languages: { audio: [], subtitles: [], interface: [] },

      // Data source tracking
      dataSource: "igdb",

      // Empty/default fields
      tags: [],
      cast: [],
      crew: [],
      contentWarnings: [],
      awards: [],
      playtime: 0,
      steamLink: "",
      website: igdbGame.websites?.find(w => w.category === 1)?.url || "",
      price: 0,
      dlcs: [],
      inspiration: [],
      officialWebsite: igdbGame.websites?.find(w => w.category === 1)?.url || "",
      estimatedPlaytime: "",
      systemRequirements: { minimum: "", recommended: "" },
    };
  };

  // 🎯 Enhanced RAWG Search
  const searchRAWG = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(
          `https://api.rawg.io/api/games?key=${RAWG_KEY}&search=${encodeURIComponent(searchTerm)}`
      );
      setSearchResults(res.data.results || []);
      console.log("🎯 RAWG Sonuçları:", res.data.results?.length);
    } catch (err) {
      console.error("RAWG search failed", err);
      alert("RAWG arama başarısız oldu. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  // 🎮 IGDB Search
  const searchIGDB = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/igdb/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchResults(res.data || []);
      console.log("🎮 IGDB Sonuçları:", res.data?.length);
    } catch (err) {
      console.error("IGDB search failed", err);
      const errorMsg = err.response?.data?.error || "IGDB arama başarısız oldu";
      alert(`❌ ${errorMsg}\nLütfen Twitch credentials'larınızı kontrol edin.`);
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Enhanced RAWG Game Selection with source tracking
  const selectRawgGame = async (id) => {
    setLoading(true);
    try {
      console.log("🎯 RAWG oyunu seçiliyor:", id);

      const [gameRes, movieRes, screenshotRes] = await Promise.all([
        axios.get(`https://api.rawg.io/api/games/${id}?key=${RAWG_KEY}`),
        axios.get(`https://api.rawg.io/api/games/${id}/movies?key=${RAWG_KEY}`),
        axios.get(`https://api.rawg.io/api/games/${id}/screenshots?key=${RAWG_KEY}`),
      ]);

      const game = gameRes.data;
      const trailer = movieRes.data?.results?.[0]?.data?.max || "";

      // 🆕 Enhanced gallery with metadata and source tracking
      const gallery = [
        // Trailer video if available
        ...(trailer ? [{
          url: trailer,
          title: "Official Trailer",
          artist: "",
          date: game.released || "",
          source: trailer,
          type: "video",
          mediaType: "video",
          edited: false,
          meta: [
            { label: "Type", value: "Trailer" },
            { label: "Source", value: "RAWG" },
            { label: "Quality", value: "HD" }
          ]
        }] : []),

        // Screenshots with enhanced metadata
        ...(screenshotRes.data?.results?.map((img, index) => ({
          url: img.image,
          title: `Screenshot ${index + 1}`,
          artist: "",
          date: game.released || "",
          source: img.image,
          type: "image",
          mediaType: "image",
          edited: false,
          meta: [
            { label: "Type", value: "Screenshot" },
            { label: "Source", value: "RAWG" },
            { label: "Orientation", value: "Landscape" },
            { label: "Quality", value: "High Resolution" }
          ]
        })) || [])
      ];

      const pcPlatform = game.platforms?.find(p => p.platform.slug === "pc");
      const steamStore = game.stores?.find(s => s.store.slug === "steam");

      const payload = {
        title: game.name || "",
        originalTitle: game.name_original || "",
        releaseDate: game.released || "",
        coverImage: game.background_image || "",
        bannerImage: game.background_image || "",  // 🆕 Use same image for banner initially
        trailerUrl: trailer,
        tags: game.tags?.map(t => t.name) || [],
        studio: game.developers?.[0]?.name || "",
        genres: game.genres?.map(g => g.name) || [],
        platforms: game.platforms?.map(p => p.platform.name) || [],
        story: game.description_raw || "",
        engine: game.game_engines?.[0]?.name || "",
        franchise: game.series?.name || "",
        storeLinks: game.stores?.map((s) => ({
          platform: s.store.name,
          url: s.url,
          type: "digital"
        })) || [],
        steamLink: steamStore?.url || "",
        metacriticScore: game.metacritic || 0,
        userRating: game.rating || 0,
        gallery,
        playtime: game.playtime || 0,
        price: 59.99,
        website: game.website || "",
        officialWebsite: game.website || "",
        developer: game.developers?.[0]?.name || "",
        publisher: game.publishers?.[0]?.name || "",
        cast: [],
        crew: [],
        contentWarnings: [],
        awards: [],
        languages: { audio: [], subtitles: [], interface: [] },
        dlcs: [],
        inspiration: [],
        estimatedPlaytime: "",
        systemRequirements: {
          minimum: pcPlatform?.requirements?.minimum || "",
          recommended: pcPlatform?.requirements?.recommended || "",
        },
        dataSource: "rawg"  // 🆕 Track data source
      };

      console.log("🎯 RAWG Payload hazırlandı:", payload.title);
      const save = await axios.post(`${API_BASE}/api/games`, payload);
      onGameAdded(save.data);
      setSearchResults([]);
      setSearchTerm("");
      console.log("✅ RAWG oyunu eklendi:", save.data.title);
    } catch (err) {
      console.error("Failed to fetch or add RAWG game", err);
      alert("❌ RAWG oyunu eklenemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  // 🎮 Enhanced IGDB Game Selection
  const selectIGDBGame = async (game) => {
    setLoading(true);
    try {
      console.log("🎮 IGDB oyunu seçiliyor:", game.name, "ID:", game.id);

      const gameRes = await axios.get(`${API_BASE}/api/igdb/game/${game.id}`);
      const gameData = gameRes.data;

      if (!gameData) {
        throw new Error("IGDB'den oyun detayları alınamadı");
      }

      console.log("🎮 IGDB Detaylı Veri alındı:", gameData.name);

      // 🆕 Language support feedback - BU KISMI EKLE
      if (gameData.language_supports && gameData.language_supports.length > 0) {
        console.log(`🌍 ${gameData.language_supports.length} dil desteği bulundu`);
      } else {
        console.log(`⚠️  ${gameData.name} için IGDB'de dil desteği verisi yok`);
      }

      const payload = transformIGDBData(gameData);

      console.log("🎮 IGDB Payload hazırlandı:", payload.title);
      console.log("📊 Gallery items:", payload.gallery?.length || 0);
      console.log("🌍 Language data:", payload.languages); // 🆕 BU SATIRI EKLE

      const save = await axios.post(`${API_BASE}/api/games`, payload);
      onGameAdded(save.data);
      setSearchResults([]);
      setSearchTerm("");

      // 🆕 User feedback about language support - BU KISMI DEĞIŞTIR
      if (payload.languages.hasIGDBLanguageData) {
        const totalLanguages = payload.languages.audio.length +
            payload.languages.subtitles.length +
            payload.languages.interface.length;
        console.log(`✅ IGDB oyunu başarıyla eklendi: ${save.data.title} (${totalLanguages} dil desteği)`);
      } else {
        console.log(`✅ IGDB oyunu eklendi: ${save.data.title} (dil desteği verisi yok)`);
      }

    } catch (err) {
      console.error("❌ IGDB oyunu eklenemedi:", err);
      const errorMsg = err.response?.data?.error || err.message || "IGDB oyunu eklenemedi";
      alert(`❌ ${errorMsg}\nLütfen tekrar deneyin.`);
    } finally {
      setLoading(false);
    }
  };

  // Unified Search Handler
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      alert("Lütfen arama terimi girin");
      return;
    }

    if (tab === "rawg") {
      searchRAWG();
    } else if (tab === "igdb") {
      searchIGDB();
    }
  };

  // IGDB Helper Functions
  const formatIGDBCover = (coverUrl) => {
    if (!coverUrl) return "/placeholder-game.jpg";
    return `https:${coverUrl.replace('t_thumb', 't_cover_small')}`;
  };

  const formatIGDBDate = (timestamp) => {
    if (!timestamp) return "TBA";
    return new Date(timestamp * 1000).getFullYear();
  };

  const formatRAWGDate = (dateString) => {
    if (!dateString) return "TBA";
    return new Date(dateString).getFullYear();
  };

  // Enhanced result display with gallery count
  const renderGameCard = (game, isRAWG = true) => {
    const handleClick = () => isRAWG ? selectRawgGame(game.id) : selectIGDBGame(game);

    return (
        <div
            key={game.id}
            className={`cursor-pointer bg-gray-800 p-3 rounded-xl shadow hover:scale-105 transition-all border border-gray-700 group ${
                isRAWG ? "hover:border-cyan-400" : "hover:border-purple-400"
            }`}
            onClick={handleClick}
            title="Click to import"
        >
          <div className="relative">
            <img
                src={isRAWG ? game.background_image : formatIGDBCover(game.cover?.url)}
                alt={game.name}
                className="w-full h-32 object-cover rounded mb-2"
                onError={(e) => {
                  e.target.src = "/placeholder-game.jpg";
                }}
            />
            {/* Import overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-200 rounded flex items-center justify-center">
              <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-semibold block">Import</span>
                {!isRAWG && (
                    <span className="text-xs text-gray-300">
                  {game.screenshots?.length || 0} imgs + {game.videos?.length || 0} videos
                </span>
                )}
              </div>
            </div>
            {/* Source badge */}
            <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold ${
                isRAWG ? "bg-cyan-600 text-white" : "bg-purple-600 text-white"
            }`}>
              {isRAWG ? "🎯 RAWG" : "🎮 IGDB"}
            </div>
          </div>

          <p className="text-center text-sm font-semibold line-clamp-2 text-white mb-1">
            {game.name}
          </p>

          <div className="text-center text-xs text-gray-400">
            {isRAWG ? (
                <span>{formatRAWGDate(game.released)}</span>
            ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>{formatIGDBDate(game.first_release_date)}</span>
                  {game.rating && (
                      <span className="text-yellow-400">
                  ⭐ {Math.round(game.rating)}
                </span>
                  )}
                </div>
            )}
          </div>
        </div>
    );
  };

  // Manual Form Handlers
  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManualData((prev) => ({ ...prev, [name]: value }));
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualData.title.trim()) {
      alert("Oyun başlığı gerekli.");
      return;
    }

    try {
      const payload = {
        ...manualData,
        genres: typeof manualData.genres === 'string'
            ? manualData.genres.split(",").map((s) => s.trim()).filter(Boolean)
            : manualData.genres,
        platforms: typeof manualData.platforms === 'string'
            ? manualData.platforms.split(",").map((s) => s.trim()).filter(Boolean)
            : manualData.platforms,
        tags: typeof manualData.tags === 'string'
            ? manualData.tags.split(",").map((s) => s.trim()).filter(Boolean)
            : manualData.tags,
        storeLinks: typeof manualData.storeLinks === 'string'
            ? manualData.storeLinks
                .split("|")
                .map((item) => {
                  const [platform, url] = item.split(",");
                  return {
                    platform: platform?.trim(),
                    url: url?.trim(),
                    type: "digital"
                  };
                })
                .filter((link) => link.platform && link.url)
            : manualData.storeLinks,
        dataSource: "manual"  // 🆕 Set manual data source
      };

      console.log("✏️ Manuel oyun ekleniyor:", payload.title);
      const save = await axios.post(`${API_BASE}/api/games`, payload);
      onGameAdded(save.data);
      setManualData(initialManualData);
      alert("✅ Oyun manuel olarak eklendi.");
      console.log("✅ Manuel oyun eklendi:", save.data.title);
    } catch (err) {
      console.error("Manual add failed", err);
      alert("❌ Manuel oyun eklenirken hata oluştu.");
    }
  };

  return (
      <div className="text-white">
        <h2 className="text-2xl font-bold mb-4 text-cyan-300">Add Game</h2>

        {/* Enhanced Tab Navigation with source info */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <button
              onClick={() => {
                setTab("rawg");
                setSearchResults([]);
                setSearchTerm("");
              }}
              className={`px-4 py-2 rounded flex items-center gap-2 transition-all ${
                  tab === "rawg"
                      ? "bg-cyan-600 text-white shadow-lg"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-300"
              }`}
          >
            🎯 RAWG Database
            <span className="text-xs bg-cyan-700 px-2 py-1 rounded">Screenshots</span>
          </button>
          <button
              onClick={() => {
                setTab("igdb");
                setSearchResults([]);
                setSearchTerm("");
              }}
              className={`px-4 py-2 rounded flex items-center gap-2 transition-all ${
                  tab === "igdb"
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-300"
              }`}
          >
            🎮 IGDB Database
            <span className="text-xs bg-purple-700 px-2 py-1 rounded">Rich Media</span>
          </button>
          <button
              onClick={() => {
                setTab("manual");
                setSearchResults([]);
                setSearchTerm("");
              }}
              className={`px-4 py-2 rounded flex items-center gap-2 transition-all ${
                  tab === "manual"
                      ? "bg-yellow-600 text-white shadow-lg"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-300"
              }`}
          >
            ✏️ Manual Entry
            <span className="text-xs bg-yellow-700 px-2 py-1 rounded">Custom</span>
          </button>
        </div>

        {/* Search Section */}
        {(tab === "rawg" || tab === "igdb") && (
            <>
              <div className="mb-6">
                <div className="flex gap-2 items-center mb-2">
                  <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="p-3 rounded-lg bg-gray-800 text-white flex-1 shadow-inner border border-gray-700 focus:border-cyan-500 focus:outline-none"
                      placeholder={`🔍 Search ${tab === "rawg" ? "RAWG" : "IGDB"} game database...`}
                      disabled={loading}
                  />
                  <button
                      onClick={handleSearch}
                      disabled={loading || !searchTerm.trim()}
                      className={`px-6 py-3 rounded-lg text-white font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                          tab === "rawg"
                              ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                              : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                      }`}
                  >
                    {loading ? "Searching..." : "Search"}
                  </button>
                </div>

                {/* Enhanced Database Info */}
                <div className="text-xs text-gray-400 mb-4 p-3 bg-gray-800/50 rounded-lg">
                  {tab === "rawg" && (
                      <div>
                        <span className="text-cyan-400 font-semibold">🎯 RAWG:</span> Fast search, screenshots, good for popular games.
                        All images will be available in TabBanner for featured section override.
                      </div>
                  )}
                  {tab === "igdb" && (
                      <div>
                        <span className="text-purple-400 font-semibold">🎮 IGDB:</span> Professional database with artworks, trailers, metadata.
                        Rich gallery content perfect for banners and featured sections.
                      </div>
                  )}
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className={`animate-spin w-8 h-8 border-3 border-t-transparent rounded-full mx-auto mb-3 ${
                          tab === "rawg" ? "border-cyan-500" : "border-purple-500"
                      }`}></div>
                      <p className="text-gray-400">
                        Searching {tab === "rawg" ? "RAWG" : "IGDB"} database...
                      </p>
                    </div>
                  </div>
              )}

              {/* Enhanced Results Grid */}
              {!loading && searchResults.length > 0 && (
                  <>
                    <div className="mb-4 text-sm text-gray-400 flex items-center justify-between">
                      <span>Found {searchResults.length} games for "{searchTerm}"</span>
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                  {tab === "rawg" ? "Screenshots will be imported" : "Artworks & videos will be imported"}
                </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {searchResults.map((game) => renderGameCard(game, tab === "rawg"))}
                    </div>
                  </>
              )}

              {/* No Results */}
              {!loading && searchResults.length === 0 && searchTerm && (
                  <div className="text-center py-12 text-gray-400">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-lg mb-2">No games found for "{searchTerm}"</p>
                    <p className="text-sm">Try a different search term or check spelling</p>
                  </div>
              )}

              {/* Initial State */}
              {!loading && searchResults.length === 0 && !searchTerm && (
                  <div className="text-center py-12 text-gray-400">
                    <div className="text-4xl mb-4">
                      {tab === "rawg" ? "🎯" : "🎮"}
                    </div>
                    <p className="text-lg mb-2">
                      Search {tab === "rawg" ? "RAWG" : "IGDB"} Database
                    </p>
                    <p className="text-sm">
                      Enter a game name to start searching
                    </p>
                    <div className="mt-4 text-xs text-gray-500 max-w-md mx-auto">
                      {tab === "rawg" && "Images from RAWG will be available in Banner tab for featured section customization"}
                      {tab === "igdb" && "Rich media from IGDB including artworks and trailers will be available for banner overrides"}
                    </div>
                  </div>
              )}
            </>
        )}

        {/* Enhanced Manual Entry Tab */}
        {tab === "manual" && (
            <div className="max-w-4xl">
              <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                <h3 className="text-yellow-400 font-semibold mb-2">Manual Entry Instructions</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Separate multiple values with commas (genres, platforms, tags)</li>
                  <li>• Store links format: "Platform,URL | Platform2,URL2"</li>
                  <li>• Use YYYY-MM-DD format for release date</li>
                  <li>• 🆕 Manual entries can be enhanced later with TabBanner overrides</li>
                </ul>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                      name="title"
                      placeholder="Game Title *"
                      value={manualData.title}
                      onChange={handleManualChange}
                      required
                      className="bg-gray-800 text-white p-3 rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  />
                  <input
                      name="originalTitle"
                      placeholder="Original Title"
                      value={manualData.originalTitle}
                      onChange={handleManualChange}
                      className="bg-gray-800 text-white p-3 rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  />
                  <input
                      name="coverImage"
                      placeholder="Cover Image URL"
                      value={manualData.coverImage}
                      onChange={handleManualChange}
                      className="bg-gray-800 text-white p-3 rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  />
                  <input
                      name="bannerImage"
                      placeholder="Banner Image URL (for featured section)"
                      value={manualData.bannerImage}
                      onChange={handleManualChange}
                      className="bg-gray-800 text-white p-3 rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  />
                  <input
                      name="releaseDate"
                      type="date"
                      value={manualData.releaseDate}
                      onChange={handleManualChange}
                      className="bg-gray-800 text-white p-3 rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  />
                  <input
                      name="genres"
                      placeholder="Genres (comma separated)"
                      value={manualData.genres}
                      onChange={handleManualChange}
                      className="bg-gray-800 text-white p-3 rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  />
                  <input
                      name="platforms"
                      placeholder="Platforms (comma separated)"
                      value={manualData.platforms}
                      onChange={handleManualChange}
                      className="bg-gray-800 text-white p-3 rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  />
                  <input
                      name="developer"
                      placeholder="Developer"
                      value={manualData.developer}
                      onChange={handleManualChange}
                      className="bg-gray-800 text-white p-3 rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  />
                  <input
                      name="publisher"
                      placeholder="Publisher"
                      value={manualData.publisher}
                      onChange={handleManualChange}
                      className="bg-gray-800 text-white p-3 rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  />
                  <input
                      name="studio"
                      placeholder="Studio"
                      value={manualData.studio}
                      onChange={handleManualChange}
                      className="bg-gray-800 text-white p-3 rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  />
                  <input
                      name="metacriticScore"
                      type="number"
                      placeholder="Metacritic Score"
                      value={manualData.metacriticScore}
                      onChange={handleManualChange}
                      className="bg-gray-800 text-white p-3 rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                  />
                </div>

                <input
                    name="trailerUrl"
                    placeholder="Trailer URL"
                    value={manualData.trailerUrl}
                    onChange={handleManualChange}
                    className="w-full bg-gray-800 text-white p-3 rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                />

                <input
                    name="tags"
                    placeholder="Tags (comma separated)"
                    value={manualData.tags}
                    onChange={handleManualChange}
                    className="w-full bg-gray-800 text-white p-3 rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                />

                <textarea
                    name="story"
                    placeholder="Description / Story"
                    rows={4}
                    value={manualData.story}
                    onChange={handleManualChange}
                    className="w-full bg-gray-800 text-white p-3 rounded border border-gray-600 focus:border-yellow-500 focus:outline-none resize-y"
                />

                <input
                    name="storeLinks"
                    placeholder="Store Links (Platform,URL | Platform2,URL2)"
                    value={manualData.storeLinks}
                    onChange={handleManualChange}
                    className="w-full bg-gray-800 text-white p-3 rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
                />

                <div className="flex justify-end pt-4">
                  <button
                      type="submit"
                      className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-8 py-3 rounded-lg transition-all hover:scale-105"
                  >
                    Add Game Manually
                  </button>
                </div>
              </form>
            </div>
        )}
      </div>
  );
};

export default AddGame;