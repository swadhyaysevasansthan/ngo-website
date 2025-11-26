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
  { date: '01/12/2025', school: 'Cygnus High World School', location: 'HARYANA' },
  { date: '02/12/2025', school: 'Akal Academy Ajitsar', location: 'HARYANA' },
  { date: '05/12/2025', school: 'Mayoor School, Noida', location: 'UTTAR PRADESH' },
  { date: '08/12/2025', school: 'Countrywide Public School, Garur', location: 'UTTARAKHAND' },
  { date: '09/12/2025', school: 'SACHDEVA PUBLIC SCHOOL, PITAM PURA', location: 'DELHI' },
  { date: '10/12/2025', school: 'St Xavier\'s High School, Cuttack', location: 'ODISHA' },
  { date: '10/12/2025', school: 'Vidya Bharti School', location: 'DELHI' },
  { date: '16/12/2025', school: 'Anant Vidya Niketan Public School (Bir)', location: 'HIMACHAL PRADESH' },
  { date: '16/12/2025', school: 'DELHI HERITAGE SCHOOL', location: 'DELHI' },
  { date: '21/12/2025', school: 'DAV Public School, Tanda', location: 'UTTAR PRADESH' },
  { date: '22/12/2025', school: 'JHABBAN LAL DAV PUBLIC SCHOOL', location: 'DELHI' },
  { date: '22/12/2025', school: 'JAGANNATH INTERNATIONAL SCHOOL', location: 'DELHI' },
  { date: '23/12/2025', school: 'DAV PUBLIC SCHOOL MIDNAPUR', location: 'WEST BENGAL' },
  { date: '12/01/2026', school: 'DAV Model School, IIT Kharagpur', location: 'WEST BENGAL' },
  { date: '17/01/2026', school: 'JK PUBLIC SCHOOL, KATHUA', location: 'JAMMU AND KASHMIR' },
  { date: '27/01/2026', school: 'Akal Academy, Chogawan', location: 'PUNJAB' },
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
