// src/pages/SNPCGrandFinalePage.jsx
import React, { useState, useRef } from "react";
import {
  motion, AnimatePresence, useInView as useFramerInView, useReducedMotion,
} from "framer-motion";
import {
  Calendar, MapPin, Camera, Users, Trophy, Aperture, Heart,
  ChevronDown, Clock, Play, X, ArrowRight, Landmark, Quote,
} from "lucide-react";
import {
  eventMeta, chiefGuest, guestsOfHonour, jury, patrons,
  schedule, galleryTabs, closingImage, memorialImage, youtubeVideoId,
} from "../data/snpcGrandFinale";

/**
 * Palette: an awards-ceremony identity distinct from the site's green
 * environmental pages — near-black + gold + deep burgundy, paired
 * with the same editorial serif (Fraunces) used on the Results
 * Gallery page, so the two SNPC pages feel like one family.
 */
const INK = "#120F0C";
const PARCHMENT = "#FBF7EF";
const GOLD = "#E7A93B";
const MAROON = "#7A2331";
const GREEN = "#1B4D3E";

const serif = { fontFamily: "'Fraunces', serif" };
const mono = { fontFamily: "'JetBrains Mono', monospace" };

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: Math.min(i, 10) * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ---------- Shared bits ---------- */

const Photo = ({ src, alt, className = "", rounded = "rounded-2xl", style = {} }) => {
  const [err, setErr] = useState(false);
  if (!src || src === "CLOUDINARY_URL" || err) {
    return (
      <div
        className={`flex flex-col items-center justify-center border-2 border-dashed ${rounded} ${className}`}
        style={{ backgroundColor: "#1B4D3E0d", borderColor: `${GOLD}55` }}
      >
        <Camera size={22} style={{ color: GOLD }} className="mb-1.5" />
        <p className="text-[10px] text-center px-3 leading-tight" style={{ ...mono, color: "#8A7C67" }}>{alt}</p>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setErr(true)}
      className={`object-cover ${rounded} ${className}`}
      style={style}
    />
  );
};

const Reveal = ({ children, index = 0, className = "", variants = fadeUp, margin = "-80px" }) => {
  const ref = useRef(null);
  const inView = useFramerInView(ref, { once: true, margin });
  return (
    <motion.div ref={ref} custom={index} initial="hidden" animate={inView ? "show" : "hidden"} variants={variants} className={className}>
      {children}
    </motion.div>
  );
};

const SectionHeader = ({ tag, title, subtitle, light = false }) => (
  <Reveal className="text-center mb-14 max-w-2xl mx-auto">
    {tag && (
      <span
        className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.3em] uppercase px-4 py-1.5 rounded-full mb-5"
        style={{ ...mono, color: GOLD, backgroundColor: light ? "#ffffff14" : `${MAROON}0d`, border: `1px solid ${GOLD}40` }}
      >
        <Aperture size={11} /> {tag}
      </span>
    )}
    <h2 className={`text-3xl md:text-4xl italic leading-tight ${light ? "text-white" : ""}`} style={{ ...serif, color: light ? "#fff" : INK }}>
      {title}
    </h2>
    <div className="mx-auto mt-4 mb-4 h-0.5 w-16 rounded-full" style={{ background: `linear-gradient(90deg, ${GOLD}, ${MAROON})` }} />
    {subtitle && (
      <p className={`text-sm leading-relaxed ${light ? "text-white/70" : ""}`} style={!light ? { color: "#6B5F50" } : undefined}>
        {subtitle}
      </p>
    )}
  </Reveal>
);

/* ---------- People cards ---------- */

