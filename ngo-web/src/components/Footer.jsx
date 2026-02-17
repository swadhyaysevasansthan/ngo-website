import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Swadhyay Seva Foundation</h3>
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
                <Link to="/OurTeam" className="hover:text-primary-400 transition-colors text-sm">
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refunds" className="hover:text-primary-400 transition-colors text-sm">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary-400 transition-colors text-sm">
                  Terms & Conditions
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
                   B-3/2, 1st floor ,Sector 16, Rohini, Delhi, 110089

                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-primary-400 flex-shrink-0" />
                <span className="text-sm">+91 95992 24323, 9837042298, 9810279323
</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-primary-400 flex-shrink-0" />
                <span className="text-sm">swadhyaysevafoundation@gmail.com</span>
              </li>

              {/* Social Media Links */}
              <li className="flex items-center space-x-4 mt-3">
                <a
                  href="https://www.instagram.com/swadhyay.seva.foundation/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-500 transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/company/swadhyaysevasansthan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="https://www.youtube.com/@swadhyaysevafoundation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-500 transition-colors"
                >
                  <Youtube size={20} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Swadhyay Seva Foundation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;