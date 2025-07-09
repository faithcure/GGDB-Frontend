import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUserShield,
  FaStar,
  FaTrash,
  FaRegStar,
  FaEye,
  FaBan,
  FaFileExport,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { utils, writeFile } from "xlsx";
import "flag-icons/css/flag-icons.min.css";

const roles = ["User", "Moderator", "Premium User", "Admin"];
const countryMap = { TR: "Türkiye", US: "United States", DE: "Germany", FR: "France" };

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [roleFilter, setRoleFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      toast.error("❌ Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const sendAction = async (url, method = "put", successMsg = "", failMsg = "") => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios({ url, method, headers: { Authorization: `Bearer ${token}` } });
      toast.success(successMsg);
      fetchUsers();
    } catch (err) {
      toast.error(failMsg);
    }
  };

  const handleBan = (id, username) => {
    if (window.confirm(`Kullanıcı '${username}' banlansın mı?`)) {
      sendAction(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}/ban`, "put", "🚫 User banned", "❌ Failed to ban user");
    }
  };

  const handleDelete = (id, username) => {
    if (window.confirm(`Kullanıcı '${username}' silinsin mi?`)) {
      sendAction(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, "delete", "✅ User deleted", "❌ Failed to delete user");
    }
  };

  const handleRecover = (id) => {
    sendAction(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}/recover`, "put", "♻️ User recovered", "❌ Failed to recover user");
  };

  const handleRoleChange = async (id, newRole) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Role updated");
      fetchUsers();
    } catch (err) {
      toast.error("❌ Failed to update role");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesRole = roleFilter === "" || user.role === roleFilter;
    const matchesCountry = countryFilter === "" || user.country === countryFilter;
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const isInTab = activeTab === "active" ? !user.deleted && !user.banned : user.deleted || user.banned;
    return matchesRole && matchesCountry && matchesSearch && isInTab;
  });

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  useEffect(() => { fetchUsers(); }, []);
  useEffect(() => { setCurrentPage(1); }, [roleFilter, countryFilter, searchTerm, activeTab]);

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-400">Loading users...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FaUserShield className="text-white text-lg" />
            </div>
            Manage Users
            <span className="text-base font-normal text-gray-400 ml-2">
            ({filteredUsers.length} shown / {users.length} total)
          </span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <button
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "active"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700"
              }`}
              onClick={() => setActiveTab("active")}
          >
            <FaCheckCircle className="text-sm" />
            Active Users
          </button>
          <button
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "deleted"
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700"
              }`}
              onClick={() => setActiveTab("deleted")}
          >
            <FaBan className="text-sm" />
            Banned / Deleted
            <span className="ml-2 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
            {users.filter(u => u.deleted || u.banned).length}
          </span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-lg px-4 py-2.5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-gray-700/50 border border-gray-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">All Roles</option>
              {roles.map((role) => (<option key={role} value={role}>{role}</option>))}
            </select>

            <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="bg-gray-700/50 border border-gray-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">All Countries</option>
              {[...new Set(users.map((u) => u.country).filter(Boolean))].map((c) => (
                  <option key={c} value={c}>{countryMap[c] || c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-900/50">
              <tr className="border-b border-gray-700/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Username</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">DOB</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Country</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Plan</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-200">Actions</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
              {currentUsers.map((user, index) => (
                  <tr
                      key={user._id}
                      onClick={() => navigate(`/admin/user/${user._id}`)}
                      className={`group hover:bg-gray-700/20 transition-all duration-200 cursor-pointer ${
                          user.deleted ? "opacity-60" : ""
                      } ${index % 2 === 0 ? "bg-gray-900/10" : "bg-transparent"} hover:bg-blue-500/10 hover:border-l-4 hover:border-l-blue-500`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 max-w-[200px]">
                        <div className="relative">
                          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                            {user.username?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="absolute -top-1 -right-1">
                            {user.role === "Admin" && <FaUserShield className="text-yellow-400 text-xs" />}
                            {user.role === "Premium User" && <FaStar className="text-yellow-400 text-xs" />}
                            {user.role === "User" && <FaRegStar className="text-gray-500 text-xs" />}
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium truncate">{user.username}</span>
                            {user.deleted && <FaTrash className="text-red-400 text-xs" title="Deleted" />}
                            {user.banned && <FaBan className="text-orange-400 text-xs" title="Banned" />}
                          </div>
                          <button
                              onClick={(e) => {
                                e.stopPropagation(); // Satır click'ini engelle
                                navigator.clipboard.writeText(user._id);
                                toast.info("🆔 User ID copied to clipboard");
                              }}
                              className="text-xs text-gray-400 hover:text-blue-400 transition-colors cursor-pointer font-mono tracking-wider"
                              title="Click to copy full ID"
                          >
                            {user._id}
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <button
                          onClick={(e) => {
                            e.stopPropagation(); // Satır click'ini engelle
                            navigator.clipboard.writeText(user.email);
                            toast.info("📋 Email copied");
                          }}
                          className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer text-sm"
                          title="Click to copy email"
                      >
                        {user.email || "—"}
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          onClick={(e) => e.stopPropagation()} // Satır click'ini engelle
                          className="bg-gray-700 text-white rounded-lg px-3 py-1.5 text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={user.deleted || user.banned}
                      >
                        {roles.map((role) => (<option key={role} value={role}>{role}</option>))}
                      </select>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-300">
                      {user.dob ? formatDate(user.dob) : "—"}
                    </td>

                    <td className="px-6 py-4">
                      {user.country ? (
                          <div className="flex items-center gap-2">
                            <span className={`fi fi-${user.country.toLowerCase()}`} style={{ fontSize: '14px' }}></span>
                            <span className="text-sm text-gray-300">{countryMap[user.country] || user.country}</span>
                          </div>
                      ) : (
                          <span className="text-sm text-gray-500">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-300">
                      {user.plan || "Free"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={(e) => {
                              e.stopPropagation(); // Satır click'ini engelle
                              navigate(`/admin/user/${user._id}`);
                            }}
                            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md group-hover:scale-105"
                            title="View user details"
                        >
                          <FaEye className="text-sm" />
                        </button>

                        <div className="flex gap-1 border-l border-gray-600 pl-2 ml-1">
                          {user.deleted || user.banned ? (
                              <button
                                  onClick={(e) => {
                                    e.stopPropagation(); // Satır click'ini engelle
                                    handleRecover(user._id);
                                  }}
                                  className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md group-hover:scale-105"
                                  title="Recover user"
                              >
                                <FaCheckCircle className="text-sm" />
                              </button>
                          ) : (
                              <>
                                <button
                                    onClick={(e) => {
                                      e.stopPropagation(); // Satır click'ini engelle
                                      handleBan(user._id, user.username);
                                    }}
                                    className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md group-hover:scale-105"
                                    title="Ban user"
                                >
                                  <FaBan className="text-sm" />
                                </button>
                                <button
                                    onClick={(e) => {
                                      e.stopPropagation(); // Satır click'ini engelle
                                      handleDelete(user._id, user.username);
                                    }}
                                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md group-hover:scale-105"
                                    title="Delete user"
                                >
                                  <FaTrash className="text-sm" />
                                </button>
                              </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label htmlFor="perPage" className="text-sm text-gray-300 font-medium">Rows per page:</label>
              <select
                  id="perPage"
                  value={usersPerPage}
                  onChange={(e) => setUsersPerPage(Number(e.target.value))}
                  className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {[5, 10, 20, 50].map((num) => (<option key={num} value={num}>{num}</option>))}
              </select>
            </div>

            <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">
              Showing {indexOfFirst + 1}-{Math.min(indexOfLast, filteredUsers.length)} of {filteredUsers.length}
            </span>

              <div className="flex items-center gap-1">
                <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1 mx-2">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const page = i + 1;
                    return (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                                currentPage === page
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                            }`}
                        >
                          {page}
                        </button>
                    );
                  })}
                </div>

                <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ManageUsers;