const PersonCard = ({ person, index, size = "md" }) => {
  const dims = size === "lg" ? "w-40 h-40" : "w-32 h-32";
  return (
    <Reveal index={index}>
      <div
        className="group relative rounded-3xl overflow-hidden text-center p-6 h-full transition-all duration-400 hover:-translate-y-2"
        style={{ backgroundColor: "#fff", boxShadow: "0 10px 30px rgba(18,16,12,0.08)" }}
      >
        <div className="h-1 -mx-6 -mt-6 mb-5" style={{ background: `linear-gradient(90deg, ${GOLD}, ${MAROON})` }} />
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-400 scale-110" style={{ backgroundColor: GOLD }} />
          <div className="relative rounded-full" style={{ boxShadow: `0 0 0 4px ${PARCHMENT}, 0 0 0 5px ${GOLD}55` }}>
            <Photo src={person.photo} alt={person.name} className={dims} rounded="rounded-full" style={{ objectPosition: "center 15%" }} />
          </div>
        </div>
        <h3 className="font-bold text-base leading-tight" style={{ color: INK }}>{person.name}</h3>
        {person.credentials && <p className="text-[11px] mt-0.5" style={{ ...mono, color: MAROON }}>{person.credentials}</p>}
        <div className="w-8 h-0.5 rounded-full mx-auto my-2.5" style={{ background: `linear-gradient(90deg, ${GOLD}, ${MAROON})` }} />
        <p className="text-xs leading-relaxed" style={{ color: "#6B5F50" }}>{person.designation}</p>
        {person.subDesignation && <p className="text-[11px] mt-1 italic" style={{ ...serif, color: "#9C8F7C" }}>{person.subDesignation}</p>}
        {person.bio && <p className="text-[11px] mt-3 leading-relaxed" style={{ color: "#9C8F7C" }}>{person.bio}</p>}
      </div>
    </Reveal>
  );
};

/* ---------- Schedule ---------- */

const ScheduleItem = ({ item, index, isLast }) => (
  <Reveal index={Math.min(index, 8)} margin="-40px">
    <div className="relative flex gap-5">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-md z-10" style={{ backgroundColor: GOLD }}>
          <Clock size={14} color={INK} />
        </div>
        {!isLast && <div className="w-0.5 flex-1 mt-1 min-h-[1.5rem]" style={{ background: `linear-gradient(${GOLD}, ${MAROON}55)` }} />}
      </div>
      <div className="flex-1 pb-6 pt-1">
        <div className="rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-2 transition-colors duration-300" style={{ backgroundColor: "#F5EEE0" }}>
          <span className="text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap w-fit" style={{ ...mono, color: MAROON, backgroundColor: `${MAROON}12` }}>
            {item.time}
          </span>
          <p className="text-sm font-medium sm:ml-1" style={{ color: "#3D362C" }}>{item.activity}</p>
        </div>
      </div>
    </div>
  </Reveal>
);

/* ---------- Gallery ---------- */

const GalleryPhoto = ({ photo, onClick, index }) => (
  <Reveal index={Math.min(index, 8)} margin="-40px" variants={{ hidden: { opacity: 0, scale: 0.94 }, show: (i) => ({ opacity: 1, scale: 1, transition: { duration: 0.5, delay: Math.min(i, 8) * 0.06 } }) }}>
    <div
      className="relative overflow-hidden rounded-2xl cursor-pointer group"
      onClick={() => photo.src !== "CLOUDINARY_URL" && onClick(photo)}
    >
      <Photo src={photo.src} alt={photo.caption} className="w-full h-52 group-hover:scale-110 transition-transform duration-700" rounded="rounded-2xl" style={{ objectPosition: "center 15%" }} />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-end p-4" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent 60%)" }}>
        <p className="text-white text-xs font-medium leading-snug">{photo.caption}</p>
      </div>
    </div>
  </Reveal>
);

/* ---------- Main page ---------- */

