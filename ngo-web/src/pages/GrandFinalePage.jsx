// src/pages/GrandFinalePage.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Flame, MapPin, Calendar, Users, Map, Zap, GraduationCap,
  Medal, ChevronDown, Quote, Mic, Brain, Trophy, Rocket,
  Clock, Camera, Play, Newspaper, UtensilsCrossed, Leaf,
  UserCheck, Star, Award,
} from "lucide-react";
import {
  eventMeta, stats, winners, chiefGuest, distinguishedGuests,
  guestsOfHonour, venueDignities, schedule, galleryTabs,
  launch2627, closingImage, youtubeVideoId, foundationPatron,
} from "../data/sneacGrandFinale";

// ─── useInView ──────────────────────────────────────────────
const useInView = (threshold = 0.12) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

// ─── AnimatedCounter ────────────────────────────────────────
const AnimatedCounter = ({ end, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let cur = 0;
    const step = Math.max(1, end / (1400 / 16));
    const t = setInterval(() => {
      cur += step;
      if (cur >= end) { setCount(end); clearInterval(t); }
      else setCount(Math.floor(cur));
    }, 16);
    return () => clearInterval(t);
  }, [inView, end]);
  return <span ref={ref}>{count}{suffix}</span>;
};

// ─── Photo ──────────────────────────────────────────────────
const Photo = ({ src, alt, className = "", rounded = "rounded-2xl", style = {} }) => {
  const [err, setErr] = useState(false);
  if (!src || src === "CLOUDINARY_URL" || err) {
    return (
      <div className={`bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-dashed border-green-200 flex flex-col items-center justify-center ${rounded} ${className}`}>
        <Camera size={24} className="text-green-400 mb-1" />
        <p className="text-xs text-green-500 font-medium text-center px-2 leading-tight">{alt}</p>
      </div>
    );
  }
  return (
    <img src={src} alt={alt}
      className={`object-cover ${rounded} ${className}`}
      style={style}
      onError={() => setErr(true)}
    />
  );
};

