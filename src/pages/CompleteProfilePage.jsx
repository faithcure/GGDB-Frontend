import React, { useState, useEffect } from "react";
import { FaCamera, FaGlobe, FaPlus, FaUser, FaArrowLeft, FaArrowRight, FaGamepad, FaHeart, FaInfoCircle } from "react-icons/fa";

const RETRO_BACKGROUNDS = [
  '/login-register/ben-neale-zpxKdH_xNSI-unsplash.jpg',
  '/login-register/carl-raw-m3hn2Kn5Bns-unsplash.jpg',
  '/login-register/senad-palic-Qcefx5xENeA-unsplash.jpg',
  '/login-register/sven-mieke-Xg2kpqP3bomw-unsplash.jpg',
  '/login-register/carl-raw-FhtnBTSkrp0-unsplash.jpg',
  '/login-register/aedrian-salazar-mSS2r9_RGgA-unsplash.jpg',
  '/login-register/ella-don-le9BekWw_Uk-unsplash.jpg',
  '/login-register/florian-olivo-Mf23RF8xArY-unsplash.jpg',
];

const PHOTO_CREDITS = [
  'Photo by Ben Neale on Unsplash',
  'Photo by Carl Raw on Unsplash',
  'Photo by Senad Palic on Unsplash',
  'Photo by Sven Mieke on Unsplash',
  'Photo by Carl Raw on Unsplash',
  'Photo by Aedrian Salazar on Unsplash',
  'Photo by Ella Don on Unsplash',
  'Photo by Florian Olivo on Unsplash',
];

const ROLES = [
  { value: "Gamer", label: "Gamer" },
  { value: "Streamer", label: "Streamer" },
  { value: "GameDev", label: "Game Industry Professional" },
  { value: "Actor", label: "Actor" },
  { value: "Writer", label: "Writer" },
  { value: "Director", label: "Director" },
  { value: "3DArtist", label: "3D Artist" },
];

const PLATFORMS = [
  { value: "Steam", label: "Steam" },
  { value: "Epic Games", label: "Epic Games" },
  { value: "Ubisoft", label: "Ubisoft Connect" },
  { value: "Origin", label: "EA Origin" },
  { value: "Battle.net", label: "Battle.net" },
  { value: "GOG", label: "GOG Galaxy" },
  { value: "Microsoft Store", label: "Microsoft Store" },
  { value: "Rockstar Games", label: "Rockstar Games Launcher" },
  { value: "Bethesda", label: "Bethesda Launcher" },
  { value: "Itch.io", label: "Itch.io" },
];

const CONSOLES = [
  { value: "PlayStation 5", label: "PlayStation 5" },
  { value: "PlayStation 4", label: "PlayStation 4" },
  { value: "Xbox Series X/S", label: "Xbox Series X/S" },
  { value: "Xbox One", label: "Xbox One" },
  { value: "Nintendo Switch", label: "Nintendo Switch" },
  { value: "Nintendo 3DS", label: "Nintendo 3DS" },
  { value: "Steam Deck", label: "Steam Deck" },
  { value: "Mobile", label: "Mobile Gaming" },
  { value: "VR", label: "VR Headsets" },
  { value: "Retro", label: "Retro Consoles" },
];

const SOCIAL_PLATFORMS = [
  { value: "Twitter", label: "Twitter/X" },
  { value: "Instagram", label: "Instagram" },
  { value: "YouTube", label: "YouTube" },
  { value: "Twitch", label: "Twitch" },
  { value: "TikTok", label: "TikTok" },
  { value: "Discord", label: "Discord" },
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "GitHub", label: "GitHub" },
  { value: "Behance", label: "Behance" },
  { value: "ArtStation", label: "ArtStation" },
  { value: "Facebook", label: "Facebook" },
  { value: "Reddit", label: "Reddit" },
];

const GENRES = [
  { value: "RPG", label: "RPG" },
  { value: "Action", label: "Action" },
  { value: "Strategy", label: "Strategy" },
  { value: "Sports", label: "Sports" },
  { value: "Adventure", label: "Adventure" },
  { value: "Indie", label: "Indie" },
];

