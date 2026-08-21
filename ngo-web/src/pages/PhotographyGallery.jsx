import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, MapPin, Sparkles, Trophy, Award, Star } from 'lucide-react';
import { evaluationPublicAPI } from '../utils/api';

const PRIZE_META = {
  first: { label: 'First Prize', icon: '🥇', ring: 'ring-4 ring-yellow-400', glow: 'shadow-[0_0_40px_rgba(250,204,21,0.5)]' },
  second: { label: 'Second Prize', icon: '🥈', ring: 'ring-4 ring-slate-300', glow: 'shadow-[0_0_30px_rgba(203,213,225,0.5)]' },
  third: { label: 'Third Prize', icon: '🥉', ring: 'ring-4 ring-amber-600', glow: 'shadow-[0_0_30px_rgba(180,83,9,0.4)]' },
  consolation: { label: 'Consolation', icon: '⭐', ring: 'ring-2 ring-emerald-400', glow: '' },
};

const CATEGORY_STYLE = {
  wildlife: 'bg-orange-500/90 text-white',
  nature: 'bg-emerald-500/90 text-white',
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] },
  }),
};

const FloatingParticles = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {Array.from({ length: 18 }).map((_, i) => (
      <motion.span
        key={i}
        className="absolute rounded-full bg-amber-300/30"
        style={{
          width: 4 + (i % 4) * 3,
          height: 4 + (i % 4) * 3,
          left: `${(i * 37) % 100}%`,
          top: `${(i * 53) % 100}%`,
        }}
        animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 6 + (i % 5), repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
      />
    ))}
  </div>
);

