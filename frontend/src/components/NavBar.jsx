import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';

const NavBar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.user);

  const handleLinkClick = () => setShow(false); // close mobile menu on click

  const navLinks = (
    <>
      <li>
        <Link to="/" onClick={handleLinkClick} className="hover:text-blue-400 transition">
          HOME
        </Link>
      </li>
      <li>
        <Link to="/jobs" onClick={handleLinkClick} className="hover:text-blue-400 transition">
          JOBS
        </Link>
      </li>
      {isAuthenticated ? (
        <li>
          <Link to="/dashboard" onClick={handleLinkClick} className="hover:text-blue-400 transition">
            DASHBOARD
          </Link>
        </li>
      ) : (
        <li>
          <Link to="/login" onClick={handleLinkClick} className="hover:text-blue-400 transition">
            LOGIN
          </Link>
        </li>
      )}
    </>
  );

  return (
    <nav className="bg-gray-900 text-white shadow-md w-full">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
    
    {/* Logo */}
    <Link to="/" className="flex items-center">
      <img
        src="/blog.png"
        alt="SkillyHire Logo"
        className="h-12 sm:h-14 md:h-20 w-auto object-contain"
      />
    </Link>

    {/* Desktop Nav */}
    <ul className="hidden md:flex gap-6 lg:gap-10 text-sm lg:text-base items-center">
      {navLinks}
    </ul>

    {/* Hamburger */}
    <div className="md:hidden">
      <button
        onClick={() => setShow(!show)}
        className="text-2xl"
      >
        <GiHamburgerMenu />
      </button>
    </div>
  </div>

  {/* Mobile Nav */}
  {show && (
    <ul className="md:hidden w-full px-6 py-4 flex flex-col gap-4 bg-gray-900 text-base border-t border-gray-800">
      {navLinks}
    </ul>
  )}
</nav>
  );
};

export default NavBar;
