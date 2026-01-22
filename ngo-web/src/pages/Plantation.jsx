import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trees, Users, Leaf, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const Plantation = () => {
  useEffect(() => {
    document.title = 'Plantation - Swadhyay Seva Foundation';
  }, []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const galleryImages = [
    {
      src: '/images/communities/plantation/plantation1.jpg',
      alt: 'Community tree planting'
    },
    {
      src: '/images/communities/plantation/plantation2.jpg',
      alt: 'Students planting trees'
    },
    {
      src: '/images/communities/plantation/plantation3.jpg',
      alt: 'Saplings ready for planting'
    },
    {
      src: '/images/communities/plantation/plantation4.jpg',
      alt: 'Mass plantation drive'
    },
    {
      src: '/images/communities/plantation/plantation5.jpg',
      alt: 'Green zone created'
    },
    {
      src: '/images/communities/plantation/plantation6.jpg',
      alt: 'Volunteers planting saplings'
    },
  ];

  const stats = [
<<<<<<< HEAD
    { icon: <Trees size={32} />, number: '50,000+', label: 'Saplings Planted' },
=======
    { icon: <Trees size={32} />, number: '10,000+', label: 'Saplings Planted' },
>>>>>>> f2d062dd9de6fc65cfcbc922ebc2286d2486123e
    { icon: <Users size={32} />, number: '5,000+', label: 'Volunteers Engaged' },
    { icon: <Leaf size={32} />, number: '100+', label: 'Green Zones Created' },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentImageIndex]);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/communities/plantation/hero.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Plantation
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Growing a greener tomorrow, one tree at a time
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Our Plantation Initiatives
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Trees are the lungs of our planet, and planting them is one of the most direct 
            ways to combat climate change and restore ecological balance. At Swadhyay Seva 
            Foundation, we organize mass plantation drives that bring communities together 
            in the shared mission of creating a greener, healthier environment.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our "One Person, One Tree" campaigns encourage individual responsibility while 
            creating collective impact. We work with schools, villages, and urban areas to 
            establish green zones, medicinal gardens, and community forests. Each sapling 
            planted represents hope for future generations and a commitment to environmental 
            stewardship.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Beyond planting, we provide guidance on sapling care, species selection, and 
            long-term maintenance to ensure survival and growth. Our plantation programs 
            foster environmental awareness, strengthen community bonds, and leave lasting 
            green legacies across the regions we serve.
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-primary-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <div className="mb-3">{stat.icon}</div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Carousel/Slideshow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          title="Growing Green Communities"
          subtitle="Documenting our journey towards a greener planet"
        />

        <div className="relative max-w-5xl mx-auto mt-12">
          {/* Main Image Display */}
          <div className="relative h-[400px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
            <AnimatePresence initial={false}>
              <motion.img
                key={currentImageIndex}
                src={galleryImages[currentImageIndex].src}
                alt={galleryImages[currentImageIndex].alt}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ 
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.5 }
                }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Previous Button */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-20 backdrop-blur-sm"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>

            {/* Next Button */}
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-20 backdrop-blur-sm"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </div>

          {/* Thumbnail Navigation */}
          <div className="flex justify-center gap-2 md:gap-4 mt-6 overflow-x-auto pb-2">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentImageIndex
                    ? 'border-primary-600 ring-2 ring-primary-300 scale-110'
                    : 'border-gray-300 hover:border-primary-400 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={image.src}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Image Counter */}
          <div className="text-center mt-4 text-gray-600">
            <span className="text-lg font-medium">
              {currentImageIndex + 1} / {galleryImages.length}
            </span>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary-600 to-saffron-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Plant a Tree, Plant Hope
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our plantation drives and contribute to a greener future
          </p>
          <Link to="/contact">
            <Button variant="light">
              Get Involved
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Plantation;
