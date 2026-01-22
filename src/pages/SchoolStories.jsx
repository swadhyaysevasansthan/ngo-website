import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';
import EventModalCard from '../components/EventModalCard'; // Import the new component
import { pastEvents  } from '../data/eventsData'

const SchoolStories = () => {
  useEffect(() => {
    document.title = 'School Stories - Swadhyay Seva Foundation';
  }, []);

  const [selectedEvent, setSelectedEvent] = useState(null);

  

  const closeModal = () => {
    setSelectedEvent(null);
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

      {/* Events Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          title="Our Journey in Schools"
          subtitle="Click on any event to view full details"
        />

        <div className="flex flex-wrap justify-center gap-6">
          {pastEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] max-w-sm"
            >
             <Card className="h-[260px] sm:h-[270px] lg:h-[280px] flex flex-col justify-between">


                <div
                  className="p-6 cursor-pointer hover:shadow-xl transition-shadow h-full flex flex-col justify-between"
                  onClick={() => setSelectedEvent(event)}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {event.school}
                  </h3>
                  
                  <div className="flex flex-col gap-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-primary-600" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-primary-600" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-primary-600" />
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
        </div>
      </section>

      {/* Use the EventModalCard Component */}
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
