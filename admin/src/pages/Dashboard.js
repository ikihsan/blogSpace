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
      <div className="loading flex items-center justify-center h-screen">
        <div className="spinner border-4 border-indigo-500 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }
  if (isError) {
    return <div className="flex items-center justify-center h-screen text-red-500 text-xl">Error loading dashboard data.</div>;
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
    <div className="min-h-screen bg-[#181f2a] text-white flex flex-col items-center relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <svg width="100%" height="100%" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <motion.path
            d="M0,400 C400,600 1040,200 1440,400"
            stroke="url(#grad1)"
            strokeWidth="80"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          />
          <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="1440" y2="800" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" />
              <stop offset="1" stopColor="#f472b6" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Header */}
      <section className="w-full flex flex-col items-center justify-center pt-16 pb-8 relative z-10">
        <motion.h1 initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-5xl md:text-6xl font-extrabold text-center text-pink-400 mb-4">Admin Dashboard</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-lg md:text-xl text-gray-300 text-center max-w-2xl mb-8">
          Manage your blog posts, track stats, and keep your content fresh and engaging.
        </motion.p>
        <div className="flex gap-4 justify-center flex-wrap">
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
            <Link to="/admin/blogs/new" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors flex items-center gap-2">
              <span style={{fontSize: '1.1rem'}}>✏️</span>
              <span>New Blog</span>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
            <Link to="/admin/blogs" className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg border-2 border-indigo-300 transition-colors flex items-center gap-2">
              <span style={{fontSize: '1.1rem'}}>📝</span>
              <span>Manage Blogs</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="w-full max-w-5xl px-4 py-8 relative z-10">
        <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-3xl font-bold text-white mb-2 text-center">Blog Stats</motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-[#23293a] rounded-2xl shadow-lg p-8 text-center border border-indigo-900">
            <div className="text-3xl mb-2 text-indigo-300">{stats.totalBlogs}</div>
            <div className="text-gray-300">Total Blogs</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-[#23293a] rounded-2xl shadow-lg p-8 text-center border border-indigo-900">
            <div className="text-3xl mb-2 text-green-300">{stats.publishedBlogs}</div>
            <div className="text-gray-300">Published</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-[#23293a] rounded-2xl shadow-lg p-8 text-center border border-indigo-900">
            <div className="text-3xl mb-2 text-yellow-300">{stats.draftBlogs}</div>
            <div className="text-gray-300">Drafts</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-[#23293a] rounded-2xl shadow-lg p-8 text-center border border-indigo-900">
            <div className="text-3xl mb-2 text-pink-300">{stats.totalViews || 0}</div>
            <div className="text-gray-300">Total Views</div>
          </motion.div>
        </div>
      </section>

      {/* Blog Statistics Chart */}
      <section className="w-full max-w-5xl px-4 py-8 relative z-10">
        <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-3xl font-bold text-white mb-2 text-center">Blog Statistics</motion.h2>
        <div className="bg-[#23293a] rounded-2xl shadow-lg p-8 border border-indigo-900">
          <Bar data={chartData} />
        </div>
      </section>

      {/* Recent Blogs */}
      <section className="w-full max-w-5xl px-4 py-8 relative z-10">
        <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-3xl font-bold text-white mb-2 text-center">Recent Blogs</motion.h2>
        {stats.recentBlogs && stats.recentBlogs.length > 0 ? (
          <div className="overflow-x-auto bg-[#23293a] rounded-2xl shadow-lg p-8 border border-indigo-900">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-gray-400">
                  <th className="py-2 px-4">Title</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Views</th>
                  <th className="py-2 px-4">Created</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBlogs.map(blog => (
                  <tr key={blog.id} className="border-b border-white/10">
                    <td className="py-2 px-4 font-semibold text-indigo-100">{blog.title}</td>
                    <td className="py-2 px-4">
                      <span style={{
                        background: blog.status === 'published' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                        color: blog.status === 'published' ? '#22c55e' : '#ef4444',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        border: `1px solid ${blog.status === 'published' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`
                      }}>
                        {blog.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-2 px-4">{blog.views || 0}</td>
                    <td className="py-2 px-4">{formatDate(blog.createdAt)}</td>
                    <td className="py-2 px-4">
                      <div className="flex gap-2">
                        <Link to={`/admin/blogs/edit/${blog.id}`} className="btn bg-indigo-600 text-white px-3 py-1 rounded-lg shadow hover:bg-indigo-700 text-sm">Edit</Link>
                        <a href={`/blogs/${blog.id}`} target="_blank" rel="noopener noreferrer" className="btn bg-indigo-600 text-white px-3 py-1 rounded-lg shadow hover:bg-indigo-700 text-sm">View</a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <h3>No blogs found</h3>
            <p>Create your first blog to get started!</p>
            <Link to="/admin/blogs/new" className="btn bg-indigo-500 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-600 mt-4">Create First Blog</Link>
          </div>
        )}
      </section>

      {/* System Info */}
      <section className="w-full max-w-5xl px-4 py-8 relative z-10">
        <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-3xl font-bold text-white mb-2 text-center">System Information</motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-[#23293a] rounded-2xl shadow-lg p-8 border border-indigo-900">
          <div>
            <h4 className="text-indigo-100 mb-2">Version</h4>
            <p className="text-gray-400">fathi.vlogs v1.0.0</p>
          </div>
          <div>
            <h4 className="text-indigo-100 mb-2">Last Updated</h4>
            <p className="text-gray-400">{new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <h4 className="text-indigo-100 mb-2">Built by</h4>
            <p className="text-gray-400">ikcodes</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;