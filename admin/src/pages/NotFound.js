import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#1c1c1c] text-white p-0">
      <div className="max-w-xl mx-auto text-center bg-white/10 backdrop-blur-2xl p-12 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(circle at 60% 40%, #6366f1 0%, transparent 70%)'}}></div>
        <h1 className="text-8xl font-extrabold bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent mb-8 drop-shadow-lg z-10 relative animate-pulse">404</h1>
        <h2 className="text-4xl font-bold text-white mb-6 z-10 relative">Page Not Found</h2>
        <p className="text-gray-200 mb-8 text-xl z-10 relative">Sorry, the page you are looking for does not exist.</p>
        <Link
          to="/"
          className="inline-block px-10 py-4 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold rounded-2xl transition-all duration-200 shadow-xl text-xl hover:scale-105 hover:from-[#8b5cf6] hover:to-[#6366f1] z-10 relative"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
