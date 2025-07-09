// 🧑‍💼 UserDetail.jsx - Enhanced with real backend data
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaTrash,
  FaUserLock,
  FaUserShield,
  FaStar,
  FaRegStar,
  FaEdit,
  FaGamepad,
  FaGlobe,
  FaCalendarAlt,
  FaEnvelope,
  FaUser,
  FaCrown,
  FaCheckCircle,
  FaBan,
  FaEye,
  FaEyeSlash,
  FaHeart,
  FaGraduationCap,
  FaBriefcase,
  FaProjectDiagram,
  FaBullseye,
  FaLink,
  FaPalette,
  FaTrophy,
  FaCog
} from "react-icons/fa";
import { FaXTwitter, FaDiscord, FaLinkedin, FaGithub, FaInstagram, FaYoutube, FaTwitch } from "react-icons/fa6";
import AdminSidebar from "./AdminSidebar";
import { API_BASE } from "../../config/api";


// Platform iconları mapping
const PLATFORM_ICONS = {
  steam: "🎮",
  playstation: "🎮",
  xbox: "🎮",
  nintendo: "🎮",
  epic: "🎮",
  origin: "🎮",
  gog: "🎮",
  battlenet: "⚔️",
  uplay: "🎮"
};

// Social platform iconları
const SOCIAL_ICONS = {
  twitter: FaXTwitter,
  discord: FaDiscord,
  linkedin: FaLinkedin,
  github: FaGithub,
  instagram: FaInstagram,
  youtube: FaYoutube,
  twitch: FaTwitch
};

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await axios.get(`${API_BASE}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch user:", err);
      setError("Failed to fetch user");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleAction = async (action, confirmMessage) => {
    if (!window.confirm(confirmMessage)) return;

    try {
      const token = localStorage.getItem("token");
      let endpoint = "";
      let method = "put";

      switch(action) {
        case "ban":
          endpoint = `${API_BASE}/api/admin/users/${id}/ban`;
          break;
        case "recover":
          endpoint = `${API_BASE}/api/admin/users/${id}/recover`;
          break;
        case "delete":
          endpoint = `${API_BASE}/api/admin/users/${id}`;
          method = "delete";
          break;
        default:
          return;
      }

      await axios[method](endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(`Operation successful: ${action}`);
      if (action === "delete") {
        navigate("/admin/users");
      } else {
        fetchUser();
      }
    } catch (err) {
      console.error(`❌ ${action} error:`, err);
      alert(`${action} operation failed`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getRoleIcon = (role) => {
    switch(role?.toLowerCase()) {
      case "admin": return <FaUserShield className="text-yellow-400" />;
      case "premium":
      case "premium user": return <FaStar className="text-yellow-400" />;
      case "moderator": return <FaCrown className="text-purple-400" />;
      default: return <FaRegStar className="text-gray-400" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch(role?.toLowerCase()) {
      case "admin": return "bg-yellow-500 text-black";
      case "premium":
      case "premium user": return "bg-purple-500 text-white";
      case "moderator": return "bg-blue-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const renderSocialIcon = (platform) => {
    const IconComponent = SOCIAL_ICONS[platform?.toLowerCase()];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : <FaLink className="w-4 h-4" />;
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const tabs = [
    { id: "overview", label: "Overview", icon: FaUser },
    { id: "profile", label: "Profile", icon: FaEdit },
    { id: "gaming", label: "Gaming", icon: FaGamepad },
    { id: "activity", label: "Activity", icon: FaTrophy },
    { id: "settings", label: "Settings", icon: FaCog }
  ];

  if (loading) {
    return (
        <div className="flex min-h-screen bg-gray-950">
          <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          <main className={`flex-1 flex items-center justify-center transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"}`}>
            <div className="text-white text-xl">Loading user details...</div>
          </main>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex min-h-screen bg-gray-950">
          <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          <main className={`flex-1 flex items-center justify-center transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"}`}>
            <div className="text-red-500 text-xl">{error}</div>
          </main>
        </div>
    );
  }

  return (
      <div className="flex min-h-screen bg-gray-950 text-white">
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className={`flex-1 p-6 space-y-6 transition-all duration-300 ease-in-out ${collapsed ? "ml-20" : "ml-64"}`}>
          {/* Header */}
          <div className="max-w-7xl mx-auto">
            <button
                className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-6 transition-colors"
                onClick={() => navigate("/admin/users")}
            >
              <FaArrowLeft /> Back to user list
            </button>

            {/* User Header Card */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  {user.avatar ? (
                      <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-24 h-24 rounded-full object-cover border-4 border-gray-600"
                      />
                  ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold">
                        {user.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                  )}
                  {user.coverImage && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <FaCheckCircle className="text-white w-4 h-4" />
                      </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getRoleIcon(user.role)}
                    <h1 className="text-3xl font-bold">{user.username}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                    {user.banned && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      BANNED
                    </span>
                    )}
                    {user.deleted && (
                        <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs font-bold">
                      DELETED
                    </span>
                    )}
                  </div>

                  {user.title && (
                      <p className="text-gray-300 text-lg mb-2">{user.title}</p>
                  )}

                  {user.bio && (
                      <p className="text-gray-400 max-w-2xl">{user.bio}</p>
                  )}

                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="w-4 h-4" />
                    Joined {formatDate(user.createdAt)}
                  </span>
                    <span className="flex items-center gap-1">
                    <FaEye className="w-4 h-4" />
                    Last seen {formatDate(user.updatedAt)}
                  </span>
                    {user.country && (
                        <span className="flex items-center gap-1">
                      <FaGlobe className="w-4 h-4" />
                          {user.country}
                    </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                      onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
                  >
                    {showSensitiveInfo ? <FaEyeSlash /> : <FaEye />}
                    {showSensitiveInfo ? 'Hide' : 'Show'} Sensitive Info
                  </button>

                  {!user.deleted && !user.banned && (
                      <button
                          onClick={() => handleAction("ban", `Ban user "${user.username}"?`)}
                          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded transition-colors"
                      >
                        <FaBan /> Ban User
                      </button>
                  )}

                  {(user.deleted || user.banned) && (
                      <button
                          onClick={() => handleAction("recover", `Recover user "${user.username}"?`)}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors"
                      >
                        <FaCheckCircle /> Recover User
                      </button>
                  )}

                  <button
                      onClick={() => handleAction("delete", `Permanently delete user "${user.username}"? This cannot be undone!`)}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
                  >
                    <FaTrash /> Delete User
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-900 p-1 rounded-lg">
              {tabs.map((tab) => (
                  <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                          activeTab === tab.id
                              ? 'bg-yellow-500 text-black font-semibold'
                              : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {activeTab === "overview" && (
                  <>
                    {/* Basic Information */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <FaUser className="text-blue-400" />
                          Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-gray-400 text-sm">User ID</label>
                            <p className="text-white font-mono text-sm">{user._id}</p>
                          </div>
                          <div>
                            <label className="text-gray-400 text-sm">Username</label>
                            <p className="text-white">{user.username}</p>
                          </div>
                          {showSensitiveInfo && (
                              <div>
                                <label className="text-gray-400 text-sm">Email</label>
                                <p className="text-white flex items-center gap-2">
                                  <FaEnvelope className="w-4 h-4" />
                                  {user.email}
                                </p>
                              </div>
                          )}
                          {user.dob && showSensitiveInfo && (
                              <div>
                                <label className="text-gray-400 text-sm">Date of Birth</label>
                                <p className="text-white">{formatDate(user.dob)}</p>
                              </div>
                          )}
                          <div>
                            <label className="text-gray-400 text-sm">Role</label>
                            <p className="text-white flex items-center gap-2">
                              {getRoleIcon(user.role)}
                              {user.role}
                            </p>
                          </div>
                          <div>
                            <label className="text-gray-400 text-sm">Country</label>
                            <p className="text-white">{user.country || '-'}</p>
                          </div>
                          <div>
                            <label className="text-gray-400 text-sm">Account Status</label>
                            <div className="flex items-center gap-2">
                              {user.banned ? (
                                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">Banned</span>
                              ) : user.deleted ? (
                                  <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs">Deleted</span>
                              ) : (
                                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">Active</span>
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="text-gray-400 text-sm">Member Since</label>
                            <p className="text-white">{formatDate(user.createdAt)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Professional Information */}
                      {(user.education || user.currentWork || user.currentProjects || user.careerGoals) && (
                          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                              <FaBriefcase className="text-purple-400" />
                              Professional Information
                            </h3>
                            <div className="space-y-4">
                              {user.education && (
                                  <div>
                                    <label className="text-gray-400 text-sm flex items-center gap-2">
                                      <FaGraduationCap className="w-4 h-4" />
                                      Education
                                    </label>
                                    <p className="text-white">{user.education}</p>
                                  </div>
                              )}
                              {user.currentWork && (
                                  <div>
                                    <label className="text-gray-400 text-sm flex items-center gap-2">
                                      <FaBriefcase className="w-4 h-4" />
                                      Current Work
                                    </label>
                                    <p className="text-white">{user.currentWork}</p>
                                  </div>
                              )}
                              {user.currentProjects && (
                                  <div>
                                    <label className="text-gray-400 text-sm flex items-center gap-2">
                                      <FaProjectDiagram className="w-4 h-4" />
                                      Current Projects
                                    </label>
                                    <p className="text-white">{user.currentProjects}</p>
                                  </div>
                              )}
                              {user.careerGoals && (
                                  <div>
                                    <label className="text-gray-400 text-sm flex items-center gap-2">
                                      <FaBullseye className="w-4 h-4" />
                                      Career Goals
                                    </label>
                                    <p className="text-white">{user.careerGoals}</p>
                                  </div>
                              )}
                            </div>
                          </div>
                      )}
                    </div>

                    {/* Social Links & Quick Stats */}
                    <div className="space-y-6">
                      {/* Social Links */}
                      {user.socials && user.socials.length > 0 && (
                          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                            <h3 className="text-xl font-bold mb-4">Social Links</h3>
                            <div className="space-y-3">
                              {user.socials.map((social, index) => (
                                  <a
                                      key={index}
                                      href={social.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                                      style={{ borderLeft: `4px solid ${social.color || '#6B7280'}` }}
                                  >
                                    {renderSocialIcon(social.platform)}
                                    <div>
                                      <p className="text-white font-medium capitalize">{social.platform}</p>
                                      <p className="text-gray-400 text-sm truncate">{social.link}</p>
                                    </div>
                                  </a>
                              ))}
                            </div>
                          </div>
                      )}

                      {/* User Types & Roles */}
                      {(user.userTypes?.length > 0 || user.roles?.length > 0) && (
                          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                            <h3 className="text-xl font-bold mb-4">Types & Roles</h3>
                            {user.userTypes && user.userTypes.length > 0 && (
                                <div className="mb-4">
                                  <label className="text-gray-400 text-sm">User Types</label>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {user.userTypes.map((type, index) => (
                                        <span key={index} className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                                {type}
                              </span>
                                    ))}
                                  </div>
                                </div>
                            )}
                            {user.roles && user.roles.length > 0 && (
                                <div>
                                  <label className="text-gray-400 text-sm">Roles</label>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {user.roles.map((role, index) => (
                                        <span key={index} className="bg-purple-600 text-white px-2 py-1 rounded text-xs">
                                {role.name}
                              </span>
                                    ))}
                                  </div>
                                </div>
                            )}
                          </div>
                      )}

                      {/* Website */}
                      {user.website && (
                          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                            <h3 className="text-xl font-bold mb-4">Website</h3>
                            <a
                                href={user.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <FaLink className="w-4 h-4" />
                              {user.website}
                            </a>
                          </div>
                      )}
                    </div>
                  </>
              )}

              {activeTab === "gaming" && (
                  <>
                    {/* Gaming Platforms */}
                    <div className="lg:col-span-2">
                      {user.platforms && user.platforms.length > 0 ? (
                          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                              <FaGamepad className="text-green-400" />
                              Gaming Platforms
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {user.platforms.map((platform, index) => (
                                  <div key={index} className="bg-gray-800 rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">
                                {PLATFORM_ICONS[platform.key] || '🎮'}
                              </span>
                                      <div>
                                        <p className="text-white font-medium">{platform.name}</p>
                                        {platform.verified && (
                                            <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs">
                                    Verified
                                  </span>
                                        )}
                                      </div>
                                    </div>
                                    {platform.username && (
                                        <p className="text-gray-400 text-sm">
                                          Username: <span className="text-white">{platform.username}</span>
                                        </p>
                                    )}
                                    {platform.profileUrl && (
                                        <a
                                            href={platform.profileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 text-sm"
                                        >
                                          View Profile →
                                        </a>
                                    )}
                                    <p className="text-gray-500 text-xs mt-2">
                                      Added {formatDate(platform.addedAt)}
                                    </p>
                                  </div>
                              ))}
                            </div>
                          </div>
                      ) : (
                          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                              <FaGamepad className="text-green-400" />
                              Gaming Platforms
                            </h3>
                            <p className="text-gray-400">No gaming platforms added yet.</p>
                          </div>
                      )}
                    </div>

                    {/* Favorite Genres & Consoles */}
                    <div className="space-y-6">
                      {user.favoriteGenres && user.favoriteGenres.length > 0 && (
                          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                              <FaHeart className="text-red-400" />
                              Favorite Genres
                            </h3>
                            <div className="space-y-3">
                              {user.favoriteGenres.map((genre, index) => (
                                  <div key={index} className="flex items-center justify-between">
                                    <div
                                        className="flex-1 bg-gray-800 rounded p-3"
                                        style={{ borderLeft: `4px solid ${genre.color}` }}
                                    >
                                      <p className="text-white font-medium">{genre.name}</p>
                                      {genre.percentage > 0 && (
                                          <div className="mt-2">
                                            <div className="bg-gray-700 rounded-full h-2">
                                              <div
                                                  className="h-2 rounded-full"
                                                  style={{
                                                    width: `${genre.percentage}%`,
                                                    backgroundColor: genre.color
                                                  }}
                                              ></div>
                                            </div>
                                            <p className="text-gray-400 text-xs mt-1">{genre.percentage}%</p>
                                          </div>
                                      )}
                                    </div>
                                  </div>
                              ))}
                            </div>
                          </div>
                      )}

                      {user.favoriteConsoles && user.favoriteConsoles.length > 0 && (
                          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                              <FaPalette className="text-blue-400" />
                              Favorite Consoles
                            </h3>
                            <div className="space-y-2">
                              {user.favoriteConsoles.map((console, index) => (
                                  <div key={index} className="bg-gray-800 rounded p-3">
                                    <div className="flex items-center justify-between">
                                      <p className="text-white font-medium">{console.name}</p>
                                      {console.generation && (
                                          <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs">
                                  {console.generation}
                                </span>
                                      )}
                                    </div>
                                    <p className="text-gray-500 text-xs mt-1">
                                      Added {formatDate(console.addedAt)}
                                    </p>
                                  </div>
                              ))}
                            </div>
                          </div>
                      )}

                      {/* Game Stats */}
                      {user.gameStats && (
                          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                              <FaTrophy className="text-yellow-400" />
                              Game Statistics
                            </h3>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Total Games</span>
                                <span className="text-white font-bold">{user.gameStats.totalGames || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Total Playtime</span>
                                <span className="text-white font-bold">{user.gameStats.totalPlaytime || 0}h</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Achievements</span>
                                <span className="text-white font-bold">{user.gameStats.achievementCount || 0}</span>
                              </div>
                            </div>
                          </div>
                      )}
                    </div>
                  </>
              )}

              {/* Diğer tab'ların içerikleri burada olacak */}
              {activeTab !== "overview" && activeTab !== "gaming" && (
                  <div className="lg:col-span-3 bg-gray-900 rounded-xl p-6 border border-gray-700">
                    <div className="text-center text-gray-400">
                      <p className="text-lg">"{tabs.find(t => t.id === activeTab)?.label}" content will be implemented soon.</p>
                      <p className="text-sm mt-2">This section will contain detailed information about user {activeTab}.</p>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </main>
      </div>
  );
};

export default UserDetail;