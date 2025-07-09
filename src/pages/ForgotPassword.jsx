import { useNavigate } from "react-router-dom";
import React, { useState } from "react";


const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("");
    setError("");
    setLoading(true);

    // Simulated API call
    setTimeout(() => {
      if (email.includes('@')) {
        setStatus("Password reset email sent to " + email);
        setError("");
      } else {
        setError("Please enter a valid email address.");
        setStatus("");
      }
      setLoading(false);
    }, 1500);
  };

const handleLoginClick = () => {
  navigate("/login");      // login sayfasına yönlendir
};

const handleRegisterClick = () => {
  navigate("/register");   // register sayfasına yönlendir
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
            Forgot Password? 
          </h1>
          <p className="text-gray-400 mb-8 text-sm">
            Don't worry! Enter your email and we'll send you a link to reset your password.
          </p>
          
          <div className="space-y-6">
            {status && (
              <div className="p-3 bg-green-900/60 border border-green-800 rounded flex items-center gap-2 text-green-200 text-sm">
                {status}
              </div>
            )}
            
            {error && (
              <div className="p-3 bg-red-900/60 border border-red-800 rounded flex items-center gap-2 text-red-200 text-sm">
                {error}
              </div>
            )}

            <div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-4 bg-gray-900/80 border border-gray-700 rounded focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder:text-gray-400"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-yellow-400 text-gray-900 rounded font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="flex items-center text-xs text-gray-300">
              <div className="flex-grow border-t border-gray-400" />
              <span className="mx-2">OR</span>
              <div className="flex-grow border-t border-gray-400" />
            </div>

            <div className="text-center text-xs text-gray-400 mt-4">
              <span className="mr-2">Remembered your password?</span>
              <button 
                onClick={handleLoginClick}
                className="text-yellow-400 hover:underline cursor-pointer bg-transparent border-none p-0"
              >
                Back to login
              </button>
            </div>
            
            <div className="text-center text-xs text-yellow-400 mt-1">
              <button 
                onClick={handleRegisterClick}
                className="hover:underline cursor-pointer bg-transparent border-none p-0 text-yellow-400"
              >
                Create new account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;