// GamerDashboard.jsx - Dynamic Progress Updates
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import ProfileHeader from "./ProfileHeader";
import DashboardTabs from "./DashboardTabs";
import OverviewTab from "./tabs/overview/OverviewTab";
import LibraryTab from "./tabs/LibraryTab";
import ActivityTab from "./tabs/ActivityTab";
import StatisticsTab from "./tabs/StatisticsTab";
import RecommendationsTab from "./tabs/RecommendationsTab";
import ProfileCompleteBanner from "../../profile/ProfileCompleteBanner";
import ProfessionalUpgradeBanner from "../../profile/ProfessionalUpgradeBanner";
import axios from "axios";
import { predefinedCovers, navigationTabs } from "./mockData";
import { useUser } from "../../../context/UserContext";
import { API_BASE } from "../../../config/api";


const GamerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { username } = useParams();
  const { user: currentUser } = useUser();
  const [gamer, setGamer] = useState(null);
  const [coverImage, setCoverImage] = useState(predefinedCovers[0]);
  const [isEditingCover, setIsEditingCover] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [profileProgress, setProfileProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [proBannerVisible, setProBannerVisible] = useState(true);

  // ✅ CRITICAL FIX: Memoized progress calculation function
  const calculateProfileProgress = useCallback((userData) => {
    if (!userData) {
      console.log("📊 No user data for progress calculation");
      return 0;
    }

    const fields = [
      { key: 'bio', weight: 20, condition: userData.bio && userData.bio.trim().length >= 50 },
      { key: 'avatar', weight: 15, condition: userData.avatar && userData.avatar !== '' },
      { key: 'coverImage', weight: 10, condition: userData.coverImage && userData.coverImage !== '' },
      { key: 'platforms', weight: 20, condition: userData.platforms && userData.platforms.length >= 3 },
      { key: 'favoriteGenres', weight: 15, condition: userData.favoriteGenres && userData.favoriteGenres.length >= 5 },
      { key: 'favoriteConsoles', weight: 10, condition: userData.favoriteConsoles && userData.favoriteConsoles.length >= 2 },
      { key: 'socials', weight: 10, condition: userData.socials && userData.socials.length >= 2 }
    ];

    const completedWeight = fields.reduce((total, field) => {
      const isCompleted = field.condition;
      console.log(`📊 ${field.key}: ${isCompleted ? '✅' : '❌'} (weight: ${field.weight})`);
      return total + (isCompleted ? field.weight : 0);
    }, 0);

    const finalProgress = Math.min(100, completedWeight);
    console.log("📊 Final progress calculated:", finalProgress);
    return finalProgress;
  }, []);

  // ✅ CRITICAL FIX: Effect with dependency array to trigger on gamer changes
  useEffect(() => {
    if (gamer) {
      console.log("🔄 Gamer state changed, recalculating progress...");
      console.log("🔍 Current gamer state:", {
        bio: gamer.bio?.length || 0,
        avatar: !!gamer.avatar,
        platforms: gamer.platforms?.length || 0,
        favoriteGenres: gamer.favoriteGenres?.length || 0,
        favoriteConsoles: gamer.favoriteConsoles?.length || 0,
        socials: gamer.socials?.length || 0
      });

      const newProgress = calculateProfileProgress(gamer);
      console.log("📊 Setting new progress:", newProgress);
      setProfileProgress(newProgress);
    }
  }, [gamer, calculateProfileProgress]); // Added calculateProfileProgress to dependencies

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      let userData;

      if (username) {
        // Public profile: fetch by username
        console.log("🔄 Fetching public profile for:", username);
        
        try {
          const res = await axios.get(`${API_BASE}/api/users/by-username/${username}`, {
            timeout: 10000
          });
          userData = res.data;
          console.log("✅ Public profile fetched:", userData);
        } catch (err) {
          // Try alternative endpoints
          const endpoints = [
            `${API_BASE}/api/auth/user/${username}`,
            `${API_BASE}/api/users/profile/${username}`,
            `${API_BASE}/api/profile/${username}`
          ];
          
          for (const endpoint of endpoints) {
            try {
              const res = await axios.get(endpoint, { timeout: 10000 });
              userData = res.data;
              console.log(`✅ Public profile found at: ${endpoint}`);
              break;
            } catch (e) {
              console.log(`⚠️ Endpoint failed: ${endpoint}`);
              continue;
            }
          }
          
          if (!userData) {
            throw new Error("User profile not found");
          }
        }
      } else {
        // Own profile: fetch authenticated user data
        const token = localStorage.getItem("token");
        if (!token) {
          // Redirect to login for /dashboard without username
          navigate("/login");
          return;
        }

        console.log("🔄 Fetching own profile...");
        const res = await axios.get(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        });
        userData = res.data;
        console.log("✅ Own profile fetched:", userData);
      }

      setGamer(userData);
      if (userData.coverImage) {
        setCoverImage(userData.coverImage);
      }

    } catch (err) {
      console.error("❌ Failed to fetch user:", err);
      setError(err.response?.data?.message || err.message || "Failed to load user data");

      if (err.response?.status === 401 && !username) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [username]); // Re-fetch when username changes

  // Check if current user can edit this profile
  const canEdit = !username || (currentUser && gamer && (
    currentUser._id === gamer._id || 
    currentUser.username === gamer.username ||
    currentUser.username === username
  ));

  // ✅ CRITICAL FIX: Enhanced profile update handler with immediate progress calculation
  const handleProfileUpdate = useCallback((updatedUser) => {
    console.log("🔄 Profile updated, syncing state:", updatedUser);

    setGamer(prev => {
      const newGamer = {
        ...prev,
        ...updatedUser
      };

      console.log("🔄 New gamer state:", newGamer);

      // Immediately calculate and set progress
      const newProgress = calculateProfileProgress(newGamer);
      console.log("⚡ Immediate progress update:", newProgress);
      setProfileProgress(newProgress);

      return newGamer;
    });
  }, [calculateProfileProgress]);

  // ✅ CRITICAL FIX: Enhanced save profile with progress sync
  const handleSaveProfile = async (profileData) => {
    try {
      const token = localStorage.getItem("token");

      console.log("🔍 Saving profile data:", profileData);

      const cleanedData = {
        username: profileData.username || gamer.username,
        title: profileData.title || "",
        avatar: profileData.avatar || gamer.avatar || "",
        bio: profileData.bio || gamer.bio || "",
        website: profileData.website || "",
        coverImage: profileData.coverImage || coverImage,
        platforms: profileData.platforms || gamer.platforms || [],
        favoriteGenres: profileData.favoriteGenres || gamer.favoriteGenres || [],
        favoriteConsoles: profileData.favoriteConsoles || gamer.favoriteConsoles || [],
        userTypes: (profileData.userTypes || [])
            .filter(u => u != null && u !== "")
            .map(u => {
              if (typeof u === 'string') return u;
              if (u && typeof u === 'object') return u.type || u.id || u;
              return u;
            })
            .filter(u => u != null && u !== ""),
        roles: (profileData.roles || []).map(r => {
          if (typeof r === 'string') return { name: r };
          return { name: r.name || r };
        }),
        socials: (profileData.socials || []).filter(s => s.platform && s.link).map(s => ({
          platform: s.platform,
          link: s.link,
          color: s.color || "#6B7280"
        }))
      };

      console.log("🔄 Sending to backend:", cleanedData);

      // Backend'e kaydet
      const res = await axios.put(
          `${API_BASE}/api/auth/me`,
          cleanedData,
          { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ CRITICAL FIX: Immediate state update with progress calculation
      const updatedUser = res.data.user || res.data;

      setGamer(prev => {
        const newGamer = {
          ...prev,
          ...updatedUser
        };

        // Immediate progress calculation
        const newProgress = calculateProfileProgress(newGamer);
        console.log("⚡ Profile save progress update:", newProgress);
        setProfileProgress(newProgress);

        return newGamer;
      });

      if (updatedUser.coverImage) {
        setCoverImage(updatedUser.coverImage);
      }

      console.log("✅ Profile updated successfully!");

    } catch (err) {
      console.error("❌ Profile update error:", err.response?.data || err);
      alert("Profile update failed: " + (err.response?.data?.message || err.message));
    }
  };

  // ✅ CRITICAL FIX: Quick update with immediate progress sync
  const quickUpdateProfile = async (updates) => {
    try {
      // Optimistic update with immediate progress calculation
      setGamer(prev => {
        const newGamer = {
          ...prev,
          ...updates
        };

        // Immediate progress calculation
        const newProgress = calculateProfileProgress(newGamer);
        console.log("⚡ Quick update progress:", newProgress);
        setProfileProgress(newProgress);

        return newGamer;
      });

      // Backend'e asenkron gönder
      const token = localStorage.getItem("token");
      await axios.put(
          `${API_BASE}/api/auth/me`,
          updates,
          { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Quick profile update successful");

    } catch (err) {
      console.error("❌ Quick update failed:", err);
      // Rollback on error
      fetchUser();
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return (
            <OverviewTab
                gamer={gamer}
                setGamer={handleProfileUpdate}
                quickUpdate={quickUpdateProfile}
                editingSection={editingSection}
                setEditingSection={setEditingSection}
                setActiveTab={setActiveTab}
                canEdit={canEdit}
            />
        );
      case "library":
        return <LibraryTab userId={gamer?._id} />;
      case "activity":
        return <ActivityTab userId={gamer?._id} />; // ← Bu satırı değiştir
      case "statistics":
        return <StatisticsTab gamer={gamer} />;
      case "recommendations":
        return <RecommendationsTab gamer={gamer} />;
      default:
        return null;
    }
  };
  // Loading state
  if (loading) {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your profile...</p>
          </div>
        </div>
    );
  }

  // Error state
  if (error) {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center max-w-md">
            <p className="text-red-400 mb-4">⚠️ {error}</p>
            <button
                onClick={fetchUser}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-black text-white">
        {!gamer ? (
            <div className="text-center py-24 text-gray-400">User data not available</div>
        ) : (
            <>
              <ProfileHeader
                  gamer={gamer}
                  coverImage={coverImage}
                  setCoverImage={setCoverImage}
                  isEditingCover={isEditingCover}
                  setIsEditingCover={setIsEditingCover}
                  predefinedCovers={predefinedCovers}
                  onProfileSave={handleSaveProfile}
                  canEdit={canEdit}
              />
              <div className="max-w-7xl mx-auto px-4 py-8">
                <DashboardTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    tabs={navigationTabs}
                />

                {/* ✅ CRITICAL FIX: Enhanced Dynamic Banners with real-time progress - Only show for own profile */}
                {canEdit && profileProgress < 95 && bannerVisible ? (
                    <ProfileCompleteBanner
                        gamer={gamer}
                        progress={profileProgress}
                        message={`Complete your profile to unlock more features! ${Math.round(profileProgress)}% done`}
                        onClick={() => {
                          console.log("🎯 Banner clicked, current progress:", profileProgress);
                          console.log("🔍 Checking missing fields...");

                          // İlk boş alanı bul ve düzenlemeye aç
                          if (!gamer.bio || gamer.bio.trim().length < 50) {
                            console.log("📝 Opening bio editor");
                            setEditingSection('bio');
                          } else if (!gamer.platforms || gamer.platforms.length < 3) {
                            console.log("🎮 Opening platforms editor");
                            setEditingSection('platforms');
                          } else if (!gamer.favoriteGenres || gamer.favoriteGenres.length < 5) {
                            console.log("🎨 Opening genres editor");
                            setEditingSection('genres');
                          } else if (!gamer.favoriteConsoles || gamer.favoriteConsoles.length < 2) {
                            console.log("🕹️ Opening consoles editor");
                            setEditingSection('consoles');
                          } else if (!gamer.socials || gamer.socials.length < 2) {
                            console.log("🔗 Opening socials editor");
                            setEditingSection('socials');
                          } else {
                            console.log("✅ Profile seems complete, hiding banner");
                            setBannerVisible(false);
                          }
                        }}
                        onDismiss={() => setBannerVisible(false)}
                    />
                ) : canEdit && profileProgress >= 95 && proBannerVisible && !gamer.isProfessional ? (
                    <ProfessionalUpgradeBanner
                        user={gamer}
                        onNavigate={(path) => navigate(path)}
                        onDismiss={(dontShowAgain) => {
                          setProBannerVisible(false);
                          if (dontShowAgain) {
                            localStorage.setItem('hideProfessionalBanner', 'true');
                          }
                        }}
                    />
                ) : null}

                {renderTab()}
              </div>
            </>
        )}
      </div>
  );
};

export default GamerDashboard;