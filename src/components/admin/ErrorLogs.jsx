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
  FaEye,
  FaCheck,
  FaTimes,
  FaTrash,
  FaClock,
  FaServer,
  FaUser,
  FaLink,
  FaBug,
  FaExclamationCircle
} from 'react-icons/fa';
import { api } from '../../config/api';

const ErrorLogs = () => {
  const [errorLogs, setErrorLogs] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [resolveNotes, setResolveNotes] = useState('');
  const [filters, setFilters] = useState({
    level: '',
    resolved: '',
    startDate: '',
    endDate: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 20
  });

  const logLevels = [
    { value: '', label: 'All Levels' },
    { value: 'error', label: 'Error' },
    { value: 'warn', label: 'Warning' },
    { value: 'info', label: 'Info' },
    { value: 'debug', label: 'Debug' }
  ];

  const resolvedOptions = [
    { value: '', label: 'All Status' },
    { value: 'true', label: 'Resolved' },
    { value: 'false', label: 'Unresolved' }
  ];

  useEffect(() => {
    loadErrorLogs();
    loadStats();
  }, [filters, pagination.currentPage]);

  const loadErrorLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.limit,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      const response = await api.get(`/error-logs?${params}`);
      if (response.data.success) {
        setErrorLogs(response.data.data.errorLogs);
        setPagination(prev => ({
          ...prev,
          ...response.data.data.pagination
        }));
      }
    } catch (error) {
      console.error('Error loading error logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get('/error-logs/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const viewLogDetails = (log) => {
    setSelectedLog(log);
    setShowModal(true);
    setResolveNotes(log.notes || '');
  };

  const resolveLog = async (logId, resolved = true) => {
    try {
      const endpoint = resolved ? 'resolve' : 'unresolve';
      const body = resolved ? { notes: resolveNotes } : {};
      
      const response = await api.patch(`/error-logs/${logId}/${endpoint}`, body);
      if (response.data.success) {
        loadErrorLogs();
        loadStats();
        if (showModal) {
          setShowModal(false);
          setSelectedLog(null);
          setResolveNotes('');
        }
      }
    } catch (error) {
      console.error('Error updating log status:', error);
    }
  };

  const deleteLog = async (logId) => {
    if (!window.confirm('Are you sure you want to delete this error log?')) {
      return;
    }

    try {
      const response = await api.delete(`/error-logs/${logId}`);
      if (response.data.success) {
        loadErrorLogs();
        loadStats();
        if (showModal) {
          setShowModal(false);
          setSelectedLog(null);
        }
      }
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  const exportLogs = async () => {
    try {
      const params = new URLSearchParams({
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
        limit: 1000
      });

      const response = await api.get(`/error-logs?${params}`);
      if (response.data.success) {
        const logs = response.data.data.errorLogs;
        const csv = [
          ['Timestamp', 'Level', 'Message', 'Method', 'URL', 'IP', 'User', 'Resolved'].join(','),
          ...logs.map(log => [
            new Date(log.timestamp).toISOString(),
            log.level,
            `"${log.message.replace(/"/g, '""')}"`,
            log.method,
            `"${log.url}"`,
            log.ip,
            log.userId?.name || 'Anonymous',
            log.resolved
          ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `error-logs-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting logs:', error);
    }
  };

  const clearOldLogs = async () => {
    const before = prompt('Clear logs before date (YYYY-MM-DD):');
    if (!before) return;

    if (!window.confirm(`Are you sure you want to delete all logs before ${before}?`)) {
      return;
    }

    try {
      const response = await api.delete('/error-logs/bulk/clear', {
        data: { before: new Date(before).toISOString() }
      });
      if (response.data.success) {
        alert(`Deleted ${response.data.deletedCount} error logs`);
        loadErrorLogs();
        loadStats();
      }
    } catch (error) {
      console.error('Error clearing logs:', error);
    }
  };

  const getLogIcon = (level) => {
    switch (level) {
      case 'error':
        return <FaTimesCircle className="text-red-500" />;
      case 'warn':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'info':
        return <FaInfoCircle className="text-blue-500" />;
      case 'debug':
        return <FaBug className="text-gray-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const getLogLevelBadge = (level) => {
    const colors = {
      error: 'bg-red-500/20 text-red-400 border-red-500/30',
      warn: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      debug: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs border ${colors[level] || colors.info}`}>
        {level.toUpperCase()}
      </span>
    );
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Error Logs</h2>
          <p className="text-white/60">Monitor and manage system errors</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadErrorLogs}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <FaSync />
            Refresh
          </button>
          <button
            onClick={exportLogs}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <FaDownload />
            Export
          </button>
          <button
            onClick={clearOldLogs}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <FaTrash />
            Clear Old
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats.summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Errors</p>
                <p className="text-2xl font-bold text-white">{stats.summary.totalErrors}</p>
              </div>
              <FaBug className="text-red-500 text-2xl" />
            </div>
          </div>
          
          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Unresolved</p>
                <p className="text-2xl font-bold text-red-400">{stats.summary.unresolvedErrors}</p>
              </div>
              <FaExclamationCircle className="text-red-500 text-2xl" />
            </div>
          </div>
          
          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Last 24h</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.summary.last24hErrors}</p>
              </div>
              <FaClock className="text-yellow-500 text-2xl" />
            </div>
          </div>
          
          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Resolved</p>
                <p className="text-2xl font-bold text-green-400">{stats.summary.resolvedErrors}</p>
              </div>
              <FaCheckCircle className="text-green-500 text-2xl" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="glass-effect rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search errors..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 transition-colors"
            />
          </div>

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

          <select
            value={filters.resolved}
            onChange={(e) => handleFilterChange('resolved', e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
          >
            {resolvedOptions.map(option => (
              <option key={option.value} value={option.value} className="bg-gray-800">
                {option.label}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
          />

          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
          />
        </div>
      </div>

      {/* Error Logs Table */}
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
                    <th className="text-left py-4 px-6 text-white/70 font-medium">Message</th>
                    <th className="text-left py-4 px-6 text-white/70 font-medium">Method</th>
                    <th className="text-left py-4 px-6 text-white/70 font-medium">URL</th>
                    <th className="text-left py-4 px-6 text-white/70 font-medium">User</th>
                    <th className="text-left py-4 px-6 text-white/70 font-medium">Status</th>
                    <th className="text-left py-4 px-6 text-white/70 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {errorLogs.map(log => (
                    <tr key={log._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 text-white/80 text-sm">
                        <div className="font-mono">{formatTimestamp(log.timestamp)}</div>
                        <div className="text-xs text-white/40">{formatTimeAgo(log.timestamp)}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {getLogIcon(log.level)}
                          {getLogLevelBadge(log.level)}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-white text-sm max-w-md">
                        <div className="truncate" title={log.message}>{log.message}</div>
                      </td>
                      <td className="py-4 px-6 text-white/80 text-sm">
                        <span className="bg-white/10 px-2 py-1 rounded text-xs">{log.method}</span>
                      </td>
                      <td className="py-4 px-6 text-white/80 text-sm font-mono">
                        <div className="truncate max-w-xs" title={log.url}>{log.url}</div>
                      </td>
                      <td className="py-4 px-6 text-white/80 text-sm">
                        {log.userId ? (
                          <div className="flex items-center gap-2">
                            <FaUser className="text-white/40" />
                            <span>{log.userId.name || log.userId.email}</span>
                          </div>
                        ) : (
                          <span className="text-white/40">Anonymous</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {log.resolved ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <FaCheckCircle className="text-green-500" />
                              <span className="text-green-400 text-sm font-medium">Resolved</span>
                            </div>
                            {log.resolvedBy && (
                              <div className="text-xs text-white/60">
                                by {log.resolvedBy.name}
                              </div>
                            )}
                            {log.resolvedAt && (
                              <div className="text-xs text-white/40">
                                {formatTimeAgo(log.resolvedAt)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <FaTimesCircle className="text-red-500" />
                            <span className="text-red-400 text-sm">Unresolved</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewLogDetails(log)}
                            className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          {!log.resolved ? (
                            <button
                              onClick={() => resolveLog(log._id, true)}
                              className="p-2 text-green-400 hover:text-green-300 transition-colors"
                              title="Mark as Resolved"
                            >
                              <FaCheck />
                            </button>
                          ) : (
                            <button
                              onClick={() => resolveLog(log._id, false)}
                              className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                              title="Mark as Unresolved"
                            >
                              <FaTimes />
                            </button>
                          )}
                          <button
                            onClick={() => deleteLog(log._id)}
                            className="p-2 text-red-400 hover:text-red-300 transition-colors"
                            title="Delete Log"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                <div className="text-white/60 text-sm">
                  Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount} logs
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-white">
                    {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                    disabled={pagination.currentPage === pagination.totalPages}
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

      {/* Error Log Details Modal */}
      {showModal && selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">Error Log Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-sm mb-2">Timestamp</label>
                  <div className="text-white font-mono">{formatTimestamp(selectedLog.timestamp)}</div>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">Level</label>
                  <div className="flex items-center gap-2">
                    {getLogIcon(selectedLog.level)}
                    {getLogLevelBadge(selectedLog.level)}
                  </div>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">Status Code</label>
                  <div className="text-white">{selectedLog.statusCode}</div>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">Environment</label>
                  <div className="text-white">{selectedLog.environment}</div>
                </div>
              </div>

              {/* Request Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-sm mb-2">Method</label>
                  <div className="text-white">{selectedLog.method}</div>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">IP Address</label>
                  <div className="text-white font-mono">{selectedLog.ip}</div>
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">URL</label>
                <div className="text-white font-mono bg-white/5 p-3 rounded break-all">{selectedLog.url}</div>
              </div>

              {/* User Info */}
              {selectedLog.userId && (
                <div>
                  <label className="block text-white/60 text-sm mb-2">User</label>
                  <div className="text-white">{selectedLog.userId.name} ({selectedLog.userId.email})</div>
                </div>
              )}

              {/* Error Message */}
              <div>
                <label className="block text-white/60 text-sm mb-2">Error Message</label>
                <div className="text-white bg-red-500/10 border border-red-500/20 p-4 rounded">{selectedLog.message}</div>
              </div>

              {/* Stack Trace */}
              {selectedLog.stack && (
                <div>
                  <label className="block text-white/60 text-sm mb-2">Stack Trace</label>
                  <pre className="text-white bg-white/5 p-4 rounded text-sm overflow-x-auto font-mono whitespace-pre-wrap">
                    {selectedLog.stack}
                  </pre>
                </div>
              )}

              {/* Request Body */}
              {selectedLog.requestBody && (
                <div>
                  <label className="block text-white/60 text-sm mb-2">Request Body</label>
                  <pre className="text-white bg-white/5 p-4 rounded text-sm overflow-x-auto">
                    {JSON.stringify(selectedLog.requestBody, null, 2)}
                  </pre>
                </div>
              )}

              {/* Resolution Section */}
              <div className="border-t border-white/10 pt-6">
                <h4 className="text-white font-medium mb-4">Resolution</h4>
                
                {selectedLog.resolved ? (
                  <div className="space-y-4">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-green-400 mb-2">
                        <FaCheckCircle />
                        <span className="font-medium">Resolved</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-white/60">Resolved by:</span>
                          <span className="text-white ml-2 font-medium">
                            {selectedLog.resolvedBy?.name || 'Unknown Admin'}
                          </span>
                          {selectedLog.resolvedBy?.email && (
                            <span className="text-white/60 ml-1">({selectedLog.resolvedBy.email})</span>
                          )}
                        </div>
                        <div>
                          <span className="text-white/60">Resolved on:</span>
                          <span className="text-white ml-2">{formatTimestamp(selectedLog.resolvedAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {selectedLog.notes && (
                      <div>
                        <label className="block text-white/60 text-sm mb-2 font-medium">Resolution Notes</label>
                        <div className="text-white bg-white/5 border border-white/10 p-4 rounded-lg whitespace-pre-wrap">
                          {selectedLog.notes}
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={() => resolveLog(selectedLog._id, false)}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors"
                    >
                      <FaTimes />
                      Mark as Unresolved
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-red-400">
                        <FaTimesCircle />
                        <span className="font-medium">Unresolved</span>
                      </div>
                      <p className="text-white/60 text-sm mt-1">This error needs to be investigated and resolved.</p>
                    </div>
                    
                    <div>
                      <label className="block text-white/60 text-sm mb-2 font-medium">
                        Resolution Notes <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        value={resolveNotes}
                        onChange={(e) => setResolveNotes(e.target.value)}
                        placeholder="Describe how you resolved this error...&#10;&#10;Example:&#10;- Root cause: Database connection timeout&#10;- Solution: Increased connection pool size&#10;- Prevention: Added retry logic"
                        className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                        rows={5}
                        required
                      />
                      <p className="text-white/40 text-xs mt-1">Please provide details about the resolution for future reference.</p>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => resolveLog(selectedLog._id, true)}
                        disabled={!resolveNotes.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                      >
                        <FaCheck />
                        Mark as Resolved
                      </button>
                      <button
                        onClick={() => setShowModal(false)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorLogs;