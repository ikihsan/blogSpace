import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
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
            {stats.recentBlogs.map(blog => (
              <li key={blog.id} className="flex justify-between items-center py-2 border-b border-gray-700">
                <Link to={`/blogs/edit/${blog.id}`} className="hover:text-indigo-400">{blog.title}</Link>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  blog.status === 'published' ? 'bg-green-500 text-green-900' : 'bg-yellow-500 text-yellow-900'
                }`}>{blog.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
