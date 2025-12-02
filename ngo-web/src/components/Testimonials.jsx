import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import Card from './Card';
import SectionHeader from './SectionHeader';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "The event proved to be highly informative and inspiring, playing a significant role in enhancing students' environmental awareness, competitive spirit, and overall confidence.",
      name: "Ashok Pant",
      role: "Principal",
      school: "Gyan Vigyan Children's Academy",
      location: "Hawalbagh, Almora, Uttarakhand"
    },
    {
      quote: "The online quiz provided valuable insight and awareness regarding the environment. Such initiatives play a vital role in fostering environmental awareness, analytical thinking, and intellectual growth among young learners.",
      name: "Principal",
      role: "Principal",
      school: "Academic Heights World School",
      location: "Pitampura, New Delhi"
    },
    {
      quote: "Students benefit from this exam in many ways, as they learn how to conserve biodiversity at their local level and compete with other students in great and simple ways.",
      name: "Rattan Singh",
      role: "Principal I/C",
      school: "Jawahar Navodaya Vidyalaya",
      location: "Lari, Lahaul & Spiti, Himachal Pradesh"
    }
  ];

  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Voices from Our Schools"
          subtitle="What educators say about our environmental awareness initiatives"
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <div className="p-6 flex flex-col h-full">
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <Quote className="w-10 h-10 text-primary-600 opacity-30" />
                  </div>

                  {/* Quote Text */}
                  <p className="text-gray-700 italic mb-6 flex-grow leading-relaxed">
                    "{testimonial.quote}"
                  </p>

                  {/* Author Info */}
                  <div className="border-t border-gray-200 pt-4">
                    <p className="font-bold text-gray-900 text-lg">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-primary-600 font-medium">
                      {testimonial.role}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {testimonial.school}
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

        
      </div>
    </section>
  );
};

export default Testimonials;
