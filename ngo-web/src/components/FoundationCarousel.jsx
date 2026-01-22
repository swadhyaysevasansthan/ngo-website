import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    src: '/images/home-carousel/yoga-camp.jpg',
    alt: 'Community yoga camp',
    caption: 'Yoga and wellness sessions for defence personnel and communities',
  },
  {
    src: '/images/home-carousel/moringa-drive.jpg',
    alt: 'Moringa plantation drive',
    caption: '“Har Ghar Moringa” mission across schools and housing societies',
  },
  {
    src: '/images/home-carousel/school-quiz.jpg',
    alt: 'Environmental quiz in school',
    caption: 'Environmental awareness quizzes inspiring young eco-champions',
  },
  {
    src: '/images/home-carousel/community-event.jpg',
    alt: 'Community awareness event',
    caption: 'Community programs on nature care, nutrition, and healthy living',
  },
];

const FoundationCarousel = () => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prev = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // auto-play every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          {/* Left: text */}
          <div className="md:w-1/3">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Glimpses of Our Work
            </h2>
            <p className="text-gray-600 mb-4">
              A snapshot of our school programs, plantation drives, yoga sessions, and
              community outreach initiatives.
            </p>
            <p className="text-sm text-gray-500">
              Use the arrows or dots to explore different moments from our journey.
            </p>
          </div>

          {/* Right: carousel */}
          <div className="md:w-2/3">
            <div className="relative h-[260px] sm:h-[320px] md:h-[360px] rounded-2xl overflow-hidden shadow-xl bg-gray-900">
              {/* image */}
              <img
                src={slides[current].src}
                alt={slides[current].alt}
                className="w-full h-full object-cover transition-opacity duration-500"
              />

              {/* gradient + caption */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6">
                <p className="text-sm sm:text-base text-white font-semibold">
                  {slides[current].caption}
                </p>
              </div>

              {/* prev/next */}
              <button
                onClick={prev}
                aria-label="Previous slide"
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                aria-label="Next slide"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition"
              >
                <ChevronRight size={20} />
              </button>

              {/* dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`h-2.5 w-2.5 rounded-full border border-white/70 transition ${
                      index === current ? 'bg-white' : 'bg-white/30'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundationCarousel;