const PhotoCard = ({ entry, onClick, index }) => {
  const prize = entry.prizeType ? PRIZE_META[entry.prizeType] : null;

  return (
    <motion.button
      onClick={() => onClick(entry)}
      custom={index}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={fadeUp}
      whileHover={{ y: -8 }}
      className={`group relative block w-full overflow-hidden rounded-2xl bg-slate-900 text-left ${
        prize ? `${prize.ring} ${prize.glow}` : 'ring-1 ring-white/10'
      }`}
    >
      <div className="aspect-[4/5] w-full overflow-hidden">
        {entry.imageUrl ? (
          <img
            src={entry.imageUrl}
            alt={entry.fullName || `Entry #${entry.entryNumber}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-600">
            <Camera size={32} />
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />

      <div className="absolute top-3 left-3 flex items-center gap-1.5">
        <span className="rounded-full bg-black/50 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-amber-300">
          #{entry.rank}
        </span>
        {entry.category && (
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${CATEGORY_STYLE[entry.category] || 'bg-white/20 text-white'}`}>
            {entry.category}
          </span>
        )}
      </div>

      {prize && (
        <div className="absolute top-3 right-3 text-2xl drop-shadow-lg" title={prize.label}>
          {prize.icon}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="font-semibold text-white text-sm truncate">{entry.fullName || 'Anonymous Photographer'}</p>
        {entry.captureLocation && (
          <p className="flex items-center gap-1 text-[11px] text-white/70 mt-0.5 truncate">
            <MapPin size={11} className="shrink-0" /> {entry.captureLocation}
          </p>
        )}
      </div>
    </motion.button>
  );
};

const WinnerPodiumCard = ({ entry, size = 'md' }) => {
  const prize = PRIZE_META[entry.prizeType];
  const dims = size === 'lg' ? 'w-56 sm:w-64' : 'w-44 sm:w-52';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col items-center ${dims}`}
    >
      <div className="text-3xl mb-2">{prize.icon}</div>
      <div className={`relative w-full aspect-[4/5] rounded-2xl overflow-hidden ${prize.ring} ${prize.glow}`}>
        {entry.imageUrl ? (
          <img src={entry.imageUrl} alt={entry.fullName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-800 text-slate-500">
            <Camera size={28} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="font-bold text-white text-sm truncate">{entry.fullName}</p>
          {entry.category && <p className="text-[10px] uppercase tracking-wide text-amber-300">{entry.category}</p>}
        </div>
      </div>
      <p className="mt-3 text-sm font-bold text-amber-300 tracking-wide uppercase">{prize.label}</p>
    </motion.div>
  );
};

const Lightbox = ({ entry, onClose }) => {
  if (!entry) return null;
  const prize = entry.prizeType ? PRIZE_META[entry.prizeType] : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <button onClick={onClose} className="absolute top-5 right-5 text-white/70 hover:text-white">
          <X size={30} />
        </button>
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="max-w-3xl w-full"
        >
          <div className="rounded-2xl overflow-hidden bg-slate-900">
            {entry.imageUrl && <img src={entry.imageUrl} alt={entry.fullName} className="w-full max-h-[70vh] object-contain bg-black" />}
            <div className="p-5 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-white font-bold text-lg">{entry.fullName || 'Anonymous Photographer'}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-amber-400 text-sm font-semibold">Entry #{entry.entryNumber}</span>
                  {entry.category && (
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${CATEGORY_STYLE[entry.category] || 'bg-white/20 text-white'}`}>
                      {entry.category}
                    </span>
                  )}
                  {entry.captureLocation && (
                    <span className="flex items-center gap-1 text-white/60 text-xs">
                      <MapPin size={12} /> {entry.captureLocation}
                    </span>
                  )}
                </div>
              </div>
              {prize && (
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <span className="text-2xl">{prize.icon}</span> {prize.label}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const NotPublishedYet = ({ competitionName }) => (
  <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-950 flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-md"
    >
      <Camera className="mx-auto text-amber-400 mb-6" size={56} />
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
        {competitionName || 'The Gallery'} is being curated
      </h1>
      <p className="text-white/60">
        Results haven't been published yet. Check back soon to see the winning photographs.
      </p>
    </motion.div>
  </div>
);

const PhotographyGallery = () => {
  const [loading, setLoading] = useState(true);
  const [published, setPublished] = useState(true);
  const [competitionName, setCompetitionName] = useState('');
  const [entries, setEntries] = useState([]);
  const [lightboxEntry, setLightboxEntry] = useState(null);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-950 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}>
          <Camera className="text-amber-400" size={40} />
        </motion.div>
      </div>
    );
  }

  if (!published) {
    return <NotPublishedYet competitionName={competitionName} />;
  }

  const podium = ['first', 'second', 'third']
    .map((p) => entries.find((e) => e.prizeType === p))
    .filter(Boolean);
  const consolations = entries.filter((e) => e.prizeType === 'consolation');
  const fullGallery = entries;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950">
      {/* HERO */}
      <section className="relative overflow-hidden py-20 sm:py-28 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-slate-900 to-black" />
        <FloatingParticles />
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="inline-flex items-center gap-2 text-amber-300 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-4">
            <Sparkles size={16} /> Results Gallery <Sparkles size={16} />
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight">
            {competitionName || 'Photography Exhibition'}
          </h1>
          <p className="text-white/60 mt-4 max-w-xl mx-auto text-sm sm:text-base">
            Celebrating the lens-work of every photographer who captured the wild, the green, and the
            untamed. Presenting the top {entries.length} photographs of the competition.
          </p>
        </motion.div>
      </section>

      {/* WINNERS PODIUM */}
      {podium.length > 0 && (
        <section className="relative px-4 pb-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-white/80 font-bold tracking-widest uppercase text-xs sm:text-sm mb-10 flex items-center justify-center gap-2"
          >
            <Trophy size={16} className="text-amber-400" /> The Winners
          </motion.h2>
          <div className="flex flex-wrap items-end justify-center gap-6 sm:gap-10 max-w-4xl mx-auto">
            {podium.find((e) => e.prizeType === 'second') && (
              <WinnerPodiumCard entry={podium.find((e) => e.prizeType === 'second')} />
            )}
            {podium.find((e) => e.prizeType === 'first') && (
              <WinnerPodiumCard entry={podium.find((e) => e.prizeType === 'first')} size="lg" />
            )}
            {podium.find((e) => e.prizeType === 'third') && (
              <WinnerPodiumCard entry={podium.find((e) => e.prizeType === 'third')} />
            )}
          </div>
        </section>
      )}

      {/* CONSOLATION PRIZES */}
      {consolations.length > 0 && (
        <section className="px-4 pb-20 max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-white/80 font-bold tracking-widest uppercase text-xs sm:text-sm mb-8 flex items-center justify-center gap-2"
          >
            <Award size={16} className="text-emerald-400" /> Consolation Prizes
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
            {consolations.map((entry, i) => (
              <PhotoCard key={entry.entryNumber} entry={entry} onClick={setLightboxEntry} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* FULL GALLERY WALL */}
      <section className="px-4 pb-28 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-white/80 font-bold tracking-widest uppercase text-xs sm:text-sm mb-10 flex items-center justify-center gap-2"
        >
          <Star size={16} className="text-amber-400" /> The Full Gallery
        </motion.h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {fullGallery.map((entry, i) => (
            <PhotoCard key={entry.entryNumber} entry={entry} onClick={setLightboxEntry} index={i} />
          ))}
        </div>
        {fullGallery.length === 0 && (
          <p className="text-center text-white/50 py-16">No entries to display yet.</p>
        )}
      </section>

      <footer className="text-center pb-10 text-white/30 text-xs">
        Swadhyay Seva Sansthan — Photography Competition
      </footer>

      <Lightbox entry={lightboxEntry} onClose={() => setLightboxEntry(null)} />
    </div>
  );
};

export default PhotographyGallery;
