import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import ngoLogo from '../assets/ngo-logo copy.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [quizDropdownOpen, setQuizDropdownOpen] = useState(false);
  const [ourWorkDropdownOpen, setOurWorkDropdownOpen] = useState(false);
  const location = useLocation();
  const quizDropdownRef = useRef(null);
  const ourWorkDropdownRef = useRef(null);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Team', path: '/ourteam' },
    { name: 'Quiz', dropdown: true, type: 'quiz' },
    { name: 'Our Work', dropdown: true, type: 'ourWork' },
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

  // Close dropdowns if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (quizDropdownRef.current && !quizDropdownRef.current.contains(event.target)) {
        setQuizDropdownOpen(false);
      }
      if (ourWorkDropdownRef.current && !ourWorkDropdownRef.current.contains(event.target)) {
        setOurWorkDropdownOpen(false);
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
                <div 
                  key={index} 
                  className="relative" 
                  ref={link.type === 'quiz' ? quizDropdownRef : ourWorkDropdownRef}
                >
                  <button
                    onClick={() => {
                      if (link.type === 'quiz') {
                        setQuizDropdownOpen(!quizDropdownOpen);
                        setOurWorkDropdownOpen(false);
                      } else {
                        setOurWorkDropdownOpen(!ourWorkDropdownOpen);
                        setQuizDropdownOpen(false);
                      }
                    }}
                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors duration-200"
                  >
                    <span>{link.name}</span>
                    <ChevronDown
                      size={18}
                      className={`transform transition-transform duration-200 ${
                        (link.type === 'quiz' && quizDropdownOpen) || 
                        (link.type === 'ourWork' && ourWorkDropdownOpen)
                          ? 'rotate-180' 
                          : ''
                      }`}
                    />
                  </button>

                  {((link.type === 'quiz' && quizDropdownOpen) || 
                    (link.type === 'ourWork' && ourWorkDropdownOpen)) && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      {(link.type === 'quiz' ? quizSubLinks : ourWorkSubLinks).map((sublink) => (
                        <Link
                          key={sublink.path}
                          to={sublink.path}
                          onClick={() => {
                            setQuizDropdownOpen(false);
                            setOurWorkDropdownOpen(false);
                          }}
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

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="nav:hidden pb-4">
            {navLinks.map((link, index) =>
              link.dropdown ? (
                <div key={index} className="px-4">
                  <button
                    onClick={() => {
                      if (link.type === 'quiz') {
                        setQuizDropdownOpen(!quizDropdownOpen);
                      } else {
                        setOurWorkDropdownOpen(!ourWorkDropdownOpen);
                      }
                    }}
                    className="flex justify-between items-center w-full text-gray-700 py-3 hover:text-primary-600"
                  >
                    <span>{link.name}</span>
                    <ChevronDown
                      className={`transform transition-transform duration-200 ${
                        (link.type === 'quiz' && quizDropdownOpen) || 
                        (link.type === 'ourWork' && ourWorkDropdownOpen)
                          ? 'rotate-180' 
                          : ''
                      }`}
                    />
                  </button>
                  {((link.type === 'quiz' && quizDropdownOpen) || 
                    (link.type === 'ourWork' && ourWorkDropdownOpen)) && (
                    <div className="pl-4">
                      {(link.type === 'quiz' ? quizSubLinks : ourWorkSubLinks).map((sublink) => (
                        <Link
                          key={sublink.path}
                          to={sublink.path}
                          onClick={() => {
                            setIsOpen(false);
                            setQuizDropdownOpen(false);
                            setOurWorkDropdownOpen(false);
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
