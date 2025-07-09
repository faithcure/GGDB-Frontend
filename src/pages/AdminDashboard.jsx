// 📁 pages/AdminDashboard.jsx - Enhanced Admin Panel
import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import AdminOverview from "../components/admin/AdminOverview";
import GameList from "../components/admin/GameList";
import ManageUsers from "../components/admin/ManageUsers";
import Analytics from "../components/admin/Analytics";
import EditGameDetail from "../components/admin/EditGameDetail";
import AdminSettings from "../components/admin/AdminSettings";
import AdminLogs from "../components/admin/AdminLogs";
import SectionOrderingPage from "./admin/SectionOrderingPage";
import { useUser } from "../context/UserContext";
import { SectionLoader } from "../components/common/PageTransition";
import { API_BASE } from "../config/api";

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeModule, setActiveModule] = useState('overview');
  const [adminStats, setAdminStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: userLoading } = useUser();
  const location = useLocation();

  useEffect(() => {
    // Load admin dashboard data
    loadAdminData();
  }, []);

  useEffect(() => {
    // Update active module based on route
    const path = location.pathname.split('/').pop();
    setActiveModule(path || 'overview');
  }, [location]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/admin/platform-stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch platform statistics');
      }
      
      const data = await response.json();
      if (data.success) {
        setAdminStats(data.data);
      } else {
        throw new Error(data.message || 'Failed to load admin statistics');
      }
    } catch (error) {
      console.error('Failed to load admin data:', error);
      // Fallback to mock data if API fails
      setAdminStats({
        totalUsers: 0,
        totalGames: 0,
        totalReviews: 0,
        recentActivity: [],
        systemHealth: {
          server: 'error',
          database: 'error',
          cdn: 'error',
          apis: 'error'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (user?.role?.toLowerCase() !== "admin") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-400">Access Denied</h2>
          <p className="text-gray-400">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.3
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <AdminSidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed}
        activeModule={activeModule}
      />

      <div className={`transition-all duration-300 ease-in-out ${
        collapsed ? "ml-20" : "ml-64"
      }`}>
        <AdminHeader 
          user={user} 
          adminStats={adminStats}
          activeModule={activeModule}
        />

        <main className="px-6 py-6 relative z-10">
          <SectionLoader isLoading={loading}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Routes>
                  <Route path="/" element={<AdminOverview stats={adminStats} />} />
                  <Route path="overview" element={<AdminOverview stats={adminStats} />} />
                  <Route path="games" element={<GameList />} />
                  <Route path="view/:id" element={<EditGameDetail />} />
                  <Route path="users" element={<ManageUsers />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="section-ordering" element={<SectionOrderingPage />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="logs" element={<AdminLogs />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </SectionLoader>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
