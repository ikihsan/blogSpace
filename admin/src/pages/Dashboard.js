// Cleaned Dashboard: single-definition, appearance-only changes preserved
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const fetchDashboardStats = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/blogs/admin/stats`);
  return data;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const Dashboard = () => {
  const { data: stats, isLoading, isError } = useQuery('dashboardStats', fetchDashboardStats);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <span className="ml-3 text-lg text-gray-300">Loading dashboard...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">
          <span className="text-4xl">⚠️</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Error loading dashboard</h3>
        <p className="text-gray-400">Please try refreshing the page</p>
      </div>
    );
  }

  const chartData = {
    labels: ['Total Blogs', 'Published', 'Drafts'],
    datasets: [
      {
        label: 'Blog Stats',
        data: [stats.totalBlogs, stats.publishedBlogs, stats.draftBlogs],
        backgroundColor: ['#6366f1', '#10b981', '#f59e0b'],
      },
    ],
  };

  return (
  <div className="space-y-12">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
  className="bg-white/10 backdrop-blur-2xl rounded-3xl p-10 border border-white/20 shadow-2xl relative overflow-hidden animate-fade-in"
  style={{boxShadow:'0 8px 32px 0 rgba(31, 38, 135, 0.37)'}}>
  <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(circle at 60% 40%, #6366f1 0%, transparent 70%)'}}></div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
            <p className="text-gray-400">Monitor your blog performance and manage content</p>
          </div>
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/blogs/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <span>✏️</span>
                New Blog
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-600 transition-all duration-200"
              >
                <span>📝</span>
                Manage Blogs
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
      >
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-indigo-500/50 transition-colors duration-200">
          <div className="flex items-center justify-between animate-slide-in">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Blogs</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.totalBlogs}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl animate-bounce">📝</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-green-500/50 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Published</p>
              <p className="text-2xl font-bold text-green-400 mt-1">{stats.publishedBlogs}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl animate-bounce">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Drafts</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">{stats.draftBlogs}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl animate-bounce">📝</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-pink-500/50 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Views</p>
              <p className="text-2xl font-bold text-pink-400 mt-1">{stats.totalViews || 0}</p>
            </div>
            <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl animate-bounce">👁️</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Blog Statistics Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
  className="bg-white/10 backdrop-blur-2xl rounded-3xl p-10 border border-white/20 shadow-2xl relative overflow-hidden animate-fade-in"
  style={{boxShadow:'0 8px 32px 0 rgba(31, 38, 135, 0.37)'}}>
  <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(circle at 60% 40%, #6366f1 0%, transparent 70%)'}}></div>
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <span>📊</span>
          Blog Statistics
        </h3>
        <div className="h-64">
          <Bar data={chartData} options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: {
                  color: '#9CA3AF'
                }
              }
            },
            scales: {
              x: {
                ticks: { color: '#9CA3AF' },
                grid: { color: '#374151' }
              },
              y: {
                ticks: { color: '#9CA3AF' },
                grid: { color: '#374151' }
              }
            }
          }} />
        </div>
      </motion.div>

      {/* Recent Blogs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
  className="bg-white/10 backdrop-blur-2xl rounded-3xl p-10 border border-white/20 shadow-2xl relative overflow-hidden animate-fade-in"
  style={{boxShadow:'0 8px 32px 0 rgba(31, 38, 135, 0.37)'}}>
  <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(circle at 60% 40%, #6366f1 0%, transparent 70%)'}}></div>
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <span>🕒</span>
          Recent Blogs
        </h3>
        {stats.recentBlogs && stats.recentBlogs.length > 0 ? (
          <div className="space-y-4">
            {stats.recentBlogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors duration-200"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1">{blog.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      blog.status === 'published'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {blog.status}
                    </span>
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/blogs/edit/${blog.id}`}
                    className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors duration-200"
                  >
                    Edit
                  </Link>
                  <a
                    href={`/blogs/${blog.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors duration-200"
                  >
                    View
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <span className="text-4xl">📝</span>
            </div>
            <h4 className="text-lg font-medium text-white mb-2">No blogs yet</h4>
            <p className="text-gray-400 mb-4">Create your first blog to get started!</p>
            <Link
              to="/blogs/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
            >
              <span>✏️</span>
              Create First Blog
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;