import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Users, BookOpen, Sprout, ArrowRight, Target, Eye } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';

const Home = () => {
  useEffect(() => {
    document.title = 'Home - Swadhyay Seva Foundation';
  }, []);

  const services = [
    {
      icon: <BookOpen className="w-12 h-12" />,
      title: "Education & Awareness",
      description: "Conducting yoga camps, workshops, and awareness drives in schools, villages, and urban areas to promote holistic well-being and knowledge.",
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Yoga & Naturopathy",
      description: "Training individuals in natural healing methods including yoga, naturopathy, mud therapy, and stress management through expert guidance.",
    },
    {
      icon: <Sprout className="w-12 h-12" />,
      title: "Natural Farming",
      description: "Converting land to chemical-free farming, training farmers in organic techniques, and creating model farms for sustainable agriculture.",
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Community Empowerment",
      description: "Organizing mass plantation drives, creating green zones, and empowering youth through environmental and social initiatives.",
    },
  ];

  // ---------- Highlights slideshow logic ----------
  const images = [
    '/images/highlight/high1.png',
    '/images/highlight/high2.png',
    '/images/highlight/high3.png',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Auto-scroll effect (every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [currentIndex]);
  // ------------------------------------------------

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-saffron-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Swadhyay Seva Foundation
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Empowering Lives Through Knowledge and Service
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/about">
                <Button variant="secondary">Learn More</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="bg-white text-primary-600 hover:bg-gray-100">
                  Get Involved
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <Card delay={0.1}>
            <div className="p-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To awaken self-awareness, promote health through natural methods like yoga and naturopathy, 
                and create sustainable farming communities that nurture both people and planet. We strive to 
                eliminate chemical use in farming while fostering environmental consciousness.
              </p>
            </div>
          </Card>

          <Card delay={0.2}>
            <div className="p-8">
              <div className="w-16 h-16 bg-saffron-100 rounded-full flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-saffron-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To help society by creating health awareness, promoting individual and social responsibility 
                through natural lifestyle practices. We envision communities that practice balanced living, 
                eliminate harmful habits, and contribute to a greener, healthier world.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader title="Highlights"/>

          {/* Slideshow Container */}
          <div className="relative overflow-hidden rounded-2xl shadow-lg max-w-4xl mx-auto">
            <div className="flex justify-center items-center relative">

              {images.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Highlight ${index + 1}`}
                  className={`w-full h-auto object-contain object-center transition-opacity duration-700 ${index === currentIndex ? 'opacity-100' : 'opacity-0 absolute'
                    }`}
                />
              ))}

              {/* Prev Button */}
              <button
                onClick={prevSlide}
                className="absolute left-2 md:left-1 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 shadow-md text-2xl"
              >
                ‹
              </button>

              {/* Next Button */}
              <button
                onClick={nextSlide}
                className="absolute right-2 md:right-1 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 shadow-md text-2xl"
              >
                ›
              </button>

            </div>
          </div>
        </div>
      </section>


      {/* What We Do Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="What We Do"
            subtitle="Comprehensive programs designed to create lasting positive impact"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} delay={index * 0.1}>
                <div className="p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-saffron-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Core Focus Areas Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          title="Our Core Focus"
          subtitle="Building sustainable communities through integrated programs"
        />
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <div className="p-6">
              <h4 className="font-semibold text-lg text-primary-700 mb-3">Yoga & Naturopathy</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 300+ yoga camps conducted</li>
                <li>• International Day of Yoga celebrations</li>
                <li>• Training in mud therapy & crystal healing</li>
                <li>• Stress management programs</li>
              </ul>
            </div>
          </Card>

          <Card delay={0.1}>
            <div className="p-6">
              <h4 className="font-semibold text-lg text-primary-700 mb-3">Natural Farming</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 1000+ acres converted to organic</li>
                <li>• 500+ farmers trained</li>
                <li>• Model farms for demonstrations</li>
                <li>• Farmer telephone directory</li>
              </ul>
            </div>
          </Card>

          <Card delay={0.2}>
            <div className="p-6">
              <h4 className="font-semibold text-lg text-primary-700 mb-3">Plantation & Environment</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 10,000+ saplings planted</li>
                <li>• Community green zones created</li>
                <li>• Medicinal gardens established</li>
                <li>• "One Person, One Tree" campaigns</li>
              </ul>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-saffron-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Be a Part of the Change
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join us in creating a healthier, more sustainable future for all
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/quiz">
                <Button variant="secondary" className="bg-black text-primary-600 hover:bg-gray-100">
                  Take Our Quiz <ArrowRight className="inline ml-2" size={20} />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900 hover:border-white">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
