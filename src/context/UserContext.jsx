// 📁 context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../config/api";

const UserContext = createContext();

// JWT Token Validation Utility
const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // Decode JWT payload (basic validation)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (payload.exp && payload.exp < currentTime) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

// Logout utility
const clearUserSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  delete axios.defaults.headers.common['Authorization'];
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kullanıcıyı token üzerinden getir
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    
    // Validate token before making API call
    if (!token || !isTokenValid(token)) {
      clearUserSession();
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const res = await axios.get(`${API_BASE}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      console.error('Fetch user error:', err);
      
      // If unauthorized, clear session
      if (err.response?.status === 401 || err.response?.status === 403) {
        clearUserSession();
      }
      
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Logout function
  const logout = () => {
    clearUserSession();
    setUser(null);
    window.location.href = '/login';
  };

  // Login function with token validation
  const login = (token, userData) => {
    if (!isTokenValid(token)) {
      throw new Error('Invalid token received');
    }
    
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      loading, 
      fetchUser, 
      logout, 
      login,
      isTokenValid: () => isTokenValid(localStorage.getItem("token"))
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
