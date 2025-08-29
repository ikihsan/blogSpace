import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fetchBlog = async (id) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/blogs/admin/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return data;
};

const EditBlog = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: blog, isLoading, isError } = useQuery(['blog', id], () => fetchBlog(id));

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
      setStatus(blog.status);
    }
  }, [blog]);

  const mutation = useMutation(
    (updatedBlog) => {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', updatedBlog.title);
      formData.append('content', updatedBlog.content);
      formData.append('status', updatedBlog.status);
      if (updatedBlog.images.length > 0) {
        for (let i = 0; i < updatedBlog.images.length; i++) {
          formData.append('images', updatedBlog.images[i]);
        }
      }
      return axios.put(`${process.env.REACT_APP_API_URL}/blogs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
    },
    {
      onSuccess: () => {
        toast.success('Blog updated successfully!');
        queryClient.invalidateQueries('adminBlogs');
        queryClient.invalidateQueries(['blog', id]);
        navigate('/blogs');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Error updating blog');
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mb-4"></div>
          <p className="text-xl text-gray-400">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-8 text-center">
            <div className="text-red-400 mb-4">
              {/* Icon removed for cleaner look */}
            </div>
            <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Blog</h3>
            <p className="text-gray-300 mb-6">Unable to load blog data. Please try again.</p>
            <Link
              to="/blogs"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300"
            >
              {/* Icon removed for cleaner look */}
              Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <Link
              to="/blogs"
              className="text-gray-400 hover:text-indigo-400 font-medium text-sm transition-colors duration-200 mb-2 md:mb-0"
            >
              ← Back to Blogs
            </Link>
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-1">
                Edit Blog
              </h1>
              <p className="text-gray-400 text-base">Update your blog post details</p>
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
            <label htmlFor="title" className="block text-base font-bold text-indigo-300 mb-2">
              Blog Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-950 border border-indigo-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-lg"
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
            <label htmlFor="content" className="block text-base font-bold text-indigo-300 mb-2">
              Content
            </label>
            <textarea
              id="content"
              rows="10"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-gray-950 border border-indigo-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base resize-vertical"
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
            <label htmlFor="status" className="block text-base font-bold text-indigo-300 mb-2">
              Publication Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-gray-950 border border-indigo-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base"
            >
              <option value="draft" className="bg-gray-900">Draft - Save as draft</option>
              <option value="published" className="bg-gray-900">Published - Make it live</option>
              <option value="archived" className="bg-gray-900">Archived - Hide from public</option>
            </select>
          </motion.div>

          {/* Current Images */}
          {blog.images && blog.images.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="mb-8"
            >
              <label className="block text-base font-bold text-indigo-300 mb-2">Current Images</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-950 rounded-xl border border-indigo-700/30">
                {blog.images.map(img => (
                  <div key={img.id} className="relative group">
                    <img
                      src={`${process.env.REACT_APP_API_URL.replace('/api', '')}${img.imageUrl}`}
                      alt="blog"
                      className="h-28 w-full object-cover rounded-lg border border-indigo-700/30 group-hover:border-indigo-400/50 transition-colors duration-200 shadow-md"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">Current Image</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">These images will be replaced if you upload new ones below.</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="mb-8"
            >
              <label className="block text-base font-bold text-indigo-300 mb-2">No images uploaded for this blog.</label>
              <button
                type="button"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors duration-200 shadow"
                onClick={() => document.getElementById('images')?.focus()}
              >
                Upload Images
              </button>
            </motion.div>
          )}

          {/* Upload New Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <label htmlFor="images" className="block text-base font-bold text-indigo-300 mb-2">Upload New Images (Optional)</label>
            <div className="relative">
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full bg-gray-950 border border-indigo-700 rounded-lg px-4 py-3 text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-base file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:transition-colors file:cursor-pointer shadow"
              />
              <p className="text-xs text-gray-400 mt-2">Supported formats: JPG, PNG, GIF. Maximum file size: 5MB each. Max 3 images.</p>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="flex justify-end space-x-4 pt-6 border-t border-gray-700/50"
          >
            <Link
              to="/blogs"
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-200 shadow"
            >
              Cancel
            </Link>
            {/* Submit button removed for cleaner look */}
          </motion.div>
        </motion.form>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-10 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-700/30 rounded-xl p-6 shadow"
        >
          <h3 className="text-xl font-bold text-indigo-300 mb-4">Editing Tips</h3>
          <ul className="text-base text-gray-300 space-y-2">
            <li>• Make sure your title is clear and engaging</li>
            <li>• Review your content for spelling and grammar</li>
            <li>• Upload new images only if you want to replace existing ones</li>
            <li>• Use archived status to temporarily hide published posts</li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EditBlog;
