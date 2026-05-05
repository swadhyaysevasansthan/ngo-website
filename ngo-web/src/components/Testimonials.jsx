import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from './Card';
import SectionHeader from './SectionHeader';

const Testimonials = () => {
  const featuredTestimonials = [
    {
      quote:
        "The event proved to be highly informative and inspiring, playing a significant role in enhancing students' environmental awareness, competitive spirit, and overall confidence.",
      name: 'Ashok Pant',
      role: 'Principal',
      school: "Gyan Vigyan Children's Academy",
      location: 'Hawalbagh, Almora, Uttarakhand',
    },
    {
      quote:
        'The online quiz provided valuable insight and awareness regarding the environment. Such initiatives play a vital role in fostering environmental awareness, analytical thinking, and intellectual growth among young learners.',
      name: 'Principal',
      role: 'Principal',
      school: 'Academic Heights World School',
      location: 'Pitampura, New Delhi',
    },
    {
      quote:
        'Students benefit from this exam in many ways, as they learn how to conserve biodiversity at their local level and compete with other students in great and simple ways.',
      name: 'Rattan Singh',
      role: 'Principal I/C',
      school: 'Jawahar Navodaya Vidyalaya',
      location: 'Lari, Lahaul & Spiti, Himachal Pradesh',
    },
    {
      quote:
        'Our experience with the SNEAC 2025–26 Quiz Competition was highly enriching and very well coordinated. It encouraged our students to think critically, participate with confidence, and expand their knowledge.',
      name: 'K. K. Pant',
      role: 'Headmaster',
      school: 'Koormanchal Academy',
      location: 'Almora, Uttarakhand',
    },
    {
      quote:
        'Participation in the SNEAC programme was well‑organised and beneficial for our students, supporting value‑based learning and social awareness.',
      name: 'Principal',
      role: 'Principal',
      school: 'Himalaya Public Sr. Sec. School',
      location: 'Rohini, Delhi',
    },
    {
      quote:
        'The Swadhyay National Environment Awareness online quiz gave our students a valuable learning experience that strengthened awareness, speed, and analytical thinking.',
      name: 'Headmistress',
      role: 'Headmistress',
      school: 'D.A.V. Public School, Jhanjra Area',
      location: 'Paschim Bardhaman, West Bengal',
    },
    {
      quote:
        'Conducting the Swadhyay National Environment Awareness Quiz at our school reflected sincere dedication and hard work, and strongly supported our efforts to build environmental consciousness.',
      name: 'Naresh Kumar Sharma',
      role: 'Principal',
      school: 'DAV Public School BSPS Surangani',
      location: 'District Chamba, Himachal Pradesh',
    },
  ];

  const scrollRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Recalculate pages on resize
  useEffect(() => {
    const calculatePages = () => {
      const container = scrollRef.current;
      if (!container) return;

      // approximate single-card width (same as your min-w on the card wrapper)
      const cardWidth = 320; // px, between 280–360
      const visibleWidth = container.offsetWidth;
      const cardsPerPage = Math.max(1, Math.floor(visibleWidth / cardWidth));
      const pages = Math.max(
        1,
        Math.ceil(featuredTestimonials.length / cardsPerPage)
      );
      setTotalPages(pages);
      setCurrentPage((prev) => Math.min(prev, pages - 1));
    };

    calculatePages();
    window.addEventListener('resize', calculatePages);
    return () => window.removeEventListener('resize', calculatePages);
  }, [featuredTestimonials.length]);

  const scrollToPage = (pageIndex) => {
    const container = scrollRef.current;
    if (!container) return;

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const target =
      totalPages <= 1
        ? 0
        : Math.min(maxScrollLeft, (maxScrollLeft / (totalPages - 1)) * pageIndex);

    container.scrollTo({
      left: target,
      behavior: 'smooth',
    });
  };

  const handleArrowClick = (direction) => {
    if (direction === 'next') {
      const next = Math.min(currentPage + 1, totalPages - 1);
      setCurrentPage(next);
      scrollToPage(next);
    } else {
      const prev = Math.max(currentPage - 1, 0);
      setCurrentPage(prev);
      scrollToPage(prev);
    }
  };

  // indicator width & position based on pages
  const thumbWidthPercent = totalPages > 0 ? 100 / totalPages : 100;
  const barLeftPercent = thumbWidthPercent * currentPage;

  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Voices of Appreciation"
          subtitle="What institutions and communities say about our initiatives"
        />

        <div className="relative mt-12">
          {/* Arrows */}
          {totalPages > 1 && (
            <>
              <button
                onClick={() => handleArrowClick('prev')}
                className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-primary-50 text-gray-700 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous testimonial"
                disabled={currentPage === 0}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => handleArrowClick('next')}
                className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-primary-50 text-gray-700 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next testimonial"
                disabled={currentPage === totalPages - 1}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Scrollable row */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory hide-native-scrollbar"
          >
            {featuredTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="min-w-[280px] sm:min-w-[320px] lg:min-w-[360px] snap-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <div className="p-6 flex flex-col h-full">
                    <div className="mb-4">
                      <Quote className="w-10 h-10 text-primary-600 opacity-30" />
                    </div>

                    <p className="text-gray-700 italic mb-6 flex-grow leading-relaxed text-sm">
                      "{testimonial.quote}"
                    </p>

                    <div className="border-t border-gray-200 pt-4">
                      <p className="font-bold text-gray-900 text-base">
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

          {/* Position bar */}
          {totalPages > 1 && (
            <div className="mx-auto mt-3 h-[4px] w-40 rounded-full bg-blue-200/60 relative overflow-hidden">
              <div
                className="absolute inset-y-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-400 transition-all duration-300"
                style={{
                  width: `${thumbWidthPercent}%`,
                  left: `${barLeftPercent}%`,
                }}
              />
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/testimonials">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-primary-700 transition-colors"
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