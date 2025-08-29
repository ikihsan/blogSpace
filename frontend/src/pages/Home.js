import React from 'react';
import Hero from '../components/Hero';
import BlogList from '../components/BlogList';

const Home = () => {
  return (
    <div>
      <Hero />
      <div id="main-content" className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Latest Posts</h2>
          <BlogList />
        </div>
      </div>
    </div>
  );
};

export default Home;
