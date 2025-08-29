import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-[#181f2a] text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden rounded-2xl m-4 shadow-2xl bg-[#23293a]">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
