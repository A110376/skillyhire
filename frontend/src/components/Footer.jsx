import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaTwitterSquare, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const { isAuthenticated } = useSelector(state => state.user);
  const [showRealNumber, setShowRealNumber] = useState(false);

  return (
    <footer className="bg-gray-900 text-white pt-10">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 
    grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

    {/* Logo */}
    <div className="flex flex-col items-start sm:items-start">
      <img src="/blog.png" alt="SkillyHire Logo" className="h-14 mb-3" />
      <p className="text-sm text-gray-400">
        Connecting talent with opportunity.
      </p>
    </div>

    {/* Support */}
    <div>
      <h4 className="font-semibold mb-3 text-base">Support</h4>
      <ul className="space-y-2 text-sm text-gray-300">
        <li>Mianwali, Pakistan</li>
        <li>
          <a href="mailto:skillyhire@gmail.com" className="hover:underline">
            skillyhire@gmail.com
          </a>
        </li>
        <li>
          <a href="tel:03027278183" className="hover:text-blue-400">
            +92 300 1234567
          </a>
        </li>
      </ul>
    </div>

    {/* Links */}
    <div>
      <h4 className="font-semibold mb-3 text-base">Quick Links</h4>
      <ul className="space-y-2 text-sm text-gray-300">
        <li><Link to="/" className="hover:underline">Home</Link></li>
        <li><Link to="/jobs" className="hover:underline">Jobs</Link></li>
        {isAuthenticated && (
          <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
        )}
      </ul>
    </div>

    {/* Social */}
    <div>
      <h4 className="font-semibold mb-3 text-base">Follow Us</h4>
      <div className="flex gap-4 text-xl">
        <FaTwitterSquare className="hover:text-blue-400 cursor-pointer" />
        <FaInstagram className="hover:text-pink-500 cursor-pointer" />
        <FaYoutube className="hover:text-red-500 cursor-pointer" />
        <FaLinkedin className="hover:text-blue-600 cursor-pointer" />
      </div>
    </div>
  </div>

  {/* Bottom */}
  <div className="bg-gray-800 text-center py-3 text-xs sm:text-sm border-t border-gray-700">
    © {new Date().getFullYear()} SkillyHire. All rights reserved.
  </div>
</footer>
  );
};

export default Footer;
