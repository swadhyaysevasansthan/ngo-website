import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';
import { testimonials } from '../data/testimonialsData';

const TestimonialsPage = () => {
  useEffect(() => {
    document.title = 'Testimonials - Swadhyay Seva Foundation';
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-saffron-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Testimonials</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Letters of appreciation from schools, housing societies, and institutions we've partnered with
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          title="Voices of Appreciation"
          subtitle="Read what our partners and beneficiaries say about our work"
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                <div className="p-6 flex flex-col h-full">
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <Quote className="w-10 h-10 text-primary-600 opacity-30" />
                  </div>

                  {/* Quote Text */}
                  <p className="text-gray-700 italic mb-6 flex-grow leading-relaxed text-sm">
                    "{testimonial.quote}"
                  </p>

                  {/* Author Info */}
                  <div className="border-t border-gray-200 pt-4">
                    <p className="font-bold text-gray-900 text-base">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-primary-600 font-medium">
                      {testimonial.role}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {testimonial.organization}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TestimonialsPage;
