import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Rocket } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';
import CircularGallery from '../components/CircularGallery';
import { communityAPI } from '../utils/api';

const CommunityPage = () => {
  const { slug: paramSlug } = useParams();
  const location = useLocation();
  const slug = paramSlug || location.pathname.slice(1);

  const [topic, setTopic] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const galleryRef = useRef(null);


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll to gallery every time it enters viewport
  useEffect(() => {
    if (!galleryRef.current) return;
    let cooldown = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !cooldown) {
          cooldown = true;
          galleryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(() => { cooldown = false; }, 2000);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(galleryRef.current);
    return () => observer.disconnect();
  }, [topic]);


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    communityAPI.getBySlug(slug)
      .then((res) => {
        setTopic(res.data.data);
        document.title = res.data.data.title + ' - Swadhyay Seva Foundation';
      })
      .catch(() => setError('Community topic not found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-500 mb-6">This community page does not exist yet.</p>
          <Link to="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const pastEvents = topic.events?.filter((e) => e.event_type === 'past') || [];
  const ongoingEvents = topic.events?.filter((e) => e.event_type === 'ongoing') || [];
  const futureEvents = topic.events?.filter((e) => e.event_type === 'future') || [];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: topic.hero_image_url
              ? `url('${topic.hero_image_url}')`
              : "linear-gradient(135deg, #2f855a 0%, #166534 60%, #14532d 100%)",
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
              {topic.title}
            </h1>
            {topic.description && (
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                {topic.description}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      {topic.stats?.length > 0 && (
        <section className="bg-primary-600 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`grid md:grid-cols-${Math.min(topic.stats.length, 4)} gap-8 text-center text-white`}>
              {topic.stats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center"
                >
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Content Sections */}
      {topic.sections?.length > 0 && (() => {
        const generalSections = topic.sections.filter(s => s.section_type !== 'card');
        const cardSections = topic.sections.filter(s => s.section_type === 'card');
        return (
          <>
            {/* Full-width sections (general + quote) */}
            {generalSections.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {generalSections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center max-w-4xl mx-auto"
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 underline underline-offset-8 decoration-primary-600 decoration-2">
                      {section.heading}
                    </h2>
                    {section.content && (() => {
                      const parts = section.content.split('\n\n');
                      const mainText = parts[0];
                      const quoteText = parts.length > 1 ? parts.slice(1).join('\n\n') : null;
                      return (
                        <>
                          <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                            {mainText}
                          </p>
                          {quoteText && (
                            <blockquote className="mt-6 border-l-4 border-primary-600 pl-5 py-2 text-left">
                              <p className="text-gray-600 italic text-base leading-relaxed font-serif">
                                {quoteText}
                              </p>
                            </blockquote>
                          )}
                        </>
                      );
                    })()}
                  </motion.div>
                ))}
              </section>
            )}

            {/* Card sections (displayed in grid) */}
            {cardSections.length > 0 && (
              <section className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className={`grid md:grid-cols-${Math.min(cardSections.length, 2)} gap-6`}>
                    {cardSections.map((section, index) => (
                      <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl shadow-md p-8 border border-gray-100"
                      >
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-sm">✦</span>
                          {section.heading}
                        </h3>
                        {section.content && (
                          <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                            {section.content}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        );
      })()}

      {/* Events & Activities */}
      {(pastEvents.length > 0 || ongoingEvents.length > 0 || futureEvents.length > 0) && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Activities & Events"
              subtitle="Stay updated with our past, ongoing, and upcoming programs"
            />
            <div className="mt-12 space-y-12">
              {[
                { title: 'Ongoing Activities & Events', items: ongoingEvents, icon: <Clock size={24} />, color: 'text-blue-600', borderColor: 'border-blue-500' },
                { title: 'Future Activities & Events', items: futureEvents, icon: <Rocket size={24} />, color: 'text-green-600', borderColor: 'border-green-500' },
                { title: 'Past Activities & Events', items: pastEvents, icon: <Calendar size={24} />, color: 'text-gray-600', borderColor: 'border-gray-400' },
              ]
                .filter((group) => group.items.length > 0)
                .map((group) => (
                  <div key={group.title}>
                    <div className="flex items-center mb-6">
                      <span className={`mr-3 ${group.color}`}>{group.icon}</span>
                      <h3 className={`text-xl font-bold tracking-wide ${group.color}`}>{group.title}</h3>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      {group.items.map((event) => (
                        <motion.div key={event.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`bg-white rounded-2xl shadow-md border-l-4 ${group.borderColor} p-6`}>
                          {event.event_date && <div className="flex items-center gap-2 mb-2"><Calendar size={14} className="text-gray-400" /><span className="text-sm text-gray-500">{event.event_date}</span></div>}
                          <h4 className="text-lg font-semibold text-gray-800 mb-2">{event.title}</h4>
                          {event.description && <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Image Galleries - One per Album */}
      {(topic.albums?.length > 0 || topic.images?.length > 0) && (
        <section ref={galleryRef} className="py-16 bg-[#120F17] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <SectionHeader
              title="Gallery"
            />
          </div>

          {/* Album galleries */}
          {topic.albums?.map((album) => (
            album.images?.length > 0 && (
              <div key={album.id} className="mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-6"
                >
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    {album.title}
                  </h3>
                  {album.location && (
                    <p className="text-sm text-gray-400 mt-2">📍 {album.location}</p>
                  )}
                  {album.description && (
                    <p className="text-sm text-gray-300 mt-1 max-w-2xl mx-auto leading-relaxed">{album.description}</p>
                  )}
                </motion.div>
                <div style={{ height: '500px', position: 'relative' }}>
                  <CircularGallery
                    items={album.images.map((img, idx) => ({
                      image: img.image_url,
                      text: `${idx + 1}/${album.images.length}`
                    }))}
                    bend={1}
                    textColor="#ffffff"
                    borderRadius={0.06}
                    scrollSpeed={1.2}
                    scrollEase={0.07}
                  />
                </div>
              </div>
            )
          ))}

          {/* Ungrouped images fallback */}
          {topic.images?.length > 0 && (
            <div className="mb-8">
              {topic.albums?.length > 0 && (
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-2xl md:text-3xl font-bold text-white text-center mb-6"
                >
                  More Photos
                </motion.h3>
              )}
              <div style={{ height: '500px', position: 'relative' }}>
                <CircularGallery
                  items={topic.images.map((img, idx) => ({
                    image: img.image_url,
                    text: `${idx + 1}/${topic.images.length}`
                  }))}
                  bend={1}
                  textColor="#ffffff"
                  borderRadius={0.06}
                  scrollSpeed={1.2}
                  scrollEase={0.07}
                />
              </div>
            </div>
          )}
        </section>
      )}

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary-600 to-saffron-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
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
            <Link to="/contact">
              <Button variant="outline" className="bg-white text-primary-600 hover:bg-gray-100">
                Get Involved
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CommunityPage;
