import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, ChevronDown } from 'lucide-react';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';
import EventModalCard from '../components/EventModalCard';
import { pastEvents, getUniqueStates, filterEventsByState, getEventCountByState } from '../data/eventsData';

const SchoolStories = () => {
  useEffect(() => {
    document.title = 'School Stories - Swadhyay Seva Foundation';
  }, []);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedState, setSelectedState] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const states = useMemo(() => getUniqueStates(), []);
  const eventCountByState = useMemo(() => getEventCountByState(), []);
  const filteredEvents = useMemo(() => filterEventsByState(selectedState), [selectedState]);

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const handleStateSelect = (state) => {
    setSelectedState(state);
    setIsDropdownOpen(false);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedEvent]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-saffron-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">School Stories</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Celebrating the memorable quiz events we've conducted with bright young minds across schools
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Filter by State</h3>
              <p className="text-sm text-gray-600">
                Showing {filteredEvents.length} of {pastEvents.length} events
              </p>
            </div>
            
            {/* Dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full sm:w-64 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-primary-500 focus:outline-none focus:border-primary-600 transition-colors"
              >
                <span className="font-medium text-gray-700">
                  {selectedState === 'all' ? 'All States' : selectedState}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    isDropdownOpen ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-50 w-full sm:w-64 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto"
                  >
                    {/* All States Option */}
                    <button
                      onClick={() => handleStateSelect('all')}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                        selectedState === 'all' ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      <span>All States</span>
                      <span className="text-sm text-gray-500 font-normal">
                        ({pastEvents.length})
                      </span>
                    </button>

                    {/* Divider */}
                    <div className="border-t border-gray-200"></div>

                    {/* State Options */}
                    {states.map((state) => (
                      <button
                        key={state}
                        onClick={() => handleStateSelect(state)}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                          selectedState === state ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-700'
                        }`}
                      >
                        <span>{state}</span>
                        <span className="text-sm text-gray-500 font-normal">
                          ({eventCountByState[state]})
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Selected State Display */}
          {selectedState !== 'all' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Filtered by:</span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {selectedState}
                  <button
                    onClick={() => setSelectedState('all')}
                    className="hover:bg-primary-200 rounded-full p-0.5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Events Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SectionHeader
          title={selectedState === 'all' ? 'Our Journey in Schools' : `Events in ${selectedState}`}
          subtitle="Click on any event to view full details"
        />

        {/* Events Grid with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedState}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap justify-center gap-6"
          >
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] max-w-sm"
              >
                <Card className="h-[280px] sm:h-[290px] lg:h-[300px] flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
                  <div
                    className="p-6 cursor-pointer h-full flex flex-col justify-between"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-4 line-clamp-2">
                      {event.school}
                    </h3>
                    
                    <div className="flex flex-col gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-primary-600 flex-shrink-0" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-primary-600 flex-shrink-0" />
                        <span className="line-clamp-1">{event.city}, {event.state}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-primary-600 flex-shrink-0" />
                        <span>{event.participants}</span>
                      </div>
                    </div>

                    <div className="mt-4 text-primary-600 font-medium text-sm">
                      Click to view details →
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 mb-4">
              <MapPin className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-600 text-lg font-medium mb-2">No events found</p>
            <p className="text-gray-500 text-sm">Try selecting a different state</p>
          </motion.div>
        )}
      </section>

      {/* Event Modal */}
      {selectedEvent && (
        <EventModalCard
          selectedEvent={selectedEvent}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default SchoolStories;
