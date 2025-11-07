import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import ngoLogo from '../assets/ngo-logo copy.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null); //click outside

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Team', path: '/ourteam' },
    { name: 'Quiz', path: '/quiz' },
    { name: 'Question Bank', path: '/question-bank' },
    { name: 'Our Work', dropdown: true },
    { name: 'Contact', path: '/contact' },
  ];

  const ourWorkSubLinks = [
    { name: 'Milestones', path: '/milestones' },
    { name: 'Activities', path: '/activities' },
    { name: 'Highlights', path: '/highlights' },
  ];

  const isActive = (path) => location.pathname === path;

  //Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={ngoLogo} alt="Swadhyay Logo" className="w-16 h-16 rounded-full object-cover" />
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-800">Swadhyay</span>
              <span className="text-xs text-gray-600">Seva Foundation</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden nav:flex space-x-8 relative">
            {navLinks.map((link, index) =>
              link.dropdown ? (
                <div key={index} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors duration-200"
                  >
                    <span>Our Work</span>
                    <ChevronDown
                      size={18}
                      className={`transform transition-transform duration-200 ${
                        dropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      {ourWorkSubLinks.map((sublink) => (
                        <Link
                          key={sublink.path}
                          to={sublink.path}
                          onClick={() => setDropdownOpen(false)}
                          className={`block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 ${
                            isActive(sublink.path) ? 'font-semibold text-primary-600' : ''
                          }`}
                        >
                          {sublink.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${
                    isActive(link.path)
                      ? 'text-primary-600 font-semibold'
                      : 'text-gray-700 hover:text-primary-600'
                  } transition-colors duration-300 text-base`}
                >
                  {link.name}
                </Link>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="nav:hidden text-gray-700 hover:text-primary-600 focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation (unchanged) */}
        {isOpen && (
          <div className="nav:hidden pb-4">
            {navLinks.map((link, index) =>
              link.dropdown ? (
                <div key={index} className="px-4">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex justify-between items-center w-full text-gray-700 py-3 hover:text-primary-600"
                  >
                    <span>Our Work</span>
                    <ChevronDown
                      className={`transform transition-transform duration-200 ${
                        dropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {dropdownOpen && (
                    <div className="pl-4">
                      {ourWorkSubLinks.map((sublink) => (
                        <Link
                          key={sublink.path}
                          to={sublink.path}
                          onClick={() => {
                            setIsOpen(false);
                            setDropdownOpen(false);
                          }}
                          className={`block py-2 text-gray-700 hover:text-primary-600 ${
                            isActive(sublink.path) ? 'font-semibold text-primary-600' : ''
                          }`}
                        >
                          {sublink.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`${
                    isActive(link.path)
                      ? 'text-primary-600 font-semibold bg-primary-50'
                      : 'text-gray-700'
                  } block px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors`}
                >
                  {link.name}
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
