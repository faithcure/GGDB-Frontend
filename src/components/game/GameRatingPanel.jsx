import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star, Users } from "lucide-react";
import { API_BASE } from "../../config/api";

const CATEGORIES = [
  { key: "music", label: "Music & Sound" },
  { key: "story", label: "Story & Writing" },
  { key: "gameplay", label: "Gameplay" },
  { key: "visuals", label: "Visuals" },
  { key: "bugs", label: "Bugs & Stability" },
  { key: "replayability", label: "Replayability" },
];

const isUserValid = (user) => {
  // null, undefined, boş obje veya id'si olmayanlar geçersiz
  return user && typeof user === "object" && Object.keys(user).length > 0 && user._id;
};

const GameRatingPanel = ({
  gameId,
  user,
  dominantColor = "#1e1e1e",
  onAverageCalculated,
}) => {
  const defaultScores = Object.fromEntries(CATEGORIES.map(({ key }) => [key, 0]));
  const [scores, setScores] = useState(defaultScores);
  const [hovered, setHovered] = useState({});
  const [avgScores, setAvgScores] = useState({ average: {}, total: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);


  // Kendi rating'ini çek (üye ise)
  useEffect(() => {
    if (!isUserValid(user)) return;
    const fetchUserRating = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(`${API_BASE}/api/ratings/${gameId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const safe = res.data?.scores || {};
        setScores((prev) => ({ ...prev, ...safe }));
      } catch (err) {
        console.warn("No previous rating");
      }
    };
    fetchUserRating();
  }, [gameId, user]);

  // Ortalama rating'i çek
  useEffect(() => {
    const fetchAvg = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/ratings/avg/${gameId}`);
        setAvgScores(res.data);
      } catch (err) {
        console.error("Failed to fetch average", err);
      }
    };
    fetchAvg();
  }, [gameId]);

  // Rating güncelleme fonksiyonu (Sadece giriş yapmışsa puan gönderecek!)
  const updateRating = async (updatedScores) => {
    const token = localStorage.getItem("token");
    if (!user || !user._id || !token) {
      setShowLoginAlert(true);
      return;
    }
    setSubmitting(true);
    try {
      setScores(updatedScores);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found!");
      await axios.post(
        `${API_BASE}/api/ratings/${gameId}`,
        { scores: updatedScores },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = await axios.get(`${API_BASE}/api/ratings/avg/${gameId}`);
      setAvgScores(res.data);
    } catch (err) {
      console.error("Submit failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Yıldız ikonları (her zaman gözüküyor)
  const renderStars = (key) => {
    const current = scores[key];
    const over = hovered[key] ?? -1;
    return (
      <div className="flex gap-1 mt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={20}
            className={`cursor-pointer transition-transform duration-150 hover:scale-125 ${
              (over >= 0 ? i <= over : i < Math.round(current / 2))
                ? "text-yellow-400 fill-yellow-400 drop-shadow"
                : "text-gray-700"
            }`}
            onMouseEnter={() => setHovered((prev) => ({ ...prev, [key]: i }))}
            onMouseLeave={() => setHovered((prev) => ({ ...prev, [key]: -1 }))}
            onClick={() => updateRating({ ...scores, [key]: (i + 1) * 2 })}
          />
        ))}
      </div>
    );
  };

  const averageCommunityScore =
    avgScores &&
    avgScores.average &&
    Object.values(avgScores.average).length > 0
      ? Math.min(
          10,
          Object.values(avgScores.average).reduce((acc, val) => acc + val, 0) /
            CATEGORIES.length
        )
      : 0;

  useEffect(() => {
    if (typeof onAverageCalculated === "function") {
      onAverageCalculated(averageCommunityScore);
    }
  }, [averageCommunityScore, onAverageCalculated]);

  // Login Alert Popup
  const LoginAlert = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
      <div className="bg-gray-900 p-8 rounded-xl shadow-xl text-center max-w-xs w-full">
        <div className="mb-4 text-yellow-400 text-3xl">⚠️</div>
        <div className="text-white mb-4 font-semibold">
          Please login before rating!
        </div>
        <button
          className="bg-yellow-400 text-black font-bold px-6 py-2 rounded-lg hover:bg-yellow-500 transition"
          onClick={() => setShowLoginAlert(false)}
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 border-t border-gray-800">
      {/* Giriş yap uyarısı */}
      {showLoginAlert && <LoginAlert />}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {CATEGORIES.map(({ key, label }) => (
          <div
            key={key}
            className="rounded-xl p-5 border border-yellow-400/10 shadow-md backdrop-blur-md hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
            style={{
              background: `linear-gradient(to bottom right, ${dominantColor}, #0a0a0a)`,
            }}
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-yellow-400/10 to-yellow-600/5 opacity-0 group-hover:opacity-100 transition duration-300 blur-lg pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-white text-sm tracking-wide leading-tight">
                  {label}
                </h3>
                <span className="bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded text-xs font-mono">
                  {scores[key]}/10
                </span>
              </div>
              {renderStars(key)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-white/10 pt-6">
        <div className="flex justify-between text-sm text-white/80 font-medium mb-2">
          <div className="flex gap-2 items-center">
            <Users size={16} /> Overall Community Rating
          </div>
          <div className="text-yellow-400 font-bold">
            {averageCommunityScore.toFixed(1)} / 10
          </div>
        </div>
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${Math.min(
                100,
                (averageCommunityScore / 10) * 100
              )}%`,
            }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default GameRatingPanel;
