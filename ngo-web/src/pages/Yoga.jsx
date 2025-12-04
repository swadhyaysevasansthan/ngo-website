import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Users, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const Yoga = () => {
  useEffect(() => {
    document.title = 'Yoga - Swadhyay Seva Foundation';
  }, []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

 const galleryImages = [
  {
    src: '/images/communities/yoga/yoga1.jpg',
    alt: 'Group yoga session'
  },
  {
    src: '/images/communities/yoga/yoga13.jpg',
    alt: 'Yoga training workshop'
  },
  {
    src: '/images/communities/yoga/yoga3.jpg',
    alt: 'Large group yoga gathering'
  },
  {
    src: '/images/communities/yoga/yoga17.jpg',
    alt: 'Meditation session'
  },
  {
    src: '/images/communities/yoga/yoga5.jpg',
    alt: 'Outdoor yoga session'
  },
  {
    src: '/images/communities/yoga/yoga6.jpg',
    alt: 'Yoga instructor demonstrating pose'
  },
  {
    src: '/images/communities/yoga/yoga7.jpg',
    alt: 'Community yoga practice'
  },
  {
    src: '/images/communities/yoga/yoga20.jpg',
    alt: 'International Yoga Day celebration'
  },
  {
    src: '/images/communities/yoga/yoga9.jpg',
    alt: 'Students participating in yoga'
  },
  {
    src: '/images/communities/yoga/yoga21.jpg',
    alt: 'Morning yoga session'
  },
  {
    src: '/images/communities/yoga/yoga25.jpg',
    alt: 'Breathing exercises practice'
  },
  {
    src: '/images/communities/yoga/yoga12.jpg',
    alt: 'Yoga camp participants'
  },
];


  const stats = [
    { icon: <CalendarDays size={32} />, number: '300+', label: 'Yoga Camps Conducted' },
    { icon: <Users size={32} />, number: '50,000+', label: 'Participants Reached' },
    { icon: <Heart size={32} />, number: '50+', label: 'Locations Covered' },
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

    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentImageIndex]); // Reset timer when user manually changes image

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/communities/yoga/yoga2.jpg')",
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
              Yoga
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Promoting holistic health and well-being through ancient yogic practices
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Our Yoga Initiative
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Yoga is more than physical exercise—it's a path to holistic wellness that 
            harmonizes mind, body, and spirit. At Swadhyay Seva Foundation, we organize 
            yoga camps, workshops, and awareness programs across schools, villages, and 
            urban communities to make this ancient practice accessible to all.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our experienced instructors guide participants through asanas (postures), 
            pranayama (breathing techniques), and meditation practices that reduce stress, 
            improve physical health, and enhance mental clarity. We celebrate International 
            Day of Yoga with mass gatherings, bringing communities together in the spirit 
            of wellness and unity.
          </p>
          <p className="text-gray-700 leading-relaxed">
            From beginners to advanced practitioners, our programs cater to all levels, 
            creating spaces where individuals can discover the transformative power of yoga 
            and integrate it into their daily lives for lasting health benefits.
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
    title="Yoga in Action"
    subtitle="Capturing moments of wellness, peace, and community"
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
            Begin Your Yoga Journey
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our yoga programs and experience holistic wellness
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

export default Yoga;
