import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Calendar, MapPin, ArrowRight, Brush, BookOpen,
  Award, Users, Star, Trophy, Clock, ChevronDown,
  Leaf, Flame, Droplets, TreePine, Globe, Zap, Mail, Phone, Trash
} from 'lucide-react';

/* ─── Animation Helpers ───────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─── Data ────────────────────────────────────────────────────── */
const topics = [
  { icon: Flame,    label: 'Global Warming',        color: 'text-orange-500 bg-orange-50' },
  { icon: Zap,      label: 'Renewable Energy',       color: 'text-yellow-500 bg-yellow-50' },
  { icon: Droplets, label: 'Pollution & Waste',      color: 'text-blue-500 bg-blue-50' },
  { icon: TreePine, label: 'Tree Plantation',         color: 'text-green-600 bg-green-50' },
  { icon: Trash,    label: 'Waste Management',  color: 'text-red-600 bg-red-50' },
  { icon: Leaf,     label: 'Sustainable Living',     color: 'text-teal-600 bg-teal-50' },
];

const awards = [
  {  text: 'E-Certificates for all participants' },
  { text: 'Merit certificates for top 3 students from each school' },
  {  text: 'Top performers qualify for National Level event & trophies & recognition at National Level' },
  {  text: 'Special recognition for best performing schools' },
];


