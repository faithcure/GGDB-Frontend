import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  FaChevronLeft, FaChevronRight, FaArrowLeft, FaFlag,
  FaHeart, FaThumbsDown, FaShareAlt, FaEye
} from "react-icons/fa";

const MediaPreviewPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialIndex = parseInt(searchParams.get("media")) || 0;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showInfo, setShowInfo] = useState(true);
  const [mediaList, setMediaList] = useState([]);
  const [gameTitle, setGameTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState("");

  // Klavye navigasyonu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") navigate(-1);
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
    // eslint-disable-next-line
  }, [mediaList, currentIndex]);

  // Galeri verisini çek
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/games/${id}`
        );
        const data = await res.json();
        if (Array.isArray(data.gallery)) {
          setMediaList(data.gallery);
          setGameTitle(data.title || "Unknown Game");
          setReleaseYear(data.releaseDate?.slice(0, 4) || "");
        }
      } catch (error) {
        console.error("Failed to load media", error);
      }
    };
    fetchGallery();
  }, [id]);

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % (mediaList.length || 1));
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + (mediaList.length || 1)) % (mediaList.length || 1));

  const media = mediaList[currentIndex] || {};

  // Video/Resim mi otomatik algıla
  const isVideo = (item) => {
    if (!item?.url) return false;
    return (
      item.type === "video" ||
      /\.(mp4|webm|ogg)$/i.test(item.url) ||
      /(youtube\.com|youtu\.be|vimeo\.com)/i.test(item.url)
    );
  };

  // Youtube embed fonksiyonu
  const getYoutubeEmbed = (url) => {
    const match =
      url &&
      url.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+|(?:v|embed)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      );
    return match ? `https://www.youtube.com/embed/${match[1]}?rel=0&showinfo=0&modestbranding=1` : null;
  };

  // Vimeo embed fonksiyonu
  const getVimeoEmbed = (url) => {
    const match = url && url.match(/vimeo\.com\/(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}` : null;
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen w-full flex flex-col justify-between fixed inset-0 z-50">
      {/* Üst bar */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white text-sm px-4 py-1 bg-zinc-800/90 rounded-full hover:bg-zinc-700"
        >
          <FaArrowLeft /> <span>Return</span>
        </button>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-sm bg-zinc-800 text-white px-3 py-1 rounded-full hover:bg-zinc-700 flex items-center gap-2"
        >
          <FaEye className="text-sm" /> {showInfo ? "Hide Info" : "Show Info"}
        </button>
      </div>

      {/* Medya gösterimi */}
      <div className="flex-1 flex items-center justify-center px-4">
        <button
          onClick={handlePrev}
          className="text-3xl px-4 text-gray-500 hover:text-white"
        >
          <FaChevronLeft />
        </button>

        <div className="flex-1 flex justify-center items-center">
          {!media.url ? null
            : isVideo(media) && getYoutubeEmbed(media.url) ? (
              <iframe
                src={getYoutubeEmbed(media.url)}
                frameBorder="0"
                allow="encrypted-media"
                allowFullScreen
                className="rounded-xl w-full h-[60vh]"
                title={`YouTube Video ${currentIndex}`}
              />
            ) : isVideo(media) && getVimeoEmbed(media.url) ? (
              <iframe
                src={getVimeoEmbed(media.url)}
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
                className="rounded-xl w-full h-[60vh]"
                title={`Vimeo Video ${currentIndex}`}
              />
            ) : isVideo(media) ? (
              <video
                src={media.url}
                controls
                autoPlay
                className="max-h-[75vh] w-full rounded-md shadow-2xl border border-zinc-700"
              />
            ) : (
              <img
                src={media.url}
                alt={media.title || "preview"}
                className="max-h-[75vh] object-contain rounded-md shadow-2xl border border-zinc-700"
              />
            )}
        </div>

        <button
          onClick={handleNext}
          className="text-3xl px-4 text-gray-500 hover:text-white"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Alt bilgi paneli */}
      {showInfo && (
        <div className="w-full bg-zinc-900/80 border-t border-zinc-800 pt-6 px-6 pb-8 relative">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:justify-between md:gap-10">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-yellow-400 rounded" />
                <h2 className="text-2xl font-semibold text-white">
                  {gameTitle}{" "}
                  <span className="text-zinc-400 text-base">
                    ({releaseYear})
                  </span>
                </h2>
              </div>

              {/* Sadece DB'den gelen alanlar boş değilse göster */}
              {media.title && (
                <p className="text-sm text-zinc-400 italic">
                  Scene: <span className="text-white">{media.title}</span>
                </p>
              )}
              {media.artist && (
                <p className="text-sm text-zinc-400">
                  Artist: <span className="text-white">{media.artist}</span>
                </p>
              )}
              {media.date && (
                <p className="text-sm text-zinc-400">
                  Date: <span className="text-white">{media.date}</span>
                </p>
              )}

              {/* Meta bilgileri varsa göster */}
              {(media.meta || []).length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 text-sm text-zinc-400 mt-2">
                  {media.meta.map((meta, i) => (
                    <p key={i}>
                      {meta.label}:{" "}
                      <span className="text-white">{meta.value}</span>
                    </p>
                  ))}
                </div>
              )}

              {/* Medya sayısı ve source her zaman gösterilsin */}
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 text-sm text-zinc-400 mt-2">
                <p>
                  Media {currentIndex + 1} / {mediaList.length}
                </p>
                <p>
                  Source:{" "}
                  <a
                    href={media.source || media.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    Visit
                  </a>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between mt-6 md:mt-0 gap-4">
              <div className="flex gap-4 text-lg text-zinc-500">
                <button className="hover:text-pink-500" title="Like">
                  <FaHeart />
                </button>
                <button className="hover:text-yellow-500" title="Dislike">
                  <FaThumbsDown />
                </button>
                <button className="hover:text-red-500" title="Report">
                  <FaFlag />
                </button>
                <button className="hover:text-blue-400" title="Publish">
                  <FaShareAlt />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPreviewPage;
