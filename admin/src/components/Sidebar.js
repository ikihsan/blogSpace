import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const sidebarLinks = [
    { to: '/', label: 'Dashboard', icon: '📊', exact: true },
    { to: '/blogs', label: 'Manage Blogs', icon: '📝' },
    { to: '/blogs/new', label: 'New Blog', icon: '✏️' },
  ];

  return (
    <aside className="w-80 min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex-shrink-0 shadow-2xl border-r border-gray-700">
      <div className="flex flex-col items-center justify-center h-24 border-b border-gray-700 bg-gradient-to-r from-indigo-600/20 to-purple-600/20">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-wide">
          fathi.vlogs
        </h1>
        <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
      </div>

      <nav className="mt-8 flex flex-col gap-3 px-6">
        {sidebarLinks.map((link, idx) => (
          <motion.div
            key={link.to}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <NavLink to={link.to} end={link.exact} className="w-full block">
              {({ isActive }) => (
                <div
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-500/50'
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white border border-transparent hover:border-gray-600'
                  }`}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </div>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <div className="mt-auto p-6 border-t border-gray-700">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <p className="text-xs text-gray-400">Admin Panel v1.0</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
