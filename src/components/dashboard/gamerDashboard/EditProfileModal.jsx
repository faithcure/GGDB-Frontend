import React, { useState } from "react";
import { FaCamera, FaSave, FaTimes, FaEdit, FaGlobe, FaTwitter, FaInstagram, FaYoutube, FaTwitch, FaDiscord, FaLinkedin, FaGithub, FaPlus, FaTrash, FaGamepad, FaCode, FaVideo, FaExclamationTriangle, FaCheck, FaSpinner, FaSearch } from "react-icons/fa";

const SOCIAL_PLATFORMS = [
  { value: "Twitter", label: "Twitter", icon: FaTwitter, color: "#1DA1F2" },
  { value: "Instagram", label: "Instagram", icon: FaInstagram, color: "#E4405F" },
  { value: "YouTube", label: "YouTube", icon: FaYoutube, color: "#FF0000" },
  { value: "Twitch", label: "Twitch", icon: FaTwitch, color: "#9146FF" },
  { value: "Discord", label: "Discord", icon: FaDiscord, color: "#7289DA" },
  { value: "LinkedIn", label: "LinkedIn", icon: FaLinkedin, color: "#0077B5" },
  { value: "GitHub", label: "GitHub", icon: FaGithub, color: "#f0f6fc" },
];

const USER_TYPES = [
  {
    id: "professional",
    title: "Professional",
    description: "I work in the gaming industry (I have credits)",
    icon: FaCode,
    color: "blue"
  },
  {
    id: "gamer",
    title: "Gamer",
    description: "I'm a professional player or gaming enthusiast",
    icon: FaGamepad,
    color: "green"
  },
  {
    id: "streamer",
    title: "Streamer",
    description: "I stream online (Twitch, YouTube, etc.)",
    icon: FaVideo,
    color: "purple"
  }
];

const PROFESSIONAL_TITLES = [
  "Game Developer", "Gameplay Programmer", "AI Programmer", "Network Programmer", "Engine Programmer", "Tools Programmer", "UI Programmer", "Mobile Game Developer", "VR/AR Developer", "Unreal Developer", "Unity Developer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "Scripting Specialist", "Technical Artist", "DevOps Engineer", "Build Engineer", "System Administrator",
  "Art Director", "Lead Artist", "3D Artist", "2D Artist", "Environment Artist", "Character Artist", "Concept Artist", "Texture Artist", "Lighting Artist", "VFX Artist", "FX Artist", "Rigging Artist", "Animator", "Technical Animator", "Motion Capture Specialist", "Story Artist", "UI Artist", "UI/UX Designer", "Graphic Designer", "Motion Graphics Designer", "Cinematic Artist", "Storyboard Artist",
  "Game Designer", "Level Designer", "Narrative Designer", "Quest Designer", "System Designer", "Economy Designer", "Combat Designer", "UX Designer", "Monetization Designer", "Audio Designer",
  "Producer", "Associate Producer", "Project Manager", "Scrum Master", "Product Manager", "Development Director", "Creative Director", "Studio Head", "Localization Manager", "QA Manager",
  "QA Tester", "Quality Assurance Analyst", "QA Lead", "Game Tester", "Playtester", "Compliance Tester",
  "Sound Designer", "Audio Engineer", "Composer", "Musician", "Voice Actor", "Audio Director", "Dialogue Editor",
  "Community Manager", "Community Moderator", "Social Media Manager", "Support Specialist", "Localization Specialist", "Customer Support", "Live Ops Manager",
  "Business Developer", "Marketing Specialist", "User Acquisition Manager", "PR Manager", "Brand Manager", "Partnership Manager", "E-commerce Manager", "Monetization Specialist",
  "Content Creator", "Streamer", "YouTuber", "Blogger", "Journalist", "Game Reviewer",
  "Esports Player", "Coach", "Caster", "Tournament Organizer", "Event Manager", "Shoutcaster", "Analyst", "Team Manager",
  "Instructor", "Consultant", "Freelancer", "Technical Writer", "Data Analyst", "Localization Tester", "Legal Advisor", "Researcher", "Intern", "Volunteer"
];

