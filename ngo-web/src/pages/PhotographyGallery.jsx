import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Camera, X, MapPin } from 'lucide-react';
import { evaluationPublicAPI } from '../utils/api';

/**
 * Design language: a museum darkroom, not a dashboard.
 * — ink (#120F0C) hall, parchment (#F2EAD8) mats, spotlight gold accent.
 * — Fraunces (display serif) for names, JetBrains Mono for placard data.
 * — Signature moment: an aperture-iris shutter opens on load; prints hang
 *   slightly askew and straighten when picked up (hovered), like real
 *   photographs on a gallery wall.
 */

const INK = '#120F0C';
const PARCHMENT = '#F2EAD8';
const PARCHMENT_DIM = '#8A7C67';
const GOLD = '#E7A93B';

const CATEGORY_META = {
  wildlife: { label: 'Wildlife', color: '#B5502C' },
  nature: { label: 'Nature', color: '#5C7A5E' },
};

const serif = { fontFamily: "'Fraunces', serif" };
const mono = { fontFamily: "'JetBrains Mono', monospace" };

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: Math.min(i, 12) * 0.04, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ---------- Aperture blade motif (used for the intro reveal + loader) ---------- */

const BLADE_COUNT = 10;
const bladePath = (() => {
  const step = (Math.PI * 2) / BLADE_COUNT;
  const x2 = 150 + 150 * Math.sin(step);
  const y2 = 150 - 150 * Math.cos(step);
  return `M150,150 L150,0 A150,150 0 0,1 ${x2.toFixed(2)},${y2.toFixed(2)} Z`;
})();

const ApertureIcon = ({ size = 22, color = GOLD, spin = false }) => (
  <svg width={size} height={size} viewBox="0 0 300 300" className={spin ? 'animate-spin' : ''} style={spin ? { animationDuration: '2.4s' } : undefined}>
    {Array.from({ length: BLADE_COUNT }).map((_, i) => (
      <path
        key={i}
        d={bladePath}
        fill="none"
        stroke={color}
        strokeWidth={10}
        transform={`rotate(${(360 / BLADE_COUNT) * i} 150 150) scale(0.72) translate(58 58)`}
      />
    ))}
  </svg>
);

const ApertureReveal = ({ onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 1250);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] pointer-events-none"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: '150vmax', height: '150vmax' }}
      >
        <svg viewBox="0 0 300 300" className="w-full h-full">
          {Array.from({ length: BLADE_COUNT }).map((_, i) => (
            <motion.path
              key={i}
              d={bladePath}
              fill={INK}
              initial={{ rotate: (360 / BLADE_COUNT) * i, scale: 1, opacity: 1 }}
              animate={{ rotate: (360 / BLADE_COUNT) * i + 62, scale: 0, opacity: 0 }}
              transition={{ duration: 0.9, delay: i * 0.035, ease: [0.76, 0, 0.24, 1] }}
              style={{ transformOrigin: '150px 150px' }}
            />
          ))}
        </svg>
      </div>
    </motion.div>
  );
};

/* ---------- Ambient: a single analog light-leak sweep across the hero ---------- */

const LightLeak = () => (
  <motion.div
    aria-hidden
    className="pointer-events-none absolute -inset-y-1/3 w-2/3 blur-3xl"
    style={{
      background: `linear-gradient(120deg, transparent, ${GOLD}55 45%, #B5502C4d 60%, transparent)`,
      rotate: 10,
    }}
    animate={{ x: ['-70%', '170%'] }}
    transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', repeatDelay: 5 }}
  />
);

