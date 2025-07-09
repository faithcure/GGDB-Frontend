import React, { useEffect, useState } from 'react';
import { FaLock, FaUser, FaEye, FaEyeSlash, FaExclamationTriangle, FaShieldAlt } from 'react-icons/fa';

const MaintenancePage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const user = data.user;
        
        // Check if user is admin or moderator (case-insensitive)
        const userRole = user.role.toLowerCase();
        if (userRole === 'admin' || userRole === 'moderator') {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(user));
          
          // Reload the page to bypass maintenance mode
          window.location.reload();
        } else {
          setLoginError(`Access denied. Current role: ${user.role}. Admin or moderator privileges required.`);
        }
      } else {
        setLoginError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Connection error. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (loginError) setLoginError('');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        {/* Main Maintenance Card */}
        <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
            <div className="flex items-center justify-center space-x-3">
              <FaExclamationTriangle className="text-yellow-500 text-xl" />
              <h1 className="text-xl font-bold text-white">System Maintenance</h1>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            
            {/* Status */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-2 mb-4">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-yellow-500 font-medium">Currently Under Maintenance</span>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">GGDB</h2>
              <p className="text-gray-400 text-sm">Gaming Database Platform</p>
            </div>

            {/* Message */}
            <div className="bg-gray-700/50 rounded-lg p-4 mb-6 border border-gray-600">
              <p className="text-gray-300 text-sm leading-relaxed text-center">
                We are currently performing scheduled maintenance to improve our services. 
                The platform will be temporarily unavailable. We apologize for any inconvenience.
              </p>
            </div>

            {/* Time */}
            <div className="bg-black/30 rounded-lg p-4 mb-6 border border-gray-600">
              <div className="text-center">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Current Time</p>
                <p className="text-white text-xl font-mono mb-1">{formatTime(currentTime)}</p>
                <p className="text-gray-500 text-xs">{formatDate(currentTime)}</p>
              </div>
            </div>

            {/* Admin Login Toggle */}
            {!showLoginForm ? (
              <div className="text-center">
                <button
                  onClick={() => setShowLoginForm(true)}
                  className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <FaShieldAlt className="text-xs" />
                  <span>Staff Access</span>
                </button>
              </div>
            ) : (
              /* Login Form */
              <div className="border-t border-gray-600 pt-6">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <FaShieldAlt className="text-blue-400 text-sm" />
                  <h3 className="text-white font-medium text-sm">Administrative Access</h3>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  
                  {/* Username */}
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-wide mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm" />
                      <input
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Enter username"
                        required
                        disabled={isLoggingIn}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-wide mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={credentials.password}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-10 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Enter password"
                        required
                        disabled={isLoggingIn}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 transition-colors"
                        disabled={isLoggingIn}
                      >
                        {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {loginError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <p className="text-red-400 text-xs text-center">{loginError}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-medium text-sm transition-colors"
                  >
                    {isLoggingIn ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Authenticating...</span>
                      </div>
                    ) : (
                      'Access Platform'
                    )}
                  </button>

                  {/* Cancel */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowLoginForm(false);
                      setCredentials({ username: '', password: '' });
                      setLoginError('');
                    }}
                    className="w-full text-gray-400 hover:text-white text-xs transition-colors"
                    disabled={isLoggingIn}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-700/50 px-6 py-3 border-t border-gray-600">
            <p className="text-gray-500 text-xs text-center">
              © 2024 GGDB. All rights reserved.
            </p>
          </div>
        </div>

        {/* Note */}
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-xs">
            For support inquiries: <a href="mailto:admin@ggdb.com" className="text-blue-400 hover:text-blue-300">admin@ggdb.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;