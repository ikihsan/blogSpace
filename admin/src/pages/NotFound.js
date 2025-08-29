import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <h1 className="text-6xl font-extrabold text-indigo-500 mb-4">404</h1>
      <p className="text-2xl mb-2">Page Not Found</p>
      <p className="mb-6 text-gray-400">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="bg-indigo-600 text-white py-2 px-6 rounded-xl shadow hover:bg-indigo-700 transition-all">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
