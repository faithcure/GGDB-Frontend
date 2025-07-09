import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import axios from "axios";
import "flag-icons/css/flag-icons.min.css";

// Components
import FormField from "../components/common/FormField";
import PasswordStrengthMeter from "../components/common/PasswordStrengthMeter";
import StepIndicator from "../components/common/StepIndicator";
import DateSelector from "../components/common/DateSelector";
import { useUser } from "../context/UserContext";

// Utilities
import { 
  validateEmail, 
  validateUsername, 
  validatePassword, 
  validateDateOfBirth, 
  validateConfirmPassword,
  getEmailSuggestions,
  validateRegistrationForm 
} from "../utils/validation";
import { API_BASE } from "../config/api";

// Enhanced country list with more countries
const COUNTRIES = [
  { value: "US", label: "United States", flag: "US" },
  { value: "GB", label: "United Kingdom", flag: "GB" },
  { value: "DE", label: "Germany", flag: "DE" },
  { value: "FR", label: "France", flag: "FR" },
  { value: "CA", label: "Canada", flag: "CA" },
  { value: "AU", label: "Australia", flag: "AU" },
  { value: "JP", label: "Japan", flag: "JP" },
  { value: "KR", label: "South Korea", flag: "KR" },
  { value: "NL", label: "Netherlands", flag: "NL" },
  { value: "SE", label: "Sweden", flag: "SE" },
  { value: "NO", label: "Norway", flag: "NO" },
  { value: "DK", label: "Denmark", flag: "DK" },
  { value: "FI", label: "Finland", flag: "FI" },
  { value: "CH", label: "Switzerland", flag: "CH" },
  { value: "AT", label: "Austria", flag: "AT" },
  { value: "BE", label: "Belgium", flag: "BE" },
  { value: "ES", label: "Spain", flag: "ES" },
  { value: "IT", label: "Italy", flag: "IT" },
  { value: "PT", label: "Portugal", flag: "PT" },
  { value: "TR", label: "Turkey", flag: "TR" },
  { value: "BR", label: "Brazil", flag: "BR" },
  { value: "MX", label: "Mexico", flag: "MX" },
  { value: "AR", label: "Argentina", flag: "AR" },
  { value: "CL", label: "Chile", flag: "CL" },
  { value: "IN", label: "India", flag: "IN" },
  { value: "CN", label: "China", flag: "CN" },
  { value: "SG", label: "Singapore", flag: "SG" },
  { value: "TH", label: "Thailand", flag: "TH" },
  { value: "MY", label: "Malaysia", flag: "MY" },
  { value: "PH", label: "Philippines", flag: "PH" },
  { value: "ID", label: "Indonesia", flag: "ID" },
  { value: "VN", label: "Vietnam", flag: "VN" },
  { value: "ZA", label: "South Africa", flag: "ZA" },
  { value: "EG", label: "Egypt", flag: "EG" },
  { value: "NG", label: "Nigeria", flag: "NG" },
  { value: "KE", label: "Kenya", flag: "KE" },
  { value: "RU", label: "Russia", flag: "RU" },
  { value: "UA", label: "Ukraine", flag: "UA" },
  { value: "PL", label: "Poland", flag: "PL" },
  { value: "CZ", label: "Czech Republic", flag: "CZ" },
  { value: "HU", label: "Hungary", flag: "HU" },
  { value: "RO", label: "Romania", flag: "RO" },
  { value: "GR", label: "Greece", flag: "GR" },
  { value: "IL", label: "Israel", flag: "IL" },
  { value: "AE", label: "United Arab Emirates", flag: "AE" },
  { value: "SA", label: "Saudi Arabia", flag: "SA" },
  { value: "NZ", label: "New Zealand", flag: "NZ" }
];

// Background images (optimized list)
const RETRO_BACKGROUNDS = [
  '/login-register/ben-neale-zpxKdH_xNSI-unsplash.jpg',
  '/login-register/carl-raw-m3hn2Kn5Bns-unsplash.jpg',
  '/login-register/senad-palic-Qcefx5xENeA-unsplash.jpg',
  '/login-register/florian-olivo-Mf23RF8xArY-unsplash.jpg',
];

const PHOTO_CREDITS = [
  'Photo by Ben Neale on Unsplash',
  'Photo by Carl Raw on Unsplash',
  'Photo by Senad Palic on Unsplash', 
  'Photo by Florian Olivo on Unsplash',
];

