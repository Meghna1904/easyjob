import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">&copy; 2025 EasyJob. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</a>
            <a href="/terms" className="text-gray-600 hover:text-gray-900">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;