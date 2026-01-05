import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';

const UpcomingEngagements = () => {
  useEffect(() => {
    document.title = 'Upcoming Engagements - Swadhyay Seva Foundation';
  }, []);

  const upcomingEvents = [
  { date: '06/01/2026', school: 'St Xavier\'s High School, Cuttack', location: 'ODISHA' },
  { date: '07/01/2025', school: 'DAV Public School, Raipur', location: 'CHHATTISGARH' },
  { date: '07/01/2026', school: 'Raniganj Lions JDM Chanani DAV Public School', location: 'MANIPUR' },
  { date: '09/01/2026', school: 'Babu Brish Bhan Dav Public School, Moonak', location: 'WEST BENGAL' },
  { date: '12/01/2026', school: 'AGPN Convent & ER School', location: 'WEST BENGAL' },
  { date: '12/01/2026', school: 'DAV Model School, IIT Kharagpur', location: 'WEST BENGAL' },
  { date: '12/01/2026', school: 'Assam Rifles Public School, Mantripukhri', location: 'MANIPUR' },
  { date: '13/01/2026', school: 'DDB DAV Centenary Public School', location: 'PUNJAB' },
  { date: '13/01/2026', school: 'DAV Model School, Sankarpur', location: 'WEST BENGAL' },
  { date: '15/01/2026', school: 'DAV Public Senior Secondary School, Badshahpur', location: 'PUNJAB' },
  { date: '16/01/2026', school: 'Jhabban Lal DAV Public School', location: 'DELHI' },
  { date: '16/01/2026', school: 'GND DAV Public School, Bhikhiwind', location: 'PUNJAB' },
  { date: '17/01/2026', school: 'JK Public School, Kathua', location: 'GOA' },
  { date: '19/01/2026', school: 'Bloomz International School', location: 'JAMMU AND KASHMIR' },
  { date: '19/01/2026', school: 'South Eastern Railway Mixed Higher Secondary School, Adra (Campus-2)', location: 'WEST BENGAL' },
  { date: '19/01/2026', school: 'DAV Public School ', location: 'UTTAR PRADESH' },
  { date: '19/01/2026', school: 'Vedantic International School', location: 'UTTAR PRADESH' },
  { date: '21/01/2026', school: 'Brainy Blooms Lecole Internationale', location: 'PUDUCHERRY' },
  { date: '22/01/2026', school: 'Delhi Public Senior Secondary School, Barmer', location: 'RAJASTHAN' },
  { date: '27/01/2026', school: 'Akal Academy, Chogawan', location: 'PUNJAB' },
  { date: '28/01/2026', school: 'The Mother\'s International School', location: 'PUNJAB' },
  { date: '29/01/2026', school: 'The Mann School', location: 'DELHI' },
  { date: '02/02/2026', school: 'HOLY PUBLIC SCHOOL', location: 'UTTAR PRADESH' },
  { date: '04/02/2026', school: 'Brainy Blooms Concept School', location: 'PUDUCHERRY' },
  { date: '09/02/2026', school: 'Army Public School, Ranikhet', location: 'UTTARAKHAND' },
  { date: '20/02/2026', school: 'Eklavya Model Residential School Gamnom Sapormeina', location: 'MANIPUR' },
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
