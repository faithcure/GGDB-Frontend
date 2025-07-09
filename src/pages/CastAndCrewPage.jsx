// src/pages/CastAndCrewPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaUsers, FaArrowLeft, FaEdit, FaSearch } from "react-icons/fa";
import axios from "axios";
import EditContributorsModal from "../components/game/EditContributorsModal";
import { API_BASE } from "../config/api";


const slugify = (text) =>
    text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^Ā-￿\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');

// Helper function for safe image URLs
const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  if (url.length < 4) return false;

  // Accept HTTP/HTTPS URLs, data URLs, and relative paths
  const urlPattern = /^(https?:\/\/|data:image\/|\/|\.\/)/i;
  return urlPattern.test(url.trim());
};

// Helper function for fallback images
const generateFallbackImage = (name) => {
  const safeName = name && typeof name === 'string' ? name : 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(safeName)}&background=random&color=fff&size=40`;
};

// Helper function to check if user is logged in
const isLoggedIn = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user && user._id;
  } catch {
    return false;
  }
};

// Check if user is admin
const isAdmin = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user && user.role && user.role.toLowerCase() === "admin";
  } catch {
    return false;
  }
};

const Section = ({ title, people }) => (
    people?.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-white border-l-4 border-yellow-400 pl-4">{title}</h3>
          </div>
          <div className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
            {people.map((person, i) => (
                <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3 border-b border-white/10 last:border-b-0 hover:bg-white/10 transition"
                >
                  <div className="flex items-center gap-4">
                    <img
                        src={isValidImageUrl(person.image || person.avatar)
                            ? (person.image || person.avatar)
                            : generateFallbackImage(person.name)
                        }
                        alt={person.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                        onError={(e) => {
                          console.log('Avatar load failed for:', person.name, 'URL:', e.target.src);
                          e.target.src = generateFallbackImage(person.name);
                          e.target.onerror = null;
                        }}
                    />
                    <div>
                      <Link to={`/person/${slugify(person.name)}`}>
                        <div className="text-white font-medium leading-tight hover:underline hover:text-yellow-400 transition-colors">
                          {person.name}
                        </div>
                      </Link>
                      <div className="text-white/60 text-sm">{person.role}</div>
                      {isAdmin() && !person.isRegisteredUser && person.isRegisteredUser !== undefined && (
                          <div className="text-yellow-400 text-xs">Guest Contributor</div>
                      )}
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
    )
);

const AdPlaceholder = ({ width = 300, height = 250, label = "Advertisement" }) => (
    <div
        className="bg-gray-800/30 border-2 border-dashed border-gray-600/50 rounded-lg flex flex-col items-center justify-center text-gray-500/70 hover:border-gray-500/70 transition-colors"
        style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div className="text-4xl mb-2">📢</div>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xs mt-1 opacity-70">{width} × {height}</div>
    </div>
);

const CastAndCrewPage = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [crewList, setCrewList] = useState([]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const userIsLoggedIn = isLoggedIn();

  // Fetch game data from backend
  useEffect(() => {
    const fetchGame = async () => {
      try {
        if (!id) {
          setError("Game ID not found in URL");
          setLoading(false);
          return;
        }

        setLoading(true);
        const response = await axios.get(`${API_BASE}/api/games/${id}`);
        setGame(response.data);
        setCrewList(response.data.crewList || []);
      } catch (err) {
        console.error("Error fetching game:", err);
        setError(`Failed to load game data: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  // Filter and search functionality
  const getFilteredAndSortedCrew = () => {
    let filtered = [...crewList];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(person =>
          person.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.role?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Department filter
    if (selectedDepartment !== "all") {
      filtered = filtered.filter(person => {
        const role = person.role?.toLowerCase() || '';

        switch (selectedDepartment) {
          case "direction":
            return role.includes('director');
          case "production":
            return role.includes('producer');
          case "writing":
            return role.includes('writer');
          case "design":
            return role.includes('designer');
          case "art":
            return role.includes('artist') || role.includes('art');
          case "animation":
            return role.includes('animator') || role.includes('animation');
          case "programming":
            return role.includes('programmer') || role.includes('developer');
          case "audio":
            return role.includes('composer') || role.includes('music') || role.includes('sound') || role.includes('audio');
          case "qa":
            return role.includes('qa') || role.includes('test');
          case "localization":
            return role.includes('localization') || role.includes('translation');
          case "cast":
            return role.includes('voice') || role.includes('actor') || role.includes('cast');
          default:
            return true;
        }
      });
    }

    // Default sort by name
    filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    return filtered;
  };

  // Get department options with counts
  const getDepartments = () => {
    const departments = [
      { value: "all", label: "All Departments" },
      { value: "direction", label: "Direction" },
      { value: "production", label: "Production" },
      { value: "writing", label: "Writing" },
      { value: "design", label: "Design" },
      { value: "art", label: "Art" },
      { value: "animation", label: "Animation" },
      { value: "programming", label: "Programming" },
      { value: "audio", label: "Audio & Music" },
      { value: "qa", label: "QA & Testing" },
      { value: "localization", label: "Localization" },
      { value: "cast", label: "Voice Cast" }
    ];

    return departments.map(dept => {
      if (dept.value === "all") {
        return { ...dept, count: crewList.length };
      }

      const count = crewList.filter(person => {
        const role = person.role?.toLowerCase() || '';
        switch (dept.value) {
          case "direction": return role.includes('director');
          case "production": return role.includes('producer');
          case "writing": return role.includes('writer');
          case "design": return role.includes('designer');
          case "art": return role.includes('artist') || role.includes('art');
          case "animation": return role.includes('animator') || role.includes('animation');
          case "programming": return role.includes('programmer') || role.includes('developer');
          case "audio": return role.includes('composer') || role.includes('music') || role.includes('sound') || role.includes('audio');
          case "qa": return role.includes('qa') || role.includes('test');
          case "localization": return role.includes('localization') || role.includes('translation');
          case "cast": return role.includes('voice') || role.includes('actor') || role.includes('cast');
          default: return false;
        }
      }).length;

      return { ...dept, count };
    }).filter(dept => dept.count > 0 || dept.value === "all");
  };

  // Organize crew data by sections
  const organizeCrewData = () => {
    if (!crewList || !Array.isArray(crewList)) return {};

    const organized = {
      directors: [],
      producers: [],
      writers: [],
      designers: [],
      artists: [],
      animators: [],
      programmers: [],
      composers: [],
      sound: [],
      qa: [],
      localization: [],
      cast: []
    };

    crewList.forEach(person => {
      const role = person.role?.toLowerCase() || '';

      if (role.includes('director')) {
        organized.directors.push(person);
      } else if (role.includes('producer')) {
        organized.producers.push(person);
      } else if (role.includes('writer')) {
        organized.writers.push(person);
      } else if (role.includes('designer')) {
        organized.designers.push(person);
      } else if (role.includes('artist') || role.includes('art')) {
        organized.artists.push(person);
      } else if (role.includes('animator') || role.includes('animation')) {
        organized.animators.push(person);
      } else if (role.includes('programmer') || role.includes('developer')) {
        organized.programmers.push(person);
      } else if (role.includes('composer') || role.includes('music')) {
        organized.composers.push(person);
      } else if (role.includes('sound') || role.includes('audio')) {
        organized.sound.push(person);
      } else if (role.includes('qa') || role.includes('test')) {
        organized.qa.push(person);
      } else if (role.includes('localization') || role.includes('translation')) {
        organized.localization.push(person);
      } else if (role.includes('voice') || role.includes('actor') || role.includes('cast')) {
        organized.cast.push(person);
      }
    });

    return organized;
  };

  const handleEditContributors = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveContributors = async (updatedList) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCrewList(updatedList);
        setGame(prev => ({ ...prev, crewList: updatedList }));
        return;
      }

      await axios.put(
          `${API_BASE}/api/games/${id}/contributors`,
          { crewList: updatedList },
          { headers: { Authorization: `Bearer ${token}` } }
      );

      setCrewList(updatedList);
      setGame(prev => ({ ...prev, crewList: updatedList }));
      console.log("✅ Contributors updated successfully!");
    } catch (err) {
      console.error("❌ Error updating contributors:", err);
      setCrewList(updatedList);
      setGame(prev => ({ ...prev, crewList: updatedList }));
    }
  };

  if (loading) return <div className="text-white p-6 min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="text-red-500 p-6 min-h-screen flex items-center justify-center">{error}</div>;
  if (!game) return <div className="text-white p-6 min-h-screen flex items-center justify-center">Game not found</div>;

  const crew = organizeCrewData();
  const filteredCrew = getFilteredAndSortedCrew();
  const totalCount = crewList.length;
  const isFiltering = searchTerm || selectedDepartment !== "all";

  // Calculate stats
  const sectionCounts = {
    cast: crew.cast?.length || 0,
    crew: totalCount - (crew.cast?.length || 0)
  };

  return (
      <div className="text-white min-h-screen" style={{ backgroundColor: 'rgb(14, 15, 17)' }}>
        {/* Hero Banner */}
        <div
            className="relative w-full overflow-hidden border-b border-[#38bdf8]"
            style={{ height: "320px" }}
        >
          <div
              className="absolute inset-0 bg-cover bg-center blur-xl scale-110"
              style={{
                backgroundImage: `url(${game.bannerOverrides?.posterImage || game.coverImage || game.bannerImage})`,
                opacity: 0.28,
              }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

          <div className="relative z-10 max-w-6xl mx-auto flex flex-col justify-end gap-6 h-full px-6 pb-10 pt-20">
            <div className="mb-1">
              <Link
                  to={`/game/${id}`}
                  className="text-white/80 hover:text-white font-bold text-sm flex items-center gap-2 transition-colors"
              >
                <FaArrowLeft className="text-sm" /> Back to Game
              </Link>
            </div>

            <div className="flex items-end gap-8">
              <img
                  src={game.bannerOverrides?.posterImage || game.coverImage}
                  alt={game.title}
                  className="w-24 h-36 object-cover rounded-lg shadow-2xl border-2 border-white/20"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(game.title)}&background=random&color=fff&size=150`;
                  }}
              />
              <div className="flex-1">
                <div className="text-gray-400 text-base mb-2">{game.title}</div>
                <h1 className="text-white text-5xl font-bold mb-6 tracking-tight">
                  Full cast & crew
                </h1>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-yellow-400 text-sm" />
                    <span className="text-white font-semibold">{totalCount}</span>
                    <span className="text-gray-400">Contributors</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-white font-semibold">{sectionCounts.cast}</span>
                    <span className="text-gray-400">Voice Cast</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-white font-semibold">{sectionCounts.crew}</span>
                    <span className="text-gray-400">Development Team</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-white font-semibold">{game.releaseDate ? new Date(game.releaseDate).getFullYear() : 'TBA'}</span>
                  </div>
                </div>
              </div>

              {/* Global Edit Button */}
              {userIsLoggedIn && (
                  <div className="flex items-center">
                    <button
                        onClick={handleEditContributors}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      <FaEdit size={16} />
                      Edit Contributors
                    </button>
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 pt-12 px-4 md:px-8 pb-20">
          <div className="flex-1 min-w-0">
            {/* Filter Section */}
            {totalCount > 0 && (
                <div className="mb-8 bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Filter & Search</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Search</label>
                      <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by name or role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                        />
                        <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                      </div>
                    </div>

                    {/* Department Filter */}
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Department</label>
                      <select
                          value={selectedDepartment}
                          onChange={(e) => setSelectedDepartment(e.target.value)}
                          className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400 transition-colors"
                      >
                        {getDepartments().map(dept => (
                            <option key={dept.value} value={dept.value} className="bg-gray-800">
                              {dept.label} ({dept.count})
                            </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Filter Results Summary */}
                  {isFiltering && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex flex-wrap gap-2 items-center text-sm">
                          <span className="text-white/60">
                            Showing {filteredCrew.length} of {totalCount} contributors
                          </span>
                          <button
                              onClick={() => {
                                setSearchTerm("");
                                setSelectedDepartment("all");
                              }}
                              className="text-blue-400 hover:text-blue-300 underline ml-2"
                          >
                            Clear filters
                          </button>
                        </div>
                      </div>
                  )}
                </div>
            )}

            {/* Content */}
            {isFiltering ? (
                // Filtered Results
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white border-l-4 border-yellow-400 pl-4 mb-4">
                    Search Results ({filteredCrew.length})
                  </h3>
                  {filteredCrew.length > 0 ? (
                      <div className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
                        {filteredCrew.map((person, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between px-4 py-3 border-b border-white/10 last:border-b-0 hover:bg-white/10 transition"
                            >
                              <div className="flex items-center gap-4">
                                <img
                                    src={isValidImageUrl(person.image || person.avatar)
                                        ? (person.image || person.avatar)
                                        : generateFallbackImage(person.name)
                                    }
                                    alt={person.name}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                                    onError={(e) => {
                                      e.target.src = generateFallbackImage(person.name);
                                      e.target.onerror = null;
                                    }}
                                />
                                <div>
                                  <Link to={`/person/${slugify(person.name)}`}>
                                    <div className="text-white font-medium leading-tight hover:underline hover:text-yellow-400 transition-colors">
                                      {person.name}
                                    </div>
                                  </Link>
                                  <div className="text-white/60 text-sm">{person.role}</div>
                                  {person.isRegisteredUser && (
                                      <div className="text-green-400 text-xs">✓ Verified</div>
                                  )}
                                </div>
                              </div>
                            </div>
                        ))}
                      </div>
                  ) : (
                      <div className="bg-white/5 rounded-lg p-8 text-center border border-white/10">
                        <div className="text-4xl mb-2">🔍</div>
                        <p className="text-white/60 mb-2">No contributors match your search criteria.</p>
                        <button
                            onClick={() => {
                              setSearchTerm("");
                              setSelectedDepartment("all");
                            }}
                            className="text-blue-400 hover:text-blue-300 underline"
                        >
                          Clear filters
                        </button>
                      </div>
                  )}
                </div>
            ) : (
                // Organized Sections
                <>
                  <Section title="Director" people={crew.directors} />
                  <Section title="Producers" people={crew.producers} />
                  <Section title="Writers" people={crew.writers} />
                  <Section title="Designers" people={crew.designers} />
                  <Section title="Artists" people={crew.artists} />
                  <Section title="Animators" people={crew.animators} />
                  <Section title="Programmers" people={crew.programmers} />
                  <Section title="Composers" people={crew.composers} />
                  <Section title="Sound & Audio" people={crew.sound} />
                  <Section title="Localization" people={crew.localization} />
                  <Section title="QA & Testing" people={crew.qa} />
                  <Section title="Voice Cast" people={crew.cast} />
                </>
            )}

            {/* No Contributors Message */}
            {totalCount === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-2xl font-bold text-white mb-2">No Contributors Listed</h3>
                  <p className="text-white/60 mb-6">Help build our database by adding contributors for this game.</p>
                  {userIsLoggedIn && (
                      <button
                          onClick={handleEditContributors}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                      >
                        Add First Contributors
                      </button>
                  )}
                </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[320px] shrink-0">
            <div className="space-y-8 sticky top-6">
              <div className="flex justify-center">
                <AdPlaceholder width={300} height={250} label="Advertisement" />
              </div>
              <div className="flex justify-center">
                <AdPlaceholder width={300} height={600} label="Advertisement" />
              </div>
            </div>
          </div>
        </div>

        {/* Edit Contributors Modal */}
        {userIsLoggedIn && (
            <EditContributorsModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                gameId={id}
                crewList={crewList}
                onSave={handleSaveContributors}
            />
        )}
      </div>
  );
};

export default CastAndCrewPage;