import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, DocumentTextIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  const activeClassName = "bg-gray-700 text-white";
  const inactiveClassName = "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <div className="w-64 bg-gray-800 flex-shrink-0">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <h1 className="text-2xl font-bold">fathi.vlogs Admin</h1>
      </div>
      <nav className="mt-6">
        <NavLink to="/" end className={({ isActive }) => `${isActive ? activeClassName : inactiveClassName} flex items-center px-6 py-3 text-base font-semibold`}>
          <HomeIcon className="h-6 w-6 mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/blogs" className={({ isActive }) => `${isActive ? activeClassName : inactiveClassName} flex items-center px-6 py-3 text-base font-semibold`}>
          <DocumentTextIcon className="h-6 w-6 mr-3" />
          Manage Blogs
        </NavLink>
        <NavLink to="/blogs/new" className={({ isActive }) => `${isActive ? activeClassName : inactiveClassName} flex items-center px-6 py-3 text-base font-semibold`}>
          <PlusCircleIcon className="h-6 w-6 mr-3" />
          New Blog
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
