import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex items-center justify-center p-0">
      <div className="max-w-xl mx-auto text-center bg-gray-900/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-gray-800">
        <h1 className="text-7xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-8">404</h1>
        <h2 className="text-3xl font-bold text-white mb-6">Page Not Found</h2>
        <p className="text-gray-400 mb-8 text-lg">Sorry, the page you are looking for does not exist.</p>
        <Link
          to="/"
          className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all duration-200 shadow text-lg"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
