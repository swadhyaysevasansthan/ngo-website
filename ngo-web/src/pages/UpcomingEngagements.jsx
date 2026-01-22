import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, ChevronDown, ChevronUp, Award } from 'lucide-react';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';

const UpcomingEngagements = () => {
  const [isAnnouncementExpanded, setIsAnnouncementExpanded] = useState(true);

  useEffect(() => {
    document.title = 'Upcoming Engagements - Swadhyay Seva Foundation';
  }, []);

  const upcomingEvents = [
    { date: '16/01/2026', school: 'South Eastern Railway Mixed Higher Secondary School, Adra (Campus-2)', location: 'WEST BENGAL' },
    { date: '17/01/2026', school: 'JK Public School, Kathua', location: 'JAMMU AND KASHMIR' },
    { date: '18/01/2026', school: 'Jhabban Lal DAV Public School', location: 'DELHI' },
    { date: '19/01/2026', school: 'Bloomz International School', location: 'GOA' },
    { date: '19/01/2026', school: 'GND DAV Public School, Bhikhiwind', location: 'PUNJAB' },
    { date: '19/01/2026', school: 'Vedantic International School', location: 'UTTAR PRADESH' },
    { date: '21/01/2026', school: 'Brainy Blooms Lecole Internationale', location: 'PUDUCHERRY' },
    { date: '22/01/2026', school: 'Delhi Public Senior Secondary School, Barmer', location: 'RAJASTHAN' },
    { date: '22/01/2026', school: 'DAV Public School, Hamirpur', location: 'HIMACHAL PRADESH' },
    { date: '27/01/2026', school: 'Akal Academy, Chogawan', location: 'PUNJAB' },
    { date: '27/01/2026', school: 'Delhi Public School HRIT Campus', location: 'UTTAR PRADESH' },
    { date: '28/01/2026', school: 'The Mother\'s International School', location: 'DELHI' },
    { date: '29/01/2026', school: 'The Mann School', location: 'DELHI' },
    { date: '02/02/2026', school: 'Holy Public School', location: 'UTTAR PRADESH' },
    { date: '04/02/2026', school: 'Brainy Blooms Concept School', location: 'PUDUCHERRY' },
    { date: '05/02/2026', school: 'Bal Bharati Public School, Nabinagar', location: 'BIHAR' },
    { date: '09/02/2026', school: 'Army Public School, Ranikhet', location: 'UTTARAKHAND' },
    { date: '20/02/2026', school: 'Eklavya Model Residential School, Gamnom Sapormeina', location: 'MANIPUR' },
    { date: '15/03/2026', school: 'Dalhousie Public School', location: 'HIMACHAL PRADESH' },
  ];

  return (
    <div className="bg-gray-50">
      {/* Collapsible Announcement Banner */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header - Always Visible */}
          <button
            onClick={() => setIsAnnouncementExpanded(!isAnnouncementExpanded)}
            className="w-full py-4 flex items-center justify-between text-white hover:bg-white/5 transition-colors rounded-lg px-2"
          >
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-yellow-300" />
              <h2 className="text-xl md:text-2xl font-bold">
                Photography Competition - WORLD WETLANDS DAY
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/80 hidden sm:block">
                {isAnnouncementExpanded ? 'Click to minimize' : 'Click for details'}
              </span>
              {isAnnouncementExpanded ? (
                <ChevronUp className="w-6 h-6" />
              ) : (
                <ChevronDown className="w-6 h-6" />
              )}
            </div>
          </button>

          {/* Expandable Content */}
          <AnimatePresence>
            {isAnnouncementExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="pb-6">
                  {/* Competition Details */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-white/80 mb-1">Open to:</p>
                          <p className="text-lg font-semibold">All College & University Students</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-white/80 mb-1">Theme:</p>
                          <p className="text-lg font-semibold">Wetlands and Traditional Knowledge: Celebrating Cultural Heritage</p>
                        </div>

                        <div>
                          <p className="text-sm text-white/80 mb-1">Submission Period:</p>
                          <p className="text-lg font-semibold">23rd to 29th January 2026 (till 5:00 PM)</p>
                          <p className="text-sm text-yellow-300 mt-1">📸 Photos to be taken ONLY at DDA Yamuna Biodiversity Park</p>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-white/80 mb-1">Results & Prize Distribution:</p>
                          <p className="text-lg font-semibold">2nd February 2026</p>
                        </div>

                        <div>
                          <p className="text-sm text-white/80 mb-1">Venue:</p>
                          <p className="text-base">DDA Yamuna Biodiversity Park, Main Jagatpur Rd, Wazirabad, Delhi-110084</p>
                        </div>

                        <div>
                          <p className="text-sm text-white/80 mb-2">Prizes:</p>
                          <ul className="space-y-1 text-sm">
                            <li>🥇 1st Prize: ₹2000 Cash + Pen Drive + Earthenware Glasses</li>
                            <li>🥈 2nd Prize: ₹1500 Cash + Pen Drive + Earthenware Glasses</li>
                            <li>🥉 3rd Prize: ₹1000 Cash + Pen Drive + Earthenware Glasses</li>
                            <li>🎖️ 5 Consolation Prizes: Earthenware Glasses</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Organizers */}
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <p className="text-sm text-white/80 mb-2">Organized by:</p>
                      <p className="text-base">
                        DDA Yamuna Biodiversity Park | Gardening Committee, Rajdhani College (DU) | Swadhyay Seva Foundation
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-saffron-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Calendar className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Upcoming Engagements</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Find out where we're headed next and how you can be a part of our mission
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          title="Our Schedule"
          subtitle="Join us at these upcoming quiz events across India"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {upcomingEvents.map((event, index) => (
            <Card key={index} delay={index * 0.05}>
              <div className="p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl font-bold text-primary-600">{event.date}</span>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2 min-h-[3rem]">
                  {event.school}
                </h3>
                
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-saffron-600" />
                  <span className="text-sm font-medium">{event.location}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Want to Host a Quiz at Your School?</h2>
          <p className="text-blue-100 mb-6">
            Reach out to us to organize an environmental awareness quiz event at your institution
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
};

export default UpcomingEngagements;
