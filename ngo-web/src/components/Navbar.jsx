import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import ngoLogo from '../assets/ngo-head-logo copy.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState('');
  const [activeMobileSubDropdown, setActiveMobileSubDropdown] = useState('');
  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState('');
  const location = useLocation();

  const quizDropdownRef = useRef(null);
  const ourCommunitiesDropdownRef = useRef(null);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', dropdown: true, type: 'about' },
    { name: 'Quiz', dropdown: true, type: 'quiz' },
    { name: 'School Stories', path: '/school-stories' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Upcoming Engagements', path: '/quiz/upcoming-engagements' },
    { name: 'Our Communities', dropdown: true, type: 'ourcommunities' },
    { name: 'Contact', path: '/contact' },
    { name: 'Donate', path: '/donate' },
  ];

  const aboutSubLinks = [
    { name: 'About the Foundation', path: '/about' },
    { name: 'Our Team', path: '/ourteam' }
  ];

  const quizSubLinks = [
    { name: 'Question Bank', path: '/question-bank' },
    { name: 'Online Quiz', path: '/quiz' },
    { name: 'Currently Active Events', path: '/quiz/currently-active' },
    { name: 'Upcoming Engagements', path: '/quiz/upcoming-engagements' },
  ];

  const ourCommunitiesSubLinks = [
    { name: 'Natural Farming', path: '/natural-farming' },
    { name: 'Naturopathy', path: '/naturopathy' },
    { name: 'Plantation', path: '/plantation' },
    { name: 'Yoga', path: '/yoga' },
  ];

  const isActive = (path) => location.pathname === path;

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
    <>
      {/* -------------------------LOGO ABOVE NAVBAR------------------------- */}
      <div className="bg-white py-4 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <Link to="/" className="flex flex-col items-center space-y-1">
            <img
              src={ngoLogo}
              alt="Swadhyay Logo"
              className="w-80 h-auto object-contain"
            />
          </Link>
        </div>
      </div>
      {/* ------------------------------------------------------------------- */}

      {/* ------------------------- NAVBAR------------------------- */}
      <div className="bg-white border-t shadow-md sticky top-0 z-50">
        <nav>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">

              {/* Desktop Navigation */}
              <div className="hidden nav:flex space-x-8 relative">
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

                      {activeDesktopDropdown === link.type && (
                        <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
                          {(
                            link.type === 'quiz'
                              ? quizSubLinks
                              : link.type === 'about'
                                ? aboutSubLinks
                                : ourCommunitiesSubLinks
                          ).map((sublink) => (
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
                            </div>
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

              {/* Mobile Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="nav:hidden text-gray-700 hover:text-primary-600 focus:outline-none"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="block pb-4 nav:hidden">
              {navLinks.map((link, index) =>
                link.dropdown ? (
                  <div key={index} className="px-4">

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

                    <div
                      className={`pl-4 overflow-hidden transition-all duration-300 ease-in-out ${
                        activeMobileDropdown === link.type ? 'max-h-[1000px]' : 'max-h-0'
                      }`}
                    >
                      {(
                        link.type === 'quiz'
                          ? quizSubLinks
                          : link.type === 'about'
                            ? aboutSubLinks
                            : ourCommunitiesSubLinks
                      ).map((sublink) => (
                        <div key={sublink.path}>
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
                        </div>
                      ))}
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
        </nav>
      </div>
    </>
  );
};

export default Navbar;