const SKILLS_OPTIONS = [
  "JavaScript", "TypeScript", "Python", "C#", "C++", "Java", "C", "Go", "Rust", "Swift", "Kotlin", "PHP", "Ruby", "Scala",
  "Unity", "Unreal Engine", "Godot", "GameMaker Studio", "Construct 3", "React", "Vue.js", "Angular", "Node.js", "Express.js", "Next.js", "Nuxt.js",
  "Blender", "Maya", "3ds Max", "Cinema 4D", "Houdini", "ZBrush", "Substance Painter", "Substance Designer", "Photoshop", "Illustrator", "After Effects", "Premiere Pro",
  "Nuke", "Fusion", "Houdini", "RealFlow", "Particle Systems", "Shader Programming", "Motion Capture", "Character Animation", "Visual Effects", "Compositing",
  "Pro Tools", "Logic Pro", "Ableton Live", "FL Studio", "Cubase", "Reaper", "Sound Design", "Music Composition", "Audio Implementation", "FMOD", "Wwise",
  "Git", "Docker", "AWS", "Azure", "Google Cloud", "MongoDB", "PostgreSQL", "MySQL", "Redis", "GraphQL", "REST API", "Microservices", "DevOps", "CI/CD",
  "Game Design", "Level Design", "Gameplay Programming", "AI Programming", "Physics Programming", "Network Programming", "Mobile Development", "VR/AR Development",
  "Concept Art", "Character Design", "Environment Art", "UI Design", "UX Design", "Graphic Design", "Motion Graphics", "2D Animation", "3D Modeling", "Texturing", "Lighting", "Rigging",
  "Agile", "Scrum", "Kanban", "Jira", "Trello", "Asana", "Project Management", "Team Leadership", "Product Management",
  "Machine Learning", "Data Analysis", "Blockchain", "Cybersecurity", "Technical Writing", "Community Management", "Marketing", "Business Development"
];

// Resim validasyon kuralları
const IMAGE_RULES = {
  maxWidth: 800,
  maxHeight: 800,
  maxFileSize: 5,
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
  compressedMaxWidth: 400,
  compressQuality: 0.85
};

const validateImageFile = (file) => {
  const errors = [];
  if (!IMAGE_RULES.allowedTypes.includes(file.type)) {
    errors.push(`Sadece JPG ve PNG dosyaları kabul edilir. Seçilen dosya: ${file.type}`);
  }
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > IMAGE_RULES.maxFileSize) {
    errors.push(`Dosya boyutu ${IMAGE_RULES.maxFileSize}MB'dan küçük olmalıdır. Seçilen dosya: ${fileSizeMB.toFixed(2)}MB`);
  }
  return { isValid: errors.length === 0, errors };
};

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

const processImage = (file) => {
  return new Promise((resolve, reject) => {
    const fileValidation = validateImageFile(file);
    if (!fileValidation.isValid) {
      reject(new Error(fileValidation.errors.join('\n')));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const dimensionValidation = validateImageDimensions(img);
      if (!dimensionValidation.isValid) {
        console.warn('⚠️ Resim boyutları büyük, otomatik olarak yeniden boyutlandırılacak:', dimensionValidation.errors);
      }

      let { width, height } = img;
      const maxSize = IMAGE_RULES.compressedMaxWidth;

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

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

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
          fileSize: ((compressedDataUrl.length * 0.75) / (1024 * 1024)).toFixed(2) + 'MB'
        }
      });
    };

    img.onerror = () => {
      reject(new Error('Resim yüklenirken hata oluştu. Lütfen geçerli bir resim dosyası seçin.'));
    };

    img.src = URL.createObjectURL(file);
  });
};

