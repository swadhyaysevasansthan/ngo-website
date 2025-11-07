import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, Users, Leaf } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import Card from "../components/Card";

const Activities = () => {
  const activities = [
    {
      title: "Yoga & Wellness Camps",
      description:
        "Regular yoga sessions and holistic wellness workshops conducted across various regions to promote natural living.",
      icon: <Users className="w-8 h-8 text-primary-600" />,
    },
    {
      title: "Environmental Drives",
      description:
        "Tree plantation campaigns and awareness programs encouraging sustainable practices and community participation.",
      icon: <Leaf className="w-8 h-8 text-green-600" />,
    },
    {
      title: "Social Awareness Events",
      description:
        "Organizing talks and outreach programs on health, environment, and lifestyle for schools and communities.",
      icon: <CalendarDays className="w-8 h-8 text-saffron-600" />,
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
            Our Activities
          </motion.h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            A glimpse into our ongoing efforts to build awareness, health, and
            harmony in society.
          </p>
        </div>
      </section>

      {/* Activities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          title="What We Do"
          subtitle="Our activities reflect our mission to serve, educate, and empower communities"
        />

        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {activities.map((activity, index) => (
            <Card key={index} delay={index * 0.1}>
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-primary-50 rounded-full">
                  {activity.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {activity.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {activity.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Activities;
