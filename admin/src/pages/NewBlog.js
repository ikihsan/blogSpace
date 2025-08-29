import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
// Removed icons for cleaner look
import { Link } from 'react-router-dom';

const NewBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [images, setImages] = useState([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation(
    (newBlog) => {
      const formData = new FormData();
      formData.append('title', newBlog.title);
      formData.append('content', newBlog.content);
      formData.append('status', newBlog.status);
      for (let i = 0; i < newBlog.images.length; i++) {
        formData.append('images', newBlog.images[i]);
      }
      return axios.post(`${process.env.REACT_APP_API_URL}/blogs`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    {
      onSuccess: () => {
        toast.success('Blog created successfully!');
        queryClient.invalidateQueries('adminBlogs');
        navigate('/blogs');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Error creating blog');
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ title, content, status, images });
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 3) {
      toast.warn('You can only upload a maximum of 3 images');
      return;
    }
    setImages(e.target.files);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-0"
    >
      <div className="max-w-3xl mx-auto py-10 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
    className="mb-10"
        >
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/blogs"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Back to Blogs
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Create New Blog
              </h1>
              <p className="text-gray-400 text-sm">Share your thoughts with the world</p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
    className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 border border-gray-800 shadow-2xl space-y-10"
        >
          {/* Title Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <label htmlFor="title" className="block text-sm font-semibold text-gray-200 mb-3">
              Blog Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter an engaging title for your blog..."
              required
            />
          </motion.div>

          {/* Content Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <label htmlFor="content" className="block text-sm font-semibold text-gray-200 mb-3">
              Content
            </label>
            <textarea
              id="content"
              rows="12"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-vertical"
              placeholder="Write your blog content here..."
              required
            />
          </motion.div>

          {/* Status Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <label htmlFor="status" className="block text-sm font-semibold text-gray-200 mb-3">
              Publication Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="draft" className="bg-gray-800">Draft - Save as draft</option>
              <option value="published" className="bg-gray-800">Published - Make it live</option>
            </select>
          </motion.div>

          {/* Images Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <label htmlFor="images" className="block text-sm font-semibold text-gray-200 mb-3">
              Images (Optional - Max 3)
            </label>
            <div className="relative">
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:transition-colors file:cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: JPG, PNG, GIF. Maximum file size: 5MB each.
              </p>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="flex justify-end space-x-4 pt-6 border-t border-gray-700/50"
          >
            <Link
              to="/blogs"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-all duration-200"
            >
              Cancel
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={mutation.isLoading}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {mutation.isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Creating Blog...
                </div>
              ) : (
                'Create Blog'
              )}
            </motion.button>
          </motion.div>
        </motion.form>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 bg-indigo-900/20 border border-indigo-700/30 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-indigo-300 mb-3">Writing Tips</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>• Use a compelling title that captures attention</li>
            <li>• Write clear, engaging content that provides value</li>
            <li>• Add relevant images to make your blog more visual</li>
            <li>• Save as draft if you're not ready to publish yet</li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NewBlog;