/* ─── Sub-components ──────────────────────────────────────────── */
function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function TimelineBadge({ icon: Icon, label, date, color }) {
  return (
    <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border-2 ${color}`}>
      <div className="p-2 rounded-full bg-white shadow-sm"><Icon className="w-5 h-5" /></div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest opacity-70">{label}</p>
        <p className="font-bold text-base">{date}</p>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────── */
const UpcomingEngagements = () => {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    document.title = 'Upcoming Engagements';
  }, []);

  const competitions = {
    overview: {
      title: 'All India Environment Awareness Competitions',
      subtitle: '2026–2027 · Painting & Quiz',
      poster: '/images/competitions/quiznpaint.png', // path to QuiznPaint-5.jpg
      tabActive: 'bg-emerald-700 text-white',
      tabHover: 'hover:bg-gray-50 text-gray-600',
      icon: Globe,
    },
    painting: {
      title: 'National Painting Competition',
      subtitle: 'Express Your Ideas on Nature & Sustainability!',
      classes: 'Classes 3rd – 5th',
      max: '200 students / school',
      accentLight: 'from-orange-400 to-amber-500',
      accentDark: 'from-orange-500 to-amber-600',
      border: 'border-orange-300',
      bg: 'bg-orange-50',
      badge: 'bg-orange-100 text-orange-700',
      tabActive: 'bg-orange-500 text-white',
      tabHover: 'hover:bg-orange-50 text-orange-600',
      icon: Brush,
      poster: '/images/competitions/paint.png', 
      description:
        'Students creatively express their ideas and concerns about nature, environmental protection, and sustainable living through artwork.',
    },
    quiz: {
      title: 'National Environment Awareness Quiz',
      subtitle: 'SNEAC 2026–27 (2nd Edition)',
      classes: 'Classes 6th – 8th',
      max: '50 students / school',
      accentLight: 'from-emerald-400 to-teal-500',
      accentDark: 'from-emerald-500 to-teal-600',
      border: 'border-emerald-300',
      bg: 'bg-emerald-50',
      badge: 'bg-emerald-100 text-emerald-700',
      tabActive: 'bg-emerald-600 text-white',
      tabHover: 'hover:bg-emerald-50 text-emerald-600',
      icon: BookOpen,
      poster: '/images/competitions/quiz.png', 
      description:
        'Students participate in a knowledge-based quiz covering important environmental topics and sustainability issues at a national level.',
    },
  };

  const comp = competitions[activeTab];
  const CompIcon = comp.icon;

  return (
    <div className="bg-gray-50 overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 to-teal-400 text-white py-24">
        {/* Decorative blobs */}
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.p
              variants={fadeUp}
              className="text-sm font-semibold tracking-[0.2em] uppercase text-emerald-200 mb-3"
            >
              Swadhyay Seva Foundation presents
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4"
            >
              All India Environment<br />
              <span className="text-yellow-300">Awareness Competitions</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-xl text-emerald-100 max-w-2xl mx-auto mb-8"
            >
              2026 – 2027 &nbsp;·&nbsp; Theme: <strong className="text-white">Environment &amp; Sustainability</strong>
            </motion.p>

            {/* Stat pills */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap justify-center gap-4 mb-10"
            >
              <p className="w-full text-center text-xs font-semibold tracking-widest uppercase text-emerald-200 mb-1">
                SNEAC 2025-26 · 1st Edition
              </p>
              {[
                { label: 'Students participated', value: 3000, suffix: '+' },
                { label: 'Schools participated', value: 70, suffix: '+' },
                { label: 'States represented', value: 20, suffix: '+' },
              ].map(s => (
                <div key={s.label} className="bg-white/10 backdrop-blur rounded-2xl px-6 py-3 text-center">
                  <p className="text-2xl font-extrabold text-yellow-300">
                    <AnimatedCounter target={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-xs text-white mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
              <a
                href="#competitions"
                className="px-7 py-3 rounded-full bg-yellow-400 text-gray-900 font-bold text-sm hover:bg-yellow-300 transition-colors shadow-lg"
              >
                View Competitions 
              </a>
              <a
                href="/contact"
                className="px-7 py-3 rounded-full bg-white/15 border border-white/30 text-white font-semibold text-sm hover:bg-white/25 transition-colors"
              >
                Registrations Open Soon
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── COMPETITIONS SECTION ──────────────────────────────── */}
      <section id="competitions" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        {/* Section heading */}
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center mb-10"
        >
          <motion.p variants={fadeUp} className="text-sm font-semibold tracking-[0.2em] uppercase text-emerald-600 mb-1">
            Two Competitions, One Mission
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Choose Your Competition
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-500 mt-2 max-w-xl mx-auto">
            Designed for different age groups — both united by a love for our planet
          </motion.p>
         
        </motion.div>

        {/* Tabs */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm gap-1">
            {['overview', 'painting', 'quiz'].map(tab => {
              const c = competitions[tab];
              const TabIcon = c.icon;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive ? c.tabActive + ' shadow-sm' : 'text-gray-500 ' + c.tabHover
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                    {tab === 'overview' ? 'Overview' : tab === 'painting' ? 'Painting' : 'Quiz'}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Competition detail card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'overview' ? (

            /* ── Overview: same two-column layout as painting/quiz ── */
            <div className="rounded-3xl border-2 border-emerald-200 bg-emerald-50 overflow-hidden shadow-xl">
              <div className="grid md:grid-cols-2 gap-0">

                {/* Left: combined poster */}
                <div className="relative min-h-[320px] md:min-h-[480px] overflow-hidden">
                  <img
                    src={comp.poster}
                    alt="National Environment Awareness Competitions 2026-27 poster"
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                    width={600}
                    height={800}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-gray-800 shadow">
                      Painting & Quiz
                    </span>
                  </div>
                </div>

                {/* Right: overview details */}
                <div className="p-8 sm:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow">
                        <Globe className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                        National Level
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1 leading-tight">
                      National Environment Awareness Competitions
                    </h3>
                    <p className="text-sm font-semibold text-gray-500 mb-4">2026–2027 · Painting & Quiz</p>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Two national-level competitions — a Painting Competition for Classes 3rd–5th and an Environment Awareness Quiz for Classes 6th–8th — united by the theme of Environment & Sustainability.
                    </p>

                    {/* Competition highlights */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {[
                        { icon: Brush,    label: 'Painting',  value: 'Classes 3rd – 5th',  sub: 'Up to 200 students/school', color: 'border-orange-200 bg-orange-50' },
                        { icon: BookOpen, label: 'Quiz',       value: 'Classes 6th – 8th',  sub: 'Up to 50 students/school',  color: 'border-emerald-200 bg-emerald-50/80' },
                      ].map(s => (
                        <div key={s.label} className={`rounded-xl p-4 shadow-sm border ${s.color}`}>
                          <s.icon className="w-4 h-4 text-gray-400 mb-1" />
                          <p className="text-[11px] text-gray-500 uppercase tracking-wider">{s.label}</p>
                          <p className="font-bold text-gray-800 text-sm mt-0.5">{s.value}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">{s.sub}</p>
                        </div>
                      ))}
                    </div>

                    {/* Timeline */}
                    <div className="space-y-3 mb-6">
                      <TimelineBadge
                        icon={Calendar}
                        label="School Level Participation"
                        date="1 May 2026 – 28 Feb 2027"
                        color="border-emerald-200 bg-emerald-50 text-gray-800"
                      />
                      <TimelineBadge
                        icon={Trophy}
                        label="National Level Event"
                        date="April 2027"
                        color="border-yellow-300 bg-yellow-50 text-gray-800"
                      />
                    </div>
                  </div>

                  {/* CTA buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setActiveTab('painting')}
                      className="flex-1 py-3 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-orange-400 to-amber-500 hover:opacity-90 transition-opacity shadow-md"
                    >
                      🎨 Painting Details
                    </button>
                    <button
                      onClick={() => setActiveTab('quiz')}
                      className="flex-1 py-3 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 transition-opacity shadow-md"
                    >
                      📖 Quiz Details
                    </button>
                  </div>
                </div>

              </div>
            </div>

          ) : (

              /* ── Painting / Quiz: two-column detail card ── */
              <div className={`rounded-3xl border-2 ${comp.border} ${comp.bg} overflow-hidden shadow-xl`}>
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Left: poster */}
                  <div className="relative min-h-[320px] md:min-h-[480px] overflow-hidden">
                    <img
                      src={comp.poster}
                      alt={comp.title + ' poster'}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                      width={600}
                      height={800}
                      onError={e => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-gray-800 shadow">
                        {comp.classes}
                      </span>
                    </div>
                  </div>

                  {/* Right: details */}
                  <div className="p-8 sm:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${comp.accentLight} text-white shadow`}>
                          <CompIcon className="w-5 h-5" />
                        </div>
                        <span className={`text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full ${comp.badge}`}>
                          National Level
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1 leading-tight">
                        {comp.title}
                      </h3>
                      <p className="text-sm font-semibold text-gray-500 mb-4">{comp.subtitle}</p>
                      <p className="text-gray-700 leading-relaxed mb-6">{comp.description}</p>

                      {/* Stats row */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {[
                          { icon: Users, label: 'Max Students', value: comp.max },
                          { icon: BookOpen, label: 'Classes', value: comp.classes },
                        ].map(s => (
                          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <s.icon className="w-4 h-4 text-gray-400 mb-1" />
                            <p className="text-[11px] text-gray-500 uppercase tracking-wider">{s.label}</p>
                            <p className="font-bold text-gray-800 text-sm mt-0.5">{s.value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Timeline */}
                      <div className="space-y-3 mb-6">
                        <TimelineBadge
                          icon={Calendar}
                          label="School Level Participation"
                          date="1 May 2026 – 28 Feb 2027"
                          color={`${comp.border} ${comp.bg} text-gray-800`}
                        />
                        <TimelineBadge
                          icon={Trophy}
                          label="National Level Event"
                          date="April 2027"
                          color="border-yellow-300 bg-yellow-50 text-gray-800"
                        />
                      </div>
                    </div>

                    <a
                      href="/contact"
                      className={`inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r ${comp.accentDark} hover:opacity-90 transition-opacity shadow-md`}
                    >
                      Registrations Open Soon
                    </a>
                  </div>
                </div>
              </div>

            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── TOPICS SECTION ───────────────────────────────────── */}
      <section className="bg-white border-t border-b border-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-10"
          >
            <motion.p variants={fadeUp} className="text-sm font-semibold tracking-[0.2em] uppercase text-emerald-600 mb-1">Theme</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl font-extrabold text-gray-900 mb-2">Environment &amp; Sustainability</motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 max-w-lg mx-auto">Suggested topics that students can explore and express through both competitions</motion.p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {topics.map((t) => {
              const TopicIcon = t.icon;
              return (
                <motion.div
                  key={t.label}
                  variants={fadeUp}
                  whileHover={{ y: -4, scale: 1.04 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl ${t.color} text-center shadow-sm border border-white`}
                >
                  <TopicIcon className="w-7 h-7" />
                  <span className="text-xs font-semibold leading-tight">{t.label}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── COMPETITION STRUCTURE ────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.p variants={fadeUp} className="text-sm font-semibold tracking-[0.2em] uppercase text-emerald-600 mb-1">How It Works</motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl font-extrabold text-gray-900">Competition Structure</motion.h2>
        </motion.div>

        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid sm:grid-cols-2 gap-6"
        >
          {[
            {
              step: '01',
              title: 'School Level Round',
              desc: 'Schools conduct the competition within their institution. For the painting competition, schools select the best artwork entries. For the quiz, schools select the top-performing students.',
              color: 'border-blue-200 bg-blue-50',
              badge: 'bg-blue-100 text-blue-700',
            },
            {
              step: '02',
              title: 'National Level Round',
              desc: 'Selected winners from participating schools across India compete at the National (All India) Level — held in April 2027. Trophies and national recognition await.',
              color: 'border-amber-200 bg-amber-50',
              badge: 'bg-amber-100 text-amber-700',
            },
          ].map(s => (
            <motion.div
              key={s.step}
              variants={fadeUp}
              className={`rounded-2xl border-2 ${s.color} p-8 relative overflow-hidden`}
            >
              <span className={`text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full ${s.badge} mb-4 inline-block`}>
                Step {s.step}
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{s.desc}</p>
              <div className="absolute -bottom-4 -right-4 text-7xl font-black opacity-[0.06] select-none">{s.step}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── AWARDS ───────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-emerald-700 to-teal-400  py-20 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} className="text-sm font-semibold tracking-[0.2em] uppercase text-emerald-200 mb-1">Recognition</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl text-yellow-300 font-extrabold">Awards &amp; Recognition</motion.h2>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {awards.map((a) => (
              <motion.div
                key={a.text}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-6 text-center"
              >
                <p className="text-sm font-medium text-white leading-snug">{a.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      

    </div>
  );
};

export default UpcomingEngagements;