const CountrySelector = ({ open, onToggle, onChange, selectedValue, error }) => (
  <div className="relative">
    <button
      type="button"
      onClick={onToggle}
      aria-label="Select country"
      aria-expanded={open}
      aria-haspopup="listbox"
      className={`
        w-full px-4 py-4 bg-gray-900/80 border rounded text-left 
        flex items-center justify-between hover:border-gray-600 
        focus:outline-none focus:border-yellow-400 transition-all text-white
        ${error ? 'border-red-500' : 'border-gray-700'}
      `}
    >
      <div className="flex items-center gap-3">
        <span 
          className={`fi fi-${selectedValue?.value?.toLowerCase() || 'xx'} text-lg`}
          style={{ fontSize: '20px' }}
        ></span>
        <span className="text-white font-medium">{selectedValue?.label || "Select Country"}</span>
      </div>
      <FaChevronDown className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
    
    {/* Floating label */}
    <label 
      className={`
        absolute left-4 top-1 text-xs transition-all duration-200 pointer-events-none
        ${open ? 'text-yellow-400' : 'text-gray-400'}
      `}
    >
      Country
    </label>
    
    {open && (
      <div 
        className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto"
        role="listbox"
      >
        {COUNTRIES.map((country) => (
          <button
            key={country.value}
            type="button"
            role="option"
            aria-selected={selectedValue?.value === country.value}
            onClick={() => {
              onChange(country);
              onToggle();
            }}
            className="w-full px-4 py-3 text-left hover:bg-gray-800 flex items-center gap-3 transition-colors text-gray-300 hover:text-white focus:bg-gray-800 focus:outline-none"
          >
            <span 
              className={`fi fi-${country.value.toLowerCase()} text-lg`}
              style={{ fontSize: '18px' }}
            ></span>
            <span>{country.label}</span>
          </button>
        ))}
      </div>
    )}
    
    {error && (
      <div className="mt-2 flex items-center gap-2 text-red-400 text-xs">
        <FaTimes className="flex-shrink-0" />
        <span>{error}</span>
      </div>
    )}
  </div>
);

