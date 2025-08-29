import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const fetchAdminBlogs = async (page, status, search) => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/blogs/admin/all`, {
    params: { page, status, search }
  });
  return data;
};

const ManageBlogs = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery(['adminBlogs', page, status, search], () => fetchAdminBlogs(page, status, search), { keepPreviousData: true });

  const deleteMutation = useMutation(
    (id) => axios.delete(`${process.env.REACT_APP_API_URL}/blogs/${id}`),
    {
      onSuccess: () => {
        toast.success('Blog deleted successfully');
        queryClient.invalidateQueries('adminBlogs');
      },
      onError: () => {
        toast.error('Error deleting blog');
      }
    }
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-0"
    >
      <div className="max-w-5xl mx-auto py-10 px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Manage Blogs
              </h1>
              <p className="text-gray-400 text-lg">Create, edit, and manage your blog posts</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/blogs/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {/* Removed PlusIcon for cleaner look */}
                Create New Blog
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 border border-gray-800 shadow-2xl mb-10"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              {/* Removed MagnifyingGlassIcon for cleaner look */}
              <input
                type="text"
                placeholder="Search blogs by title..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
              />
            </div>
            <div className="relative">
              {/* Removed FunnelIcon for cleaner look */}
              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                className="pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-white min-w-[180px]"
              >
                <option value="">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Content Section */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col justify-center items-center py-16"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mb-4"></div>
            <p className="text-xl text-gray-400">Loading your blogs...</p>
          </motion.div>
        ) : isError ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/20 border border-red-700/50 rounded-2xl p-8 text-center shadow-xl"
          >
            <div className="text-red-400 mb-4">
              {/* Icon removed for cleaner look */}
            </div>
            <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Blogs</h3>
            <p className="text-gray-300">Please try refreshing the page or contact support if the problem persists.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-gray-800"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-800/80 to-gray-700/80">
                  <tr>
                    <th className="p-6 text-left font-semibold text-gray-200">Blog Details</th>
                    <th className="p-6 text-left font-semibold text-gray-200">Status</th>
                    <th className="p-6 text-left font-semibold text-gray-200">Created</th>
                    <th className="p-6 text-left font-semibold text-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.blogs.map((blog, index) => (
                    <motion.tr
                      key={blog.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-all duration-200 group"
                    >
                      <td className="p-6">
                        <div className="font-medium text-white group-hover:text-indigo-300 transition-colors duration-200">
                          {blog.title}
                        </div>
                        <div className="text-sm text-gray-400 mt-1 font-mono">
                          ID: {blog.id}
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                          blog.status === 'published'
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : blog.status === 'draft'
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }`}>
                          {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-6 text-gray-300">
                        <div className="text-sm">
                          {new Date(blog.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(blog.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex space-x-2">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                              to={`/blogs/edit/${blog.id}`}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-all duration-200 border border-indigo-500/20 hover:border-indigo-400/40"
                              title="Edit Blog"
                            >
                              {/* Edit action icon removed for cleaner look */}
                              Edit
                            </Link>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <button
                              onClick={() => handleDelete(blog.id)}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all duration-200 border border-red-500/20 hover:border-red-400/40"
                              title="Delete Blog"
                            >
                              {/* Delete action icon removed for cleaner look */}
                              Delete
                            </button>
                          </motion.div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Pagination */}
        {data && data.blogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center items-center mt-8 space-x-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              Previous
            </motion.button>

            <div className="flex items-center space-x-3 bg-gray-800/50 backdrop-blur-sm rounded-xl px-6 py-3 border border-gray-700/50">
              <span className="text-gray-400">Page</span>
              <span className="px-3 py-1 bg-indigo-600 rounded-lg font-semibold text-white min-w-[40px] text-center">
                {page}
              </span>
              <span className="text-gray-400">of</span>
              <span className="px-3 py-1 bg-gray-700 rounded-lg font-semibold text-white min-w-[40px] text-center">
                {data?.totalPages || 1}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(p => p + 1)}
              disabled={page === data?.totalPages || data?.blogs.length === 0}
              className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              Next
            </motion.button>
          </motion.div>
        )}

        {/* Empty State */}
        {data && data.blogs.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-xl"
          >
            <div className="text-gray-400 mb-4">
              {/* Icon removed for cleaner look */}
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Blogs Found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first blog post</p>
            <Link
              to="/blogs/new"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {/* Removed PlusIcon for cleaner look */}
              Create Your First Blog
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ManageBlogs;
