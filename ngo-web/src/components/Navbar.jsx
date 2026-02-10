import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import ngoLogo from '../assets/ngo-logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState('');
  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState('');
  const location = useLocation();

  const quizDropdownRef = useRef(null);
  const ourCommunitiesDropdownRef = useRef(null);
  const aboutDropdownRef = useRef(null);
  const supportDropdownRef = useRef(null);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', dropdown: true, type: 'about' },
    { name: 'Quiz', dropdown: true, type: 'quiz' },
    { name: 'School Stories', path: '/school-stories' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Upcoming Engagements', path: '/upcoming-engagements' },
    { name: 'SNPC 2026', path: '/photography-competition' },
    // { name: 'Certificates', path: '/certificates' },
    { name: 'Our Communities', dropdown: true, type: 'ourcommunities' },
    { name: 'Contact', path: '/contact' },
    { name: 'Support Us', dropdown: true, type: 'support' },
    
    
  ];

  const aboutSubLinks = [
    { name: 'About the Foundation', path: '/about' },
    { name: 'Our Team', path: '/ourteam' },
  ];

  const quizSubLinks = [
    { name: 'Question Bank', path: '/question-bank' },
    { name: 'Online Quiz', path: '/quiz' },
    // { name: 'Currently Active Events', path: '/quiz/currently-active' },
  ];

  const ourCommunitiesSubLinks = [
    { name: 'Natural Farming', path: '/natural-farming' },
    { name: 'Naturopathy', path: '/naturopathy' },
    { name: 'Plantation', path: '/plantation' },
    { name: 'Yoga', path: '/yoga' },
    { name: 'Pustak Daan', path: '/book-donation' }
  ];

  const supportSublinks = [
    { name: 'Partner With Us', path: '/partner-with-us' },
    { name: 'Donate', path: '/donate', emphasis: true },
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
      if (
        activeDesktopDropdown === 'about' &&
        aboutDropdownRef.current &&
        !aboutDropdownRef.current.contains(event.target)
      ) {
        setActiveDesktopDropdown('');
      }
      if (
        activeDesktopDropdown === 'support' &&
        supportDropdownRef.current &&
        !supportDropdownRef.current.contains(event.target)
      ) {
        setActiveDesktopDropdown('');
      }
    }

    if (activeDesktopDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [activeDesktopDropdown]);


  const getDropdownRef = (type) => {
    if (type === 'quiz') return quizDropdownRef;
    if (type === 'ourcommunities') return ourCommunitiesDropdownRef;
    if (type === 'about') return aboutDropdownRef;
    if (type === 'support') return supportDropdownRef;
    return null;
  };


  const getSubLinks = (type) => {
    if (type === 'quiz') return quizSubLinks;
    if (type === 'about') return aboutSubLinks;
    if (type === 'support') return supportSublinks;
    return ourCommunitiesSubLinks;
  };


  return (
    <>
    {/* ANIMATED HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-700 via-orange-500 to-amber-400 text-white">
        {/* soft background glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,255,255,0.16),_transparent_55%)]" />

        {/* moving highlight on hover */}
        <div className="pointer-events-none absolute inset-y-0 left-[-40%] w-[80%] bg-white/10 blur-3xl transition-transform duration-700 ease-out group-hover:translate-x-[80%]" />

        <div className="group relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between gap-6 min-h-[96px]">
          {/* LEFT: logo + text */}
          <Link to="/" className="flex items-center gap-5">
            {/* logo from top, scale on hover */}
            <div className="relative animate-headerFromTop group-hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 rounded-full bg-white/40 blur-md opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
              <img
                src={ngoLogo}
                alt="Swadhyay Seva Foundation logo"
                className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full shadow-lg border border-white/80"
              />
            </div>

            {/* text stack */}
            <div className="flex flex-col leading-tight">
              {/* name from top */}
              <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide drop-shadow-md animate-headerFromTop">
                Swadhyay Seva Foundation
              </span>

              {/* decorative separator */}
              <div className="mt-2 mb-2 h-[3px] w-32 sm:w-40 rounded-full bg-white/70 overflow-hidden">
                <div className="h-full w-1/3 bg-amber-400 animate-separatorSlide" />
              </div>

              {/* quotes from bottom with some gap */}
              <span className="text-sm sm:text-lg md:text-xl text-orange-50 animate-headerFromBottom">
                भूमि और मानव के स्वास्थ्य का स्वर्णिम अध्याय
              </span>
              <span className="hidden sm:block text-xs sm:text-sm text-orange-100 mt-1 animate-headerFromBottom">
                Empowering communities through environment, wellness, and education
              </span>
            </div>
          </Link>

          {/* RIGHT: badge */}
          <div className="hidden md:flex flex-col items-end text-xs text-orange-100 animate-headerFromBottom">
            <span className="uppercase tracking-[0.25em] text-[10px]">
              Registered NGO
            </span>
            <span className="mt-1 text-sm font-semibold group-hover:text-white transition-colors duration-300">
              Environment • Wellness • Community
            </span>
          </div>
        </div>
      </div>


{/* NAVBAR */}
<div className="bg-white/95 backdrop-blur sticky top-0 z-50 shadow-sm border-b border-gray-100">
  <nav>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative flex justify-between items-center min-h-[64px] py-2">
        {/* Desktop Nav - now spreads across full width */}
        <div className="hidden nav:flex justify-between items-center w-full text-sm font-bold">
          {navLinks.map((link, index) =>
            link.dropdown ? (
              <div
                key={index}
                className="relative"
                ref={getDropdownRef(link.type)}
              >
                <button
                  onClick={() =>
                    setActiveDesktopDropdown(
                      activeDesktopDropdown === link.type ? '' : link.type
                    )
                  }
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap ${
                    activeDesktopDropdown === link.type
                      ? 'text-primary-700 bg-primary-50 shadow-sm'
                      : 'text-gray-900 hover:text-primary-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      activeDesktopDropdown === link.type ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {activeDesktopDropdown === link.type && (
                  <div className="absolute left-0 mt-3 w-60 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 animate-fadeIn z-50">
                    {getSubLinks(link.type).map((sublink) => (
                      <Link
                        key={sublink.path}
                        to={sublink.path}
                        onClick={() => setActiveDesktopDropdown('')}
                        className={`block px-4 py-2.5 text-sm rounded-xl mx-1 my-0.5 transition-colors ${
                          isActive(sublink.path)
                            ? 'bg-primary-50 text-primary-700 font-semibold'
                            : 'text-gray-800 hover:bg-gray-50 hover:text-primary-700'
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
                className={`relative px-2 py-1 font-bold tracking-wide transition-all duration-200 whitespace-nowrap ${
                  link.emphasis
                    ? 'rounded-full bg-primary-600 text-white px-4 py-2 shadow-md hover:bg-primary-700'
                    : isActive(link.path)
                    ? 'text-primary-700'
                    : 'text-gray-900 hover:text-primary-700'
                }`}
              >
                {link.name}
              </Link>
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="nav:hidden absolute right-4 text-gray-900 hover:text-primary-700 focus:outline-none"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>
    </div>

    {/* Mobile Nav - remains the same */}
    {isOpen && (
      <div className="nav:hidden border-t border-gray-100 bg-white/97 backdrop-blur pb-4 animate-fadeDown">
        {navLinks.map((link, index) =>
          link.dropdown ? (
            <div key={index} className="px-4">
              <button
                onClick={() =>
                  setActiveMobileDropdown(
                    activeMobileDropdown === link.type ? '' : link.type
                  )
                }
                className="flex justify-between items-center w-full text-gray-900 py-3 font-bold"
              >
                <span>{link.name}</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${
                    activeMobileDropdown === link.type ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`pl-3 overflow-hidden transition-all duration-300 ease-in-out ${
                  activeMobileDropdown === link.type ? 'max-h-[600px]' : 'max-h-0'
                }`}
              >
                {getSubLinks(link.type).map((sublink) => (
                  <Link
                    key={sublink.path}
                    to={sublink.path}
                    onClick={() => {
                      setIsOpen(false);
                      setActiveMobileDropdown('');
                    }}
                    className="block py-2 text-sm font-semibold text-gray-800 border-l border-primary-100 pl-3 ml-1 hover:text-primary-700"
                  >
                    {sublink.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 text-sm font-bold ${
                link.emphasis
                  ? 'mt-1 mx-4 rounded-full bg-primary-600 text-white text-center shadow-md hover:bg-primary-700'
                  : isActive(link.path)
                  ? 'text-primary-700 bg-primary-50'
                  : 'text-gray-900 hover:bg-gray-50'
              }`}
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
