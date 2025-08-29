import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  const activeLinkStyle = {
    color: '#ec4899',
  };

  return (
    <nav className="bg-gray-900 bg-opacity-50 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">
              fathi.vlogs
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Home</NavLink>
              <NavLink to="/blogs" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Blogs</NavLink>
              <NavLink to="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>About Me</NavLink>
              <NavLink to="/contact" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Contact</NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
