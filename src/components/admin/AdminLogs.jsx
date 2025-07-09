import React, { useState, useEffect } from 'react';
import {
  FaSearch,
  FaFilter,
  FaDownload,
  FaSync,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaGamepad,
  FaShieldAlt
} from 'react-icons/fa';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    level: 'all',
    category: 'all',
    timeRange: '24h',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 20;

  const logLevels = [
    { value: 'all', label: 'All Levels' },
    { value: 'error', label: 'Error' },
    { value: 'warning', label: 'Warning' },
    { value: 'info', label: 'Info' },
    { value: 'success', label: 'Success' }
  ];

  const logCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'auth', label: 'Authentication' },
    { value: 'user', label: 'User Actions' },
    { value: 'game', label: 'Game Management' },
    { value: 'system', label: 'System' },
    { value: 'security', label: 'Security' }
  ];

  const timeRanges = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  // Mock log data
  const mockLogs = [
    {
      id: 1,
      timestamp: new Date(),
      level: 'error',
      category: 'auth',
      message: 'Failed login attempt from IP 192.168.1.100',
      user: 'system',
      details: { ip: '192.168.1.100', attempts: 5 }
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 300000),
      level: 'info',
      category: 'user',
      message: 'User @gamer123 updated their profile',
      user: 'gamer123',
      details: { action: 'profile_update', fields: ['bio', 'avatar'] }
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 600000),
      level: 'warning',
      category: 'system',
      message: 'Database connection pool approaching limit',
      user: 'system',
      details: { current: 45, max: 50 }
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 900000),
      level: 'success',
      category: 'game',
      message: 'Game "Cyberpunk 2077" successfully approved',
      user: 'admin',
      details: { gameId: 'game_123', approver: 'admin' }
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 1200000),
      level: 'error',
      category: 'security',
      message: 'Potential SQL injection attempt detected',
      user: 'system',
      details: { ip: '10.0.0.1', endpoint: '/api/games/search' }
    }
  ];

  useEffect(() => {
    loadLogs();
  }, [filters]);

  const loadLogs = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = [...mockLogs];
    
    // Apply filters
    if (filters.level !== 'all') {
      filtered = filtered.filter(log => log.level === filters.level);
    }
    
    if (filters.category !== 'all') {
      filtered = filtered.filter(log => log.category === filters.category);
    }
    
    if (filters.search) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.user.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    setLogs(filtered);
    setFilteredLogs(filtered);
    setLoading(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const exportLogs = () => {
    // Export logs to CSV or JSON
    console.log('Exporting logs...');
  };

  const refreshLogs = () => {
    loadLogs();
  };

  const getLogIcon = (level) => {
    switch (level) {
      case 'error':
        return <FaTimesCircle className="text-red-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'info':
        return <FaInfoCircle className="text-blue-500" />;
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'auth':
        return <FaShieldAlt className="text-orange-500" />;
      case 'user':
        return <FaUser className="text-blue-500" />;
      case 'game':
        return <FaGamepad className="text-green-500" />;
      case 'system':
        return <FaInfoCircle className="text-purple-500" />;
      case 'security':
        return <FaShieldAlt className="text-red-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleString();
  };

  // Pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">System Logs</h2>
          <p className="text-white/60">Monitor system activity and events</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={refreshLogs}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <FaSync />
            Refresh
          </button>
          <button
            onClick={exportLogs}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors"
          >
            <FaDownload />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-effect rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search logs..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 transition-colors"
            />
          </div>

          {/* Level Filter */}
          <select
            value={filters.level}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
          >
            {logLevels.map(level => (
              <option key={level.value} value={level.value} className="bg-gray-800">
                {level.label}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
          >
            {logCategories.map(category => (
              <option key={category.value} value={category.value} className="bg-gray-800">
                {category.label}
              </option>
            ))}
          </select>

          {/* Time Range */}
          <select
            value={filters.timeRange}
            onChange={(e) => handleFilterChange('timeRange', e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value} className="bg-gray-800">
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-effect rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-6 text-white/70 font-medium">Time</th>
                    <th className="text-left py-4 px-6 text-white/70 font-medium">Level</th>
                    <th className="text-left py-4 px-6 text-white/70 font-medium">Category</th>
                    <th className="text-left py-4 px-6 text-white/70 font-medium">Message</th>
                    <th className="text-left py-4 px-6 text-white/70 font-medium">User</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLogs.map(log => (
                    <tr key={log.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 text-white/80 text-sm font-mono">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {getLogIcon(log.level)}
                          <span className="text-white/80 text-sm capitalize">{log.level}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(log.category)}
                          <span className="text-white/80 text-sm capitalize">{log.category}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-white text-sm max-w-md">
                        <div className="truncate">{log.message}</div>
                      </td>
                      <td className="py-4 px-6 text-white/80 text-sm">
                        {log.user}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                <div className="text-white/60 text-sm">
                  Showing {indexOfFirstLog + 1} to {Math.min(indexOfLastLog, filteredLogs.length)} of {filteredLogs.length} logs
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-white">
                    {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLogs;