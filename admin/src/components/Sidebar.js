import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = () => {

  const sidebarLinks = [
    { to: '/', label: 'Dashboard', exact: true },
    { to: '/blogs', label: 'Manage Blogs' },
    { to: '/blogs/new', label: 'New Blog' },
  ];

  return (
    <aside className="w-72 min-h-screen bg-[#181f2a] flex-shrink-0 shadow-2xl rounded-r-3xl border-r border-indigo-900 py-6">
      <div className="flex items-center justify-center h-20 border-b border-indigo-900">
        <h1 className="text-3xl font-extrabold text-indigo-400 tracking-wide">fathi.vlogs Admin</h1>
      </div>
      <nav className="mt-10 flex flex-col gap-6 px-6">
        {sidebarLinks.map((link, idx) => (
          <motion.div
            key={link.to}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <NavLink to={link.to} end={link.exact} className="w-full">
              {({ isActive }) => (
                <button
                  type="button"
                  className={`w-full block text-center ${isActive ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-extrabold shadow-lg' : 'bg-[#23293a] text-indigo-300 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white font-semibold shadow'} rounded-2xl py-5 text-xl transition-all duration-200 border-2 border-transparent hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  style={{ cursor: 'pointer' }}
                >
                  {link.label}
                </button>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
