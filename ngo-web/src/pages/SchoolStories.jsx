import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, ChevronDown } from 'lucide-react';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';
import EventModalCard from '../components/EventModalCard';
import {
  pastEvents,
  getUniqueStates,
  filterEventsByState,
  getEventCountByState
} from '../data/eventsData';

const SchoolStories = () => {
  useEffect(() => {
    document.title = 'SNEAC 2025-26 (1st Edition)';
  }, []);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedState, setSelectedState] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const states = useMemo(() => getUniqueStates(), []);
  const eventCountByState = useMemo(() => getEventCountByState(), []);
  const filteredEvents = useMemo(
    () => filterEventsByState(selectedState),
    [selectedState]
  );

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

    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <div className="bg-gray-50">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary-700 via-orange-500 to-amber-400 text-white py-24">
        
        {/* Background Effects */}
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_55%)]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >

            {/* Badge */}
            <div className="inline-flex items-center px-5 py-2 rounded-full bg-white/20 border border-white/30 text-sm font-medium backdrop-blur-sm mb-6">
              Swadhyay National Education Awareness Campaign
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-extrabold mb-3 tracking-tight">
              SNEAC 2025-26
            </h1>

            {/* Edition */}
            <p className="text-2xl md:text-3xl font-semibold text-orange-100 mb-8">
              1st Edition
            </p>

            {/* Description */}
            <p className="text-lg md:text-xl text-orange-50 max-w-4xl mx-auto leading-relaxed">
              Celebrating the successful journey of the Swadhyay National
              Education Awareness Campaign (SNEAC) 2025-26 First Edition
              conducted across schools to inspire learning, awareness,
              participation, and intellectual growth among students.
            </p>

          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Filter by State
              </h3>

              <p className="text-sm text-gray-600">
                Showing {filteredEvents.length} of {pastEvents.length} events
              </p>
            </div>

            {/* Dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full sm:w-64 px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-left flex items-center justify-between hover:border-primary-500 focus:outline-none focus:border-primary-600 transition-colors"
              >
                <span className="font-medium text-gray-700">
                  {selectedState === 'all'
                    ? 'All States'
                    : selectedState}
                </span>

                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
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
                    className="absolute z-50 w-full sm:w-64 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-96 overflow-y-auto"
                  >

                    {/* All States */}
                    <button
                      onClick={() => handleStateSelect('all')}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                        selectedState === 'all'
                          ? 'bg-primary-50 text-primary-700 font-semibold'
                          : 'text-gray-700'
                      }`}
                    >
                      <span>All States</span>

                      <span className="text-sm text-gray-500 font-normal">
                        ({pastEvents.length})
                      </span>
                    </button>

                    <div className="border-t border-gray-200"></div>

                    {/* State Options */}
                    {states.map((state) => (
                      <button
                        key={state}
                        onClick={() => handleStateSelect(state)}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                          selectedState === state
                            ? 'bg-primary-50 text-primary-700 font-semibold'
                            : 'text-gray-700'
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

                <span className="text-sm text-gray-600">
                  Filtered by:
                </span>

                <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {selectedState}

                  <button
                    onClick={() => setSelectedState('all')}
                    className="hover:bg-primary-200 rounded-full p-0.5 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
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
          title={
            selectedState === 'all'
              ? 'SNEAC 2025-26 Campaign Journey'
              : `SNEAC Events in ${selectedState}`
          }
          subtitle="Explore schools and institutions that participated in the first edition of SNEAC"
        />

        {/* Events Grid */}
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

                <Card className="h-[290px] flex flex-col justify-between hover:shadow-2xl transition-all duration-300 border border-gray-100">

                  <div
                    className="p-6 cursor-pointer h-full flex flex-col justify-between"
                    onClick={() => setSelectedEvent(event)}
                  >

                    <h3 className="text-xl font-bold text-gray-800 mb-4 line-clamp-2">
                      {event.school}
                    </h3>

                    <div className="flex flex-col gap-3 text-sm text-gray-600">

                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-primary-600 flex-shrink-0" />
                        <span>{event.date}</span>
                      </div>

                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-primary-600 flex-shrink-0" />
                        <span className="line-clamp-1">
                          {event.city}, {event.state}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-primary-600 flex-shrink-0" />
                        <span>{event.participants}</span>
                      </div>

                    </div>

                    <div className="mt-6 text-primary-600 font-semibold text-sm">
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

            <p className="text-gray-600 text-lg font-medium mb-2">
              No events found
            </p>

            <p className="text-gray-500 text-sm">
              Try selecting a different state
            </p>

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