const ImprovedRegister = () => {
  // Form state
  const [form, setForm] = useState({
    email: "",
    username: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });

  // UI state
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [languages, setLanguages] = useState([]);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  
  // Statistics state
  const [stats, setStats] = useState({
    gamers: "...",
    games: "...", 
    reviews: "..."
  });
  
  // Fun facts state
  const [currentFact, setCurrentFact] = useState("");
  
  const funFacts = [
    "🎮 Over 1000 new players join every hour!",
    "🏆 98% of our users rate their gaming experience as 'Epic'",
    "🌍 Players from 195+ countries game together daily",
    "⚡ Average response time: 0.3 seconds worldwide",
    "🔥 Most popular genre: Action RPGs (47% preference)",
    "🎯 Players spend avg. 2.5 hours discovering new games",
    "🚀 New game releases every 12 minutes",
    "💎 Premium members get 50% more rewards",
    "🎪 Weekend tournaments have 300K+ participants",
    "🌟 Community has shared 12M+ game screenshots"
  ];
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState({});
  const [successes, setSuccesses] = useState({});
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  
  // Debounced validation state
  const [usernameCheckLoading, setUsernameCheckLoading] = useState(false);
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);

  const navigate = useNavigate();
  const { fetchUser } = useUser();

  // Initialize background
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * RETRO_BACKGROUNDS.length);
    setBgIndex(randomIndex);
  }, []);

  // Fetch real statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch real statistics from public endpoint
        const response = await axios.get(`${API_BASE}/api/public/platform-stats`);
        const data = response.data;
        
        // Format numbers for display
        const formatNumber = (num) => {
          if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M+`;
          } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K+`;
          }
          return num.toString();
        };

        // Handle public API response format: response.data.data
        const statsData = data.data || data;
        
        setStats({
          gamers: formatNumber(statsData.totalUsers || 0),
          games: formatNumber(statsData.totalGames || 0),
          reviews: formatNumber(statsData.totalReviews || 0)
        });
      } catch (error) {
        // If backend is not ready, use fallback values
        setStats({
          gamers: "8.5M+",
          games: "2.3M+", 
          reviews: "48M+"
        });
      }
    };

    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fun facts rotation
  useEffect(() => {
    // Set initial fact
    setCurrentFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
    
    // Rotate facts every 4 seconds
    const interval = setInterval(() => {
      setCurrentFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  // Debounced email validation
  const validateEmailField = useCallback(async (email) => {
    if (!email) {
      setErrors(prev => ({ ...prev, email: "" }));
      setSuccesses(prev => ({ ...prev, email: "" }));
      setEmailSuggestions([]);
      return;
    }

    const validation = validateEmail(email);
    
    if (!validation.isValid) {
      setErrors(prev => ({ ...prev, email: validation.message }));
      setSuccesses(prev => ({ ...prev, email: "" }));
      
      // Check for email suggestions
      const suggestions = getEmailSuggestions(email);
      setEmailSuggestions(suggestions);
      return;
    }

    setErrors(prev => ({ ...prev, email: "" }));
    setEmailSuggestions([]);
    
    // Check email availability
    setEmailCheckLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/api/auth/check-email`, { email });
      if (response.data.exists) {
        setErrors(prev => ({ ...prev, email: "This email is already registered" }));
        setSuccesses(prev => ({ ...prev, email: "" }));
      } else {
        setErrors(prev => ({ ...prev, email: "" }));
        setSuccesses(prev => ({ ...prev, email: "Email is available" }));
      }
    } catch (error) {
      if (error.response?.data?.error) {
        setErrors(prev => ({ ...prev, email: error.response.data.error }));
      }
    }
    setEmailCheckLoading(false);
  }, []);

  // Debounced username validation
  const validateUsernameField = useCallback(async (username) => {
    if (!username) {
      setErrors(prev => ({ ...prev, username: "" }));
      setSuccesses(prev => ({ ...prev, username: "" }));
      return;
    }

    const validation = validateUsername(username);
    
    if (!validation.isValid) {
      setErrors(prev => ({ ...prev, username: validation.message }));
      setSuccesses(prev => ({ ...prev, username: "" }));
      return;
    }

    setErrors(prev => ({ ...prev, username: "" }));
    
    // Check username availability
    setUsernameCheckLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/api/auth/check-username`, { username });
      if (response.data.available) {
        setSuccesses(prev => ({ ...prev, username: "Username is available" }));
        setErrors(prev => ({ ...prev, username: "" }));
      } else {
        setErrors(prev => ({ ...prev, username: response.data.message || "Username is not available" }));
        setSuccesses(prev => ({ ...prev, username: "" }));
      }
    } catch (error) {
      if (error.response?.data?.error) {
        setErrors(prev => ({ ...prev, username: error.response.data.error }));
      }
    }
    setUsernameCheckLoading(false);
  }, []);

  // Real-time field validation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (step === 1 && form.email) {
        validateEmailField(form.email);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [form.email, step, validateEmailField]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (step === 2 && form.username) {
        validateUsernameField(form.username);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [form.username, step, validateUsernameField]);

  // Password validation
  useEffect(() => {
    if (form.password) {
      const validation = validatePassword(form.password);
      if (!validation.isValid) {
        setErrors(prev => ({ ...prev, password: validation.message }));
        setSuccesses(prev => ({ ...prev, password: "" }));
      } else {
        setErrors(prev => ({ ...prev, password: "" }));
        setSuccesses(prev => ({ ...prev, password: "Password strength is good" }));
      }
    } else {
      setErrors(prev => ({ ...prev, password: "" }));
      setSuccesses(prev => ({ ...prev, password: "" }));
    }
  }, [form.password]);

  // Confirm password validation
  useEffect(() => {
    if (form.confirmPassword) {
      const validation = validateConfirmPassword(form.password, form.confirmPassword);
      if (!validation.isValid) {
        setErrors(prev => ({ ...prev, confirmPassword: validation.message }));
        setSuccesses(prev => ({ ...prev, confirmPassword: "" }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: "" }));
        setSuccesses(prev => ({ ...prev, confirmPassword: "Passwords match" }));
      }
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: "" }));
      setSuccesses(prev => ({ ...prev, confirmPassword: "" }));
    }
  }, [form.password, form.confirmPassword]);

  // Date of birth validation
  useEffect(() => {
    if (form.dob) {
      const validation = validateDateOfBirth(form.dob);
      if (!validation.isValid) {
        setErrors(prev => ({ ...prev, dob: validation.message }));
        setWarnings(prev => ({ ...prev, dob: "" }));
      } else {
        setErrors(prev => ({ ...prev, dob: "" }));
        if (validation.warning) {
          setWarnings(prev => ({ ...prev, dob: validation.warning }));
        } else {
          setWarnings(prev => ({ ...prev, dob: "" }));
        }
      }
    }
  }, [form.dob]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle email suggestions
  const handleEmailSuggestion = (suggestion) => {
    setForm(prev => ({ ...prev, email: suggestion }));
    setEmailSuggestions([]);
  };

  // Step 1: Email verification
  const handleContinue = async () => {
    const validation = validateRegistrationForm(form, 1);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (errors.email || emailCheckLoading) {
      return;
    }

    setStep(2);
  };

  // Step 2: Complete registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateRegistrationForm(form, 2);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Check for any remaining errors
    if (Object.values(errors).some(error => error) || usernameCheckLoading) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE}/api/auth/register`, {
        username: form.username,
        email: form.email,
        dob: form.dob,
        country: country.value,
        languages: languages,
        password: form.password,
      });

      // Auto-login after registration
      localStorage.setItem("token", response.data.token);
      if (fetchUser) await fetchUser();

      // Redirect based on role
      const role = response.data.user?.role?.toLowerCase();
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      // Handle registration errors
      if (err.response?.status === 403 && err.response?.data?.registrationClosed) {
        setErrors({ general: "Registration is currently disabled. Please contact the administrator for more information." });
      } else {
        setErrors({ 
          general: err.response?.data?.message || "Registration failed. Please try again." 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const currentBg = RETRO_BACKGROUNDS[bgIndex];
  const currentCredit = PHOTO_CREDITS[bgIndex];

  return (
    <div className="min-h-screen bg-black relative">
      {/* Photo credit */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "18px",
          color: "#cccccc",
          opacity: 0.72,
          fontSize: "12px",
          fontStyle: "italic",
          zIndex: 50,
          pointerEvents: "none"
        }}
      >
        {currentCredit}
      </div>

      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url('${currentBg}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-8 py-12">
        <div className="w-full max-w-md">
          {/* Registration Form */}
          <div className="bg-black/75 backdrop-blur-sm rounded-lg p-8 md:p-12 border border-yellow-400/20 shadow-2xl">
            <h1 className="text-3xl font-bold text-white mb-2">Join the Game World</h1>
            <p className="text-gray-400 text-sm mb-8">Create your gaming profile and connect with millions of players</p>
            
            {/* Step Indicator */}
            <StepIndicator currentStep={step} totalSteps={2} className="mb-8" />
            
            {/* General Error */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-800 rounded flex items-center gap-3 text-red-200">
                <FaTimes />
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                /* Step 1: Email */
                <div className="space-y-6">
                  <FormField
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    label="Email address"
                    placeholder="Email address"
                    required
                    autoComplete="email"
                    error={errors.email}
                    success={successes.email}
                    suggestions={emailSuggestions}
                    onSuggestionClick={handleEmailSuggestion}
                  />
                  
                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={loading || emailCheckLoading || !!errors.email || !form.email}
                    className="w-full py-4 bg-yellow-400 text-gray-900 rounded font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {emailCheckLoading ? "Checking..." : "Continue"}
                  </button>
                </div>
              ) : (
                /* Step 2: Complete Registration */
                <div className="space-y-6">
                  <FormField
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    label="Username"
                    placeholder="Username"
                    required
                    autoComplete="username"
                    error={errors.username}
                    success={successes.username}
                  />

                  <DateSelector
                    value={form.dob}
                    onChange={handleChange}
                    label="Date of birth"
                    required
                    error={errors.dob}
                    warning={warnings.dob}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  
                  <CountrySelector
                    open={countryDropdownOpen}
                    onToggle={() => setCountryDropdownOpen(!countryDropdownOpen)}
                    onChange={setCountry}
                    selectedValue={country}
                    error={errors.country}
                  />

                  <FormField
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    label="Password"
                    placeholder="Password"
                    required
                    autoComplete="new-password"
                    error={errors.password}
                    success={successes.password}
                  >
                    <PasswordStrengthMeter password={form.password} />
                  </FormField>

                  <FormField
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    label="Confirm password"
                    placeholder="Confirm password"
                    required
                    autoComplete="new-password"
                    error={errors.confirmPassword}
                    success={successes.confirmPassword}
                  />

                  <button
                    type="submit"
                    disabled={loading || usernameCheckLoading || Object.values(errors).some(error => error)}
                    className="w-full py-4 bg-yellow-400 text-gray-900 rounded font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                        Creating account...
                      </div>
                    ) : (
                      "Join the Game World"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-yellow-400 hover:text-yellow-200 transition-colors text-sm"
                  >
                    ← Back to email
                  </button>
                </div>
              )}
            </form>

            {/* Already a player */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Already a player?{" "}
                <a href="/login" className="text-yellow-400 hover:underline">
                  Sign in
                </a>
              </p>
            </div>

            {/* Terms and Privacy */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By creating an account, you agree to our{" "}
                <a href="/terms" className="text-yellow-400 hover:underline">Terms of Service</a> and{" "}
                <a href="/privacy" className="text-yellow-400 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>

          {/* Platform Statistics */}
          <div className="mt-8 text-center">
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="text-gray-400 transition-all duration-500">
                <div className="text-2xl font-bold text-white transition-all duration-500">{stats.gamers}</div>
                <div className="text-xs">Gamers</div>
              </div>
              <div className="text-gray-400 transition-all duration-500">
                <div className="text-2xl font-bold text-white transition-all duration-500">{stats.games}</div>
                <div className="text-xs">Games</div>
              </div>
              <div className="text-gray-400 transition-all duration-500">
                <div className="text-2xl font-bold text-white transition-all duration-500">{stats.reviews}</div>
                <div className="text-xs">Reviews</div>
              </div>
            </div>
            
            {/* Fun Facts */}
            {currentFact && (
              <div className="mt-6 px-4">
                <p className="text-yellow-300 text-sm font-medium transition-all duration-500 text-center max-w-sm mx-auto">
                  {currentFact}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImprovedRegister;