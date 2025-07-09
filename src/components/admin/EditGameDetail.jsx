// 📁 components/admin/GameEdit/EditGameDetail.jsx - Updated with Languages tab (Design preserved)
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CoverImage from "./GameEdit/CoverImage";
import TabNavigation from "./GameEdit/TabNavigation";
import TabOverview from "./GameEdit/TabOverview";
import TabCreative from "./GameEdit/TabCreative";
import TabSystem from "./GameEdit/TabSystem";
import TabLanguages from "./GameEdit/TabLanguages"; // 🆕 New Languages Tab
import TabStore from "./GameEdit/TabStore";
import TabMedia from "./GameEdit/TabMedia";
import TabCredits from "./GameEdit/TabCredits";
import TabReview from "./GameEdit/TabReview";
import TabTrivia from "./GameEdit/TabTrivia";
import TabAwards from "./GameEdit/TabAwards";
import TabBanner from "./GameEdit/TabBanner";
import { API_BASE } from "../../config/api";

// 🆕 Updated tabs array with separate System & Languages
const tabs = [
  "Overview",
  "Creative & Story",
  "Awards",
  "System", // ✏️ System requirements & content rating only
  "Languages", // 🆕 Language support management
  "Store Links",
  "Media",
  "Credits",
  "Review",
  "Trivia",
  "Banner / Trailer", // ← yeni tab burada
];

const formatList = (arr) => Array.isArray(arr) && arr.length ? arr.join(", ") : "-";

const EditGameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(null);

  const normalizeAwards = (rawAwards) => {
    if (!Array.isArray(rawAwards)) return [];
    if (typeof rawAwards[0] === "string") {
      return rawAwards.map(str => ({ title: str }));
    }
    return rawAwards;
  };

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/games/${id}`);
        const gameData = res.data;

        // Awards normalization
        gameData.awards = normalizeAwards(gameData.awards);

        // Language data initialization if missing
        if (!gameData.languages) {
          gameData.languages = {
            audio: [],
            subtitles: [],
            interface: [],
            hasIGDBLanguageData: false
          };
        }

        setGame(gameData);
        setFormData(gameData);
      } catch (err) {
        console.error("Failed to load game", err);
        navigate("/notfound");
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id, navigate]);

  const handleSave = async () => {
    try {
      const res = await axios.put(`${API_BASE}/api/games/${game._id}`, formData);
      setGame(res.data);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to save changes", err);
      alert("An error occurred while saving.");
    }
  };

  if (loading) return <p className="text-white p-8">Loading...</p>;
  if (!game) return <p className="text-white p-8">Game not found.</p>;

  return (
      <div className="bg-gray-950 min-h-screen text-white px-8 pt-28 pb-16">
        <CoverImage coverImage={game.coverImage} />

        {/* Game Info Panel - Right after cover image */}
        <GameInfoPanel game={game} formData={formData} />

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-yellow-400">🎮 {formData?.title || game.title}</h1>
          <div className="flex gap-4">
            <button onClick={() => navigate(-1)} className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700">← Back</button>
            <a
                href={`${window.location.origin}/game/${game._id}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded shadow mr-auto"
            >
              🌐 View Game Page
            </a>
            <button
                onClick={editMode ? handleSave : () => setEditMode(true)}
                className={`${
                    editMode ? "bg-green-500 hover:bg-green-400" : "bg-yellow-400 hover:bg-yellow-300"
                } text-black font-semibold px-6 py-2 rounded`}
            >
              {editMode ? "💾 Save" : "✏️ Edit"}
            </button>
          </div>
        </div>

        <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className={`${activeTab === "Media" ? "" : "grid grid-cols-1 md:grid-cols-2"} gap-8 text-sm`}>
          {activeTab === "Overview" && (
              <TabOverview
                  game={game}
                  formatList={formatList}
                  editMode={editMode}
                  formData={formData}
                  setFormData={setFormData}
              />
          )}
          {activeTab === "Creative & Story" && (
              <TabCreative
                  game={game}
                  formatList={formatList}
                  editMode={editMode}
                  formData={formData}
                  setFormData={setFormData}
              />
          )}
          {activeTab === "Awards" && (
              <TabAwards
                  game={game}
                  editMode={editMode}
                  formData={formData}
                  setFormData={setFormData}
              />
          )}
          {/* 🆕 Updated - System tab only (no languages) */}
          {activeTab === "System" && (
              <TabSystem
                  game={game}
                  formatList={formatList}
                  editMode={editMode}
                  formData={formData}
                  setFormData={setFormData}
              />
          )}
          {/* 🆕 New Languages Tab */}
          {activeTab === "Languages" && (
              <TabLanguages
                  game={game}
                  formatList={formatList}
                  editMode={editMode}
                  formData={formData}
                  setFormData={setFormData}
              />
          )}
          {activeTab === "Store Links" && (
              <TabStore game={game} editMode={editMode} formData={formData} setFormData={setFormData} />
          )}
          {activeTab === "Media" && (
              <TabMedia game={game} editMode={editMode} formData={formData} setFormData={setFormData} />
          )}
          {activeTab === "Credits" && (
              <TabCredits
                  game={game}
                  formatList={formatList}
                  editMode={editMode}
                  formData={formData}
                  setFormData={setFormData}
              />
          )}
          {activeTab === "Review" && (
              <TabReview game={game} editMode={editMode} formData={formData} setFormData={setFormData} />
          )}
          {activeTab === "Trivia" && (
              <TabTrivia game={game} editMode={editMode} formData={formData} setFormData={setFormData} />
          )}
          {activeTab === "Banner / Trailer" && (
              <TabBanner
                  editMode={editMode}
                  formData={formData}
                  setFormData={setFormData}
              />
          )}
        </div>
      </div>
  );
};

