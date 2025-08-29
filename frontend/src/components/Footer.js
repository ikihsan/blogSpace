import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} FathiVlog. All rights reserved.</p>
          <p className="mt-2">
            Built with ❤️ using React, Node.js, and PostgreSQL.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
