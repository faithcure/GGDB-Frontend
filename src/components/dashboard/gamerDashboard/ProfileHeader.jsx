import React, { useState } from "react";
import { FaCamera, FaEdit, FaUser, FaUsers, FaExternalLinkAlt, FaMapMarkerAlt, FaCalendarAlt, FaGlobe, FaTwitter, FaInstagram, FaYoutube, FaTwitch, FaDiscord, FaLinkedin, FaGithub, FaStar, FaCheckCircle } from "react-icons/fa";
import { MessageCircle } from "lucide-react";
import Badge from "./common/Badge";
import EditProfileModal from "./EditProfileModal";
import MessageCenter from "../../social/MessageCenter";
import { useNavigate } from "react-router-dom";

// Resim validasyon kuralları
const IMAGE_RULES = {
  maxWidth: 800,      // Maksimum genişlik
  maxHeight: 800,     // Maksimum yükseklik
  maxFileSize: 5,     // MB cinsinden maksimum dosya boyutu
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'], // İzin verilen dosya tipleri
  compressedMaxWidth: 400,  // Sıkıştırma sonrası maksimum genişlik
  compressQuality: 0.85     // Sıkıştırma kalitesi
};

// Dosya validasyon fonksiyonu
const validateImageFile = (file) => {
  const errors = [];

  // Dosya tipi kontrolü
  if (!IMAGE_RULES.allowedTypes.includes(file.type)) {
    errors.push(`Sadece JPG ve PNG dosyaları kabul edilir. Seçilen dosya: ${file.type}`);
  }

  // Dosya boyutu kontrolü
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > IMAGE_RULES.maxFileSize) {
    errors.push(`Dosya boyutu ${IMAGE_RULES.maxFileSize}MB'dan küçük olmalıdır. Seçilen dosya: ${fileSizeMB.toFixed(2)}MB`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Resim boyutlarını kontrol etme fonksiyonu
const validateImageDimensions = (img) => {
  const errors = [];

  if (img.width > IMAGE_RULES.maxWidth) {
    errors.push(`Resim genişliği maksimum ${IMAGE_RULES.maxWidth}px olabilir. Seçilen: ${img.width}px`);
  }

  if (img.height > IMAGE_RULES.maxHeight) {
    errors.push(`Resim yüksekliği maksimum ${IMAGE_RULES.maxHeight}px olabilir. Seçilen: ${img.height}px`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    needsResize: img.width > IMAGE_RULES.compressedMaxWidth || img.height > IMAGE_RULES.compressedMaxWidth
  };
};

// Gelişmiş resim sıkıştırma fonksiyonu
const processImage = (file) => {
  return new Promise((resolve, reject) => {
    // İlk olarak dosya validasyonu
    const fileValidation = validateImageFile(file);
    if (!fileValidation.isValid) {
      reject(new Error(fileValidation.errors.join('\n')));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Boyut validasyonu
      const dimensionValidation = validateImageDimensions(img);

      // Eğer boyutlar çok büyükse uyarı ver ama devam et (resize edeceğiz)
      if (!dimensionValidation.isValid) {
        console.warn('⚠️ Resim boyutları büyük, otomatik olarak yeniden boyutlandırılacak:', dimensionValidation.errors);
      }

      let { width, height } = img;
      const maxSize = IMAGE_RULES.compressedMaxWidth;

      // Aspect ratio'yu koruyarak yeniden boyutlandır
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }

      // Canvas boyutunu ayarla
      canvas.width = width;
      canvas.height = height;

      // Resmi çiz
      ctx.drawImage(img, 0, 0, width, height);

      // Sıkıştırılmış resmi döndür
      const compressedDataUrl = canvas.toDataURL('image/jpeg', IMAGE_RULES.compressQuality);

      resolve({
        dataUrl: compressedDataUrl,
        originalSize: {
          width: img.width,
          height: img.height,
          fileSize: (file.size / (1024 * 1024)).toFixed(2) + 'MB'
        },
        finalSize: {
          width: Math.round(width),
          height: Math.round(height),
          fileSize: ((compressedDataUrl.length * 0.75) / (1024 * 1024)).toFixed(2) + 'MB' // Base64 size estimation
        }
      });
    };

    img.onerror = () => {
      reject(new Error('Resim yüklenirken hata oluştu. Lütfen geçerli bir resim dosyası seçin.'));
    };

    img.src = URL.createObjectURL(file);
  });
};

const ProfileHeader = ({
                         gamer,
                         coverImage,
                         setCoverImage,
                         isEditingCover,
                         setIsEditingCover,
                         predefinedCovers,
                         onProfileSave,
                         canEdit = false
                       }) => {
  const navigate = useNavigate();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showMessageCenter, setShowMessageCenter] = useState(false);

  // userTypes için icon mapping
  const USER_TYPE_ICONS = {
    professional: { icon: "💼", color: "text-blue-400" },
    gamer: { icon: "🎮", color: "text-green-400" },
    streamer: { icon: "📹", color: "text-purple-400" }
  };

  // Debug için gamer objesi
  React.useEffect(() => {
    if (gamer) {
      console.log("🔍 ProfileHeader'da gamer objesi:", gamer);
      console.log("🔍 gamer.userTypes:", gamer.userTypes);
    }
  }, [gamer]);

  const handleProfileSave = async (updatedData) => {
    // Check if username is being changed
    const isUsernameChanging = updatedData.username && updatedData.username !== gamer.username;
    const oldUsername = gamer.username;
    const newUsername = updatedData.username;

    try {
      // Show loading state if username is changing
      if (isUsernameChanging) {
        console.log(`🔄 Username changing from "${oldUsername}" to "${newUsername}"`);

        // You could show a loading indicator here if needed
        // setIsUpdatingProfile(true);
      }

      // Call the original save function
      const result = await onProfileSave(updatedData);

      // Handle username change feedback
      if (isUsernameChanging && result?.contributorUpdate) {
        const { updated, gamesCount, gamesList, error } = result.contributorUpdate;

        if (updated && gamesCount > 0) {
          // Success notification for contributor updates
          alert(`✅ Profile updated successfully!\n\n🎮 Your contributor name has been updated in ${gamesCount} game(s):\n${gamesList.map(game => `• ${game.title}`).join('\n')}`);

          console.log(`✅ Username change completed:`, {
            oldUsername,
            newUsername,
            gamesUpdated: gamesCount,
            gamesList
          });
        } else if (error) {
          // Partial success notification
          alert(`✅ Profile updated successfully!\n\n⚠️ Note: There was an issue updating your contributor credits in some games. Your profile changes are saved, but please contact support if you notice any issues with your game credits.`);

          console.warn(`⚠️ Username change completed with errors:`, {
            oldUsername,
            newUsername,
            error
          });
        } else {
          // No games to update (normal case)
          console.log(`✅ Username change completed (no contributor records found):`, {
            oldUsername,
            newUsername
          });
        }
      }

      setIsEditingProfile(false);

      return result;

    } catch (error) {
      console.error("❌ Profile save error:", error);

      // Enhanced error handling for username changes
      if (isUsernameChanging) {
        if (error.response?.data?.field === 'username') {
          alert(`❌ Username change failed: ${error.response.data.message}`);
        } else {
          alert(`❌ Profile update failed: ${error.response?.data?.message || error.message}\n\nPlease try again or contact support if the issue persists.`);
        }
      } else {
        alert(`❌ Profile update failed: ${error.response?.data?.message || error.message}`);
      }

      throw error;
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        console.log("📤 Cover resmi işleniyor...");

        const result = await processImage(file);
        setCoverImage(result.dataUrl);
        setIsEditingCover(false);

        // Backend'e gönder
        await onProfileSave({
          ...gamer,
          coverImage: result.dataUrl
        });

        console.log("✅ Cover image güncellendi!");
        console.log(`📏 Orijinal: ${result.originalSize.width}x${result.originalSize.height} (${result.originalSize.fileSize})`);
        console.log(`📏 İşlenmiş: ${result.finalSize.width}x${result.finalSize.height} (${result.finalSize.fileSize})`);

      } catch (error) {
        console.error("❌ Cover image işleme hatası:", error.message);
        alert(`❌ Cover resmi yüklenirken hata oluştu:\n\n${error.message}\n\nLütfen kurallara uygun bir resim seçin:\n• Sadece JPG/PNG formatı\n• Maksimum ${IMAGE_RULES.maxFileSize}MB\n• Maksimum ${IMAGE_RULES.maxWidth}x${IMAGE_RULES.maxHeight} piksel`);
      }
    }
  };

  const selectPredefinedCover = async (url) => {
    setCoverImage(url);
    setIsEditingCover(false);

    // Backend'e gönder
    try {
      await onProfileSave({
        ...gamer,
        coverImage: url
      });
      console.log("✅ Cover image güncellendi!");
    } catch (err) {
      console.error("❌ Cover image güncellenemedi:", err);
      alert("Cover image güncellenemedi!");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        console.log("📤 Avatar işleniyor...");

        const result = await processImage(file);

        // Backend'e gönder
        await onProfileSave({
          ...gamer,
          avatar: result.dataUrl
        });

        console.log("✅ Avatar güncellendi!");
        console.log(`📏 Orijinal: ${result.originalSize.width}x${result.originalSize.height} (${result.originalSize.fileSize})`);
        console.log(`📏 İşlenmiş: ${result.finalSize.width}x${result.finalSize.height} (${result.finalSize.fileSize})`);

      } catch (error) {
        console.error("❌ Avatar işleme hatası:", error.message);
        alert(`❌ Avatar yüklenirken hata oluştu:\n\n${error.message}\n\nLütfen kurallara uygun bir resim seçin:\n• Sadece JPG/PNG formatı\n• Maksimum ${IMAGE_RULES.maxFileSize}MB\n• Maksimum ${IMAGE_RULES.maxWidth}x${IMAGE_RULES.maxHeight} piksel`);
      }
    }
  };

  return (
      <div className="relative overflow-hidden">
        <div className="absolute top-6 right-6 z-20"></div>
        <div className="relative h-[340px] md:h-[440px]">
          <div
              className="absolute inset-0 bg-center bg-cover profile-blur-bg"
              style={{ backgroundImage: `url(${coverImage})`, filter: "blur(2px) scale(1.04)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 -mt-36 sm:-mt-44">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 pb-6">
            <div className="relative group">
              <img
                  src={gamer.avatar || "https://placehold.co/120x120?text=Avatar"}
                  alt={gamer.username || "Avatar"}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-yellow-400 shadow-2xl object-cover bg-white"
                  style={{ boxShadow: "0 0 0 8px rgba(255,221,51,0.2)" }}
              />
              <div className="absolute bottom-2 right-2 glass-effect text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Online
              </div>
              {canEdit && (
                <label className="absolute bottom-2 right-2 bg-yellow-400 hover:bg-yellow-300 text-black p-2 rounded-full shadow-lg transition-all hover:scale-105 border border-white cursor-pointer" title="Change profile picture">
                  <FaCamera size={15} />
                  <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleAvatarChange}
                      className="hidden"
                  />
                </label>
              )}
              {canEdit && (
                <button onClick={() => setIsEditingCover(true)} className="absolute -top-3 -left-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full border border-white/30 transition-all hover:scale-105" title="Change cover photo">
                  <FaEdit size={13} />
                </button>
              )}
            </div>
            {/* Cover Edit Modal */}
            {canEdit && isEditingCover && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold">Change Cover Photo</h3>
                      <button onClick={() => setIsEditingCover(false)} className="text-gray-400 hover:text-white text-xl">×</button>
                    </div>
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-300 mb-3">Choose from templates</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {predefinedCovers.map((cover, index) => (
                            <button key={index} onClick={() => selectPredefinedCover(cover)}
                                    className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                                        coverImage === cover ? "border-yellow-400" : "border-white/20 hover:border-white/40"
                                    }`}>
                              <img src={cover} alt={`Cover option ${index + 1}`} className="w-full h-full object-cover" />
                              {coverImage === cover && (
                                  <div className="absolute inset-0 bg-yellow-400/20 flex items-center justify-center">
                                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                      <span className="text-black text-sm">✓</span>
                                    </div>
                                  </div>
                              )}
                            </button>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-white/20 pt-6">
                      <h4 className="text-sm font-medium text-gray-300 mb-3">Or upload your own</h4>
                      <input type="file" accept="image/jpeg,image/jpg,image/png" onChange={handleCoverChange} className="text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-black hover:file:bg-yellow-300 file:cursor-pointer cursor-pointer" />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                      <button onClick={() => setIsEditingCover(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm font-medium">Cancel</button>
                    </div>
                  </div>
                </div>
            )}
            {/* Profil detayları */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1 flex items-center gap-2">
                    {gamer.username}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {gamer.title && gamer.title.split(',').map((titlePart, idx) => (
                          <span key={idx} className="text-xl text-white/80 font-medium">
                          {titlePart.trim()}
                            {idx < gamer.title.split(',').length - 1 && <span className="ml-2 text-white/60">•</span>}
                        </span>
                      ))}
                    </div>
                    <div className="h-4 w-px bg-white/40"></div>
                    <div className="flex gap-2">
                      {(gamer.userTypes || []).filter(userType => userType != null).map((userType, i) => {
                        // String ise basit badge göster
                        if (typeof userType === 'string' && userType.trim()) {
                          const getTypeStyle = (type) => {
                            const styles = {
                              professional: {
                                icon: <FaCheckCircle className="text-blue-400" />,
                                colorClass: "bg-blue-500/20 text-blue-400 border-blue-400/50"
                              },
                              gamer: {
                                icon: <FaStar className="text-purple-400" />,
                                colorClass: "bg-purple-500/20 text-purple-400 border-purple-400/50"
                              },
                              streamer: {
                                icon: <FaCamera className="text-red-400" />,
                                colorClass: "bg-red-500/20 text-red-400 border-red-400/50"
                              }
                            };
                            return styles[type] || {
                              icon: <FaCheckCircle className="text-gray-400" />,
                              colorClass: "bg-gray-500/20 text-gray-400 border-gray-400/50"
                            };
                          };

                          const typeStyle = getTypeStyle(userType);

                          return (
                              <span key={i} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${typeStyle.colorClass}`}>
                              {typeStyle.icon}
                                {userType.charAt(0).toUpperCase() + userType.slice(1)}
                            </span>
                          );
                        }
                        // Object ise ve gerekli alanları varsa Badge component kullan
                        if (userType && typeof userType === 'object' && (userType.icon || userType.type || userType.title)) {
                          return (
                              <Badge key={i} icon={userType.icon || "👤"} text={userType.type || userType.title || "Unknown"} colorClass={userType.colorClass || "text-gray-400"} />
                          );
                        }
                        // Güvenli fallback - sadece geçerli değerler için
                        if (userType) {
                          return (
                              <span key={i} className="inline-flex items-center gap-1.5 bg-gray-500/20 text-gray-400 border-gray-400/50 px-3 py-1 rounded-lg text-xs font-medium border">
                              <FaCheckCircle className="text-gray-400" />
                                {String(userType)}
                            </span>
                          );
                        }
                        return null; // Hiçbir şey render etme
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-white/70 text-sm mb-3">
                <span className="flex items-center gap-1">
                  <FaMapMarkerAlt />
                  Location @{gamer.country || "Unknown"}
                </span>
                <span className="flex items-center gap-1">
                  <FaCalendarAlt />
                  Member since {gamer.createdAt ? new Date(gamer.createdAt).getFullYear() : "2024"}
                </span>
                <span className="flex items-center gap-1">
                <FaGlobe />Level {gamer.level || "1"} • {gamer.rank || "Beginner"}
                  {gamer.website && (
                      <>
                        <span className="mx-2 text-white/50">|</span>
                        <a href={gamer.website.startsWith('http') ? gamer.website : `https://${gamer.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                          <FaGlobe size={12} />
                          {gamer.website}
                        </a>
                      </>
                  )}
              </span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-3">
                {(gamer.roles || []).map((role, i) => (
                    <span key={i} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-xs text-white border border-white/20 transition-colors cursor-pointer font-medium">
                      <FaStar className="w-3 h-3 text-yellow-400" />
                      {role.name || role}
                    </span>
                ))}
              </div>
              <div className="flex items-center gap-4 justify-center sm:justify-start">
                <div className="flex gap-3">
                  {(gamer.socials || []).map((social, i) => {
                    // Social platform ikonunu bul
                    const getSocialIcon = (platform) => {
                      const icons = {
                        Twitter: { Component: FaTwitter, color: "#1DA1F2" },
                        Instagram: { Component: FaInstagram, color: "#E4405F" },
                        YouTube: { Component: FaYoutube, color: "#FF0000" },
                        Twitch: { Component: FaTwitch, color: "#9146FF" },
                        Discord: { Component: FaDiscord, color: "#7289DA" },
                        LinkedIn: { Component: FaLinkedin, color: "#0077B5" },
                        GitHub: { Component: FaGithub, color: "#f0f6fc" },
                      };
                      return icons[platform] || { Component: FaGlobe, color: social.color || "#6B7280" };
                    };

                    const { Component, color } = getSocialIcon(social.platform);

                    return (
                        <a key={i} href={social.link} title={social.platform}
                           className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all hover:scale-110"
                           style={{ backgroundColor: `${color}22` }}>
                          <Component size={16} style={{ color: color }} />
                        </a>
                    );
                  })}
                  <button className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all hover:scale-110 bg-white/10 hover:bg-white/20 border border-white/20"
                          title="More links">
                    <FaExternalLinkAlt size={14} />
                  </button>
                </div>
                <div className="h-6 w-px bg-white/30"></div>
                <button
                    onClick={() => navigate(`/person/${gamer.username}`)} // 🆕 Bu onClick'i ekle
                    className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 border border-yellow-300/50"
                >
                  <FaUsers size={12} />
                  <span>Go to Crew Page</span>
                  <FaExternalLinkAlt size={10} className="opacity-80" />
                </button>
                <button
                    onClick={() => setShowMessageCenter(true)}
                    className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 border border-green-300/50"
                    title="Open Message Center"
                >
                  <MessageCircle size={12} />
                  <span>Messages</span>
                </button>
                {canEdit && (
                  <button
                      onClick={() => setIsEditingProfile(true)}
                      className="bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 border border-blue-300/50"
                  >
                    <FaEdit size={12} />
                    <span>Edit Profile</span>
                    <FaExternalLinkAlt size={10} className="opacity-80" />
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mt-8 mb-4"></div>
        </div>
        {/* Edit Profile Modal */}
        {canEdit && isEditingProfile && (
            <EditProfileModal
                gamer={gamer}
                onClose={() => setIsEditingProfile(false)}
                onSave={handleProfileSave}
            />
        )}
        
        {/* Message Center Modal */}
        <MessageCenter 
          isOpen={showMessageCenter}
          onClose={() => setShowMessageCenter(false)}
        />
      </div>
  );
};

export default ProfileHeader;