import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import ngoLogo from '../assets/ngo-logo copy.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState('');
  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState('');
  const location = useLocation();
  const quizDropdownRef = useRef(null);
  const ourWorkDropdownRef = useRef(null);

  // Links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Team', path: '/ourteam' },
    { name: 'Quiz', dropdown: true, type: 'quiz' },
    { name: 'Our Work', dropdown: true, type: 'ourwork' },
    { name: 'Contact', path: '/contact' },
  ];
  const quizSubLinks = [
    { name: 'Question Bank', path: '/question-bank' },
    { name: 'Quiz', path: '/quiz' },
  ];
  const ourWorkSubLinks = [
    { name: 'Natural Farming', path: '/natural-farming' },
    { name: 'Naturopathy', path: '/naturopathy' },
    { name: 'Plantation', path: '/plantation' },
    { name: 'Yoga', path: '/yoga' },
  ];

  const isActive = (path) => location.pathname === path;

  // Desktop click outside: only for desktop menus
useEffect(() => {
  function handleClickOutside(event) {
    // Only close the dropdown if it's open and the click is outside the relevant dropdown
    if (
      activeDesktopDropdown === 'quiz' &&
      quizDropdownRef.current &&
      !quizDropdownRef.current.contains(event.target)
    ) {
      setActiveDesktopDropdown('');
    }
    if (
      activeDesktopDropdown === 'ourwork' &&
      ourWorkDropdownRef.current &&
      !ourWorkDropdownRef.current.contains(event.target)
    ) {
      setActiveDesktopDropdown('');
    }
  }
  if (activeDesktopDropdown) {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }
}, [activeDesktopDropdown]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={ngoLogo}
              alt="Swadhyay Logo"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-800">
                Swadhyay
              </span>
              <span className="text-xs text-gray-600">Seva Foundation</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 relative">
            {navLinks.map((link, index) =>
              link.dropdown ? (
                <div
                  key={index}
                  className="relative"
                  ref={link.type === 'quiz' ? quizDropdownRef : ourWorkDropdownRef}
                >
                  <button
                    onClick={() =>
                      setActiveDesktopDropdown(
                        activeDesktopDropdown === link.type ? '' : link.type
                      )
                    }
                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors duration-200"
                  >
                    <span>{link.name}</span>
                    <ChevronDown
                      size={18}
                      className={
                        activeDesktopDropdown === link.type
                          ? 'transform rotate-180 transition-transform duration-200'
                          : 'transform transition-transform duration-200'
                      }
                    />
                  </button>

                  {activeDesktopDropdown === link.type && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      {(link.type === 'quiz'
                        ? quizSubLinks
                        : ourWorkSubLinks
                      ).map((sublink) => (
                        <Link
                          key={sublink.path}
                          to={sublink.path}
                          onClick={() => setActiveDesktopDropdown('')}
                          className={`block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 ${
                            isActive(sublink.path)
                              ? 'font-semibold text-primary-600'
                              : ''
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
            className="md:hidden text-gray-700 hover:text-primary-600 focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="block pb-4 md:hidden">
            {navLinks.map((link, index) =>
              link.dropdown ? (
                <div key={index} className="px-4">
                  <button
                    onClick={() =>
                      setActiveMobileDropdown(
                        activeMobileDropdown === link.type ? '' : link.type
                      )
                    }
                    className="flex justify-between items-center w-full text-gray-700 py-3 hover:text-primary-600"
                  >
                    <span>{link.name}</span>
                    <ChevronDown
                      className={
                        activeMobileDropdown === link.type
                          ? 'transform rotate-180 transition-transform duration-200'
                          : 'transform transition-transform duration-200'
                      }
                    />
                  </button>
                  {activeMobileDropdown === link.type && (
                    <div className="pl-4">
                      {(link.type === 'quiz'
                        ? quizSubLinks
                        : ourWorkSubLinks
                      ).map((sublink) => (
                        <Link
                          key={sublink.path}
                          to={sublink.path}
                          onClick={() => {
                            setIsOpen(false);
                            setActiveMobileDropdown('');
                          }}
                          className={`block py-2 text-gray-700 hover:text-primary-600 ${
                            isActive(sublink.path)
                              ? 'font-semibold text-primary-600'
                              : ''
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