const scrollbarStyles = `
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
  }
  .scrollbar-thin::-webkit-scrollbar-track {
    background: #1f1f1f;
    border-radius: 3px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #374151;
    border-radius: 3px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #4b5563;
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const EditProfileModal = ({ gamer, onClose, onSave }) => {
  // State definitions
  const [avatar, setAvatar] = useState((gamer && gamer.avatar) || "");
  const [username, setUsername] = useState((gamer && gamer.username) || "");
  const [selectedTitles, setSelectedTitles] = useState(() => {
    if (!gamer?.title) return [];
    return gamer.title.split(',').map(t => t.trim()).filter(t => t !== "");
  });

  const [userTypes, setUserTypes] = useState(() => {
    if (!gamer || !gamer.userTypes || !Array.isArray(gamer.userTypes)) return [];
    return gamer.userTypes
        .filter(t => t != null)
        .map(t => {
          if (typeof t === 'string') return t;
          if (t && typeof t === 'object') return t.type || t.id || t;
          return t;
        })
        .filter(t => t != null && t !== "");
  });

  const [selectedSkills, setSelectedSkills] = useState(() => {
    if (!gamer || !gamer.roles || !Array.isArray(gamer.roles)) return [];
    return gamer.roles
        .filter(r => r != null)
        .map(r => {
          if (typeof r === 'string') return r;
          if (r && typeof r === 'object') return r.name || r;
          return r;
        })
        .filter(r => r != null && r !== "");
  });

  const [bio, setBio] = useState((gamer && gamer.bio) || "");
  const [website, setWebsite] = useState((gamer && gamer.website) || "");
  const [socials, setSocials] = useState((gamer && gamer.socials) || []);

  // Dropdown states
  const [titleSearchTerm, setTitleSearchTerm] = useState("");
  const [skillsSearchTerm, setSkillsSearchTerm] = useState("");
  const [titleDropdownOpen, setTitleDropdownOpen] = useState(false);
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);

  // Validation states
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Character limits
  const LIMITS = {
    username: { min: 3, max: 20 },
    maxTitles: 5,
    maxSkills: 15
  };

  // ALL REACT HOOKS MUST BE HERE - BEFORE ANY CONDITIONAL RETURNS
  // Track changes
  React.useEffect(() => {
    if (!gamer) return;

    const hasChanges =
        username !== (gamer?.username || "") ||
        JSON.stringify(selectedTitles) !== JSON.stringify(gamer?.title?.split(',').map(t => t.trim()).filter(t => t !== "") || []) ||
        website !== (gamer?.website || "") ||
        JSON.stringify(userTypes) !== JSON.stringify(gamer?.userTypes || []) ||
        JSON.stringify(selectedSkills) !== JSON.stringify(gamer?.roles?.map(r => r.name || r) || []);

    setHasUnsavedChanges(hasChanges);
  }, [username, selectedTitles, website, userTypes, selectedSkills, gamer]);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setTitleDropdownOpen(false);
        setSkillsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // NOW ALL REGULAR VARIABLES AND FUNCTIONS
  // Filter functions for search
  const filteredTitles = PROFESSIONAL_TITLES.filter(title =>
      title.toLowerCase().includes(titleSearchTerm.toLowerCase())
  );

  const filteredSkills = SKILLS_OPTIONS.filter(skill =>
      skill.toLowerCase().includes(skillsSearchTerm.toLowerCase())
  );

  // Validation functions
  const validateUsername = (value) => {
    if (!value.trim()) return "Username is required";
    if (value.length < LIMITS.username.min) return `Username must be at least ${LIMITS.username.min} characters`;
    if (value.length > LIMITS.username.max) return `Username must be less than ${LIMITS.username.max} characters`;
    if (!/^[a-zA-Z0-9_.-]+$/.test(value)) return "Username can only contain letters, numbers, dots, dashes and underscores";
    return null;
  };

  const validateURL = (value) => {
    if (!value.trim()) return null;
    try {
      const url = value.startsWith('http') ? value : `https://${value}`;
      new URL(url);
      return null;
    } catch {
      return "Please enter a valid URL";
    }
  };

  const validateUserTypes = (types) => {
    if (types.length === 0) return "Please select at least one user type";
    return null;
  };

  const formatURL = (value) => {
    if (!value.trim()) return value;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    return value.startsWith('www.') ? `https://${value}` : `https://www.${value}`;
  };

  const validateField = (field, value) => {
    let error = null;
    switch (field) {
      case 'username':
        error = validateUsername(value);
        break;
      case 'website':
        error = validateURL(value);
        break;
      case 'userTypes':
        error = validateUserTypes(value);
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const isFormValid = () => {
    const usernameValid = validateUsername(username) === null;
    const websiteValid = validateURL(website) === null;
    const userTypesValid = validateUserTypes(userTypes) === null;

    return usernameValid && websiteValid && userTypesValid;
  };

  // Safety check - AFTER ALL HOOKS
  if (!gamer || typeof gamer !== 'object') {
    console.error('Gamer objesi geçersiz:', gamer);
    return <div className="text-center py-24 text-gray-400">Loading...</div>;
  }

  // Event handlers
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      console.log("📤 Resim işleniyor...");
      const result = await processImage(file);
      setAvatar(result.dataUrl);

      console.log("✅ Resim başarıyla işlendi:");
      console.log(`📏 Orijinal: ${result.originalSize.width}x${result.originalSize.height} (${result.originalSize.fileSize})`);
      console.log(`📏 İşlenmiş: ${result.finalSize.width}x${result.finalSize.height} (${result.finalSize.fileSize})`);

      if (result.originalSize.width > IMAGE_RULES.compressedMaxWidth || result.originalSize.height > IMAGE_RULES.compressedMaxWidth) {
        alert(`✅ Resim başarıyla yüklendi!\n🔧 Orijinal: ${result.originalSize.width}x${result.originalSize.height}\n✨ Optimize edilmiş: ${result.finalSize.width}x${result.finalSize.height}`);
      }

    } catch (error) {
      console.error("❌ Resim işleme hatası:", error.message);
      alert(`❌ Resim yüklenirken hata oluştu:\n\n${error.message}\n\nLütfen kurallara uygun bir resim seçin:\n• Sadece JPG/PNG formatı\n• Maksimum ${IMAGE_RULES.maxFileSize}MB\n• Maksimum ${IMAGE_RULES.maxWidth}x${IMAGE_RULES.maxHeight} piksel`);
    }
  };

  const handleUserTypeToggle = (typeId) => {
    const newTypes = userTypes.includes(typeId)
        ? userTypes.filter(t => t !== typeId)
        : [...userTypes, typeId];

    setUserTypes(newTypes);
    validateField('userTypes', newTypes);
  };

  const handleTitleToggle = (title) => {
    if (selectedTitles.includes(title)) {
      setSelectedTitles(selectedTitles.filter(t => t !== title));
    } else {
      if (selectedTitles.length < LIMITS.maxTitles) {
        setSelectedTitles([...selectedTitles, title]);
        setTitleSearchTerm("");
      }
    }
  };

  const handleSkillToggle = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      if (selectedSkills.length < LIMITS.maxSkills) {
        setSelectedSkills([...selectedSkills, skill]);
        setSkillsSearchTerm("");
      }
    }
  };

  const handleSocialChange = (idx, key, value) => {
    const newSocials = socials.map((s, i) => i === idx ? { ...s, [key]: value } : s);
    setSocials(newSocials);

    if (key === 'link') {
      const error = validateURL(value);
      setErrors(prev => ({ ...prev, [`social_${idx}`]: error }));
    }
  };

  const addSocial = () => {
    setSocials([...socials, { platform: "", link: "", color: "#6B7280" }]);
  };

  const removeSocial = (idx) => {
    setSocials(socials.filter((_, i) => i !== idx));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`social_${idx}`];
      return newErrors;
    });
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleSave = async () => {
    const usernameError = validateUsername(username);
    const websiteError = validateURL(website);
    const userTypesError = validateUserTypes(userTypes);

    const newErrors = {
      username: usernameError,
      website: websiteError,
      userTypes: userTypesError
    };

    socials.forEach((social, idx) => {
      if (social.link) {
        newErrors[`social_${idx}`] = validateURL(social.link);
      }
    });

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(error => error !== null);

    if (hasErrors) {
      setTimeout(() => {
        const firstError = document.querySelector('.border-red-500');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
      }, 100);
      return;
    }

    setIsLoading(true);

    try {
      await onSave({
        avatar,
        username: username.trim(),
        title: selectedTitles.join(', '),
        userTypes: userTypes,
        roles: selectedSkills.map(s => ({ name: s })),
        bio: bio.trim(),
        website: website.trim() ? formatURL(website.trim()) : "",
        socials: socials.filter(s => s.platform && s.link).map(s => ({
          ...s,
          link: formatURL(s.link)
        }))
      });

      setTimeout(() => {
        onClose();
      }, 500);

    } catch (error) {
      console.error("Save error:", error);
      setErrors(prev => ({ ...prev, general: "Failed to save profile. Please try again." }));
    } finally {
      setIsLoading(false);
    }
  };

  const getSocialIcon = (platform) => {
    const platformData = SOCIAL_PLATFORMS.find(p => p.value === platform);
    if (platformData) {
      const IconComponent = platformData.icon;
      return <IconComponent className="w-5 h-5" style={{ color: platformData.color }} />;
    }
    return <FaGlobe className="w-5 h-5 text-gray-400" />;
  };

  const getColorClasses = (color, isSelected) => {
    const colors = {
      blue: isSelected
          ? "bg-blue-500/20 border-blue-400 text-blue-300"
          : "bg-gray-800/50 border-gray-600 text-gray-400 hover:border-blue-400/50 hover:text-blue-400",
      green: isSelected
          ? "bg-green-500/20 border-green-400 text-green-300"
          : "bg-gray-800/50 border-gray-600 text-gray-400 hover:border-green-400/50 hover:text-green-400",
      purple: isSelected
          ? "bg-purple-500/20 border-purple-400 text-purple-300"
          : "bg-gray-800/50 border-gray-600 text-gray-400 hover:border-purple-400/50 hover:text-purple-400"
    };
    return colors[color] || colors.blue;
  };

  return (
      <>
        <style>{scrollbarStyles}</style>
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-black/75 backdrop-blur-sm rounded-lg w-full max-w-xl shadow-2xl border border-yellow-400/20 relative max-h-[85vh] overflow-hidden flex flex-col">

            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaEdit className="w-5 h-5 text-yellow-400" />
                    Edit Profile
                  </h2>
                  <p className="text-gray-400 text-xs mt-0.5">Update your gamer information</p>
                </div>
                <button
                    className="text-gray-400 hover:text-white text-lg transition-colors p-1"
                    onClick={handleClose}
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-5 overflow-y-auto scrollbar-thin">

              {/* General Error */}
              {errors.general && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400">
                    <FaExclamationTriangle className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{errors.general}</span>
                  </div>
              )}

              {/* Unsaved Changes Warning */}
              {hasUnsavedChanges && (
                  <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg flex items-center gap-2 text-yellow-400">
                    <FaExclamationTriangle className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">You have unsaved changes</span>
                  </div>
              )}

              {/* Profile Picture */}
              <div className="mb-6 text-center">
                <div className="relative group inline-block">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-gray-700 shadow-lg bg-gray-800 mx-auto">
                    <img
                        src={avatar || "https://placehold.co/120x120?text=Avatar"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <FaCamera className="text-yellow-400 w-5 h-5" />
                    <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleAvatarChange}
                        className="hidden"
                    />
                  </label>
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  Click on the avatar to change your profile picture
                  <br />
                  <span className="text-gray-500">Supported: JPG, PNG • Max: 5MB</span>
                </p>
              </div>

              {/* Username */}
              <div className="mb-4">
                <div className="relative">
                  <input
                      type="text"
                      value={username}
                      onChange={e => {
                        setUsername(e.target.value);
                        validateField('username', e.target.value);
                      }}
                      className={`w-full px-3 py-3 bg-gray-900/80 border rounded focus:outline-none transition-colors text-white placeholder-transparent peer text-sm ${
                          errors.username
                              ? 'border-red-500 focus:border-red-400'
                              : 'border-gray-700 focus:border-yellow-400'
                      }`}
                      placeholder="Username"
                      required
                  />
                  <label className="absolute left-3 top-3 text-gray-400 transition-all peer-placeholder-shown:top-3 peer-focus:top-0.5 peer-focus:text-xs peer-focus:text-yellow-400 peer-[:not(:placeholder-shown)]:top-0.5 peer-[:not(:placeholder-shown)]:text-xs">
                    Display Name *
                  </label>
                  <div className="flex justify-between items-center mt-1">
                    {errors.username ? (
                        <span className="text-red-400 text-xs flex items-center gap-1">
                          <FaExclamationTriangle className="w-3 h-3" />
                          {errors.username}
                        </span>
                    ) : (
                        <span className="text-gray-500 text-xs">Required field</span>
                    )}
                    <span className={`text-xs ${
                        username.length > LIMITS.username.max ? 'text-red-400' : 'text-gray-500'
                    }`}>
                      {username.length}/{LIMITS.username.max}
                    </span>
                  </div>
                </div>
              </div>

              {/* Professional Titles - Modern Multi-Select */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-400 mb-3">
                  Professional Titles ({selectedTitles.length}/{LIMITS.maxTitles})
                </label>

                {/* Selected Titles Display */}
                {selectedTitles.length > 0 && (
                    <div className="mb-3 p-3 bg-gray-900/50 border border-gray-700 rounded-lg">
                      <div className="flex flex-wrap gap-2">
                        {selectedTitles.map((title, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-400/30 px-3 py-1.5 rounded-full text-xs font-medium animate-fadeIn group hover:bg-yellow-400/30 transition-all"
                            >
                              {title}
                              <button
                                  type="button"
                                  onClick={() => handleTitleToggle(title)}
                                  className="hover:bg-yellow-400/40 rounded-full p-0.5 transition-colors group-hover:scale-110"
                              >
                                <FaTimes className="w-2.5 h-2.5" />
                              </button>
                            </span>
                        ))}
                      </div>
                    </div>
                )}

                {/* Search Input */}
                <div className="relative dropdown-container">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        value={titleSearchTerm}
                        onChange={(e) => {
                          setTitleSearchTerm(e.target.value);
                          setTitleDropdownOpen(true);
                        }}
                        onFocus={() => setTitleDropdownOpen(true)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-900/80 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder-gray-400 text-sm"
                        placeholder={selectedTitles.length >= LIMITS.maxTitles
                            ? `Maximum ${LIMITS.maxTitles} titles reached`
                            : "Search and add professional titles..."
                        }
                        disabled={selectedTitles.length >= LIMITS.maxTitles}
                    />
                  </div>

                  {/* Dropdown Results */}
                  {titleDropdownOpen && titleSearchTerm && filteredTitles.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-gray-900 border border-gray-600 rounded-lg shadow-xl max-h-48 overflow-y-auto scrollbar-thin">
                        {filteredTitles.slice(0, 10).map((title) => (
                            <button
                                key={title}
                                type="button"
                                onClick={() => handleTitleToggle(title)}
                                disabled={selectedTitles.includes(title) || selectedTitles.length >= LIMITS.maxTitles}
                                className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-800 transition-all flex items-center justify-between border-b border-gray-800 last:border-b-0 ${
                                    selectedTitles.includes(title)
                                        ? 'text-yellow-400 bg-yellow-400/10 cursor-not-allowed'
                                        : selectedTitles.length >= LIMITS.maxTitles
                                            ? 'text-gray-500 cursor-not-allowed opacity-50'
                                            : 'text-gray-300 hover:text-white'
                                }`}
                            >
                              <span className="flex-1">{title}</span>
                              {selectedTitles.includes(title) ? (
                                  <FaCheck className="w-3 h-3 text-yellow-400" />
                              ) : (
                                  <FaPlus className="w-3 h-3 text-gray-500" />
                              )}
                            </button>
                        ))}
                        {filteredTitles.length > 10 && (
                            <div className="px-4 py-2 text-xs text-gray-500 bg-gray-800/50">
                              +{filteredTitles.length - 10} more results...
                            </div>
                        )}
                      </div>
                  )}

                  {/* No results */}
                  {titleDropdownOpen && titleSearchTerm && filteredTitles.length === 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-gray-900 border border-gray-600 rounded-lg shadow-xl">
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          No titles found for "{titleSearchTerm}"
                        </div>
                      </div>
                  )}
                </div>

                {/* Helper text */}
                <p className="text-xs text-gray-500 mt-2">
                  Start typing to search professional titles. You can select up to {LIMITS.maxTitles} titles.
                </p>
              </div>

              {/* User Type Selection */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-400 mb-3">
                  Who are you? (You can select multiple) *
                </label>
                {errors.userTypes && (
                    <div className="mb-3 p-2 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-xs flex items-center gap-1">
                      <FaExclamationTriangle className="w-3 h-3" />
                      {errors.userTypes}
                    </div>
                )}
                <div className="space-y-2">
                  {USER_TYPES.map((type) => {
                    const isSelected = userTypes.includes(type.id);
                    const IconComponent = type.icon;
                    return (
                        <button
                            key={type.id}
                            type="button"
                            onClick={() => handleUserTypeToggle(type.id)}
                            className={`w-full p-3 border-2 rounded-lg transition-all cursor-pointer text-left ${getColorClasses(type.color, isSelected)}`}
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent className="w-5 h-5 flex-shrink-0" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm">{type.title}</h3>
                              <p className="text-xs opacity-80 mt-0.5">{type.description}</p>
                            </div>
                            {isSelected && (
                                <div className="w-5 h-5 rounded-full bg-current flex items-center justify-center flex-shrink-0">
                                  <FaCheck className="text-black text-xs" />
                                </div>
                            )}
                          </div>
                        </button>
                    );
                  })}
                </div>
              </div>

              {/* Skills & Expertise - Modern Multi-Select */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-400 mb-3">
                  Skills & Expertise ({selectedSkills.length}/{LIMITS.maxSkills})
                </label>

                {/* Selected Skills Display */}
                {selectedSkills.length > 0 && (
                    <div className="mb-3 p-3 bg-gray-900/50 border border-gray-700 rounded-lg">
                      <div className="flex flex-wrap gap-2">
                        {selectedSkills.map((skill, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-400/30 px-3 py-1.5 rounded-full text-xs font-medium animate-fadeIn group hover:bg-blue-400/30 transition-all"
                            >
                              {skill}
                              <button
                                  type="button"
                                  onClick={() => handleSkillToggle(skill)}
                                  className="hover:bg-blue-400/40 rounded-full p-0.5 transition-colors group-hover:scale-110"
                              >
                                <FaTimes className="w-2.5 h-2.5" />
                              </button>
                            </span>
                        ))}
                      </div>
                    </div>
                )}

                {/* Search Input */}
                <div className="relative dropdown-container">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        value={skillsSearchTerm}
                        onChange={(e) => {
                          setSkillsSearchTerm(e.target.value);
                          setSkillsDropdownOpen(true);
                        }}
                        onFocus={() => setSkillsDropdownOpen(true)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-900/80 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder-gray-400 text-sm"
                        placeholder={selectedSkills.length >= LIMITS.maxSkills
                            ? `Maximum ${LIMITS.maxSkills} skills reached`
                            : "Search and add your skills..."
                        }
                        disabled={selectedSkills.length >= LIMITS.maxSkills}
                    />
                  </div>

                  {/* Dropdown Results */}
                  {skillsDropdownOpen && skillsSearchTerm && filteredSkills.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-gray-900 border border-gray-600 rounded-lg shadow-xl max-h-52 overflow-y-auto scrollbar-thin">
                        {filteredSkills.slice(0, 12).map((skill) => (
                            <button
                                key={skill}
                                type="button"
                                onClick={() => handleSkillToggle(skill)}
                                disabled={selectedSkills.includes(skill) || selectedSkills.length >= LIMITS.maxSkills}
                                className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-800 transition-all flex items-center justify-between border-b border-gray-800 last:border-b-0 ${
                                    selectedSkills.includes(skill)
                                        ? 'text-blue-400 bg-blue-400/10 cursor-not-allowed'
                                        : selectedSkills.length >= LIMITS.maxSkills
                                            ? 'text-gray-500 cursor-not-allowed opacity-50'
                                            : 'text-gray-300 hover:text-white'
                                }`}
                            >
                              <span className="flex-1">{skill}</span>
                              {selectedSkills.includes(skill) ? (
                                  <FaCheck className="w-3 h-3 text-blue-400" />
                              ) : (
                                  <FaPlus className="w-3 h-3 text-gray-500" />
                              )}
                            </button>
                        ))}
                        {filteredSkills.length > 12 && (
                            <div className="px-4 py-2 text-xs text-gray-500 bg-gray-800/50">
                              +{filteredSkills.length - 12} more results...
                            </div>
                        )}
                      </div>
                  )}

                  {/* No results */}
                  {skillsDropdownOpen && skillsSearchTerm && filteredSkills.length === 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-gray-900 border border-gray-600 rounded-lg shadow-xl">
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          No skills found for "{skillsSearchTerm}"
                        </div>
                      </div>
                  )}
                </div>

                {/* Helper text */}
                <p className="text-xs text-gray-500 mt-2">
                  Start typing to search skills like "React", "Unity", "Photoshop". You can select up to {LIMITS.maxSkills} skills.
                </p>
              </div>

              {/* Website */}
              <div className="mb-4">
                <div className="relative">
                  <input
                      type="url"
                      value={website}
                      onChange={e => {
                        setWebsite(e.target.value);
                        validateField('website', e.target.value);
                      }}
                      className={`w-full px-3 py-3 pl-10 bg-gray-900/80 border rounded focus:outline-none transition-colors text-white placeholder-transparent peer text-sm ${
                          errors.website
                              ? 'border-red-500 focus:border-red-400'
                              : 'border-gray-700 focus:border-yellow-400'
                      }`}
                      placeholder="Website"
                  />
                  <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <label className="absolute left-10 top-3 text-gray-400 transition-all peer-placeholder-shown:top-3 peer-focus:top-0.5 peer-focus:text-xs peer-focus:text-yellow-400 peer-[:not(:placeholder-shown)]:top-0.5 peer-[:not(:placeholder-shown)]:text-xs">
                    Website (Portfolio, Blog, etc.)
                  </label>
                  {errors.website && (
                      <div className="mt-1">
                        <span className="text-red-400 text-xs flex items-center gap-1">
                          <FaExclamationTriangle className="w-3 h-3" />
                          {errors.website}
                        </span>
                      </div>
                  )}
                </div>
              </div>

              {/* Social Links */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-gray-400">
                    Social Links
                  </label>
                  <button
                      type="button"
                      onClick={addSocial}
                      className="text-yellow-400 hover:text-yellow-300 text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <FaPlus className="w-2.5 h-2.5" />
                    Add Link
                  </button>
                </div>

                <div className="space-y-2">
                  {socials.map((social, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2.5 border border-gray-700 rounded bg-gray-900/50">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {getSocialIcon(social.platform)}
                          <select
                              value={social.platform}
                              onChange={e => handleSocialChange(idx, "platform", e.target.value)}
                              className="border-0 bg-transparent text-xs font-medium text-gray-300 focus:ring-0 outline-none cursor-pointer"
                          >
                            <option value="" className="bg-gray-900 text-gray-300">Select Platform</option>
                            {SOCIAL_PLATFORMS.map(platform => (
                                <option key={platform.value} value={platform.value} className="bg-gray-900 text-gray-300">
                                  {platform.label}
                                </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex-1">
                          <input
                              type="url"
                              value={social.link}
                              onChange={e => handleSocialChange(idx, "link", e.target.value)}
                              placeholder="Profile URL"
                              className={`w-full px-2.5 py-1.5 bg-gray-900/80 border rounded text-xs focus:outline-none transition-colors text-white placeholder-gray-400 ${
                                  errors[`social_${idx}`]
                                      ? 'border-red-500 focus:border-red-400'
                                      : 'border-gray-700 focus:border-yellow-400'
                              }`}
                          />
                          {errors[`social_${idx}`] && (
                              <div className="mt-1">
                                <span className="text-red-400 text-xs flex items-center gap-1">
                                  <FaExclamationTriangle className="w-3 h-3" />
                                  {errors[`social_${idx}`]}
                                </span>
                              </div>
                          )}
                        </div>

                        <button
                            type="button"
                            onClick={() => removeSocial(idx)}
                            className="text-red-400 hover:text-red-300 p-1 transition-colors"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                  ))}

                  {socials.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        <p className="text-xs">No social links added yet</p>
                        <p className="text-xs mt-0.5 opacity-75">Click "Add Link" to get started</p>
                      </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-gray-700/50 bg-black/50 px-5 py-3 flex justify-between items-center">
              <div className="text-xs text-gray-500">
                {hasUnsavedChanges && "• Unsaved changes"}
              </div>
              <div className="flex gap-2">
                <button
                    onClick={handleClose}
                    className="px-4 py-2 text-gray-400 bg-gray-900/80 border border-gray-700 rounded hover:bg-gray-800 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={!isFormValid() || isLoading}
                    className={`px-4 py-2 rounded font-semibold transition-colors flex items-center gap-1.5 text-sm ${
                        isFormValid() && !isLoading
                            ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  {isLoading ? (
                      <>
                        <FaSpinner className="w-3.5 h-3.5 animate-spin" />
                        Saving...
                      </>
                  ) : (
                      <>
                        <FaSave className="w-3.5 h-3.5" />
                        Save Changes
                      </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
  );
};

export default EditProfileModal;