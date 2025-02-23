import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <a href="/" className="text-white hover:text-gray-300">Home</a>
            <a href="/about" className="text-white hover:text-gray-300">About</a>
            <a href="/contact" className="text-white hover:text-gray-300">Contact</a>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-white hover:text-gray-300">Sign In</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;