export default function SNPCGrandFinalePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const reduceMotion = useReducedMotion();
  const heroRef = useRef(null);

  const handleHeroMouseMove = (e) => {
    if (!heroRef.current || reduceMotion) return;
    const rect = heroRef.current.getBoundingClientRect();
    heroRef.current.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    heroRef.current.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <div className="overflow-x-hidden font-poppins" style={{ backgroundColor: PARCHMENT }}>

      {/* ═══ HERO ═══ */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        className="relative min-h-screen flex items-center justify-center overflow-hidden text-center px-6"
        style={{ backgroundColor: INK }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(600px circle at var(--mx, 50%) var(--my, 30%), ${GOLD}1a, transparent 70%)` }} />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {eventMeta.heroImage !== "CLOUDINARY_URL" && (
            <img src={eventMeta.heroImage} alt="Grand Finale stage" className="w-full h-full object-cover opacity-20" />
          )}
          {!reduceMotion && (
            <motion.div
              className="absolute -inset-y-1/3 w-2/3 blur-3xl"
              style={{ background: `linear-gradient(120deg, transparent, ${GOLD}40 45%, ${MAROON}40 60%, transparent)`, rotate: 10 }}
              animate={{ x: ["-70%", "170%"] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", repeatDelay: 5 }}
            />
          )}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.3em] uppercase px-5 py-2 rounded-full mb-8" style={{ ...mono, color: GOLD, border: `1px solid ${GOLD}55`, backgroundColor: `${GOLD}14` }}>
              <Camera size={12} /> {eventMeta.organizer}
            </span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl italic leading-[1.05]" style={{ ...serif, color: PARCHMENT }}>
              {eventMeta.title}
            </h1>
            <p className="text-lg md:text-xl mt-4 tracking-wide" style={{ color: GOLD }}>{eventMeta.memorialName}</p>
            <p className="text-xs md:text-sm mt-3 uppercase tracking-[0.25em]" style={{ ...mono, color: "#9C8F7C" }}>{eventMeta.theme}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
            <span className="inline-flex items-center gap-2 text-white text-sm px-5 py-2.5 rounded-full" style={{ backgroundColor: "#ffffff10", border: "1px solid #ffffff1f" }}>
              <Calendar size={14} style={{ color: GOLD }} /> {eventMeta.date}
            </span>
            <span className="inline-flex items-center gap-2 text-white text-sm px-5 py-2.5 rounded-full" style={{ backgroundColor: "#ffffff10", border: "1px solid #ffffff1f" }}>
              <MapPin size={14} style={{ color: GOLD }} /> {eventMeta.venue}
            </span>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-10">
            <a
              href="#about"
              className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-full shadow-xl transition-transform duration-300 hover:-translate-y-1 group"
              style={{ background: `linear-gradient(90deg, ${GOLD}, #d4a63f)`, color: INK }}
            >
              Explore the Grand Finale
              <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform duration-300" />
            </a>
          </motion.div>
        </div>

        {!reduceMotion && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40 animate-bounce">
            <div className="w-5 h-8 rounded-full border border-white/40 flex items-start justify-center pt-1.5">
              <div className="w-1 h-2 rounded-full bg-white/70" />
            </div>
          </div>
        )}
      </section>

      {/* ═══ IN LOVING MEMORY ═══ */}
      <section className="py-24 px-6" style={{ backgroundColor: INK }}>
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <Heart size={28} style={{ color: MAROON }} className="mx-auto mb-5" fill={MAROON} />
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.3em] uppercase px-4 py-1.5 rounded-full mb-6" style={{ ...mono, color: GOLD, border: `1px solid ${GOLD}40` }}>
              In Loving Memory
            </span>
            <h2 className="text-3xl md:text-4xl italic mb-6" style={{ ...serif, color: PARCHMENT }}>
              Santosh Kumar Goel
            </h2>
            <Quote size={22} style={{ color: `${GOLD}88` }} className="mx-auto mb-4" />
            <p className="text-sm md:text-base leading-relaxed max-w-xl mx-auto" style={{ color: "#C9BFAE" }}>
              The Grand Finale of SNPC 2026 was held in cherished memory of Santosh Kumar Goel, whose
              spirit continues to guide the work of Swadhyay Seva Foundation. A special tribute reel
              was shared with all present, honouring a life that shaped this journey.
            </p>
          </Reveal>
          <Reveal index={1} className="mt-10">
            <div className="relative inline-block w-full max-w-md">
              <div className="absolute -inset-3 rounded-3xl blur-2xl opacity-40" style={{ background: `linear-gradient(90deg, ${GOLD}, ${MAROON})` }} />
              <Photo src={memorialImage} alt="In loving memory of Santosh Kumar Goel" className="w-full h-64 relative" rounded="rounded-3xl" style={{ objectPosition: "center 20%" }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="about" className="py-24 px-6 max-w-6xl mx-auto">
        <SectionHeader
          tag="The Event"
          title="A Grand Celebration of Photography"
          subtitle="Guests, photographers, jury and dignitaries gathered at Lakshmibai College for the felicitation ceremony and award distribution of the Swadhyay National Photography Competition 2026."
        />
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {[
            [Camera, "SNPC 2026 Grand Finale", "The top photographs of the competition were showcased on stage, followed by prize distribution to the winners and consolation awardees."],
            [Users, `${eventMeta.collaboration}`, "Held in collaboration with Lakshmibai College, University of Delhi."],
            [Landmark, `Associate Sponsor — ${eventMeta.associateSponsor}`, "Supporting the celebration of creativity and environmental awareness through photography."],
            [Heart, eventMeta.memorialName, "A special tribute was paid to Santosh Kumar Goel, in whose memory the ceremony was organised."],
          ].map(([Icon, title, desc], i) => (
            <Reveal key={i} index={i}>
              <div className="flex gap-4 p-5 rounded-2xl bg-white transition-all duration-400 hover:-translate-y-1" style={{ boxShadow: "0 6px 20px rgba(18,16,12,0.06)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${GOLD}22` }}>
                  <Icon size={18} style={{ color: MAROON }} />
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: INK }}>{title}</p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: "#6B5F50" }}>{desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ CHIEF GUEST ═══ */}
      <section className="py-20 px-6" style={{ backgroundColor: PARCHMENT }}>
        <SectionHeader tag="Chief Guest" title={chiefGuest.name} />
        <div className="max-w-xs mx-auto">
          <Reveal>
            <div className="rounded-3xl p-8 flex flex-col items-center text-center gap-4" style={{ backgroundColor: "#fff", boxShadow: "0 10px 30px rgba(18,16,12,0.08)" }}>
              <div className="rounded-full" style={{ boxShadow: `0 0 0 4px ${PARCHMENT}, 0 0 0 5px ${GOLD}` }}>
                <Photo src={chiefGuest.photo} alt={chiefGuest.name} className="w-36 h-36" rounded="rounded-full" style={{ objectPosition: "center 15%" }} />
              </div>
              <p className="text-sm font-semibold" style={{ color: "#3D362C" }}>{chiefGuest.designation}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ GUESTS OF HONOUR ═══ */}
      <section className="py-20 px-6" style={{ backgroundColor: "#F5EEE0" }}>
        <SectionHeader tag="Guests of Honour" title="Distinguished Voices" subtitle="Eminent academicians and leaders honoured at the Grand Finale." />
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {guestsOfHonour.map((g, i) => <PersonCard key={i} person={g} index={i} />)}
        </div>
      </section>

      {/* ═══ JURY ═══ */}
      <section className="py-20 px-6" style={{ backgroundColor: PARCHMENT }}>
        <SectionHeader tag="Meet the Jury" title="The Eyes Behind the Judgment" subtitle="Five accomplished photographers who evaluated the entries of SNPC 2026." />
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {jury.map((j, i) => <PersonCard key={i} person={j} index={i} />)}
        </div>
      </section>

      {/* ═══ PATRONS ═══ */}
      <section className="py-16 px-6" style={{ backgroundColor: "#F5EEE0" }}>
        <SectionHeader tag="Swadhyay Seva Foundation" title="Our Patrons" />
        <div className="max-w-md mx-auto grid grid-cols-2 gap-5">
          {patrons.map((p, i) => (
            <Reveal key={i} index={i}>
              <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: "#fff", boxShadow: "0 6px 20px rgba(18,16,12,0.06)" }}>
                <div className="w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: `linear-gradient(135deg, ${GOLD}, ${MAROON})` }}>
                  <span className="text-white font-bold text-xs">{p.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
                </div>
                <p className="font-bold text-sm" style={{ color: INK }}>{p.name}</p>
                <p className="text-[11px] mt-1" style={{ color: "#9C8F7C" }}>{p.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ SCHEDULE ═══ */}
      <section className="py-24 px-6" style={{ backgroundColor: PARCHMENT }}>
        <div className="max-w-3xl mx-auto">
          <SectionHeader tag="Programme" title="Minutes of the Grand Finale" subtitle="A chronological record of proceedings on 30th August 2026." />
          <div className="flex items-center justify-between mb-6 px-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ ...mono, color: "#9C8F7C" }}><Clock size={12} /> Time</div>
            <div className="text-xs font-bold uppercase tracking-widest" style={{ ...mono, color: "#9C8F7C" }}>Activity</div>
          </div>
          {schedule.map((item, i) => (
            <ScheduleItem key={i} item={item} index={i} isLast={i === schedule.length - 1} />
          ))}
        </div>
      </section>

      {/* ═══ RESULTS CTA ═══ */}
      <section className="py-20 px-6" style={{ backgroundColor: INK }}>
        <Reveal className="max-w-3xl mx-auto text-center">
          <Trophy size={30} style={{ color: GOLD }} className="mx-auto mb-5" />
          <h2 className="text-2xl md:text-3xl italic mb-4" style={{ ...serif, color: PARCHMENT }}>See the Winning Photographs</h2>
          <p className="text-sm leading-relaxed max-w-lg mx-auto mb-8" style={{ color: "#C9BFAE" }}>
            The Grand Finale concluded with the announcement of the top prize winners and consolation
            awardees. Explore the full exhibition of SNPC 2026's finest photographs.
          </p>
          <a
            href="/photography-gallery"
            className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-full shadow-xl transition-transform duration-300 hover:-translate-y-1 group"
            style={{ background: `linear-gradient(90deg, ${GOLD}, #d4a63f)`, color: INK }}
          >
            View the Results Gallery
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </Reveal>
      </section>

      {/* ═══ GALLERY ═══ */}
      <section className="py-24 px-6" style={{ backgroundColor: "#0E0B08" }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeader tag="Gallery" title="Moments from the Day" subtitle="Relive the highlights of the SNPC 2026 Grand Finale." light />
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {galleryTabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300"
                style={
                  activeTab === i
                    ? { background: `linear-gradient(90deg, ${GOLD}, ${MAROON})`, color: "#fff" }
                    : { backgroundColor: "#ffffff0d", border: "1px solid #ffffff1a", color: "#9C8F7C" }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryTabs[activeTab].photos.map((photo, i) => (
              <GalleryPhoto key={`${activeTab}-${i}`} photo={photo} onClick={setLightbox} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VIDEO ═══ */}
      <section className="py-20 px-6" style={{ backgroundColor: PARCHMENT }}>
        <div className="max-w-4xl mx-auto">
          <SectionHeader tag="Watch" title="Event Highlights" subtitle="Experience the energy of the SNPC 2026 Grand Finale." />
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video" style={{ backgroundColor: INK }}>
              {youtubeVideoId !== "YOUR_YOUTUBE_VIDEO_ID" ? (
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                  className="w-full h-full"
                  title="SNPC 2026 Grand Finale Highlights"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#ffffff10", border: `2px solid ${GOLD}55` }}>
                    <Play size={30} style={{ color: GOLD }} className="ml-1" />
                  </div>
                  <p className="text-white font-semibold text-lg">Event Highlight Video</p>
                  <p className="text-sm mt-2 max-w-md" style={{ color: "#9C8F7C" }}>
                    Upload the recording to YouTube, then set <code style={{ color: GOLD }}>youtubeVideoId</code> in{" "}
                    <code style={{ color: GOLD }}>snpcGrandFinale.js</code>.
                  </p>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ CLOSING ═══ */}
      <section className="py-28 px-6 relative overflow-hidden" style={{ backgroundColor: INK }}>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <SectionHeader tag="Thank You" title="A Heartfelt Note of Thanks" light />
          <p className="text-sm leading-relaxed max-w-xl mx-auto mb-12" style={{ color: "#C9BFAE" }}>
            Swadhyay Seva Foundation thanks the Chief Guest, Guests of Honour, the jury, patrons,
            Lakshmibai College, our associate sponsor, and every guest who joined us in celebrating
            SNPC 2026 and honouring the memory of Santosh Kumar Goel.
          </p>
          <Reveal index={1} className="relative inline-block w-full max-w-2xl">
            <div className="absolute -inset-3 rounded-3xl blur-2xl opacity-30" style={{ background: `linear-gradient(90deg, ${GOLD}, ${MAROON})` }} />
            <Photo src={closingImage} alt="Closing group photo" className="w-full h-72 relative shadow-2xl" rounded="rounded-3xl" style={{ objectPosition: "center 20%" }} />
          </Reveal>
        </div>
      </section>

      {/* ═══ LIGHTBOX ═══ */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
            style={{ backgroundColor: "rgba(8,6,4,0.95)" }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
              className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}
            >
              <img src={lightbox.src} alt={lightbox.caption} className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl" />
              {lightbox.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-4 rounded-b-2xl" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
                  <p className="text-white text-sm text-center">{lightbox.caption}</p>
                </div>
              )}
            </motion.div>
            <button
              className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
              style={{ backgroundColor: "#ffffff14", border: "1px solid #ffffff26" }}
              onClick={() => setLightbox(null)}
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}