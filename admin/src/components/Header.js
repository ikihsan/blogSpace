import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRightOnRectangleIcon, BellIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Welcome back!</h2>
            <p className="text-sm text-gray-400">Manage your blog content</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200">
            <BellIcon className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-3 px-4 py-2 bg-gray-700/50 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-white">{user?.email}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
