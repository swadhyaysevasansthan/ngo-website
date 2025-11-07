import React from "react";
import { motion } from "framer-motion";
import { Flag, Target, Award } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import Card from "../components/Card";

const Milestones = () => {
  const milestones = [
    {
      year: "2018",
      title: "Foundation Established",
      description:
        "Swadhyay Seva Foundation was founded with the vision of promoting holistic wellness and natural living.",
      icon: <Flag className="w-8 h-8 text-primary-600" />,
    },
    {
      year: "2020",
      title: "Community Yoga Programs",
      description:
        "Launched large-scale yoga and naturopathy awareness programs benefiting thousands across India.",
      icon: <Target className="w-8 h-8 text-saffron-600" />,
    },
    {
      year: "2023",
      title: "Sustainable Farming Initiative",
      description:
        "Started natural farming training programs for farmers to promote eco-friendly and chemical-free agriculture.",
      icon: <Award className="w-8 h-8 text-green-600" />,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Our Milestones
          </motion.h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            A journey of growth, impact, and service — step by step toward a healthier world.
          </p>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          title="Key Highlights"
          subtitle="Some of our proud achievements over the years"
        />
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {milestones.map((item, index) => (
            <Card key={index} delay={index * 0.1}>
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-primary-50 rounded-full">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 font-medium mb-3">
                  {item.year}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Milestones;
