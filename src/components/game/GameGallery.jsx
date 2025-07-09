import { Link } from "react-router-dom";
import React, { useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaPlay, FaExpand } from "react-icons/fa";

// Video mu, resim mi tespit et
const isVideo = (item) => {
  if (!item?.url) return false;
  return (
      item.type === "video" ||
      /\.(mp4|webm|ogg)$/i.test(item.url) ||
      /(youtube\.com|youtu\.be|vimeo\.com)/i.test(item.url)
  );
};

// YouTube video ID'sini çıkarır
const getYoutubeId = (url) => {
  const match =
      url.match(
          /(?:youtube\.com\/(?:[^\/]+\/.+|(?:v|embed)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      ) || [];
  return match[1] || "";
};

const GameGallery = ({ images = [], id }) => {
  const scrollRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [loadedVideos, setLoadedVideos] = useState(new Set());
  const [activeFilter, setActiveFilter] = useState("all");

  if (!images.length) return null;

  // IGDB kategorilerini tespit et
  const getIGDBCategory = (item) => {
    // Meta bilgisinden kategoriyi al
    if (item.meta && Array.isArray(item.meta)) {
      const typeField = item.meta.find(m => m.label === "Type");
      if (typeField && typeField.value) {
        return typeField.value.toLowerCase();
      }
    }

    // Category field'ı varsa onu kullan
    if (item.category) return item.category.toLowerCase();

    // Title'dan çıkarmaya çalış
    if (item.title) {
      const title = item.title.toLowerCase();
      if (title.includes("trailer")) return "trailer";
      if (title.includes("artwork")) return "artwork";
      if (title.includes("screenshot")) return "screenshot";
      if (title.includes("concept")) return "concept art";
      if (title.includes("key art")) return "key art";
      if (title.includes("logo")) return "logos";
    }

    return "image";
  };

  // Filtreleme
  const filteredImages = images.filter(item => {
    if (activeFilter === "all") return true;
    if (activeFilter === "videos") return isVideo(item);
    if (activeFilter === "images") {
      // Kategorize edilmemiş image'lar için
      return !isVideo(item) && getIGDBCategory(item) === "image";
    }

    // Belirli kategoriler için
    if (!isVideo(item)) {
      return getIGDBCategory(item) === activeFilter;
    }

    return false;
  });

  // Kategori sayıları ve dinamik tab oluşturma
  const videos = images.filter(item => isVideo(item));
  const imageItems = images.filter(item => !isVideo(item));

  // Tüm benzersiz kategorileri topla
  const categories = [...new Set(imageItems
      .map(item => getIGDBCategory(item))
      .filter(category => category !== "image") // Generic "image" kategorisini hariç tut
  )];

  // Tab listesini dinamik olarak oluştur
  const filterTabs = [
    { key: "all", label: "All", count: images.length }
  ];

  if (videos.length > 0) {
    filterTabs.push({ key: "videos", label: "Videos", count: videos.length });
  }

  // IGDB kategorilerini ekle
  const categoryMap = {
    "screenshot": "Screenshots",
    "artwork": "Artworks",
    "concept art": "Concept Art",
    "key art": "Key Art",
    "logos": "Logos",
    "trailer": "Trailers"
  };

  categories.forEach(category => {
    const categoryCount = imageItems.filter(item => getIGDBCategory(item) === category).length;

    if (categoryCount > 0) {
      const label = categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
      filterTabs.push({ key: category, label, count: categoryCount });
    }
  });

  // Eğer kategorize edilmemiş image'lar varsa "Images" tab'ı ekle
  const uncategorizedCount = imageItems.filter(item => getIGDBCategory(item) === "image").length;
  if (uncategorizedCount > 0 && categories.length > 0) {
    filterTabs.push({ key: "images", label: "Images", count: uncategorizedCount });
  } else if (imageItems.length > 0 && categories.length === 0) {
    filterTabs.push({ key: "images", label: "Images", count: imageItems.length });
  }

  const scroll = (direction) => {
    if (scrollRef.current) {
      const itemWidth = 320;
      const scrollAmount = itemWidth * 2;
      const newScroll =
          direction === "left"
              ? scrollRef.current.scrollLeft - scrollAmount
              : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({ left: newScroll, behavior: "smooth" });
    }
  };

  const handleVideoLoad = (index) => {
    setLoadedVideos(prev => new Set([...prev, index]));
  };

  return (
      <section className="max-w-7xl mx-auto px-4 py-12 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Media Gallery</h2>
            <p className="text-gray-400 text-sm">
              {filteredImages.length} {filteredImages.length === 1 ? 'item' : 'items'}
              {activeFilter !== "all" && ` • Filtered by ${activeFilter}`}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center border-b border-gray-700 mb-8">
          {filterTabs.map((filter) => (
              <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`relative px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 mr-6 ${
                      activeFilter === filter.key
                          ? "text-white border-white"
                          : "text-gray-400 border-transparent hover:text-gray-200 hover:border-gray-500"
                  }`}
              >
                {filter.label}
                <span className="ml-2 text-xs text-gray-500">
                  {filter.count}
                </span>
              </button>
          ))}
        </div>

        {/* Gallery Container */}
        <div className="relative group">
          {/* Navigation Buttons */}
          {filteredImages.length > 4 && (
              <>
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/80 backdrop-blur-sm p-3 rounded-full
                       hover:bg-black/90 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110
                       shadow-lg border border-white/10"
                >
                  <FaChevronLeft className="text-white w-5 h-5" />
                </button>

                <button
                    onClick={() => scroll("right")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/80 backdrop-blur-sm p-3 rounded-full
                       hover:bg-black/90 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110
                       shadow-lg border border-white/10"
                >
                  <FaChevronRight className="text-white w-5 h-5" />
                </button>
              </>
          )}

          {/* Scrollable Gallery */}
          <div
              ref={scrollRef}
              className="flex overflow-x-auto space-x-6 pb-4 px-2 scrollbar-hide scroll-smooth"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                scrollSnapType: "x mandatory"
              }}
          >
            {filteredImages.map((item, filteredIndex) => {
              // Orijinal images array'indeki gerçek index'i bul
              const originalIndex = images.findIndex(originalItem => originalItem === item);

              return (
                  <Link
                      key={originalIndex}
                      to={`/preview/game/${id}?media=${originalIndex}&filter=${activeFilter}`}
                      className="block flex-shrink-0 scroll-snap-align-start"
                      onMouseEnter={() => setHoveredIndex(originalIndex)}
                      onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="relative group/item overflow-hidden rounded-xl bg-gray-900/50 border border-white/10
                            hover:border-white/30 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20">

                      {/* Media Content */}
                      <div className="relative w-80 h-48">
                        {isVideo(item) ? (
                            // --- Video Thumbnail ---
                            item.url && item.url.includes("youtube") ? (
                                // YouTube thumbnail
                                <div className="relative w-full h-full">
                                  <img
                                      src={`https://img.youtube.com/vi/${getYoutubeId(item.url)}/maxresdefault.jpg`}
                                      alt="YouTube Thumbnail"
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                                      onError={(e) => {
                                        e.target.src = `https://img.youtube.com/vi/${getYoutubeId(item.url)}/mqdefault.jpg`;
                                      }}
                                  />
                                  {/* YouTube Play Button */}
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-red-600 hover:bg-red-700 rounded-full p-4 transition-all duration-200
                                        shadow-lg hover:shadow-xl hover:scale-110">
                                      <FaPlay className="text-white w-6 h-6 ml-1" />
                                    </div>
                                  </div>
                                </div>
                            ) : /\.(mp4|webm|ogg)$/i.test(item.url) ? (
                                // Native video file
                                <div className="relative w-full h-full">
                                  <video
                                      src={item.url}
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                                      autoPlay={hoveredIndex === originalIndex}
                                      loop
                                      muted
                                      playsInline
                                      preload="metadata"
                                      onLoadedData={() => handleVideoLoad(originalIndex)}
                                  />
                                  {/* Video Label */}
                                  <div className="absolute top-3 left-3">
                                    <div className="bg-red-600/90 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-medium">
                                      VIDEO
                                    </div>
                                  </div>
                                  {!loadedVideos.has(originalIndex) && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                                      </div>
                                  )}
                                </div>
                            ) : (
                                // Vimeo or unknown video
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-red-400">
                                  <div className="text-6xl mb-2">▶</div>
                                  <span className="text-lg font-bold">Video</span>
                                  <span className="text-xs text-gray-400 mt-1">External Source</span>
                                </div>
                            )
                        ) : (
                            // --- Image ---
                            <div className="relative w-full h-full">
                              <img
                                  src={item.url}
                                  alt={item.title || `Screenshot ${originalIndex + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                                  loading="lazy"
                              />
                              {/* Image Type Label */}
                              <div className="absolute top-3 left-3">
                                <div className={`backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-medium ${
                                    (() => {
                                      const category = getIGDBCategory(item);
                                      return category === "artwork" ? "bg-purple-600/90" :
                                          category === "screenshot" ? "bg-blue-600/90" :
                                              category === "concept art" ? "bg-green-600/90" :
                                                  category === "key art" ? "bg-pink-600/90" :
                                                      category === "logos" ? "bg-yellow-600/90" :
                                                          category === "trailer" ? "bg-red-600/90" :
                                                              "bg-gray-600/90";
                                    })()
                                }`}>
                                  {(() => {
                                    const category = getIGDBCategory(item);
                                    const labelMap = {
                                      "screenshot": "SCREENSHOT",
                                      "artwork": "ARTWORK",
                                      "concept art": "CONCEPT ART",
                                      "key art": "KEY ART",
                                      "logos": "LOGO",
                                      "trailer": "TRAILER",
                                      "image": "IMAGE"
                                    };
                                    return labelMap[category] || category.toUpperCase();
                                  })()}
                                </div>
                              </div>
                            </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300
                                flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover/item:scale-100
                                  transition-transform duration-200">
                            <FaExpand className="text-white w-5 h-5" />
                          </div>
                        </div>

                        {/* Index Number */}
                        <div className="absolute bottom-3 right-3">
                          <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded">
                          <span className="text-white text-xs font-medium">
                            {filteredIndex + 1}/{filteredImages.length}
                          </span>
                          </div>
                        </div>
                      </div>

                      {/* Media Info */}
                      <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-white font-medium text-sm truncate">
                          {item.title || (isVideo(item) ? `Video ${originalIndex + 1}` : `Screenshot ${originalIndex + 1}`)}
                        </h3>
                        {item.description && (
                            <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                              {item.description}
                            </p>
                        )}
                      </div>
                    </div>
                  </Link>
              )
            })}
          </div>

          {/* Empty State */}
          {filteredImages.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4 text-gray-600">📷</div>
                <h3 className="text-xl font-semibold text-white mb-2">No {activeFilter} found</h3>
                <p className="text-gray-400">Try selecting a different filter or add more media.</p>
              </div>
          )}

          {/* Scroll Indicators */}
          {filteredImages.length > 4 && (
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: Math.ceil(filteredImages.length / 4) }).map((_, i) => (
                    <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-white/20 hover:bg-white/40 cursor-pointer transition-colors"
                        onClick={() => {
                          const scrollAmount = scrollRef.current.clientWidth * i;
                          scrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
                        }}
                    />
                ))}
              </div>
          )}
        </div>
      </section>
  );
};

export default GameGallery;