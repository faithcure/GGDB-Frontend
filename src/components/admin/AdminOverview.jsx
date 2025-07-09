import React from 'react';
import {
  FaUsers,
  FaGamepad,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaShieldAlt,
  FaChartLine,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AdminOverview = ({ stats }) => {

  // Mock data for charts
  const userGrowthData = [
    { date: '2024-06-24', users: 12500, games: 5600 },
    { date: '2024-06-25', users: 12580, games: 5615 },
    { date: '2024-06-26', users: 12650, games: 5625 },
    { date: '2024-06-27', users: 12720, games: 5640 },
    { date: '2024-06-28', users: 12780, games: 5650 },
    { date: '2024-06-29', users: 12820, games: 5660 },
    { date: '2024-06-30', users: 12847, games: 5632 }
  ];

  const activityData = [
    { name: 'Reviews', value: 35, color: '#FCD34D' },
    { name: 'Registrations', value: 25, color: '#60A5FA' },
    { name: 'Game Submissions', value: 20, color: '#34D399' },
    { name: 'Reports', value: 15, color: '#F87171' },
    { name: 'Other', value: 5, color: '#A78BFA' }
  ];

  const recentActions = [
    {
      id: 1,
      type: 'user_ban',
      message: 'Banned user @spammer123 for violations',
      time: '2 minutes ago',
      severity: 'high',
      icon: <FaShieldAlt />
    },
    {
      id: 2,
      type: 'game_approval',
      message: 'Approved game "Cyberpunk Adventure"',
      time: '15 minutes ago',
      severity: 'medium',
      icon: <FaCheckCircle />
    },
    {
      id: 3,
      type: 'system_alert',
      message: 'API response time threshold exceeded',
      time: '1 hour ago',
      severity: 'high',
      icon: <FaExclamationTriangle />
    },
    {
      id: 4,
      type: 'user_verification',
      message: 'Verified 12 new user accounts',
      time: '2 hours ago',
      severity: 'low',
      icon: <FaUsers />
    }
  ];

  const StatCard = ({ title, value, change, icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-xl p-6 hover:scale-105 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
          trend === 'up' ? 'bg-green-500/20 text-green-400' : 
          trend === 'down' ? 'bg-red-500/20 text-red-400' : 
          'bg-gray-500/20 text-gray-400'
        }`}>
          {trend === 'up' ? <FaArrowUp /> : trend === 'down' ? <FaArrowDown /> : <FaClock />}
          {change}
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-sm text-white/60">{title}</div>
    </motion.div>
  );

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Admin Overview</h2>
        <p className="text-white/60">Monitor your platform's performance and activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          change="+12%"
          trend="up"
          icon={<FaUsers />}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Total Games"
          value={stats.totalGames}
          change="+5%"
          trend="up"
          icon={<FaGamepad />}
          color="from-green-500 to-green-600"
        />
        <StatCard
          title="Total Reviews"
          value={stats.totalReviews}
          change="+18%"
          trend="up"
          icon={<FaStar />}
          color="from-yellow-500 to-yellow-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FaChartLine className="text-blue-500" />
            Platform Growth
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#60A5FA" 
                  strokeWidth={3}
                  dot={{ fill: '#60A5FA', strokeWidth: 2 }}
                  name="Users"
                />
                <Line 
                  type="monotone" 
                  dataKey="games" 
                  stroke="#34D399" 
                  strokeWidth={3}
                  dot={{ fill: '#34D399', strokeWidth: 2 }}
                  name="Games"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Distribution */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FaEye className="text-green-500" />
            Activity Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {activityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FaClock className="text-yellow-500" />
          Recent Admin Actions
        </h3>
        <div className="space-y-3">
          {recentActions.map(action => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                action.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                action.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {action.icon}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">{action.message}</p>
                <p className="text-white/60 text-xs">{action.time}</p>
              </div>
              <div className={`w-2 h-2 rounded-full ${
                action.severity === 'high' ? 'bg-red-500' :
                action.severity === 'medium' ? 'bg-yellow-500' :
                'bg-green-500'
              }`}></div>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <button className="text-yellow-400 hover:text-yellow-300 text-sm">
            View all activity
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.systemHealth && Object.entries(stats.systemHealth).map(([service, status]) => (
          <div key={service} className="glass-effect rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white capitalize">{service}</h4>
                <p className="text-white/60 text-sm capitalize">{status}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                status === 'healthy' ? 'bg-green-500' :
                status === 'warning' ? 'bg-yellow-500 animate-pulse' :
                'bg-red-500 animate-pulse'
              }`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;