export default EditGameDetail;

// Game Info Panel Component
const GameInfoPanel = ({ game, formData }) => {
  // Data source bilgisi
  const getDataSourceInfo = () => {
    const source = game.dataSource || formData?.dataSource || "manual";
    console.log("🔍 Data source detected:", source); // Debug için

    switch (source.toLowerCase()) {
      case "igdb":
        return {
          icon: "🎮",
          label: "IGDB",
          color: "bg-purple-600/20 text-purple-400 border-purple-500/30",
          description: "Data imported from IGDB database"
        };
      case "rawg":
        return {
          icon: "🎯",
          label: "RAWG",
          color: "bg-cyan-600/20 text-cyan-400 border-cyan-500/30",
          description: "Data imported from RAWG API"
        };
      case "manual":
      default:
        return {
          icon: "✏️",
          label: "Manual",
          color: "bg-yellow-600/20 text-yellow-400 border-yellow-500/30",
          description: "Manually entered data"
        };
    }
  };

  // Progress hesaplama
  const calculateProgress = () => {
    const data = formData || game;
    let completed = 0;
    let total = 0;

    // Temel bilgiler (20 puan)
    const basicFields = [
      'title', 'developer', 'publisher', 'releaseDate', 'description'
    ];
    basicFields.forEach(field => {
      total += 4;
      if (data[field] && data[field].toString().trim()) completed += 4;
    });

    // Platformlar ve türler (10 puan)
    total += 5;
    if (data.platforms && data.platforms.length > 0) completed += 2.5;
    total += 5;
    if (data.genres && data.genres.length > 0) completed += 2.5;

    // Medya (15 puan)
    total += 5;
    if (data.coverImage) completed += 5;
    total += 5;
    if (data.screenshots && data.screenshots.length > 0) completed += 5;
    total += 5;
    if (data.trailerUrl) completed += 5;

    // Sistem gereksinimleri (10 puan)
    total += 5;
    if (data.systemRequirements?.minimum) completed += 2.5;
    total += 5;
    if (data.systemRequirements?.recommended) completed += 2.5;

    // Dil desteği (10 puan)
    const hasLanguages = (data.languages?.audio?.length > 0) ||
        (data.languages?.subtitles?.length > 0) ||
        (data.languages?.interface?.length > 0);
    total += 10;
    if (hasLanguages) completed += 10;

    // Store linkler (10 puan)
    const hasStoreLinks = data.steamUrl || data.epicUrl || data.gogUrl;
    total += 10;
    if (hasStoreLinks) completed += 10;

    // Değerlendirmeler (10 puan)
    total += 5;
    if (data.metacriticScore && data.metacriticScore > 0) completed += 5;
    total += 5;
    if (data.ggdbRating && data.ggdbRating > 0) completed += 5;

    // Yaş sınırı ve uyarılar (5 puan)
    total += 2.5;
    if (data.ageRatings && data.ageRatings.length > 0) completed += 2.5;
    total += 2.5;
    if (data.contentWarnings && data.contentWarnings.length > 0) completed += 2.5;

    // İçerik (10 puan)
    total += 5;
    if (data.awards && data.awards.length > 0) completed += 5;
    total += 5;
    if (data.trivia && data.trivia.length > 0) completed += 5;

    const percentage = Math.round((completed / total) * 100);
    return { percentage, completed: Math.round(completed), total: Math.round(total) };
  };

  const sourceInfo = getDataSourceInfo();
  const progress = calculateProgress();

  // Progress bar rengi
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    if (percentage >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getProgressTextColor = (percentage) => {
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 60) return "text-yellow-400";
    if (percentage >= 40) return "text-orange-400";
    return "text-red-400";
  };

  return (
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Game ID */}
          <div className="bg-gray-700/50 rounded p-3">
            <div className="text-gray-400 text-xs mb-1">Game ID</div>
            <div className="text-white font-mono text-sm flex items-center gap-2">
              <span className="text-blue-400">🆔</span>
              {game._id}
            </div>
          </div>

          {/* Data Source */}
          <div className="bg-gray-700/50 rounded p-3">
            <div className="text-gray-400 text-xs mb-1">Data Source</div>
            <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded border ${sourceInfo.color}`}>
              {sourceInfo.icon} {sourceInfo.label}
            </span>
            </div>
            <div className="text-gray-500 text-xs mt-1">{sourceInfo.description}</div>
          </div>

          {/* Completion Progress */}
          <div className="bg-gray-700/50 rounded p-3">
            <div className="text-gray-400 text-xs mb-2">Completion Progress</div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="bg-gray-600 rounded-full h-2 overflow-hidden">
                  <div
                      className={`h-full transition-all duration-500 ${getProgressColor(progress.percentage)}`}
                      style={{ width: `${progress.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className={`text-sm font-semibold ${getProgressTextColor(progress.percentage)}`}>
                {progress.percentage}%
              </div>
            </div>
            <div className="text-gray-500 text-xs mt-1">
              {progress.completed}/{progress.total} fields completed
            </div>
          </div>
        </div>

        {/* Additional Language Info */}
        {game.languages?.hasIGDBLanguageData && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-purple-400">🌍</span>
                <span className="text-purple-400">IGDB Language Data Available</span>
                <span className="text-gray-500">• Language support imported from IGDB</span>
              </div>
            </div>
        )}
      </div>
  );
};