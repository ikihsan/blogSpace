import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Hero = () => {
  const scrollToContent = () => {
    const content = document.getElementById('main-content');
    if (content) {
      content.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center text-center text-white bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-gray-900 z-10"></div>
      <motion.div
        className="z-20 relative px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">fathi.vlogs</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-300">
          Join me on my journey as an engineering student, sharing thoughts, experiences, and insights from my academic and personal life.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/blogs">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Explore Blogs
            </motion.button>
          </Link>
          <Link to="/about">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              About Me
            </motion.button>
          </Link>
        </div>
      </motion.div>
      <motion.div
        className="absolute bottom-10 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <button onClick={scrollToContent} className="animate-bounce">
          <ChevronDownIcon className="h-8 w-8 text-gray-400" />
        </button>
      </motion.div>
    </div>
  );
};

export default Hero;