// ─── SectionHeader ──────────────────────────────────────────
const SectionHeader = ({ tag, title, subtitle, light = false }) => {
  const [ref, inView] = useInView();
  return (
    <div ref={ref}
      className={`text-center mb-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      {tag && (
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.3em] uppercase px-4 py-1.5 rounded-full mb-5 ${
          light ? "bg-white/15 text-green-200 border border-white/20" : "bg-green-100 text-green-700"}`}>
          <Leaf size={10} />
          {tag}
        </span>
      )}
      <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${light ? "text-white" : "text-gray-900"}`}>
        {title}
      </h2>
      <div className={`mx-auto mb-4 h-0.5 w-16 rounded-full bg-gradient-to-r from-green-400 to-yellow-400`} />
      {subtitle && (
        <p className={`text-base max-w-2xl mx-auto leading-relaxed ${light ? "text-green-100/80" : "text-gray-500"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

// ─── Stat icon map ───────────────────────────────────────────
const statIconMap = { graduates: GraduationCap, map: Map, zap: Zap, users: Users };

// ─── AboutCard ──────────────────────────────────────────────
const AboutCard = ({ icon: Icon, title, desc, index }) => {
  const [ref, inView] = useInView();
  return (
    <div ref={ref}
      className={`flex gap-4 p-5 rounded-2xl bg-gray-50 hover:bg-green-50 border border-transparent hover:border-green-200 transition-all duration-500 group ${
        inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
      style={{ transitionDelay: `${index * 100}ms` }}>
      <div className="w-10 h-10 rounded-xl bg-green-100 group-hover:bg-green-200 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
        <Icon size={18} className="text-green-700" />
      </div>
      <div>
        <p className="font-bold text-gray-800">{title}</p>
        <p className="text-gray-500 text-sm mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
};

// ─── StatCard ───────────────────────────────────────────────
const StatCard = ({ stat, index }) => {
  const [ref, inView] = useInView();
  const Icon = statIconMap[stat.icon] || Star;
  return (
    <div ref={ref}
      className={`text-center rounded-2xl p-6 bg-white/8 border border-white/10 hover:bg-white/14 hover:border-white/20 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 ${
        inView ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
      style={{ transitionDelay: `${index * 120}ms` }}>
      <div className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-400/30 flex items-center justify-center mx-auto mb-3">
        <Icon size={22} className="text-green-300" />
      </div>
      <div className="text-4xl font-black text-white tracking-tight">
        {inView ? <AnimatedCounter end={stat.value} suffix={stat.suffix} /> : "0"}
      </div>
      <div className="text-green-300/80 text-xs font-semibold mt-1.5 uppercase tracking-widest">{stat.label}</div>
    </div>
  );
};

// ─── WinnerCard ─────────────────────────────────────────────
const medalMeta = {
  gold:   { icon: <Medal size={40} className="text-yellow-400" />, label: "1st Place" },
  silver: { icon: <Medal size={40} className="text-slate-400" />,  label: "2nd Place" },
  bronze: { icon: <Medal size={40} className="text-orange-400" />, label: "3rd Place" },
};

const WinnerCard = ({ winner, index }) => {
  const [ref, inView] = useInView();
  const meta = medalMeta[winner.medal];
  return (
    <div ref={ref}
      className={`relative bg-white rounded-3xl shadow-xl overflow-hidden group hover:-translate-y-3 hover:shadow-2xl transition-all duration-400 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      style={{ transitionDelay: `${index * 150}ms` }}>
      <div className={`h-1.5 bg-gradient-to-r ${winner.color}`} />
      <div className={`absolute inset-0 bg-gradient-to-br ${winner.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300`} />
      <div className="p-8 flex flex-col items-center text-center">
        {meta.icon}
        <div className={`ring-4 ${winner.ring} ring-offset-2 rounded-full mb-4 mt-3`}>
          <Photo src={winner.photo} alt={`${winner.rank} winner — ${winner.name}`}
            className="w-24 h-24" rounded="rounded-full"
            style={{ objectPosition: "center 15%" }} />
        </div>
        <h3 className="font-black text-xl text-gray-800 leading-tight">{winner.name}</h3>
        <p className="text-sm text-gray-400 mt-0.5">{winner.class}</p>
        <p className="text-sm font-semibold text-gray-700 mt-3 leading-tight">{winner.school}</p>
        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
          <MapPin size={10} />{winner.city}
        </p>
        <span className={`mt-5 text-xs font-bold text-white px-5 py-1.5 rounded-full bg-gradient-to-r ${winner.color} shadow-md`}>
          {meta.label}
        </span>
      </div>
    </div>
  );
};

// ─── DistinguishedGuestCard ──────────────────────────────────
const DistinguishedGuestCard = ({ guest, index }) => {
  const [ref, inView] = useInView();
  return (
    <div ref={ref}
      className={`relative bg-white rounded-3xl shadow-lg overflow-hidden group hover:-translate-y-3 hover:shadow-2xl transition-all duration-400 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      style={{ transitionDelay: `${index * 150}ms` }}>
      <div className="h-1.5 bg-gradient-to-r from-green-400 to-emerald-600" />
      <div className="relative w-full overflow-hidden" style={{ height: "340px" }}>
        <Photo src={guest.photo} alt={`Distinguished Guest — ${guest.name}`}
          className="w-full h-full group-hover:scale-105 transition-transform duration-700"
          rounded="rounded-none"
          style={{ objectPosition: "center 15%" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/15" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="inline-flex items-center gap-1 text-xs font-bold tracking-widest uppercase text-green-300 bg-green-900/60 backdrop-blur-sm px-2.5 py-1 rounded-full mb-1.5">
            <UserCheck size={10} /> Distinguished Guest
          </span>
          <h3 className="font-black text-white text-base leading-tight drop-shadow-lg">{guest.name}</h3>
        </div>
      </div>
      <div className="px-5 py-4 text-center">
        <div className="w-8 h-0.5 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full mx-auto mb-2.5" />
        <p className="text-gray-600 text-xs leading-relaxed">{guest.designation}</p>
      </div>
    </div>
  );
};

// ─── GuestOfHonourCard ───────────────────────────────────────
const GuestOfHonourCard = ({ guest, index }) => {
  const [ref, inView] = useInView();
  return (
    <div ref={ref}
      className={`relative bg-white rounded-3xl shadow-lg overflow-hidden group hover:-translate-y-3 hover:shadow-2xl transition-all duration-400 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      style={{ transitionDelay: `${index * 100}ms` }}>
      <div className="h-1.5 bg-gradient-to-r from-green-400 to-emerald-600" />
      <div className="relative p-6 flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-400 scale-110" />
          <div className="relative ring-4 ring-green-100 group-hover:ring-green-300 transition-all duration-400 rounded-full">
            <Photo src={guest.photo} alt={`Guest of Honour — ${guest.name}`}
              className="w-36 h-36" rounded="rounded-full"
              style={{ objectPosition: "center 18%" }} />
          </div>
        </div>
        <h3 className="font-bold text-gray-800 text-sm leading-tight group-hover:text-green-800 transition-colors duration-300">
          {guest.name}
        </h3>
        <div className="w-8 h-0.5 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full my-2" />
        <p className="text-gray-500 text-xs leading-relaxed">{guest.designation}</p>
      </div>
    </div>
  );
};

// ─── VenueCard ───────────────────────────────────────────────
const VenueCard = ({ dignitary, index }) => {
  const [ref, inView] = useInView();
  const initials = dignitary.name.split(" ").slice(-2).map(w => w[0]).join("");
  return (
    <div ref={ref}
      className={`flex items-center gap-3 p-4 bg-gray-50 hover:bg-green-50 border border-gray-100 hover:border-green-200 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      style={{ transitionDelay: `${index * 80}ms` }}>
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm">
        {initials}
      </div>
      <div>
        <p className="font-semibold text-gray-800 text-sm">{dignitary.name}</p>
        <p className="text-xs text-gray-400">{dignitary.role}</p>
      </div>
    </div>
  );
};

// ─── ScheduleItem ────────────────────────────────────────────
const scheduleIcons = [
  UserCheck, Flame, Star, Mic, Quote,
  Brain, Play, Brain, Zap, Trophy,
  Zap, Rocket, Award, Newspaper, UtensilsCrossed,
];

const ScheduleItem = ({ item, index }) => {
  const [ref, inView] = useInView(0.08);
  const Icon = scheduleIcons[index] || Clock;
  const isLast = index === scheduleIcons.length - 1;
  return (
    <div ref={ref}
      className={`relative flex gap-5 transition-all duration-500 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      style={{ transitionDelay: `${Math.min(index * 50, 400)}ms` }}>

      {/* Timeline spine */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md z-10 ring-2 ring-white transition-all duration-300
          ${inView ? "bg-gradient-to-br from-green-500 to-emerald-600 ring-green-200" : "bg-gray-200 ring-gray-100"}`}>
          <Icon size={14} className={inView ? "text-white" : "text-gray-400"} />
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-gradient-to-b from-green-300 to-emerald-200 mt-1 min-h-[1.5rem]" />}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-5 pt-1 group`}>
        <div className="bg-gray-50 hover:bg-green-50 border border-gray-100 hover:border-green-200 rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-2 transition-all duration-300 hover:shadow-sm">
          <span className="text-xs font-black text-green-700 bg-green-100 px-3 py-1 rounded-full whitespace-nowrap w-fit flex items-center gap-1.5">
            <Clock size={10} />{item.time}
          </span>
          <p className="text-gray-700 text-sm font-medium sm:ml-1">{item.activity}</p>
        </div>
      </div>
    </div>
  );
};

// ─── GalleryPhoto ─────────────────────────────────────────────
const GalleryPhoto = ({ photo, onClick, index }) => {
  const [ref, inView] = useInView(0.05);
  return (
    <div ref={ref}
      className={`relative overflow-hidden rounded-2xl cursor-pointer group transition-all duration-500 ${
        inView ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      style={{ transitionDelay: `${Math.min(index * 60, 400)}ms` }}
      onClick={() => photo.src !== "CLOUDINARY_URL" && onClick(photo)}>
      <Photo src={photo.src} alt={photo.caption}
        className="w-full h-52 group-hover:scale-108 transition-transform duration-600"
        rounded="rounded-2xl"
        style={{ objectPosition: "center 15%" }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-end p-4">
        <p className="text-white text-xs font-medium leading-snug">{photo.caption}</p>
      </div>
    </div>
  );
};

// ─── Tab icon map ─────────────────────────────────────────────
const tabIcons = [Flame, Mic, Brain, Trophy, Rocket, Users, UtensilsCrossed];

// ─── Main Page ───────────────────────────────────────────────
export default function GrandFinalePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="bg-white text-gray-800 overflow-x-hidden">

      {/* ═══ HERO ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-green-950 to-emerald-950">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-[600px] h-[600px] rounded-full bg-green-600/10 blur-[120px] -top-40 -left-40 animate-[float_8s_ease-in-out_infinite]" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-emerald-400/10 blur-[100px] top-1/2 -right-20 animate-[float_12s_ease-in-out_infinite_reverse]" />
          <div className="absolute w-[300px] h-[300px] rounded-full bg-yellow-400/8 blur-[80px] bottom-10 left-1/3 animate-[float_10s_ease-in-out_infinite_2s]" />
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        </div>

        {/* Hero image */}
        <div className="absolute inset-0">
          {eventMeta.heroImage !== "CLOUDINARY_URL" && (
            <img src={eventMeta.heroImage} alt="Grand Finale stage" className="w-full h-full object-cover opacity-20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-green-950/60 to-gray-950/90" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="animate-[fadeInUp_0.8s_ease_0.1s_both]">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.35em] uppercase text-green-300 bg-green-900/40 border border-green-500/25 px-5 py-2 rounded-full mb-10 backdrop-blur-sm">
              <Leaf size={12} />
              {eventMeta.organizer} Presents
            </span>
          </div>
          <div className="animate-[fadeInUp_0.8s_ease_0.3s_both]">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-none mb-2 tracking-tight">
              <span className="text-white">SNEAC </span>
              <span className="gold-shine">2025–26</span>
            </h1>
            <p className="text-green-300 text-2xl md:text-3xl font-semibold tracking-[0.2em] mb-2 mt-3">
              Grand Finale
            </p>
            <p className="text-gray-400 text-xs md:text-sm uppercase tracking-[0.25em]">
              {eventMeta.fullName}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10 animate-[fadeInUp_0.8s_ease_0.5s_both]">
            <span className="inline-flex items-center gap-2 text-white text-sm px-5 py-2.5 rounded-full bg-white/8 border border-white/12 backdrop-blur-sm">
              <Calendar size={14} className="text-green-400" />
              {eventMeta.date}
            </span>
            <span className="inline-flex items-center gap-2 text-white text-sm px-5 py-2.5 rounded-full bg-white/8 border border-white/12 backdrop-blur-sm">
              <MapPin size={14} className="text-green-400" />
              {eventMeta.venue}
            </span>
          </div>

          <div className="mt-10 animate-[fadeInUp_0.8s_ease_0.7s_both]">
            <a href="#about"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold px-8 py-4 rounded-full shadow-xl shadow-green-900/40 hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-1 group">
              Explore the Event
              <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform duration-300" />
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40 animate-bounce">
          <div className="w-5 h-8 rounded-full border border-white/40 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/70 animate-[scrollDot_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ══════════════════════════════════════════ */}
      <section id="about" className="py-28 px-6 max-w-6xl mx-auto">
        <SectionHeader
          tag="The Event"
          title="A National Celebration of Environmental Knowledge"
          subtitle="60 finalists from 18 states competed in a three-round online quiz on environmental awareness, witnessed by distinguished leaders and a live student audience."
        />
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            {[
              [Map,        "Pan-India Competition",    "Students from 18 states competed simultaneously in online mode through Zoom and Mentimeter."],
              [Brain,      "Three-Round Elimination",  "Batch A and B each completed Round 1, then top 5 from each advanced to the Grand Finale round."],
              [Users,      "Live Audience",             "30 students attended physically at the venue as a live student audience."],
              [Rocket,     "New Edition Launched",      "SNEAC 2026–27 was officially launched at the conclusion of the Grand Finale."],
            ].map(([Icon, title, desc], i) => (
              <AboutCard key={i} icon={Icon} title={title} desc={desc} index={i} />
            ))}
          </div>
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-green-400/15 to-emerald-600/15 rounded-3xl blur-3xl" />
            <Photo src={eventMeta.aboutImage} alt="Stage photo — wide shot"
              className="w-full h-80 relative shadow-2xl"
              rounded="rounded-3xl"
              style={{ objectPosition: "center 20%" }} />
            {/* Floating accent badge */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl px-5 py-3 flex items-center gap-2.5 border border-gray-100">
              <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
                <Trophy size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs font-black text-gray-800">Grand Finale</p>
                <p className="text-xs text-gray-400">2nd May 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ══════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-green-950 via-emerald-900 to-green-950 py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5 relative">
          {stats.map((s, i) => <StatCard key={i} stat={s} index={i} />)}
        </div>
      </section>

      {/* ═══ WINNERS ════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-gradient-to-b from-white via-amber-50/20 to-white">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            tag="Results"
            title="Grand Finale Winners"
            subtitle="The top performers from across India after three rounds of intense competition."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {winners.map((w, i) => <WinnerCard key={i} winner={w} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══ CHIEF GUEST ════════════════════════════════════ */}
      <section className="py-20 px-6 bg-gradient-to-br from-green-950 via-green-900 to-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-80 h-80 rounded-full border border-white/5 -top-10 -right-10 animate-[spin_20s_linear_infinite]" />
          <div className="absolute w-52 h-52 rounded-full border border-white/5 bottom-10 left-10 animate-[spin_15s_linear_infinite_reverse]" />
        </div>
        <div className="max-w-sm mx-auto text-center relative">
          <SectionHeader tag="Chief Guest" title="Sh. Thakur Brahmanand Singh" light />
          <div className="bg-white/8 border border-white/12 backdrop-blur-sm rounded-3xl p-8 flex flex-col items-center gap-5 hover:-translate-y-2 transition-all duration-300 shadow-2xl">
            <div className="ring-4 ring-yellow-400/40 ring-offset-4 ring-offset-transparent rounded-full">
              <Photo src={chiefGuest.photo} alt="Chief Guest — formal portrait"
                className="w-36 h-36" rounded="rounded-full"
                style={{ objectPosition: "center 15%" }} />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-sm">{chiefGuest.designation}</p>
              <p className="text-green-300 text-xs mt-1">{chiefGuest.subDesignation}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ DISTINGUISHED GUESTS ═══════════════════════════ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <SectionHeader tag="Distinguished Guests" title="Eminent Personalities" />
          <div className="grid grid-cols-2 gap-5">
            {distinguishedGuests.map((g, i) => <DistinguishedGuestCard key={i} guest={g} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══ GUESTS OF HONOUR ═══════════════════════════════ */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            tag="Guests of Honour"
            title="Distinguished Voices"
            subtitle="Leaders from academia, media, environment, and social activism honoured at the Grand Finale."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {guestsOfHonour.map((g, i) => <GuestOfHonourCard key={i} guest={g} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══ FOUNDATION PATRON ══════════════════════════════ */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-sm mx-auto">
          <SectionHeader tag="Swadhyay Seva Foundation" title="Our Patron" />
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-3xl p-8 flex flex-col items-center text-center shadow-lg hover:-translate-y-2 hover:shadow-xl transition-all duration-400 group">
            <div className="relative mb-5">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-400 scale-110" />
              <div className="relative ring-4 ring-green-200 group-hover:ring-green-400 transition-all duration-400 rounded-full">
                <Photo
                  src={foundationPatron.photo}
                  alt={`Foundation Patron — ${foundationPatron.name}`}
                  className="w-36 h-36"
                  rounded="rounded-full"
                  style={{ objectPosition: "center 15%" }}
                />
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-green-600 bg-green-100 border border-green-200 px-3 py-1 rounded-full mb-3">
              <Star size={10} /> Patron
            </span>
            <h3 className="font-black text-gray-800 text-xl">{foundationPatron.name}</h3>
            <div className="w-10 h-0.5 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full my-3" />
            <p className="text-gray-500 text-sm leading-relaxed">{foundationPatron.designation}</p>
          </div>
        </div>
      </section>

      {/* ═══ VENUE DIGNITARIES ══════════════════════════════ */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            tag="Venue Partner"
            title="Academic Heights World School"
            subtitle="Pitampura, New Delhi — the gracious host of SNEAC 2025–26 Grand Finale."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {venueDignities.map((d, i) => <VenueCard key={i} dignitary={d} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══ SCHEDULE / MINUTES ═════════════════════════════ */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            tag="Programme"
            title="Minutes of the Event"
            subtitle="A chronological record of proceedings at SNEAC 2025–26 Grand Finale."
          />
          {/* Header strip */}
          <div className="flex items-center justify-between mb-6 px-1">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <Clock size={12} /> Time
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
              Activity <ChevronDown size={12} />
            </div>
          </div>
          <div className="space-y-0">
            {schedule.map((item, i) => (
              <ScheduleItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ GALLERY ════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            tag="Gallery"
            title="Moments from the Day"
            subtitle="Relive the highlights of SNEAC 2025–26 Grand Finale."
            light
          />

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {galleryTabs.map((tab, i) => {
              const Icon = tabIcons[i] || Camera;
              return (
                <button key={i} onClick={() => setActiveTab(i)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    activeTab === i
                      ? "bg-green-500 text-white shadow-lg shadow-green-900/50 scale-105"
                      : "bg-white/6 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                  }`}>
                  <Icon size={12} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryTabs[activeTab].photos.map((photo, i) => (
              <GalleryPhoto key={`${activeTab}-${i}`} photo={photo} onClick={setLightbox} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VIDEO ══════════════════════════════════════════ */}
      {/* <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionHeader tag="Watch" title="Event Highlights" subtitle="Experience the energy of SNEAC 2025–26 Grand Finale." />
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video bg-gray-950">
            {youtubeVideoId !== "YOUR_YOUTUBE_VIDEO_ID" ? (
              <iframe src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                className="w-full h-full" title="SNEAC 2025-26 Highlights" allowFullScreen />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-full bg-white/8 border-2 border-white/15 flex items-center justify-center mb-4">
                  <Play size={32} className="text-white ml-1" />
                </div>
                <p className="text-white font-semibold text-lg">Event Highlight Video</p>
                <p className="text-gray-400 text-sm mt-2 max-w-md">
                  Upload the recording to YouTube (Unlisted), then set{" "}
                  <code className="text-green-400">youtubeVideoId</code> in{" "}
                  <code className="text-green-400">sneacGrandFinale.js</code>
                </p>
              </div>
            )}
            {["top-3 left-3 border-l-2 border-t-2 rounded-tl-xl",
              "top-3 right-3 border-r-2 border-t-2 rounded-tr-xl",
              "bottom-3 left-3 border-l-2 border-b-2 rounded-bl-xl",
              "bottom-3 right-3 border-r-2 border-b-2 rounded-br-xl",
            ].map((cls, i) => <div key={i} className={`absolute w-8 h-8 border-green-500/60 ${cls}`} />)}
          </div>
        </div>
      </section> */}

      {/* ═══ SNEAC 2026-27 LAUNCH ═══════════════════════════ */}
      <section className="py-20 px-6 bg-gradient-to-br from-emerald-50 to-green-100">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            tag="What's Next"
            title="SNEAC 2026–27 Officially Launched"
            subtitle="The Grand Finale concluded with the official launch — a Painting Competition for Classes 3–5 and an Environment Quiz for Classes 6–8."
          />
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                img: launch2627.posterImage, tag: "New Edition", tagColor: "text-green-600 bg-green-50",
                title: "SNEAC 2026–27",
                desc: "Painting Competition (Classes 3–5) · Environment Quiz (Classes 6–8) · Theme: Environment & Sustainability"
              },
              {
                img: launch2627.eventImage, tag: "Grand Finale Moment", tagColor: "text-blue-600 bg-blue-50",
                title: "Announced at the Finale",
                desc: "The new edition was unveiled by distinguished guests at Academic Heights World School, Pitampura."
              },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-400">
                <Photo src={card.img} alt={card.title} className="w-full h-64" rounded="rounded-none"
                  style={{ objectPosition: "center 20%" }} />
                <div className="p-6">
                  <span className={`text-xs font-bold ${card.tagColor} px-3 py-1 rounded-full uppercase tracking-wide`}>{card.tag}</span>
                  <h3 className="font-bold text-gray-800 text-lg mt-3">{card.title}</h3>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CLOSING ════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-gradient-to-br from-gray-950 via-green-950 to-emerald-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[400px] h-[400px] rounded-full bg-green-600/8 blur-3xl -top-20 right-0 animate-[float_10s_ease-in-out_infinite]" />
          <div className="absolute w-[300px] h-[300px] rounded-full bg-yellow-400/6 blur-3xl bottom-0 left-20 animate-[float_14s_ease-in-out_infinite_2s]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <SectionHeader tag="Thank You" title="A Heartfelt Note of Thanks" light />
          <p className="text-gray-300 leading-relaxed text-base max-w-2xl mx-auto mb-14">
            Swadhyay Seva Foundation thanks all distinguished guests, finalists, their schools and teachers, the student audience, and the Academic Heights World School family for making SNEAC 2025–26 Grand Finale a truly memorable success. We look forward to inspiring even more young minds in SNEAC 2026–27.
          </p>
          <div className="relative inline-block w-full max-w-2xl">
            <div className="absolute -inset-4 bg-gradient-to-r from-green-500/15 to-yellow-400/15 rounded-3xl blur-2xl" />
            <Photo src={closingImage} alt="Closing group photo"
              className="w-full h-72 relative shadow-2xl"
              rounded="rounded-3xl"
              style={{ objectPosition: "center 20%" }} />
          </div>
        </div>
      </section>

      {/* ═══ LIGHTBOX ════════════════════════════════════════ */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setLightbox(null)}>
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.caption}
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl" />
            {lightbox.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-2xl">
                <p className="text-white text-sm text-center">{lightbox.caption}</p>
              </div>
            )}
          </div>
          <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onClick={() => setLightbox(null)}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}