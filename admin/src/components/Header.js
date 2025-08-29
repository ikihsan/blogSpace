import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex justify-between items-center p-5 bg-[#23293a] border-b border-indigo-900 rounded-t-2xl shadow-lg">
      <div>
        {/* Can add breadcrumbs or page title here */}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-indigo-200 font-semibold">Welcome, {user?.email}</span>
        <button onClick={logout} className="flex items-center text-sm text-gray-300 hover:text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-lg shadow transition-all">
          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
