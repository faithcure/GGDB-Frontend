import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash, FaDiscord, FaSteam } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SiEpicgames, SiEa } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { FaWindows } from "react-icons/fa";
import { API_BASE } from "../config/api";

// Basit tooltip componenti
const Tooltip = ({ text, children }) => {
  const [show, setShow] = useState(false);

  return (
    <span
      className="relative flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      tabIndex={0}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-gray-800 text-gray-100 text-xs rounded px-3 py-2 shadow-lg z-50 min-w-[160px] text-center pointer-events-none whitespace-pre-line">
          {text}
        </span>
      )}
    </span>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { fetchUser } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      await fetchUser();

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative flex flex-col">
      {/* Arka plan görseli */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30"></div>
        </div>
      </div>

      {/* Ana içerik */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md bg-black/75 backdrop-blur-sm rounded-lg p-8 md:p-12 shadow-xl border border-yellow-400/20">
          <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
            Welcome back!
          </h1>
          <p className="text-gray-400 mb-8 text-sm">
            Log in to access your game library and community!
          </p>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-900/60 border border-red-800 rounded flex items-center gap-2 text-red-200 text-sm">
                {error}
              </div>
            )}

            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-4 bg-gray-900/80 border border-gray-700 rounded focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder:text-gray-400"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-4 bg-gray-900/80 border border-gray-700 rounded focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder:text-gray-400 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-yellow-400 text-gray-900 rounded font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Sosyal giriş ikonları */}
            <div className="flex justify-center gap-4 my-3">
              <Tooltip text="Login with Google">
                <button type="button" className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-300 hover:bg-gray-100 transition">
                  <FcGoogle size={22} title="Google" />
                </button>
              </Tooltip>
              <Tooltip text="Login with Steam">
                <button type="button" className="w-10 h-10 rounded-full bg-[#171a21] flex items-center justify-center border border-gray-700 hover:bg-opacity-90 transition">
                  <FaSteam size={20} className="text-white" title="Steam" />
                </button>
              </Tooltip>
              <Tooltip text="Login with Discord">
                <button type="button" className="w-10 h-10 rounded-full bg-[#7289da] flex items-center justify-center border border-gray-700 hover:bg-opacity-90 transition">
                  <FaDiscord size={20} className="text-white" title="Discord" />
                </button>
              </Tooltip>
              <Tooltip text="Login with Epic Games">
                <button type="button" className="w-10 h-10 rounded-full bg-[#313131] flex items-center justify-center border border-gray-700 hover:bg-opacity-90 transition">
                  <SiEpicgames size={20} className="text-white" title="Epic Games" />
                </button>
              </Tooltip>
              <Tooltip text="Login with EA Games">
                <button type="button" className="w-10 h-10 rounded-full bg-[#ff4747] flex items-center justify-center border border-gray-700 hover:bg-opacity-90 transition">
                  <SiEa size={20} className="text-white" title="EA Games" />
                </button>
              </Tooltip>

              <Tooltip text="Login with Microsoft">
                <button type="button" className="w-10 h-10 rounded-full bg-[#107C10] flex items-center justify-center border border-gray-700 hover:bg-opacity-90 transition">
                  <FaWindows size={20} className="text-white" title="Microsoft" />
                </button>
              </Tooltip>
            </div>

            <div className="flex items-center text-xs text-gray-300">
              <div className="flex-grow border-t border-gray-400" />
              <span className="mx-2">OR</span>
              <div className="flex-grow border-t border-gray-400" />
            </div>

            <div className="text-center text-xs text-gray-400 mt-4">
              <span className="mr-2">Don't have an account?</span>
              <Link to="/register" className="text-yellow-400 hover:underline">
                Create one
              </Link>
            </div>
            <div className="text-center text-xs text-yellow-400 mt-1">
              <Link to="/forgot-password" className="hover:underline">Forgot your password?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;