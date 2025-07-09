// 📁 src/components/admin/AdminSidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaGamepad,
  FaUsers,
  FaHome,
  FaBars,
  FaTachometerAlt,
  FaCog,
  FaFileAlt,
  FaChartLine,
  FaList
} from "react-icons/fa";

const navItems = [
  { path: "/", label: "Site Home", icon: <FaHome /> },
  { path: "/admin/overview", label: "Overview", icon: <FaTachometerAlt /> },
  { path: "/admin/section-ordering", label: "Section Ordering", icon: <FaList /> },
  { path: "/admin/games", label: "Manage Games", icon: <FaGamepad /> },
  { path: "/admin/users", label: "Manage Users", icon: <FaUsers /> },
  { path: "/admin/analytics", label: "Analytics", icon: <FaChartLine /> },
  { path: "/admin/settings", label: "Settings", icon: <FaCog /> },
  { path: "/admin/logs", label: "System Logs", icon: <FaFileAlt /> },
];

const AdminSidebar = ({ collapsed, setCollapsed, activeModule }) => {
  const location = useLocation();

  const isActive = (path) => {
    // Special handling for root admin path
    if (path === '/admin/overview' && (location.pathname === '/admin' || location.pathname === '/admin/')) {
      return true;
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const isActiveStyle = (path) =>
    isActive(path)
      ? "bg-gray-800 text-yellow-400"
      : "text-gray-300 hover:text-white hover:bg-gray-800";

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-50 bg-gray-900 border-r border-gray-800 shadow-lg
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h2
          className={`text-lg font-bold text-yellow-400 transition-all duration-300 ${
            collapsed ? "opacity-0 scale-95 w-0 overflow-hidden" : "opacity-100 scale-100 w-auto"
          }`}
        >
          Admin Panel
        </h2>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:text-yellow-400 text-xl transition-transform hover:rotate-90"
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 mt-4">
        {navItems.map(({ path, label, icon }) => (
          <div key={path} className="relative group">
            <Link
              to={path}
              className={`flex items-center ${
                collapsed ? "justify-center" : "gap-3"
              } px-4 py-2 rounded-md transition-all duration-200 font-medium text-sm ${isActiveStyle(
                path
              )}`}
            >
              <span className="text-lg">{icon}</span>
              {!collapsed && <span>{label}</span>}
            </Link>

            {/* Sarı çizgi (aktifse) */}
            {isActive(path) && (
              <span className="absolute left-0 top-0 h-full w-1 bg-yellow-400 rounded-r-md transition-all" />
            )}

            {/* Tooltip (collapsed modda) */}
            {collapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-max z-50">
                <div className="relative px-3 py-1 bg-yellow-400 text-black text-xs rounded shadow transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                  {label}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-yellow-400" />
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer / collapse hint */}
      <div
        className={`absolute bottom-0 left-0 w-full text-center text-xs text-gray-500 pb-3 transition-opacity ${
          collapsed ? "opacity-0 hidden" : "opacity-100"
        }`}
      >
        GGDB Admin • v1.0
      </div>
    </aside>
  );
};

export default AdminSidebar;
