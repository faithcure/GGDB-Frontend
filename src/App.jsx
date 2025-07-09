import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 🧩 Pages
import Login from "./pages/Login";
import ImprovedRegister from "./pages/ImprovedRegister";
import ForgotPassword from "./pages/ForgotPassword";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminDashboard from "./pages/AdminDashboard";
import GameDetail from "./pages/GameDetail";
import GameReviewPage from "./components/game/review/GameReviewPage";
import CastAndCrewPage from "./pages/CastAndCrewPage";
import PersonDetailPage from "./pages/PersonDetailPage";
import UserDetail from "./components/admin/UserDetail";
import NotFound from "./pages/NotFound";
import TrailerShowcase from "./pages/TrailerShowcase";
import PublicGamerPortfolio from "./pages/PublicGamerPortfolio";
import NewDashboard from "./pages/NewDashboard";
import GamerDashboard from "./components/dashboard/gamerDashboard/GamerDashboard";
import MediaPreviewPage from "./pages/MediaPreviewPage";
import TopRatedPage from "./pages/TopRatedPage";
import AwardsPage from "./pages/AwardsPage";
import CommunityPage from "./pages/CommunityPage";
import StudiosPage from "./pages/StudiosPage";
import GenresPage from "./pages/GenresPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import FindFriendsPage from "./pages/FindFriendsPage";
import ConnectionsPage from "./pages/ConnectionsPage";

// 🧱 Layout Components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import MaintenancePage from "./components/maintenance/MaintenancePage";

// 🏠 Home Sections
import HeroSection from "./components/home/HeroSection";
import FeaturedSection from "./components/home/FeaturedSection";
import FeaturedTodaySection from "./components/home/FeaturedTodaySection";
import TopRatedSection from "./components/home/TopRatedSection";
import MostPlayedSection from "./components/home/MostPlayedSection";
import PopularArtistsSection from "./components/home/PopularArtistsSection";
import MostVisitedCreditsSection from "./components/home/MostVisitedCreditsSection";
import WhatToPlaySection from "./components/home/WhatToPlaySection";
import UpcomingGamesSection from "./components/home/UpcomingGamesSection";
import TopSection from "./components/home/TopSection";
import TopCompanySection from "./components/home/TopCompanySection";
import SectionOrderingPage from "./pages/admin/SectionOrderingPage";
import DynamicHomepage from "./components/home/DynamicHomepage";

// 🔒 Protected Route Wrappers
import RequireAuth from "./components/protected/RequireAuth";
import RequireAdmin from "./components/protected/RequireAdmin";
import CompleteProfilePage from "./pages/CompleteProfilePage";

// 🧠 Global User Context
import { UserProvider } from "./context/UserContext";
import { NotificationProvider } from "./context/NotificationContext";

// 🛡️ Error Boundary
import ErrorBoundary from "./components/common/ErrorBoundary";
import useMaintenanceMode from "./hooks/useMaintenanceMode";
import useFavicon from "./hooks/useFavicon";

// Component to handle conditional header rendering
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { isMaintenanceMode, maintenanceInfo, loading } = useMaintenanceMode();
  
  // Initialize favicon management
  useFavicon();

  // Show loading while checking maintenance mode
  if (loading) {
    return (
      <div className="bg-gray-950 text-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        <span className="ml-3 text-white">Loading...</span>
      </div>
    );
  }

  // Show maintenance page if maintenance mode is active
  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen flex flex-col">
      {/* Only show Header if not on admin routes */}
      {!isAdminRoute && <Header />}

      <main className="flex-grow">
            <Routes>
              {/* 🌍 Public Routes */}
              <Route
                path="/"
                element={<DynamicHomepage />}
              />
              <Route path="/new-dashboard" element={<NewDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<ImprovedRegister />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/game/:id" element={<GameDetail />} />
              <Route path="/game/:gameId/reviews" element={<GameReviewPage />} />
              <Route path="/preview/:type/:id" element={<MediaPreviewPage />} />
              <Route path="/game/:id/cast-crew" element={<CastAndCrewPage />} />
              <Route path="/person/:slug" element={<PersonDetailPage />} />
              {/* 🌍 Personal/Professional Profile - accessible to all */}
              <Route path="/profile/:username" element={<PublicGamerPortfolio />} />
              <Route path="/portfolio/:slug" element={<PublicGamerPortfolio />} />
              <Route path="/portfolio/:id" element={<PublicGamerPortfolio />} />
              <Route path="/trailers" element={<TrailerShowcase />} />
              <Route path="/top-rated" element={<TopRatedPage />} />
              <Route path="/awards" element={<AwardsPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/studios" element={<StudiosPage />} />
              <Route path="/genres" element={<GenresPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/find-friends" element={<FindFriendsPage />} />
              <Route path="/connections" element={<ConnectionsPage />} />
              {/* 🌍 Public Gamer Dashboard - accessible to all */}
              <Route path="/gamer/:username" element={<GamerDashboard />} />
              <Route path="/dashboard/:username?" element={<GamerDashboard />} />
              
              {/* 🔐 My Dashboard redirect for authenticated users */}
              <Route
                path="/my-dashboard"
                element={
                  <RequireAuth>
                    <GamerDashboard />
                  </RequireAuth>
                }
              />
              {/* 🔐 Edit Profile */}
              <Route
                path="/complete-profile"
                element={
                  <RequireAuth>
                    <CompleteProfilePage />
                  </RequireAuth>
                }
              />

              {/* 🔐 Admin Panel */}
              <Route
                path="/admin/*"
                element={
                  <RequireAdmin>
                    <AdminDashboard />
                  </RequireAdmin>
                }
              />

              {/* 🔍 User Detail Page */}
              <Route
                path="/admin/user/:id"
                element={
                  <RequireAdmin>
                    <UserDetail />
                  </RequireAdmin>
                }
              />

              {/* 🧱 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

      {/* Only show Footer if not on admin routes */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <NotificationProvider>
          <Router>
            <AppContent />
            
            {/* Toast Container */}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </Router>
        </NotificationProvider>
      </UserProvider>
    </ErrorBoundary>
  );
}

export default App;
