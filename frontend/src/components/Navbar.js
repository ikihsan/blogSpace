import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
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
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Home</NavLink>
              <NavLink to="/blogs" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Blogs</NavLink>
              <NavLink to="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>About Me</NavLink>
              <NavLink to="/contact" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Contact</NavLink>
            </div>
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 bg-opacity-95 px-4 pt-2 pb-4 flex flex-col space-y-2">
          <NavLink to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium" style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/blogs" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium" style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={() => setMenuOpen(false)}>Blogs</NavLink>
          <NavLink to="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium" style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={() => setMenuOpen(false)}>About Me</NavLink>
          <NavLink to="/contact" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium" style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={() => setMenuOpen(false)}>Contact</NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
