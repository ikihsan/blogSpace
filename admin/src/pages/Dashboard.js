import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const fetchDashboardStats = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/blogs/admin/stats`);
  return data;
};

const Dashboard = () => {
  const { data: stats, isLoading, isError } = useQuery('dashboardStats', fetchDashboardStats);

  if (isLoading) return <div>Loading dashboard...</div>;
  if (isError) return <div className="text-red-500">Error loading dashboard data.</div>;

  const chartData = {
    labels: ['Total Blogs', 'Published', 'Drafts'],
    datasets: [
      {
        label: 'Blog Stats',
        data: [stats.totalBlogs, stats.publishedBlogs, stats.draftBlogs],
        backgroundColor: ['#4f46e5', '#10b981', '#f59e0b'],
      },
    ],
  };

  return (
    <div className="admin-home">
      {/* Hero Section */}
      <section className="hero" style={{ marginBottom: '2rem' }}>
        <div className="hero-content" style={{ textAlign: 'center', padding: '2rem 0' }}>
          <h1 className="text-5xl font-bold mb-4">Welcome to <span style={{ color: '#6366f1' }}>fathi.vlogs Admin</span></h1>
          <p className="text-lg text-gray-300 mb-6">Manage your blog posts, track stats, and keep your content fresh and engaging.</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="section" style={{ background: 'rgba(30, 41, 59, 0.1)', marginBottom: '2rem', borderRadius: '1rem', padding: '2rem 0' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px' }}>
            <div className="card" style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.3)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📊</div>
              <h3 style={{ color: '#e2e8f0', marginBottom: '8px', fontSize: '1.1rem' }}>Stats Overview</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Track your blog performance and growth.</p>
            </div>
            <div className="card" style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.3)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✍️</div>
              <h3 style={{ color: '#e2e8f0', marginBottom: '8px', fontSize: '1.1rem' }}>Content Management</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Create, edit, and organize your blog posts easily.</p>
            </div>
            <div className="card" style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.3)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔒</div>
              <h3 style={{ color: '#e2e8f0', marginBottom: '8px', fontSize: '1.1rem' }}>Secure Access</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Your admin panel is protected and private.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm">Total Blogs</h3>
          <p className="text-3xl font-bold">{stats.totalBlogs}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm">Published</h3>
          <p className="text-3xl font-bold">{stats.publishedBlogs}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm">Drafts</h3>
          <p className="text-3xl font-bold">{stats.draftBlogs}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm">Total Views</h3>
          <p className="text-3xl font-bold">{stats.totalViews}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Blog Statistics</h2>
          <Bar data={chartData} />
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Recent Blogs</h2>
          <ul>
            {stats.recentBlogs.map(blog => {
              // Determine image URL
              let imageUrl = '';
              if (blog.images && blog.images.length > 0) {
                // If imageUrl is relative, prepend API base URL
                const rawUrl = blog.images[0].imageUrl;
                if (rawUrl.startsWith('http')) {
                  imageUrl = rawUrl;
                } else {
                  const API_BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || '';
                  imageUrl = `${API_BASE_URL}${rawUrl}`;
                }
              } else {
                imageUrl = 'https://via.placeholder.com/60x60?text=No+Image';
              }
              return (
                <li key={blog.id} className="flex justify-between items-center py-2 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <img
                      src={imageUrl}
                      alt={blog.title}
                      className="w-10 h-10 object-cover rounded"
                      onError={e => { e.target.src = 'https://via.placeholder.com/60x60?text=No+Image'; }}
                    />
                    <Link to={`/blogs/edit/${blog.id}`} className="hover:text-indigo-400">{blog.title}</Link>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    blog.status === 'published' ? 'bg-green-500 text-green-900' : 'bg-yellow-500 text-yellow-900'
                  }`}>{blog.status}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
