import React from 'react';
import { motion } from 'framer-motion';
import { Quote, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from './Card';
import SectionHeader from './SectionHeader';

const Testimonials = () => {
  // Featured testimonials for homepage (first 3)
  const featuredTestimonials = [
    {
      quote: "We would like to thank you and your team for conducting Yoga Sessions at The Rajputana Rifles Regiment Centre for our troops (Approx 600 persons). We are quite sure that with your dedication and hardwork you and your group (SWADHYAY) will grow and succeed in your endeavors.",
      name: "Lt Col Vikash Jhajhria",
      role: "Adjutant",
      organization: "The Rajputana Rifles Regimental Centre",
      location: "PIN - 900106"
    },
    {
      quote: "We feel proud of your lecture among the students and staff. You have aware the students not to eat outside snacks and eatables. You also stressed on NATURE CARE, How the natural food can help our body to digest the things. You talked about YOGA also.",
      name: "Managing Director",
      role: "Managing Director",
      organization: "Evergray High School",
      location: "Kaithal"
    },
    {
      quote: "We appreciate Dr Manish Goel, founder of SWADHAY, for his Mission 'Har Ghar Moringa'. We are also thankful to him and his team for planting Moringa plants in our society and enlightening people about its medicinal qualities.",
      name: "President",
      role: "President",
      organization: "IVT Co-operative Group Housing Society Ltd.",
      location: "Rohini, Delhi"
    }
  ];

  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Voices of Appreciation"
          subtitle="What institutions and communities say about our initiatives"
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {featuredTestimonials.map((testimonial, index) => (
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

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/testimonials">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:bg-primary-700 transition-colors"
            >
              View All Testimonials
              <ArrowRight size={20} />
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
