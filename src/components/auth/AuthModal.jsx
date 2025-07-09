import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";

const AuthModal = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  const handleSignup = () => {
    onClose();
    navigate("/register");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md bg-black/75 backdrop-blur-sm rounded-lg p-8 shadow-xl border border-yellow-400/20 animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold transition-colors"
          aria-label="Close"
        >
          ×
        </button>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-2">
            Join the GGDB Community
          </h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Want to rate games, write reviews, or build your game collection?
            <br /> Log in or create your free account below.
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={handleLogin}
              className="w-full py-4 bg-yellow-400 text-gray-900 rounded font-semibold hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
            >
              <FaSignInAlt />
              Log In
            </button>
            <button
              onClick={handleSignup}
              className="w-full py-4 bg-gray-900/80 border border-gray-700 text-white rounded font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <FaUserPlus />
              Sign Up
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default AuthModal;