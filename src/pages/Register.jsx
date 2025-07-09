import React, { useState, useEffect } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaChevronDown,
  FaTimes,
  FaGoogle,
  FaSteam,
  FaApple,
  FaXbox,
  FaPlaystation,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Eğer kullanıyorsan ekle
import { API_BASE } from "../config/api";

// Arka plan görselleri (lokal)
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

// Country Selector
const COUNTRIES = [
  { value: "TR", label: "Turkey", flag: "🇹🇷" },
  { value: "US", label: "United States", flag: "🇺🇸" },
  { value: "DE", label: "Germany", flag: "🇩🇪" },
  { value: "FR", label: "France", flag: "🇫🇷" },
  { value: "GB", label: "United Kingdom", flag: "🇬🇧" },
  { value: "JP", label: "Japan", flag: "🇯🇵" },
  { value: "KR", label: "South Korea", flag: "🇰🇷" },
  { value: "CA", label: "Canada", flag: "🇨🇦" },
];

const CountrySelector = ({ open, onToggle, onChange, selectedValue }) => (
  <div className="relative">
    <button
      type="button"
      onClick={onToggle}
      className="w-full px-4 py-3 bg-gray-900/80 border border-gray-700 rounded text-left flex items-center justify-between hover:border-gray-600 focus:outline-none focus:border-yellow-400 transition-all text-white"
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{selectedValue?.flag || "🌍"}</span>
        <span className="text-gray-300">{selectedValue?.label || "Select Country"}</span>
      </div>
      <FaChevronDown className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
    {open && (
      <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded shadow-xl z-50 max-h-60 overflow-y-auto">
        {COUNTRIES.map((country) => (
          <button
            key={country.value}
            type="button"
            onClick={() => {
              onChange(country);
              onToggle();
            }}
            className="w-full px-4 py-3 text-left hover:bg-gray-800 flex items-center gap-2 transition-colors text-gray-300 hover:text-white"
          >
            <span className="text-lg">{country.flag}</span>
            <span>{country.label}</span>
          </button>
        ))}
      </div>
    )}
  </div>
);

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [bgIndex, setBgIndex] = useState(0);

  const navigate = useNavigate();
  const { fetchUser } = useUser();

  // Random arkaplan ve credit seçimi
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * RETRO_BACKGROUNDS.length);
    setBgIndex(randomIndex);
  }, []);

  const currentBg = RETRO_BACKGROUNDS[bgIndex];
  const currentCredit = PHOTO_CREDITS[bgIndex];

  // Email kontrolü
  const handleContinue = async () => {
    setError("");
    if (!form.email) {
      setError("Lütfen e-posta adresinizi girin.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/check-email`, { email: form.email });
      if (res.data.exists) {
        setError("This gamer already registered!");
      } else {
        setStep(2);
      }
    } catch {
      setError("Bağlantı hatası, tekrar deneyin.");
    }
    setLoading(false);
  };

  // Kayıt fonksiyonu
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/api/auth/register`, {
        username: form.username,
        email: form.email,
        dob: form.dob,
        country: country.value,
        password: form.password,
      });

      // Kayıt sonrası otomatik giriş/yönlendirme
      localStorage.setItem("token", res.data.token); // Eğer token dönüyorsa
      if (fetchUser) await fetchUser();

      // Admin ya da kullanıcı yönlendirmesi:
      const role = res.data.user?.role?.toLowerCase();
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      // Check if registration is disabled
      if (err.response?.status === 403 && err.response?.data?.registrationClosed) {
        setError("Registration is currently disabled. Please contact the administrator for more information.");
      } else {
        setError(
          err.response?.data?.message || "Kayıt başarısız. Lütfen tekrar deneyin."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Sosyal medya ikonları
  const socialIcons = [
    { icon: <FaGoogle className="text-[#EA4335]" />, label: "Google" },
    { icon: <FaSteam className="text-[#C0C0C0]" />, label: "Steam" },
    { icon: <FaApple className="text-gray-300" />, label: "Apple" },
    { icon: <FaXbox className="text-[#107C10]" />, label: "Xbox" },
    { icon: <FaPlaystation className="text-[#003791]" />, label: "PlayStation" },
  ];

  return (
    <div className="min-h-screen bg-black relative">
      {/* Fotoğrafçı credit'i */}
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
      {/* Dynamic Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: `url('${currentBg}')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30"></div>
        </div>
      </div>
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[100vh] px-8">
        <div className="w-full max-w-md">
          {/* Registration Form */}
          <div className="bg-black/75 backdrop-blur-sm rounded-lg p-8 md:p-12 border border-yellow-400/20 shadow-2xl">
            <h1 className="text-3xl font-bold text-white mb-8">Join the Game World</h1>
            {error && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-800 rounded flex items-center gap-3 text-red-200">
                <FaTimes />
                {error}
              </div>
            )}
            <div>
              <div className="space-y-6">
                {step === 1 ? (
                  <>
                    {/* Step 1: Email */}
                    <div>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          className="w-full px-4 py-4 bg-gray-900/80 border border-gray-700 rounded focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder-transparent peer"
                          placeholder="Email"
                          required
                        />
                        <label className="absolute left-4 top-4 text-gray-400 transition-all peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-xs peer-focus:text-yellow-400 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs">
                          Email address
                        </label>
                      </div>
                    </div>
                    {/* Get Started sarı */}
                    <button
                      type="button"
                      onClick={handleContinue}
                      className="w-full py-4 bg-yellow-400 text-gray-900 rounded font-semibold hover:bg-yellow-300 transition-colors"
                      disabled={loading}
                    >
                      {loading ? "Checking..." : "Get Started"}
                    </button>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="bg-black/75 px-4 text-gray-400">OR</span>
                      </div>
                    </div>
                    {/* Social login - küçük ve nizamlı */}
                    <div className="grid grid-cols-5 gap-2 mb-2">
                      {socialIcons.map((item, i) => (
                        <button
                          type="button"
                          key={i}
                          className="flex flex-col items-center justify-center p-2 bg-gray-900/80 rounded hover:bg-gray-800 border border-gray-800 transition-colors aspect-square"
                          title={item.label}
                        >
                          <span className="text-lg">{item.icon}</span>
                        </button>
                      ))}
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Continue with social platforms</p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Step 2: Full Registration */}
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="text"
                          name="username"
                          value={form.username}
                          onChange={handleChange}
                          className="w-full px-4 py-4 bg-gray-900/80 border border-gray-700 rounded focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder-transparent peer"
                          placeholder="Username"
                          required
                        />
                        <label className="absolute left-4 top-4 text-gray-400 transition-all peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-xs peer-focus:text-yellow-400 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs">
                          Username
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <input
                            type="date"
                            name="dob"
                            value={form.dob}
                            onChange={handleChange}
                            className="w-full px-4 py-4 bg-gray-900/80 border border-gray-700 rounded focus:outline-none focus:border-yellow-400 transition-colors text-white"
                            required
                          />
                        </div>
                        <div>
                          <CountrySelector
                            open={isOpen}
                            onToggle={() => setIsOpen(!isOpen)}
                            onChange={setCountry}
                            selectedValue={country}
                          />
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          className="w-full px-4 py-4 bg-gray-900/80 border border-gray-700 rounded focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder-transparent peer pr-12"
                          placeholder="Password"
                          required
                        />
                        <label className="absolute left-4 top-4 text-gray-400 transition-all peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-xs peer-focus:text-yellow-400 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showConfirm ? "text" : "password"}
                          name="confirmPassword"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          className="w-full px-4 py-4 bg-gray-900/80 border border-gray-700 rounded focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder-transparent peer pr-12"
                          placeholder="Confirm Password"
                          required
                        />
                        <label className="absolute left-4 top-4 text-gray-400 transition-all peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-xs peer-focus:text-yellow-400 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs">
                          Confirm Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
                        >
                          {showConfirm ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    {/* "Join the Game World" sarı */}
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full py-4 bg-yellow-400 text-gray-900 rounded font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                          Joining...
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
                      Back
                    </button>
                  </>
                )}
              </div>
            </div>
            {/* "Already a player?" */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Already a player?{" "}
                <a href="/login" className="text-yellow-400 hover:underline">
                  Sign in
                </a>
              </p>
            </div>
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-yellow-400 hover:underline">Terms of Service</a> and{" "}
                <a href="#" className="text-yellow-400 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
          {/* Features */}
          <div className="mt-8 text-center">
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="text-gray-400">
                <div className="text-3xl font-bold text-white">8.5M+</div>
                <div className="text-sm">Gamers</div>
              </div>
              <div className="text-gray-400">
                <div className="text-3xl font-bold text-white">2.3M+</div>
                <div className="text-sm">Games</div>
              </div>
              <div className="text-gray-400">
                <div className="text-3xl font-bold text-white">47M+</div>
                <div className="text-sm">Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
