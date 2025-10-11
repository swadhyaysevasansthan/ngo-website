import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Swadhyay Seva Sansthan</h3>
            <p className="text-sm leading-relaxed mb-4">
              Empowering lives through knowledge, service, and sustainable practices. 
              Join us in creating a better tomorrow.
            </p>
            <div className="flex items-center space-x-2">
              <Heart size={16} className="text-red-500" />
              <span className="text-sm">Serving society since our inception</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="hover:text-primary-400 transition-colors text-sm">
                  Quiz
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-primary-400 mt-1 flex-shrink-0" />
                <span className="text-sm">
                   Swadhyay Health Care, first floor, B-3/2, Sector 16, Rohini, Delhi, 110089
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-primary-400 flex-shrink-0" />
                <span className="text-sm">+91 95992 24323</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-primary-400 flex-shrink-0" />
                <span className="text-sm">swadhyaysevasansthan@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Swadhyay Seva Sansthan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
