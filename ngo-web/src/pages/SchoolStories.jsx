import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';
import EventModalCard from '../components/EventModalCard'; // Import the new component

const SchoolStories = () => {
  useEffect(() => {
    document.title = 'School Stories - Swadhyay Seva Foundation';
  }, []);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const pastEvents = [
    {
      id: 1,
      school: 'Eklavya Model Residential School Lahaul (EMRS)',
      location: 'Udaipur, Himachal Pradesh',
      date: 'November 4, 2025',
      participants: '50 students',
      description: 'We conducted an engaging environmental awareness quiz competition at EMRS Lahaul, testing students\' knowledge on climate change, biodiversity, and sustainable practices. The event was met with great enthusiasm from both students and faculty.',
      highlights: [
        'Interactive quiz format with 25 questions',
        'Focus on environmental conservation and sustainability',
        'Certificate distribution to all participants',
        'Engaging discussions on climate action'
      ],
      images: [
        '/images/events/emrs/emrs1.jpeg',
        '/images/events/emrs/emrs2.jpeg',
        '/images/events/emrs/emrs3.jpeg',
      ]
    },
    {
      id: 2,
      school: 'PM Shri School Jawahar Navodya Vidyalaya Lari',
      location: 'Tabo, Himachal Pradesh',
      date: 'November 13, 2025',
      participants: '49 students',
      description: 'We organized an exciting environmental awareness quiz at PM Shri School Jawahar Navodya Vidyalaya in the remote village of Lari, Tabo. The quiz challenged 49 bright students on topics including sustainable development, renewable energy, and conservation practices. The event fostered environmental consciousness in this high-altitude community, inspiring students to become eco-ambassadors in their region.',
      highlights: [
        'Comprehensive quiz covering sustainable living and eco-friendly practices',
        'Strong participation from students in a remote mountain region',
        'Interactive sessions on local environmental challenges and solutions',
        'Distribution of educational materials and certificates to all participants',
        'Emphasis on the role of youth in climate action'
      ],
      images: [
        '/images/events/JNV/jnv1.jpeg', 
        '/images/events/JNV/jnv2.jpeg',
        '/images/events/JNV/jnv3.jpeg',
        '/images/events/JNV/jnv4.jpeg',
        '/images/events/JNV/jnv5.jpeg',
      ]
    }

  ];

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
              <Card>
                <div
                  className="p-6 cursor-pointer hover:shadow-xl transition-shadow"
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
