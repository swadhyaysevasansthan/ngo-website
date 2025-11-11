import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import ngoLogo from '../assets/ngo-logo copy.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState('');
  const [activeMobileSubDropdown, setActiveMobileSubDropdown] = useState('');
  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState('');
  const location = useLocation();
  const quizDropdownRef = useRef(null);
  const ourCommunitiesDropdownRef = useRef(null);

  // Navigation Links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Milestones', path: '/milestones' },
    { name: 'Our Team', path: '/ourteam' },
    { name: 'Quiz', dropdown: true, type: 'quiz' },
    { name: 'Our Communities', dropdown: true, type: 'ourcommunities' },
    { name: 'Partner with Us', path: '/partners' },
    { name: 'Contact', path: '/contact' },
    { name: 'Donate', path: '/donate' },
  ];

  const quizSubLinks = [
    { name: 'Question Bank', path: '/question-bank' },
    { name: 'Quiz', path: '/quiz' },
  ];

  const ourCommunitiesSubLinks = [
    {
      name: 'Natural Farming',
      path: '/natural-farming',
      sublinks: [
        { name: 'Current Events', path: '/natural-farming/current-events' },
        { name: 'Past Events', path: '/natural-farming/past-events' },
        { name: 'Upcoming Events', path: '/natural-farming/upcoming-events' },
      ],
    },
    {
      name: 'Naturopathy',
      path: '/naturopathy',
      sublinks: [
        { name: 'Current Events', path: '/naturopathy/current-events' },
        { name: 'Past Events', path: '/naturopathy/past-events' },
        { name: 'Upcoming Events', path: '/naturopathy/upcoming-events' },
      ],
    },
    {
      name: 'Plantation',
      path: '/plantation',
      sublinks: [
        { name: 'Current Events', path: '/plantation/current-events' },
        { name: 'Past Events', path: '/plantation/past-events' },
        { name: 'Upcoming Events', path: '/plantation/upcoming-events' },
      ],
    },
    {
      name: 'Yoga',
      path: '/yoga',
      sublinks: [
        { name: 'Current Events', path: '/yoga/current-events' },
        { name: 'Past Events', path: '/yoga/past-events' },
        { name: 'Upcoming Events', path: '/yoga/upcoming-events' },
      ],
    },
  ];

  const isActive = (path) => location.pathname === path;

  // Handle outside click for desktop
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        activeDesktopDropdown === 'quiz' &&
        quizDropdownRef.current &&
        !quizDropdownRef.current.contains(event.target)
      ) {
        setActiveDesktopDropdown('');
      }
      if (
        activeDesktopDropdown === 'ourcommunities' &&
        ourCommunitiesDropdownRef.current &&
        !ourCommunitiesDropdownRef.current.contains(event.target)
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
              <span className="font-bold text-xl text-gray-800">Swadhyay</span>
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
                  ref={link.type === 'quiz' ? quizDropdownRef : ourCommunitiesDropdownRef}
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

                  {/* Dropdown Menu (Desktop) */}
                  {activeDesktopDropdown === link.type && (
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
                      {(link.type === 'quiz' ? quizSubLinks : ourCommunitiesSubLinks).map(
                        (sublink) => (
                          <div key={sublink.path} className="relative group">
                            <Link
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

                            {/* Second-level submenu for desktop */}
                            {sublink.sublinks && (
                              <div className="absolute left-full top-0 mt-0 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-200">
                                {sublink.sublinks.map((eventLink) => (
                                  <Link
                                    key={eventLink.path}
                                    to={eventLink.path}
                                    onClick={() => setActiveDesktopDropdown('')}
                                    className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                                  >
                                    {eventLink.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      )}
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
                  {/* Main mobile dropdown button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMobileDropdown(
                        activeMobileDropdown === link.type ? '' : link.type
                      );
                    }}
                    className="flex justify-between items-center w-full text-gray-700 py-3 hover:text-primary-600 cursor-pointer"
                  >
                    <span>{link.name}</span>
                    <ChevronDown
                      className={`transform transition-transform duration-200 ${
                        activeMobileDropdown === link.type ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Mobile dropdown content */}
                  <div
                    className={`pl-4 overflow-hidden transition-all duration-300 ease-in-out ${
                      activeMobileDropdown === link.type ? 'max-h-[1000px]' : 'max-h-0'
                    }`}
                  >
                    {(link.type === 'quiz' ? quizSubLinks : ourCommunitiesSubLinks).map(
                      (sublink) => (
                        <div key={sublink.path}>
                          {sublink.sublinks ? (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMobileSubDropdown(
                                    activeMobileSubDropdown === sublink.path
                                      ? ''
                                      : sublink.path
                                  );
                                }}
                                className="flex justify-between items-center w-full py-2 text-gray-700 hover:text-primary-600 cursor-pointer"
                              >
                                <span>{sublink.name}</span>
                                <ChevronDown
                                  className={`transform transition-transform duration-200 ${
                                    activeMobileSubDropdown === sublink.path
                                      ? 'rotate-180'
                                      : ''
                                  }`}
                                />
                              </button>

                              {/* Second-level submenu */}
                              <div
                                className={`pl-4 overflow-hidden transition-all duration-300 ease-in-out ${
                                  activeMobileSubDropdown === sublink.path
                                    ? 'max-h-[1000px]'
                                    : 'max-h-0'
                                }`}
                              >
                                {sublink.sublinks.map((eventLink) => (
                                  <Link
                                    key={eventLink.path}
                                    to={eventLink.path}
                                    onClick={() => {
                                      setIsOpen(false);
                                      setActiveMobileDropdown('');
                                      setActiveMobileSubDropdown('');
                                    }}
                                    className="block py-2 text-gray-700 hover:text-primary-600"
                                  >
                                    {eventLink.name}
                                  </Link>
                                ))}
                              </div>
                            </>
                          ) : (
                            <Link
                              to={sublink.path}
                              onClick={() => {
                                setIsOpen(false);
                                setActiveMobileDropdown('');
                              }}
                              className="block py-2 text-gray-700 hover:text-primary-600"
                            >
                              {sublink.name}
                            </Link>
                          )}
                        </div>
                      )
                    )}
                  </div>
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