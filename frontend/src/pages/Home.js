

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Home = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedBlogs = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/blogs?limit=3`);
        setFeaturedBlogs(data.blogs);
      } catch (error) {
        console.error('Error fetching featured blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedBlogs();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Support both images array and image string
  const getImageUrl = (blog) => {
    if (blog.images && blog.images.length > 0) {
      const rawUrl = blog.images[0].imageUrl;
      if (rawUrl.startsWith('http')) return rawUrl;
      const API_BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || '';
      return `${API_BASE_URL}${rawUrl}`;
    }
    if (blog.image) {
      if (blog.image.startsWith('http')) return blog.image;
      const API_BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || '';
      return `${API_BASE_URL}${blog.image}`;
    }
    return 'https://via.placeholder.com/400x250?text=No+Image';
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

      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center pt-16 pb-8 relative z-10">
        <motion.h1 initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-5xl md:text-6xl font-extrabold text-center text-pink-400 mb-4">Welcome to <span className="bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">fathi.vlogs</span></motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-lg md:text-xl text-gray-300 text-center max-w-2xl mb-8">
          Join me on my journey as an engineering student, sharing thoughts, experiences, and insights from my academic and personal life.
        </motion.p>
        <div className="flex gap-4 justify-center flex-wrap">
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
            <Link to="/blogs" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors">Explore Blogs</Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
            <Link to="/about" className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg border-2 border-indigo-300 transition-colors">About Me</Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="w-full max-w-5xl px-4 py-8 relative z-10">
        <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-3xl font-bold text-white mb-2 text-center">Latest Stories</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-center text-gray-400 mb-8">Stay updated with the most recent articles and insights</motion.p>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full"></motion.div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {featuredBlogs.length > 0 ? (
              featuredBlogs.map((blog, idx) => (
                <motion.div key={blog._id || blog.id || blog.slug} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: idx * 0.15 }} className="bg-[#23293a] rounded-xl shadow-lg overflow-hidden flex flex-col">
                  <Link to={`/blog/${blog.slug || blog._id || blog.id}`} className="block">
                    <motion.img src={getImageUrl(blog)} alt={blog.title} className="w-full h-48 object-cover" whileHover={{ scale: 1.04 }} onError={e => { e.target.src = 'https://via.placeholder.com/400x250?text=No+Image'; }} />
                    <div className="p-5">
                      <h3 className="text-xl font-bold mb-2 text-white">{blog.title}</h3>
                      <p className="text-gray-400 mb-4 line-clamp-3">{blog.description || blog.content?.substring(0, 100) + '...'}</p>
                      <div className="text-sm text-gray-500 flex justify-between">
                        <span>{formatDate(blog.publishDate || blog.createdAt)}</span>
                        <span>{blog.views} views</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 text-gray-400">
                <h3>No blogs found</h3>
                <p>Check back soon for new content!</p>
              </div>
            )}
          </div>
        )}
        {featuredBlogs.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="text-center mt-8">
            <Link to="/blogs" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition-colors">View All Blogs</Link>
          </motion.div>
        )}
      </section>

      {/* Features Section */}
      <section className="w-full max-w-5xl px-4 py-8 relative z-10">
        <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">The Journey of a Thousand Miles Begins with One Step</motion.h2>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-center text-gray-400 mb-8 max-w-xl mx-auto">Every great engineer started as a curious learner. Follow my journey through the world of technology, innovation, and personal growth.</motion.p>
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          <motion.div whileHover={{ scale: 1.08 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-[#23293a] rounded-xl p-8 shadow-2xl text-center border border-indigo-900">
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="text-lg font-bold text-indigo-200 mb-2">Creative Expression</h3>
            <p className="text-gray-300">Where engineering meets creativity - sharing innovative ideas and artistic approaches to problem-solving.</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.08 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-[#23293a] rounded-xl p-8 shadow-2xl text-center border border-indigo-900">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-lg font-bold text-indigo-200 mb-2">Tech Journey</h3>
            <p className="text-gray-300">From code to concepts - documenting my learning experiences and discoveries in the tech world.</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.08 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-[#23293a] rounded-xl p-8 shadow-2xl text-center border border-indigo-900">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-lg font-bold text-indigo-200 mb-2">Growth Mindset</h3>
            <p className="text-gray-300">Embracing challenges, learning from failures, and celebrating progress - one post at a time.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
