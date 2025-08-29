import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
      <div>
        {/* Can add breadcrumbs or page title here */}
      </div>
      <div className="flex items-center">
        <span className="mr-4">Welcome, {user?.email}</span>
        <button onClick={logout} className="flex items-center text-sm text-gray-300 hover:text-white">
          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
