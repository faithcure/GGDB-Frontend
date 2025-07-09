import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import GameBanner from "../components/game/GameBanner";
import GameGallery from "../components/game/GameGallery";
import GameMetaInfo from "../components/game/GameMetaInfo";
import BuyLinks from "../components/game/BuyLinks";
import GameReviews from "../components/game/GameReviews";
import GameCrew from "../components/game/GameCrew";
import TimeToBeatSection from "../components/game/TimeToBeatSection";
// 🔄 Yeni modüler sidebar import
import { GameSidebar } from "../components/game/sidebar";
import GameRatingPanel from "../components/game/GameRatingPanel";
import AwardsList from "../components/game/awards/AwardsList";
import SEOHead from "../components/seo/SEOHead";
import { API_BASE } from "../config/api";

const dummyCrew = [
  { name: "Adam Badowski", role: "Game Director", image: "https://randomuser.me/api/portraits/men/1.jpg" },
  { name: "Patrick Mills", role: "Lead Quest Designer", image: "https://randomuser.me/api/portraits/men/2.jpg" },
  { name: "Borys Pugacz-Muraszkiewicz", role: "Writer", image: "https://randomuser.me/api/portraits/men/3.jpg" },
  { name: "Marcin Przybyłowicz", role: "Composer", image: "https://randomuser.me/api/portraits/men/4.jpg" },
];

const dummyReviews = [
  { user: "gamer42", rating: 5, comment: "Absolutely stunning world-building. Performance improved a lot since launch." },
  { user: "pixelwarrior", rating: 4, comment: "Storyline is deep, visuals are amazing, some bugs still exist though." },
  { user: "noobmaster69", rating: 3, comment: "Not bad, but overhyped. Needed better AI and more freedom in choices." },
];

function getValidUser() {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    if (!user || typeof user !== "object" || Object.keys(user).length === 0 || !user._id) return null;
    return user;
  } catch {
    return null;
  }
}

const GameDetail = () => {
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [crewList, setCrewList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(getValidUser());

  useEffect(() => {
    setUser(getValidUser());
  }, []);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/games/${id}`);
        const fetched = res.data;

        const normalizeType = (platform = "") =>
            platform.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");

        setCrewList(fetched.crewList ?? dummyCrew);

        const merged = {
          ...fetched,
          awards: fetched.awards ?? [],
          whereToBuy: (fetched.storeLinks || []).map(link => ({
            type: normalizeType(link.platform || link.name || ""),
            name: link.platform || link.name || "Store",
            url: link.url,
          })),
          reviews: fetched.reviews ?? dummyReviews,
        };
        setGame(merged);
      } catch (err) {
        console.error("Error fetching game", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/ratings/avg/${game._id}`);
        if (res.data?.average) {
          const avg =
              Object.values(res.data.average).reduce((a, b) => a + b, 0) /
              Object.keys(res.data.average).length;
          setAverageRating(avg);
          setRatingCount(res.data.total);
        }
      } catch (err) {
        console.error("Failed to fetch average rating", err);
      }
    };

    if (game?._id) fetchAverageRating();
  }, [game]);

  const handleCrewUpdate = (updatedCrewList) => {
    console.log("🔄 Crew updated in GameDetail:", updatedCrewList);
    setCrewList(updatedCrewList);

    setGame(prev => ({
      ...prev,
      crewList: updatedCrewList
    }));
  };

  if (loading) return <div className="text-white p-10">Loading...</div>;
  if (!game) return <div className="text-white p-10">Game not found.</div>;

  return (
    <>
      {/* SEO Meta Tags */}
      <SEOHead
        title={game.title}
        description={game.description || `${game.title} - Discover ratings, reviews, and detailed information about this ${game.genres?.join(', ')} game.`}
        keywords={`${game.title}, ${game.genres?.join(', ')}, ${game.platforms?.join(', ')}, gaming, game review`}
        image={game.coverImage}
        url={`/game/${game._id}`}
        type="video.other"
        // Game-specific props
        gameTitle={game.title}
        gameDescription={game.description}
        gameGenres={game.genres || []}
        gamePlatforms={game.platforms || []}
        gameRating={averageRating ? averageRating.toFixed(1) : ''}
        gameReleaseDate={game.releaseDate}
        gameDeveloper={game.developer}
        gamePublisher={game.publisher}
        tags={game.tags || []}
      />
      
      <main className="bg-black text-white min-h-screen">
        <GameBanner game={game} averageRating={averageRating} ratingCount={ratingCount} />
        <section id="gallery">
          <GameGallery images={game.gallery} id={game._id} />
        </section>
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row-reverse gap-10 mt-10">
          <aside className="w-full lg:w-80">
            {/* 🎯 Yeni modüler GameSidebar kullanımı */}
            <GameSidebar
                game={{
                  ...game,
                  ggdbRating: averageRating.toFixed(1),
                  metacriticScore: game.metacriticScore || "86",
                  mainPlaytime: game.mainPlaytime || 25,
                  extrasPlaytime: game.extrasPlaytime || 45,
                  completionPlaytime: game.completionPlaytime || 85,
                  genres: game.genres,
                  tags: game.tags
                }}
                averageRating={averageRating}
                ratingCount={ratingCount}
            />
          </aside>
          <div className="flex-1 space-y-12">
            <section id="meta">
              <GameMetaInfo game={game} />
            </section>
            <section id="rating" className="max-w-10xl mx-auto px-6 mt-8">
              <GameRatingPanel
                  gameId={game._id}
                  user={user}
                  onAverageCalculated={(score) => setAverageRating(score)}
              />
            </section>

            <section id="crew">
              <GameCrew
                  crewList={crewList}
                  gameId={game._id}
                  onCrewUpdate={handleCrewUpdate}
              />
            </section>

            <section id="buy">
              <BuyLinks links={game.whereToBuy} gameTitle={game.title} />
            </section>

            {/* 🆕 Time to Beat Section */}
            <section id="time-to-beat">
              <TimeToBeatSection game={game} />
            </section>

            <section id="reviews">
              <GameReviews reviews={game.reviews} />
            </section>
            {game.awards?.length > 0 && (
                <section id="awards" className="pb-20">
                  <h2 className="text-2xl font-bold text-white mb-6">🏆 Awards & Recognition</h2>
                  <AwardsList awards={game.awards} />
                </section>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default GameDetail;