const DustMotes = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {Array.from({ length: 10 }).map((_, i) => (
      <motion.span
        key={i}
        className="absolute rounded-full"
        style={{
          width: 3 + (i % 3) * 2,
          height: 3 + (i % 3) * 2,
          left: `${(i * 41) % 100}%`,
          top: `${(i * 59) % 100}%`,
          background: GOLD,
          opacity: 0.25,
        }}
        animate={{ y: [0, -26, 0], opacity: [0.12, 0.5, 0.12] }}
        transition={{ duration: 7 + (i % 5), repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
      />
    ))}
  </div>
);

/* ---------- Gallery print card ---------- */

const PrintCard = ({ entry, onClick, index }) => {
  const tilt = ((index % 5) - 2) * 0.7;
  const meta = entry.category ? CATEGORY_META[entry.category] || { label: entry.category, color: PARCHMENT_DIM } : null;

  return (
    <motion.button
      onClick={() => onClick(entry)}
      custom={index}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUp}
      style={{ rotate: tilt, backgroundColor: PARCHMENT }}
      whileHover={{ rotate: 0, y: -10, scale: 1.02 }}
      whileFocus={{ rotate: 0, y: -10, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="group relative block w-full text-left p-2.5 pb-3.5 sm:p-3.5 sm:pb-4 shadow-[0_10px_28px_rgba(0,0,0,0.5)] hover:shadow-[0_22px_46px_rgba(0,0,0,0.6)] focus:shadow-[0_22px_46px_rgba(0,0,0,0.6)] focus:outline-none transition-shadow duration-300"
    >
      <div className="aspect-[4/5] w-full overflow-hidden" style={{ backgroundColor: INK }}>
        {entry.imageUrl ? (
          <img
            src={entry.imageUrl}
            alt={entry.fullName || 'Photography entry'}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center" style={{ color: PARCHMENT_DIM }}>
            <Camera size={28} />
          </div>
        )}
      </div>

      <div className="pt-3 sm:pt-3.5 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-base sm:text-lg italic leading-snug truncate" style={{ ...serif, color: INK }}>
            {entry.fullName || 'Anonymous Photographer'}
          </p>
          {entry.captureLocation && (
            <p className="flex items-center gap-1 text-[10px] tracking-widest uppercase mt-1" style={{ ...mono, color: PARCHMENT_DIM }}>
              <MapPin size={10} className="shrink-0" /> <span className="truncate">{entry.captureLocation}</span>
            </p>
          )}
        </div>
        {meta && (
          <span className="shrink-0 flex items-center gap-1 text-[9px] tracking-widest uppercase mt-1" style={{ ...mono, color: meta.color }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
            {meta.label}
          </span>
        )}
      </div>
    </motion.button>
  );
};

/* ---------- Lightbox ---------- */

const Lightbox = ({ entry, onClose }) => {
  if (!entry) return null;
  const meta = entry.category ? CATEGORY_META[entry.category] || { label: entry.category, color: PARCHMENT_DIM } : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
        style={{ backgroundColor: 'rgba(8,6,4,0.92)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 sm:top-8 sm:right-8 text-white/60 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={28} />
        </button>
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="max-w-2xl w-full p-3 pb-5 sm:p-5 sm:pb-6"
          style={{ backgroundColor: PARCHMENT }}
        >
          <div className="w-full max-h-[62vh] overflow-hidden flex items-center justify-center" style={{ backgroundColor: INK }}>
            {entry.imageUrl && (
              <img src={entry.imageUrl} alt={entry.fullName} className="w-full max-h-[62vh] object-contain" />
            )}
          </div>
          <div className="pt-4 sm:pt-5 flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="text-xl sm:text-2xl italic" style={{ ...serif, color: INK }}>
                {entry.fullName || 'Anonymous Photographer'}
              </p>
              {entry.captureLocation && (
                <p className="flex items-center gap-1.5 text-xs tracking-widest uppercase mt-2" style={{ ...mono, color: PARCHMENT_DIM }}>
                  <MapPin size={12} /> {entry.captureLocation}
                </p>
              )}
            </div>
            {meta && (
              <span className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase mt-1" style={{ ...mono, color: meta.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                {meta.label}
              </span>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ---------- Empty / not-published state ---------- */

const NotPublishedYet = ({ competitionName }) => (
  <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: INK }}>
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-md"
    >
      <div className="mx-auto mb-6 w-14 h-14 flex items-center justify-center">
        <ApertureIcon size={44} color={GOLD} />
      </div>
      <h1 className="text-2xl sm:text-3xl italic mb-3" style={{ ...serif, color: PARCHMENT }}>
        {competitionName || 'The gallery'} is being curated
      </h1>
      <p style={{ ...mono, color: PARCHMENT_DIM }} className="text-xs tracking-wide leading-relaxed">
        Results haven't been published yet. Check back soon to see the exhibition.
      </p>
    </motion.div>
  </div>
);

/* ---------- Main page ---------- */

const PhotographyGallery = () => {
  const [loading, setLoading] = useState(true);
  const [published, setPublished] = useState(true);
  const [competitionName, setCompetitionName] = useState('');
  const [entries, setEntries] = useState([]);
  const [lightboxEntry, setLightboxEntry] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [introPlaying, setIntroPlaying] = useState(true);
  const reduceMotion = useReducedMotion();
  const heroRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const res = await evaluationPublicAPI.getGallery();
      setPublished(res.data.published);
      setCompetitionName(res.data.competitionName || '');
      setEntries(res.data.entries || []);
    } catch (error) {
      setPublished(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (reduceMotion) setIntroPlaying(false);
  }, [reduceMotion]);

  const categories = useMemo(() => {
    const seen = new Set();
    entries.forEach((e) => e.category && seen.add(e.category));
    return Array.from(seen);
  }, [entries]);

  const visibleEntries = useMemo(
    () => (selectedCategory === 'all' ? entries : entries.filter((e) => e.category === selectedCategory)),
    [entries, selectedCategory]
  );

  const handleHeroMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    heroRef.current.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    heroRef.current.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: INK }}>
        <ApertureIcon size={40} color={GOLD} spin />
      </div>
    );
  }

  if (!published) {
    return <NotPublishedYet competitionName={competitionName} />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: INK }}>
      <AnimatePresence>
        {introPlaying && !reduceMotion && <ApertureReveal onDone={() => setIntroPlaying(false)} />}
      </AnimatePresence>

      {/* HERO */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        className="relative overflow-hidden py-24 sm:py-32 px-4 text-center"
      >
        <div
          className="absolute inset-0 pointer-events-none transition-[background] duration-300"
          style={{
            background: 'radial-gradient(500px circle at var(--mx, 50%) var(--my, 20%), rgba(231,169,59,0.14), transparent 70%)',
          }}
        />
        {!reduceMotion && <LightLeak />}
        {!reduceMotion && <DustMotes />}

        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: reduceMotion ? 0 : 1.1 }}
          className="relative"
        >
          <div
            className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-medium tracking-[0.3em] uppercase mb-5"
            style={{ ...mono, color: GOLD }}
          >
            <ApertureIcon size={14} color={GOLD} /> Results Exhibition
          </div>
          <h1
            className="text-4xl sm:text-6xl md:text-7xl italic leading-[1.05]"
            style={{ ...serif, color: PARCHMENT }}
          >
            {competitionName || 'Photography Exhibition'}
          </h1>
          <p
            className="mt-5 max-w-xl mx-auto text-sm sm:text-base leading-relaxed"
            style={{ color: '#C9BFAE' }}
          >
            {entries.length} photograph{entries.length === 1 ? '' : 's'}, hung as they were shot — in the field,
            in the wild, in passing light.
          </p>
        </motion.div>
      </section>

      {/* CATEGORY SELECTOR */}
      {categories.length > 1 && (
        <div className="flex justify-center px-4 pb-10">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5" style={{ backgroundColor: '#1C1815' }}>
            {['all', ...categories].map((cat) => {
              const isActive = selectedCategory === cat;
              const meta = cat === 'all' ? null : CATEGORY_META[cat] || { label: cat, color: PARCHMENT_DIM };
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-4 py-2 text-[11px] tracking-widest uppercase transition-colors"
                  style={{
                    ...mono,
                    color: isActive ? INK : PARCHMENT_DIM,
                    backgroundColor: isActive ? (meta ? meta.color : GOLD) : 'transparent',
                  }}
                >
                  {cat === 'all' ? 'All Works' : meta.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* GALLERY WALL */}
      <section className="px-4 sm:px-6 pb-28 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14">
          {visibleEntries.map((entry, i) => (
            <PrintCard key={`${entry.fullName}-${entry.captureLocation}-${i}`} entry={entry} onClick={setLightboxEntry} index={i} />
          ))}
        </div>
        {visibleEntries.length === 0 && (
          <p className="text-center py-16 text-sm" style={{ ...mono, color: PARCHMENT_DIM }}>
            No entries to display yet.
          </p>
        )}
      </section>

      <footer className="text-center pb-10 text-[11px] tracking-widest uppercase" style={{ ...mono, color: '#4A423A' }}>
        Swadhyay Seva Foundation — Swadhyay National Photography Competition —  SNPC 2026
      </footer>

      <Lightbox entry={lightboxEntry} onClose={() => setLightboxEntry(null)} />
    </div>
  );
};

export default PhotographyGallery;