const STEPS = [
  { id: 1, title: "Basic Info", icon: FaUser, description: "Tell us about yourself" },
  { id: 2, title: "Social Links", icon: FaGlobe, description: "Connect your profiles" },
  { id: 3, title: "Gaming Preferences", icon: FaGamepad, description: "Your gaming setup" },
  { id: 4, title: "Favorites", icon: FaHeart, description: "What you love most" }
];

const CompleteProfilePage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bgIndex, setBgIndex] = useState(0);
  const [avatar, setAvatar] = useState(null);
  const [nickname, setNickname] = useState("");
  const [role, setRole] = useState([]);
  const [website, setWebsite] = useState("");
  const [socialLinks, setSocialLinks] = useState([{ platform: "", url: "" }]);
  const [customRole, setCustomRole] = useState("");
  const [bio, setBio] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [consoles, setConsoles] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * RETRO_BACKGROUNDS.length);
    setBgIndex(randomIndex);
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSocialChange = (idx, field, value) => {
    const updated = socialLinks.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    setSocialLinks(updated);
  };

  const addCustomRole = () => {
    if (customRole.trim() && !role.includes(customRole.trim())) {
      setRole([...role, customRole.trim()]);
      setCustomRole("");
    }
  };

  const addSocial = () => setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  const removeSocial = (idx) => setSocialLinks(socialLinks.filter((_, i) => i !== idx));

  const multiToggle = (array, value, setFn) => {
    setFn(array.includes(value) ? array.filter(v => v !== value) : [...array, value]);
  };

  const validateStep = (step) => {
    switch(step) {
      case 1:
        return nickname.trim() && role.length > 0 && bio.trim();
      case 2:
        return true; // Social links are optional
      case 3:
        return platforms.length > 0 || consoles.length > 0;
      case 4:
        return genres.length > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < 4 && validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Backend API call here
    // await api.updateProfile({ avatar, nickname, role, website, socialLinks, bio, platforms, consoles, genres });
    
    setTimeout(() => {
      setLoading(false);
      // navigate("/dashboard");
      alert("Profile saved successfully!");
    }, 2000);
  };

  const currentBg = RETRO_BACKGROUNDS[bgIndex];
  const currentCredit = PHOTO_CREDITS[bgIndex];

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            {/* Avatar and Nickname Side by Side */}
            <div className="flex gap-6 items-start">
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div className="relative mb-3">
                  <img
                    src={avatar || "https://placehold.co/100x100?text=Avatar"}
                    alt="avatar"
                    className="w-24 h-24 rounded-full object-cover border-3 border-yellow-400 bg-white shadow-lg"
                  />
                  <label className="absolute right-0 bottom-0 bg-yellow-400 p-2 rounded-full cursor-pointer hover:bg-yellow-300 transition-colors shadow-lg">
                    <FaCamera className="text-black text-sm" />
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>
                </div>
                <p className="text-xs text-gray-400 text-center">Upload your profile photo</p>
              </div>

              {/* Nickname */}
              <div className="flex-1">
                <label className="block font-medium text-white mb-2 text-sm">Gaming Nickname *</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  placeholder="Enter your gaming nickname"
                  className="w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                  required
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block font-medium text-white mb-3 text-sm">What do you do? *</label>
              
              {/* Role Selection Buttons */}
              <div className="bg-white/5 rounded-lg p-4 mb-4 border border-white/10">
                <div className="flex flex-wrap gap-2">
                  {ROLES.map(r => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => multiToggle(role, r.value, setRole)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all border ${
                        role.includes(r.value)
                          ? "bg-yellow-400 text-black border-yellow-400"
                          : "bg-white/5 text-white border-white/20 hover:border-yellow-400/50 hover:bg-white/10"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Selected Roles Display */}
              {role.length > 0 && (
                <div className="bg-yellow-400/10 rounded-lg p-3 mb-4 border border-yellow-400/20">
                  <p className="text-yellow-400 text-xs font-medium mb-2">Selected Roles:</p>
                  <div className="flex flex-wrap gap-2">
                    {role.map((selectedRole, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-400/30 text-yellow-300 rounded-full text-xs border border-yellow-400/40"
                      >
                        {selectedRole}
                        <button
                          type="button"
                          onClick={() => setRole(role.filter(r => r !== selectedRole))}
                          className="ml-1 text-yellow-300 hover:text-yellow-100 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Add Custom Role */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-gray-400 text-xs mb-2">Add your own role:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customRole}
                    onChange={e => setCustomRole(e.target.value)}
                    placeholder="e.g. Content Creator, Modder..."
                    className="flex-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                    onKeyPress={(e) => e.key === 'Enter' && addCustomRole()}
                  />
                  <button
                    type="button"
                    onClick={addCustomRole}
                    className="bg-yellow-400 px-4 py-3 rounded-lg text-black hover:bg-yellow-300 transition-colors shadow-lg font-medium text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block font-medium text-white mb-2 text-sm">About You *</label>
              <textarea
                rows={3}
                className="w-full rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all resize-none"
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Tell us a bit about yourself, your interests, and what you're passionate about..."
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div className="text-center mb-4">
              <FaGlobe className="text-yellow-400 text-3xl mx-auto mb-1" />
              <p className="text-gray-300 text-sm">Connect your online presence (optional)</p>
            </div>

            {/* Website */}
            <div>
              <label className="block font-medium text-white mb-2 text-sm">Personal Website</label>
              <div className="flex items-center gap-3">
                <FaGlobe className="text-yellow-400 text-lg" />
                <input
                  type="url"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="flex-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                />
              </div>
            </div>

            {/* Social Links */}
            <div>
              <label className="block font-medium text-white mb-2 text-sm">Social Media Links</label>
              <div className="space-y-2">
                {socialLinks.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <select
                      value={item.platform}
                      onChange={e => handleSocialChange(idx, "platform", e.target.value)}
                      className="rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white p-3 text-sm w-1/3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                    >
                      <option value="" className="bg-gray-800 text-white">Select Platform</option>
                      {SOCIAL_PLATFORMS.map(platform => (
                        <option key={platform.value} value={platform.value} className="bg-gray-800 text-white">
                          {platform.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="url"
                      value={item.url}
                      onChange={e => handleSocialChange(idx, "url", e.target.value)}
                      placeholder="https://link.com"
                      className="rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white p-3 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                    />
                    {idx === 0 ? (
                      <button 
                        type="button" 
                        onClick={addSocial} 
                        className="bg-yellow-400 px-3 py-3 rounded-lg text-black hover:bg-yellow-300 transition-colors shadow-lg"
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    ) : (
                      <button 
                        type="button" 
                        onClick={() => removeSocial(idx)} 
                        className="bg-red-600 px-3 py-3 rounded-lg text-white hover:bg-red-500 transition-colors shadow-lg text-sm font-bold"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <FaGamepad className="text-yellow-400 text-3xl mx-auto mb-1" />
              <p className="text-gray-300 text-sm">Tell us about your gaming setup</p>
            </div>

            {/* Platforms */}
            <div>
              <label className="block font-medium text-white mb-3 text-sm">Favorite Gaming Platforms *</label>
              
              {/* Platform Selection */}
              <div className="bg-white/5 rounded-lg p-4 mb-4 border border-white/10">
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map(p => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => multiToggle(platforms, p.value, setPlatforms)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all border ${
                        platforms.includes(p.value)
                          ? "bg-yellow-400 text-black border-yellow-400"
                          : "bg-white/5 text-white border-white/20 hover:border-yellow-400/50 hover:bg-white/10"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Selected Platforms Display */}
              {platforms.length > 0 && (
                <div className="bg-yellow-400/10 rounded-lg p-3 border border-yellow-400/20">
                  <p className="text-yellow-400 text-xs font-medium mb-2">Selected Platforms:</p>
                  <div className="flex flex-wrap gap-2">
                    {platforms.map((selectedPlatform, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-400/30 text-yellow-300 rounded-full text-xs border border-yellow-400/40"
                      >
                        {PLATFORMS.find(p => p.value === selectedPlatform)?.label || selectedPlatform}
                        <button
                          type="button"
                          onClick={() => setPlatforms(platforms.filter(p => p !== selectedPlatform))}
                          className="ml-1 text-yellow-300 hover:text-yellow-100 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Consoles */}
            <div>
              <label className="block font-medium text-white mb-3 text-sm">Favorite Gaming Consoles</label>
              
              {/* Console Selection */}
              <div className="bg-white/5 rounded-lg p-4 mb-4 border border-white/10">
                <div className="flex flex-wrap gap-2">
                  {CONSOLES.map(c => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => multiToggle(consoles, c.value, setConsoles)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all border ${
                        consoles.includes(c.value)
                          ? "bg-yellow-400 text-black border-yellow-400"
                          : "bg-white/5 text-white border-white/20 hover:border-yellow-400/50 hover:bg-white/10"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Selected Consoles Display */}
              {consoles.length > 0 && (
                <div className="bg-yellow-400/10 rounded-lg p-3 border border-yellow-400/20">
                  <p className="text-yellow-400 text-xs font-medium mb-2">Selected Consoles:</p>
                  <div className="flex flex-wrap gap-2">
                    {consoles.map((selectedConsole, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-400/30 text-yellow-300 rounded-full text-xs border border-yellow-400/40"
                      >
                        {CONSOLES.find(c => c.value === selectedConsole)?.label || selectedConsole}
                        <button
                          type="button"
                          onClick={() => setConsoles(consoles.filter(c => c !== selectedConsole))}
                          className="ml-1 text-yellow-300 hover:text-yellow-100 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <div className="text-center mb-4">
              <FaHeart className="text-yellow-400 text-3xl mx-auto mb-1" />
              <p className="text-gray-300 text-sm">What types of games do you love?</p>
            </div>

            <div>
              <label className="block font-medium text-white mb-3 text-sm">Favorite Game Genres *</label>
              
              {/* Genre Selection */}
              <div className="bg-white/5 rounded-lg p-4 mb-4 border border-white/10">
                <div className="flex flex-wrap gap-2">
                  {GENRES.map(g => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => multiToggle(genres, g.value, setGenres)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all border ${
                        genres.includes(g.value)
                          ? "bg-yellow-400 text-black border-yellow-400"
                          : "bg-white/5 text-white border-white/20 hover:border-yellow-400/50 hover:bg-white/10"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Selected Genres Display */}
              {genres.length > 0 && (
                <div className="bg-yellow-400/10 rounded-lg p-3 mb-4 border border-yellow-400/20">
                  <p className="text-yellow-400 text-xs font-medium mb-2">Selected Genres:</p>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((selectedGenre, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-400/30 text-yellow-300 rounded-full text-xs border border-yellow-400/40"
                      >
                        {GENRES.find(g => g.value === selectedGenre)?.label || selectedGenre}
                        <button
                          type="button"
                          onClick={() => setGenres(genres.filter(g => g !== selectedGenre))}
                          className="ml-1 text-yellow-300 hover:text-yellow-100 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-yellow-400/15 backdrop-blur-sm rounded-lg p-4 border border-yellow-400/30">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="text-yellow-400 text-lg mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-medium mb-1 text-sm">Almost done!</h3>
                  <p className="text-gray-300 text-xs">
                    You're about to complete your profile. This information helps us connect you with like-minded gamers and creators in our community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Photo Credit */}
      <div className="absolute bottom-4 right-6 text-gray-400 opacity-70 text-xs italic z-50 pointer-events-none">
        {currentCredit}
      </div>

      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url('${currentBg}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-8 pt-24">
        <div className="w-full max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Complete Your Profile</h1>
            <p className="text-gray-300 text-sm">Let's get to know you better</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all ${
                      currentStep >= step.id 
                        ? 'bg-yellow-400 text-black' 
                        : 'bg-white/20 text-gray-400'
                    }`}>
                      <Icon className="text-sm" />
                    </div>
                    <span className={`text-xs font-medium ${
                      currentStep >= step.id ? 'text-yellow-400' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 bg-white/20 rounded-full h-1.5">
              <div 
                className="bg-yellow-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-black/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-400/20 shadow-2xl">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-white mb-1">
                {STEPS[currentStep - 1].title}
              </h2>
              <p className="text-gray-400 text-sm">
                {STEPS[currentStep - 1].description}
              </p>
            </div>

            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <FaArrowLeft className="text-xs" /> Previous
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                >
                  Next <FaArrowRight className="text-xs" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !validateStep(currentStep)}
                  className="px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                >
                  {loading ? "Saving..." : "Complete Profile"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;