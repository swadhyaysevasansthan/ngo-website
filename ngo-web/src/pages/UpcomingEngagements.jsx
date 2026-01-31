import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, ChevronDown, ChevronUp, Award, Camera, Clock } from 'lucide-react';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';

const UpcomingEngagements = () => {
  const [isPhotoEventExpanded, setIsPhotoEventExpanded] = useState(false);

  useEffect(() => {
    document.title = 'Upcoming Engagements - Swadhyay Seva Foundation';
  }, []);

    const upcomingEvents = [
      { date: '31/01/2026', school: 'DAV Model School, Sankarpur', location: 'WEST BENGAL' },
      { date: '02/02/2026', school: 'Holy Public School', location: 'UTTAR PRADESH' },
      { date: '03/02/2026', school: 'Sukhjinder Memorial Public School', location: 'PUNJAB' },
      { date: '04/02/2026', school: 'Brainy Blooms Concept School', location: 'PUDUCHERRY' },
      { date: '05/02/2026', school: 'Bal Bharati Public School, Nabinagar', location: 'BIHAR' },
      { date: '09/02/2026', school: 'Army Public School, Ranikhet', location: 'UTTARAKHAND' },
      { date: '20/02/2026', school: 'Eklavya Model Residential School, Gamnom Sapormeina', location: 'MANIPUR' },
      { date: '15/03/2026', school: 'Dalhousie Public School', location: 'HIMACHAL PRADESH' },
    ];

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
            <Calendar className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Upcoming Engagements</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Find out where we're headed next and how you can be a part of our mission
            </p>
          </motion.div>
        </div>
      </section>

      {/* Photography Competition Section - Collapsible */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Collapsible Header */}
          <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 rounded-2xl shadow-xl overflow-hidden mb-8">
            <button
              onClick={() => setIsPhotoEventExpanded(!isPhotoEventExpanded)}
              className="w-full p-6 md:p-8 flex items-center justify-between group transition-all duration-200 hover:bg-white/10"
              aria-expanded={isPhotoEventExpanded}
              aria-label="Toggle photography competition details"
            >
              <div className="flex items-center gap-4 md:gap-6 flex-1">
                <div className="bg-white/20 p-3 md:p-4 rounded-xl backdrop-blur-sm flex-shrink-0">
                  <Camera className="w-8 h-8 md:w-10 md:h-10 text-yellow-300" />
                </div>
                <div className="text-left flex-1">
                  <div className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-full mb-3 text-xs md:text-sm font-bold">
                    <Award className="w-4 h-4" />
                    <span>Featured Event</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-2">
                    Photography Competition - World Wetlands Day 2026
                  </h2>
                  <p className="text-sm md:text-base text-emerald-100">
                    23-29 January • Open to all university & college students • Win up to ₹2,000
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                <span className="hidden sm:block text-sm md:text-base text-emerald-100 font-medium">
                  {isPhotoEventExpanded ? 'Show less' : 'View details'}
                </span>
                <div className="bg-white/20 p-2 rounded-lg">
                  {isPhotoEventExpanded ? (
                    <ChevronUp className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:translate-y-[-2px] transition-transform" />
                  ) : (
                    <ChevronDown className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:translate-y-[2px] transition-transform" />
                  )}
                </div>
              </div>
            </button>

            {/* Expandable Content */}
            <AnimatePresence initial={false}>
              {isPhotoEventExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-4 md:px-8 pb-8">
                    {/* Eligibility Badge */}
                    <div className="mb-6 flex justify-center">
                      <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-gray-900 px-6 py-3 rounded-full font-bold text-sm md:text-base shadow-lg inline-flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Open to All College & University Students
                      </div>
                    </div>

                    {/* Main Content Card */}
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                      {/* Key Info Grid */}
                      <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                        {/* Duration */}
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-600 p-2 rounded-lg">
                              <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Duration</p>
                              <p className="text-base md:text-lg font-bold text-gray-900 leading-tight">23-29 January 2026</p>
                              <p className="text-sm text-red-600 font-semibold mt-2 flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Deadline: 29 Jan, 5:00 PM
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Venue */}
                        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
                          <div className="flex items-start gap-3">
                            <div className="bg-green-600 p-2 rounded-lg">
                              <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Venue</p>
                              <p className="text-base font-bold text-gray-900">DDA Yamuna Biodiversity Park</p>
                              <p className="text-sm text-gray-600 mt-1">Main Jagatpur Road, Wazirabad</p>
                              <p className="text-sm text-gray-600">Delhi-110084</p>
                            </div>
                          </div>
                        </div>

                        {/* Timings */}
                        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                          <div className="flex items-start gap-3">
                            <div className="bg-purple-600 p-2 rounded-lg">
                              <Clock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Visit Hours</p>
                              <p className="text-base font-semibold text-gray-900">Morning Session</p>
                              <p className="text-sm text-gray-700">10:30 AM - 12:30 PM</p>
                              <p className="text-base font-semibold text-gray-900 mt-2">Evening Session</p>
                              <p className="text-sm text-gray-700">2:30 PM - 4:30 PM</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Theme Section */}
                      <div className="px-6 py-5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
                        <p className="text-sm font-semibold uppercase tracking-wide mb-2 opacity-90">Competition Theme</p>
                        <p className="text-xl md:text-2xl font-bold leading-tight">
                          Wetlands and Traditional Knowledge: Celebrating Cultural Heritage
                        </p>
                      </div>

                      {/* Prizes Section */}
                      <div className="p-6 md:p-8 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="bg-yellow-500 p-2 rounded-lg">
                            <Award className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900">Prizes & Recognition</h3>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {/* 1st Prize */}
                          <div className="bg-white rounded-lg p-5 shadow-md border-2 border-yellow-400 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
                              1ST PLACE
                            </div>
                            <div className="text-5xl mb-3">🥇</div>
                            <p className="text-2xl font-bold text-gray-900 mb-2">₹2,000</p>
                            <p className="text-sm text-gray-600 leading-relaxed">+ Pen Drive + Earthenware Glasses</p>
                          </div>

                          {/* 2nd Prize */}
                          <div className="bg-white rounded-lg p-5 shadow-md border-2 border-gray-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-gray-400 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                              2ND PLACE
                            </div>
                            <div className="text-5xl mb-3">🥈</div>
                            <p className="text-2xl font-bold text-gray-900 mb-2">₹1,500</p>
                            <p className="text-sm text-gray-600 leading-relaxed">+ Pen Drive + Earthenware Glasses</p>
                          </div>

                          {/* 3rd Prize */}
                          <div className="bg-white rounded-lg p-5 shadow-md border-2 border-orange-400 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-orange-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
                              3RD PLACE
                            </div>
                            <div className="text-5xl mb-3">🥉</div>
                            <p className="text-2xl font-bold text-gray-900 mb-2">₹1,000</p>
                            <p className="text-sm text-gray-600 leading-relaxed">+ Pen Drive + Earthenware Glasses</p>
                          </div>

                          {/* Consolation */}
                          <div className="bg-white rounded-lg p-5 shadow-md border-2 border-blue-300 relative overflow-hidden">
                            <div className="text-5xl mb-3">🎖️</div>
                            <p className="text-lg font-bold text-gray-900 mb-2">5 Consolation Prizes</p>
                            <p className="text-sm text-gray-600 leading-relaxed">Earthenware Glasses</p>
                          </div>
                        </div>
                      </div>

                      {/* Guidelines Section */}
                      <div className="p-6 md:p-8 bg-gray-50">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-2xl">📋</span>
                          Important Guidelines
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</div>
                            <p className="text-sm text-gray-700">Photographs must be captured ONLY at DDA Yamuna Biodiversity Park during 23-29 Jan 2026</p>
                          </div>
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</div>
                            <p className="text-sm text-gray-700">Editing allowed: Contrast, Brightness, Cropping ONLY - no filters or heavy manipulation</p>
                          </div>
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">✗</div>
                            <p className="text-sm text-gray-700">Previously taken or off-site photographs will NOT be accepted</p>
                          </div>
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</div>
                            <p className="text-sm text-gray-700">Submit ONE photograph (Maximum 20MB) - Registration mandatory before submission</p>
                          </div>
                        </div>
                      </div>

                      {/* Result Announcement */}
                      <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold uppercase tracking-wide mb-1 opacity-90">Results Announcement</p>
                            <p className="text-2xl font-bold">2nd February 2026 (World Wetlands Day)</p>
                            <p className="text-sm mt-1 opacity-90">📍 DDA Yamuna Biodiversity Park • 🕙 10:00 AM onwards</p>
                          </div>
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="p-6 md:p-8 bg-white border-t-4 border-emerald-600">
                        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                          <a
                            href="https://forms.gle/bPiTHvjtbuiT6n9m6"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative bg-emerald-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-emerald-700 transition-all duration-200 text-center shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                          >
                            <span className="text-xl">📝</span>
                            <span>Register Now</span>
                          </a>
                          <a
                            href="https://forms.gle/TpZKLLjSSf2mLcie9"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative bg-yellow-400 text-gray-900 font-bold py-4 px-8 rounded-lg hover:bg-yellow-500 transition-all duration-200 text-center shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                          >
                            <span className="text-xl">📤</span>
                            <span>Submit Photograph</span>
                          </a>
                        </div>
                      </div>

                      {/* Organizers Footer */}
                      <div className="px-6 py-4 bg-gray-100 text-center border-t border-gray-200">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-semibold">Organized by</p>
                        <p className="text-sm text-gray-700">
                          DDA Yamuna Biodiversity Park • Gardening Committee, Rajdhani College (DU) • Swadhyay Seva Foundation, Delhi
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* Events Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ">
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


