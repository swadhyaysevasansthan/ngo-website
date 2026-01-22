import React, {useEffect} from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Heart, Leaf } from 'lucide-react';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';

const About = () => {

  useEffect(() => {
    document.title = 'About Us - Swadhyay Seva Foundation';
  }, []);

  const values = [
    {
      icon: <Heart className="w-10 h-10" />,
      title: "Compassionate Service",
      description: "Dedicating ourselves to serving society with empathy and care, touching lives through meaningful action.",
    },
    {
      icon: <Leaf className="w-10 h-10" />,
      title: "Sustainable Living",
      description: "Promoting eco-friendly practices and natural farming to preserve our environment for future generations.",
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "Community Empowerment",
      description: "Building strong, self-reliant communities through education, awareness, and collaborative efforts.",
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: "Excellence in Practice",
      description: "Maintaining highest standards in yoga, naturopathy, and all our initiatives with expert guidance.",
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Dedicated to empowering communities through holistic wellness, sustainable practices,
              and social awareness since our inception.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          title="Our Story"
          subtitle="A journey of dedication, service, and transformation"
        />
        <Card>
          <div className="p-8 md:p-12">
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              Swadhyay Seva Foundation was founded with a vision to create lasting positive change in society through
              self-awareness, natural health practices, and environmental consciousness. Our organization stands at
              the intersection of ancient wisdom and modern needs, bringing holistic wellness solutions to communities
              across India.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              What started as a small initiative has grown into a comprehensive movement touching thousands of lives.
              Through yoga camps, naturopathy training, natural farming initiatives, and environmental drives, we've
              created a ripple effect of positive transformation. Our work spans from urban centers to remote villages,
              ensuring that everyone has access to knowledge and practices that enhance quality of life.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Today, we continue to expand our reach while staying true to our core values: compassion, sustainability,
              and empowerment. Every program we conduct, every farmer we train, and every tree we plant is a step toward
              the healthier, more harmonious world we envision.
            </p>
          </div>
        </Card>
      </section>

      {/* Values Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Core Values"
            subtitle="Principles that guide everything we do"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} delay={index * 0.1}>
                <div className="p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-saffron-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          title="Our Goals"
          subtitle="What we strive to achieve"
        />
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-primary-700 mb-4">Health & Wellness</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start"><span className="text-primary-600 mr-2">•</span>Conduct regular yoga and naturopathy training programs across all demographics</li>
                <li className="flex items-start"><span className="text-primary-600 mr-2">•</span>Promote drug-free healing through natural methods and balanced lifestyle</li>
                <li className="flex items-start"><span className="text-primary-600 mr-2">•</span>Create awareness about stress management and preventive healthcare</li>
                <li className="flex items-start"><span className="text-primary-600 mr-2">•</span>Establish wellness centers providing accessible natural health solutions</li>
              </ul>
            </div>
          </Card>

          <Card delay={0.1}>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-primary-700 mb-4">Environmental Impact</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start"><span className="text-saffron-600 mr-2">•</span>Convert agricultural land from chemical to natural farming practices</li>
                <li className="flex items-start"><span className="text-saffron-600 mr-2">•</span>Train farmers in sustainable, chemical-free farming techniques</li>
                <li className="flex items-start"><span className="text-saffron-600 mr-2">•</span>Plant trees and create green zones in schools, villages, and urban areas</li>
                <li className="flex items-start"><span className="text-saffron-600 mr-2">•</span>Promote "One Person, One Tree" for ecological responsibility</li>
              </ul>
            </div>
          </Card>

          <Card delay={0.2}>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-primary-700 mb-4">Education & Awareness</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start"><span className="text-primary-600 mr-2">•</span>Organize workshops and campaigns on environmental and social issues</li>
                <li className="flex items-start"><span className="text-primary-600 mr-2">•</span>Engage youth in meaningful initiatives for community development</li>
                <li className="flex items-start"><span className="text-primary-600 mr-2">•</span>Conduct awareness drives on climate change and biodiversity</li>
                <li className="flex items-start"><span className="text-primary-600 mr-2">•</span>Create educational content and quizzes for knowledge dissemination</li>
              </ul>
            </div>
          </Card>

          <Card delay={0.3}>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-primary-700 mb-4">Community Building</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start"><span className="text-saffron-600 mr-2">•</span>Provide mentorship and technical guidance to farmers and communities</li>
                <li className="flex items-start"><span className="text-saffron-600 mr-2">•</span>Create support networks through farmer directories and resources</li>
                <li className="flex items-start"><span className="text-saffron-600 mr-2">•</span>Establish herbal garden corners and medicinal plant resources</li>
                <li className="flex items-start"><span className="text-saffron-600 mr-2">•</span>Foster individual and social responsibility toward environment</li>
              </ul>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default About;