import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {FileText, Camera, CheckCircle2, AlertCircle} from 'lucide-react';
import Button from "../components/Button1";
import Card from "../components/Card1";
import LiveParticipation from '../components/LiveParticipation';

import hero1 from "../assets/hero/1.jpg";
import hero2 from "../assets/hero/2.jpg";
import hero3 from "../assets/hero/3.jpg";
import hero4 from "../assets/hero/4.jpg";

const RulesModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal card */}
      <div className="relative z-[70] w-full max-w-4xl mx-3 my-4 bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          
        </div>

        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 flex justify-end bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};



const SimpleModal = ({ isOpen, onClose, title, role, photo, paragraphs }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div
        className="relative z-[70] w-full max-w-4xl mx-4 my-4
                   bg-white rounded-2xl shadow-2xl
                   max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex-1 text-center pr-8">
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            {role && (
              <p className="text-lg text-gray-500 mt-0.5">
                {role}
              </p>
            )}
          </div>
        </div>

        {/* Body (scrollable) */}
        <div className="px-6 py-5 overflow-y-auto">
          <div className="grid md:grid-cols-[1fr,2fr] gap-6 items-stretch">
            {/* Image block */}
            <div className="w-full max-w-sm mx-auto md:mx-0">
              <div className="w-full rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={photo}
                  alt={title}
                  className="w-full max-h-100 md:max-h-150 object-cover object-top"
                />
              </div>
            </div>


            {/* Text block */}
            <div className="text-gray-700 leading-relaxed text-sm md:text-base">
              {paragraphs.map((p, idx) => (
                <p key={idx} className={idx < paragraphs.length - 1 ? 'mb-4' : ''}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


const PhotographyCompetition = () => {

  useEffect(() => {
    document.title = 'SNPC 2026 — Swadhyay National Photography Competition';

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) { metaDesc = document.createElement('meta'); metaDesc.name = 'description'; document.head.appendChild(metaDesc); }
    metaDesc.content = 'SNPC 2026 — National Photography Competition for college students. Nature & Wildlife themes. ₹42,000 prize pool. Jury includes Govt. of India honourees. Register by June 30.';

    // Open Graph tags for WhatsApp / social previews
    const ogTags = [
      { property: 'og:title', content: 'SNPC 2026 — Swadhyay National Photography Competition' },
      { property: 'og:description', content: 'National Photography Competition for college students. Nature & Wildlife themes. ₹42,000 prize pool. Jury includes Govt. of India honourees. Register by June 30.' },
      { property: 'og:type', content: 'website' },
    ];
    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) { tag = document.createElement('meta'); tag.setAttribute('property', property); document.head.appendChild(tag); }
      tag.content = content;
    });

    return () => {
      // Reset on unmount
      document.title = 'Home - Swadhyay Seva Foundation';
    };
  }, []);

  const [openRulesModal, setOpenRulesModal] = useState(null); 
  const [openJury, setOpenJury] = useState(null);
  

  const juryMembers = [
    {
      id: 'anup-sah',
      name: 'Anup Sah',
      role: 'Photographer • Environmentalist • Mountaineer',
      credentials: ['Padma Shri Awardee', 'Himalayan Mountaineer & Conservationist', 'Nat. Award for Wildlife Photography'],
      photo: '/images/jury/anup-sah.jpeg',
      details: [
        `A multifaceted personality, Anup Sah is a highly acclaimed photographer who has won numerous national and international awards, including the President's Padma Shri.`,
        `Born in Nainital on 6 August 1949, his love for nature led to extensive travel, many treks, and the scaling of several Himalayan peaks, including four trips to the Nanda Devi Sanctuary. He is a member of the Indian Mountaineering Federation and President of the Nainital Mountaineering Club.`,
        `He has also worked in horticulture, wildlife conservation, apiculture, and floriculture. His photographs span wildlife, festivals, folk life, and landscapes, supporting tourism and helping explorers and researchers while highlighting environmental and wildlife issues.`,
        `Throughout his life, he has contributed immensely to the Himalayas and their communities, sharing his knowledge with anyone sensitive to nature. He has popularised nature photography across Uttarakhand and beyond, and is an expert in mycology and wild mushrooms, promoting mushroom farming.`,
        `He is also active in education in Nainital as Chairman of Mohan Lal Sah Bal Vidya Mandir and Manager of Chet Ram Sah Inter College.`
      ],
    },
    {
      id: 'bhupesh-little',
      name: 'Prof. Bhupesh C. Little',
      role: 'Fine Art Photographer • Educator • Researcher',
      credentials: ['50+ International Awards', 'Govt. of India National Honour', 'Metropolitan Museum Collection'],
      photo: '/images/jury/bhupesh.JPG',
      details: [
        `Prof. Bhupesh C. Little is an internationally acclaimed fine art photographer and one of India's pioneering photography educators, with a career of over three decades.`,
        `Beginning photography formally in 1987 during his BFA in Graphic Design, he has since received more than 50 international awards, 14 foreign fellowships, and several national honours from Government of India ministries.`,
        `He has been instrumental in establishing advanced photography education in India, helping start the first MFA in Photography at Lucknow University, drafting PhD regulations, and guiding landmark research including the first Indian woman PhD in Photography.`,
        `Prof. Little has taught at leading institutions in India and abroad, including heading the Institute of Creative Arts in the South Pacific and later the Department at Jamia Millia Islamia University, New Delhi.`,
        `He has served on juries for numerous international and national exhibitions, chaired the Horizon International Circuit for many years, and his works are held in prestigious collections such as the Metropolitan Museum, the Photographic Society of America, and major cultural institutions.`
      ],
    },
    {
      id: 'narayan-thiagarajan',
      name: 'T. Narayan',
      role: 'Photojournalist • Photo Editor • Educator',
      credentials: ['National Photo Editor — India Today, HT', '3 Decades at Times of India', 'Founder, PhotoRoutes'],
      photo: '/images/jury/narayan-thiagarajan2.jpg',
      details: [
        `T. Narayan is a renowned figure in photojournalism with over three decades of diverse experience, capturing subjects ranging from politics and wildlife to arts, lifestyle, and sports.`,
        `He has covered several pivotal socio-political events in India, including the Kashmir conflict, Punjab militancy, communal riots, the Babri Masjid demolition, the Mandal Commission aftermath, major natural disasters like cyclones and tsunamis, multiple Lok Sabha and Assembly Elections, Cricket World Cups, and the COVID-19 pandemic.`,
        `Narayan began his career in 1989 as a Staff Photographer at The Times of India, and rose through the ranks to become National Photo Editor at several leading Indian publications, including Outlook, India Today, The Week, and Hindustan Times.`,
        `He has served on juries for numerous prestigious national and international photography competitions, further cementing his authority and expertise in the field.`,
        `Currently, Narayan channels his passion for photography into education through his initiative, PhotoRoutes, where he conducts workshops aimed at nurturing the next generation of photographers.`
      ],
    },
    {
      id: 'tulika-sahu',
      name: 'Dr. Tulika Sahu',
      role: 'Photographer • Educator • Researcher',
      credentials: ['1st Woman PhD in Photography in India', 'Limca & India Book of Records 2015–16', 'NIFT Faculty & Jury — Govt. of India'],
      photo: '/images/jury/tulika.jpg',
      details: [
        `Dr. Tulika Sahu is an Assistant Professor & Head of the Fashion Communication Department at the National Institute of Fashion Technology (NIFT), Raebareli, with over 13 years of teaching experience across Amity University and NIFT.`,
        `She holds a BFA, MFA, and PhD in Photography — all from the University of Lucknow — and holds the national record for being the first woman in India to be awarded a PhD in Photography, recognised by the Limca Book of Records (2015) and India Book of Records (2016).`,
        `An internationally exhibited photographer, she has over 200 photographs accepted in national and international competitions across countries including the USA, UK, Singapore, Romania, Azerbaijan, and Australia, and has received prestigious awards such as the IPN Gold, Club Gold, and multiple PSA honours.`,
        `She has been a resource person and jury member for numerous national and international forums, including the India International Science Festival (Ministry of Science & Technology), State Lalit Kala Akademi, and Jawahar Navodaya Vidyalaya, among others.`,
        `Recipient of the Hindustan Times Woman Culture Master Award, Prathama Woman Achiever (Amar Ujala), and Amrita Sher-Gil Woman Artist of the Year 2022, she has also received a Junior Research Fellowship in Visual Arts by the Ministry of Culture, Government of India.`
      ],
    },
    {
      id: 'parveen-gahlot',
      name: 'Parveen Gahlot',
      role: 'Photographer • Tour Operator • Adventurer',
      credentials: ['Multi-genre Field Photographer', 'Photo Expedition Leader across India', 'Wildlife, Astro & Landscape Specialist'],
      photo: '/images/jury/parveen.jpeg',
      details: [
        `Parveen Gahlot is an independent photographer and professional tour operator with over 10 years of active photography experience, combining an Electronics Engineering background with a deep passion for visual storytelling across diverse genres.`,
        `His photographic work spans Wildlife, Birds, Street, Macro, Travel, Landscape, Aviation, and Astrophotography — blending engineering precision with an explorer's instinct for spontaneous, high-impact moments in the field.`,
        `A motorcyclist for over 30 years, Parveen uses the open road as both inspiration and logistics — leading photo-focused expeditions to remote and off-grid locations that most photographers rarely access.`,
        `As a tour operator, he designs and leads guided photography journeys, mentoring enthusiasts and amateurs through practical, hands-on instruction in real field conditions — covering everything from night-sky exposures to wildlife fieldcraft.`,
        `His visual signature balances technical clarity with narrative warmth, producing images that are precise in craft yet rich in context, from intimate macro close-ups to sweeping celestial and landscape vistas.`
      ],
    },
  ];

  // const testimonials = [
  //   {
  //     quote: "As a wildlife photographer from Assam, having judges of this caliber evaluate my work is a rare opportunity. SNPC 2026 feels like the real deal.",
  //     name: "Riya Borah",
  //     college: "Cotton University",
  //     state: "Assam"
  //   },
  //   {
  //     quote: "The themes — Nature and Wildlife — are exactly what I shoot. A national competition that actually gets photographers like us.",
  //     name: "Arjun Mehta",
  //     college: "Delhi College of Art",
  //     state: "Delhi"
  //   },
  //   {
  //     quote: "Padma Shri Anup Sah on the jury? I registered the same day I found out. This is the competition I've been waiting for.",
  //     name: "Priya Nair",
  //     college: "CEPT University",
  //     state: "Gujarat"
  //   },
  //   {
  //     quote: "The prize money is meaningful, but honestly it's the jury credentials that convinced me. These are people whose opinions actually matter in the field.",
  //     name: "Karan Desai",
  //     college: "Symbiosis Institute of Design",
  //     state: "Maharashtra"
  //   },
  //   {
  //     quote: "I love that it's open to all 17–23 year olds across India. Not just metro colleges — this competition actually wants to discover talent from everywhere.",
  //     name: "Meghna Sinha",
  //     college: "Patna University",
  //     state: "Bihar"
  //   },
  // ];


  const currentJury = juryMembers.find((j) => j.id === openJury);

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-emerald-50">
      {/* HERO SECTION – full width bg, content in container */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-6 py-16 md:py-12 grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div className="space-y-6 animate-slide-down">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold uppercase tracking-[0.2em]">
              <span className="text-lg">📸</span>
              National Level Photography Competition
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-forest leading-tight">
              Capture the Story of{" "}
              <span className="text-primary">Nature & Wildlife</span>
            </h1>

            <p className="text-lg text-gray-700 max-w-xl">
              <b>
                Swadhyay National Photography Competition (SNPC) 2026 invites
                young photographers across India (17–23 years) to showcase
                their eye for wild places, wild lives, and the delicate balance
                of our natural world.
              </b>
            </p>

            {/* Live Participant Trust Bar */}
            <LiveParticipation />


            {/* Key Info Strip */}
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <Card className="bg-white/80 border border-green-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Themes
                </p>
                <p className="font-bold text-gray-900 mt-1">
                  Nature • Wildlife
                </p>
              </Card>
              <Card className="bg-white/80 border border-green-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Registration Fee
                </p>
                <p className="font-bold text-gray-900 mt-1">₹100</p>
                <p className="text-xs text-gray-500">
                  Non-refundable • 1 photo per participant
                </p>
              </Card>
              <Card className="bg-white/80 border border-green-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Prize Pool
                </p>
                <p className="font-extrabold text-2xl text-emerald-700 mt-1">₹42,000</p>
                <p className="text-xs text-gray-500">₹21K · ₹11K · ₹5K + consolations</p>
              </Card>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 items-center">
              <Link to="/register">
                <Button size="large" variant="fancy">
                  Register for ₹100
                </Button>
              </Link>
          
            </div>

            <p className="text-xs text-gray-500">
              <b>
                Age group: 17-23 years • Open to college and university students
                across India.
              </b>
              </p>
              
          </div>

          {/* Right: Visual / Highlights */}
          <div className="relative animate-slide-up">
            <div className="absolute -top-10 -right-6 w-32 h-32 bg-gradient-to-br from-amber-400/60 to-orange-500/60 rounded-full blur-3xl opacity-70" />
            <div className="absolute -bottom-10 -left-6 w-40 h-40 bg-gradient-to-br from-green-400/60 to-emerald-500/60 rounded-full blur-3xl opacity-70" />

            <Card className="relative bg-black/90 text-white overflow-hidden p-0 shadow-2xl">
              {/* Simulated photo collage */}
              <div className="grid grid-cols-2 gap-1 h-64 md:h-80">
                <div
                  className="bg-cover bg-center"
                  style={{ backgroundImage: `url(${hero1})` }}
                />
                <div
                  className="bg-cover bg-center"
                  style={{ backgroundImage: `url(${hero2})` }}
                />
                <div
                  className="bg-cover bg-center"
                  style={{ backgroundImage: `url(${hero3})` }}
                />
                <div
                  className="bg-cover bg-center"
                  style={{ backgroundImage: `url(${hero4})` }}
                />
              </div>

              <div className="p-5 border-t border-white/10 bg-gradient-to-r from-black/80 via-black/70 to-black/60">
                <p className="text-xs font-semibold text-green-300 uppercase tracking-[0.25em] mb-1">
                  SNPC 2026 • Nature & Wildlife
                </p>
                <p className="text-sm text-gray-100">
                  Celebrate forests, rivers, mountains, birds, mammals, and the
                  quiet moments of the wild. No heavy edits, no composites –
                  just honest storytelling through your lens.
                </p>
              </div>
            </Card>

            {/* Floating badge */}
            <div className="absolute -bottom-6 right-4 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
              <div className="bg-green-100 text-green-700 w-9 h-9 flex items-center justify-center rounded-full text-xl">
                🏆
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Top Awards
                </p>
                <p className="text-sm font-bold text-gray-800">
                  ₹21,000 • ₹11,000 • ₹5,000
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY PARTICIPATE */}
<section className="py-20 px-4 bg-white">
  <div className="max-w-6xl mx-auto">

    <div className="text-center mb-14">
      <span className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold">
        Why Participate?
      </span>

      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">
        More Than Just a Competition
      </h2>

      <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
        SNPC 2026 is designed to discover and celebrate emerging
        photographers who can tell compelling stories about nature,
        wildlife, and conservation through their lens.
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

      <Card className="p-8 text-center border-emerald-100">
       
        <h3 className="font-bold text-lg mb-2">
          National Recognition
        </h3>
        <p className="text-gray-600 text-sm">
          Showcase your work on a national platform.
        </p>
      </Card>

      <Card className="p-8 text-center border-emerald-100">
       
        <h3 className="font-bold text-lg mb-2">
          Distinguished Jury
        </h3>
        <p className="text-gray-600 text-sm">
          Evaluated by internationally acclaimed photographers and photography experts.
        </p>
      </Card>

      <Card className="p-8 text-center border-emerald-100">
       
        <h3 className="font-bold text-lg mb-2">
          Showcase Your Vision
        </h3>
        <p className="text-gray-600 text-sm">
          Share your perspective of India’s natural world.
        </p>
      </Card>

      <Card className="p-8 text-center border-emerald-100">
        
        <h3 className="font-bold text-lg mb-2">
          ₹42,000 Prize Pool
        </h3>
        <p className="text-gray-600 text-sm">
          Cash awards and national-level recognition.
        </p>
      </Card>

    </div>

  </div>
</section>

      {/* Jury Section */}
      <section className="py-10 sm:py-16 px-3 sm:px-4 bg-white/80">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 sm:mb-4">
            Jury Members
          </h2>
          <p className="text-center text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base">
            Our jury brings together leading voices from photography, conservation, and academia.
          </p>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            {juryMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => setOpenJury(member.id)}
                className="group w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm cursor-pointer"
              >
                <div
                  className="bg-white border border-slate-200 rounded-[18px] shadow-[0_15px_30px_rgba(15,23,42,0.12)]
                            px-3 pt-3 pb-5 flex flex-col items-center transform transition
                            group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(15,23,42,0.18)]"
                >
                  {/* Photo area */}
                  <div className="w-full h-64 sm:h-80 overflow-hidden bg-slate-100 rounded-[12px]">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Caption */}
                  <div className="mt-3 text-center w-full">
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
                      {member.name}
                    </h3>
                    {/* Credential badges — always visible, no click needed */}
                    <div className="mt-2 flex flex-col gap-1 items-center">
                      {member.credentials.map((cred, ci) => (
                        <span key={ci} className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full px-3 py-0.5 font-medium">
                          {cred}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

            <SimpleModal
        isOpen={Boolean(currentJury)}
        onClose={() => setOpenJury(null)}
        title={currentJury?.name || ''}
        role={currentJury?.role || ''} 
        photo={currentJury?.photo || ''}
        paragraphs={currentJury?.details || []}
      />


      {/* Final CTA */}
<section className="relative overflow-hidden py-20 px-4 bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-900">

  {/* Background Glow Effects */}
  <div className="absolute top-0 left-1/4 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
  <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />

  <div className="relative max-w-4xl mx-auto text-center">

    <p className="text-emerald-200 text-sm font-semibold uppercase tracking-[0.3em] mb-4">
      Evaluated by Padma Shri Awardee, Former National Photo Editors, Internationally Acclaimed Photographers & Photography Educators
    </p>

    <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
      Showcase Your Vision
      <span className="block text-emerald-300">
        On a National Stage
      </span>
    </h2>

    <Link to="/register">
      <Button
        size="large"
        variant="fancy"
        className="px-10 py-4 text-lg font-bold shadow-2xl hover:scale-105 transition-all duration-300"
      >
        Register for SNPC 2026 →
      </Button>
    </Link>

    <p className="mt-5 text-sm text-emerald-200">
      Join photographers from across India and be part of a growing national community of visual storytellers.
    </p>

  </div>
</section>

      {/* PRIZES */}
<section className="py-20 px-4 bg-gradient-to-br from-amber-50 via-white to-orange-50">

  <div className="max-w-6xl mx-auto">

    <div className="text-center mb-14">
      <span className="inline-flex px-4 py-2 rounded-full bg-amber-100 text-amber-800 font-semibold text-sm">
        Awards & Recognition
      </span>

      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">
        ₹42,000 Prize Pool
      </h2>

      <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
        Recognising excellence in nature and wildlife photography by young
        photographers across India.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8 mb-10">

      <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-3xl p-8 text-center shadow-xl">
        <div className="text-6xl mb-4">🥇</div>
        <h3 className="text-white text-2xl font-bold mb-2">
          First Prize
        </h3>
        <div className="text-5xl font-extrabold text-white">
          ₹21,000
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-300 to-slate-400 rounded-3xl p-8 text-center shadow-xl">
        <div className="text-6xl mb-4">🥈</div>
        <h3 className="text-white text-2xl font-bold mb-2">
          Second Prize
        </h3>
        <div className="text-5xl font-extrabold text-white">
          ₹11,000
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-amber-700 rounded-3xl p-8 text-center shadow-xl">
        <div className="text-6xl mb-4">🥉</div>
        <h3 className="text-white text-2xl font-bold mb-2">
          Third Prize
        </h3>
        <div className="text-5xl font-extrabold text-white">
          ₹5,000
        </div>
      </div>

    </div>

    <Card className="p-8 text-center border-emerald-100">
      <h3 className="text-2xl font-bold mb-4">
        Every Participant Receives
      </h3>

      <div className="grid md:grid-cols-3 gap-4 text-sm">

        <div>
          ✓ Participation Certificate
        </div>

        <div>
          ✓ National-Level Exposure
        </div>

        <div>
          ✓ Evaluation by Expert Jury
        </div>

      </div>

      <div className="mt-6 font-semibold text-emerald-700">
        + 5 Consolation Awards of ₹1,000 each
      </div>
    </Card>

  </div>

</section>



      {/* ABOUT SECTION – white strip full width */}
      <section id="about" className="bg-white/80">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-14 grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-3xl font-bold text-forest mb-3">
              About SNPC 2026
            </h2>
            <p className="text-gray-700 mb-4">
              Swadhyay National Photography Competition is a national-level
              initiative by Swadhyay Seva Foundation to encourage young
              photographers to observe, document, and celebrate India’s rich
              natural heritage.
            </p>
            <p className="text-gray-700 mb-4">
              The 2026 edition focuses on two powerful themes –{" "}
              <strong>Nature</strong> and <strong>Wildlife</strong>. From misty
              mountain ranges and ancient forests to birds, mammals, and tiny
              insects, your frame should tell a story that is ethical, honest,
              and visually compelling.
            </p>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• Open to students aged 17-23 years (college/university)</li>
              <li>• Only one photograph per participant</li>
              <li>• <strong>Phone camera photos are welcome</strong> — no DSLR required</li>
              <li>• No heavy editing or digital manipulation allowed</li>
              <li>• Photographs must be taken in India on or after 1 September 2025</li>
              <li>• Photograph submission link sent via E-mail after registration</li>
            </ul>
          </div>

          <Card className="bg-emerald-50/70 border-emerald-100">
            <h3 className="text-xl font-bold text-forest mb-4">
              Registration & Fee
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>Registration Fee:</strong> ₹100 (non-refundable)
              </p>
              <p>
                The fee supports organization costs, jury honorarium, digital
                infrastructure, and e-certificates for all participants.
              </p>
              <ul className="space-y-1">
                <li>
                  • Single registration covers one entry in either Nature or Wildlife category
                </li>
                <li>
                  • Payment details / gateway will be provided on the registration form
                </li>
                <li>• No additional charges for evaluation or certificates</li>
              </ul>
              <div className="mt-5">
                <Link to="/register">
                  <Button fullWidth variant="fancy">
                    Register Now for ₹100
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

{/* IMPORTANT DATES */}
<section className="py-20 px-4 bg-emerald-50/60">

  <div className="max-w-5xl mx-auto">

    <div className="text-center mb-14">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
        Important Dates
      </h2>
    </div>

    <div className="relative">

      <div className="absolute left-8 top-0 bottom-0 w-1 bg-emerald-200 hidden md:block" />

      {[
        {
          date: "10 Feb 2026",
          title: "Registrations Open"
        },
        {
          date: "30 Jun 2026",
          title: "Registration Deadline"
        },
        {
          date: "7 Jul 2026",
          title: "Submission Deadline"
        },
        {
          date: "TBA",
          title: "Results & Awards"
        }
      ].map((item, idx) => (
        <div
          key={idx}
          className="relative flex items-center gap-6 mb-8"
        >

          <div className="hidden md:flex h-16 w-16 rounded-full bg-emerald-600 text-white font-bold items-center justify-center z-10">
            {idx + 1}
          </div>

          <Card className="flex-1 p-6">
            <div className="text-sm uppercase tracking-wider text-emerald-700 font-semibold">
              {item.date}
            </div>

            <div className="text-xl font-bold mt-2">
              {item.title}
            </div>
          </Card>

        </div>
      ))}

    </div>

  </div>

</section>


      {/* Rules Overview Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Rules & Guidelines
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Technical */}
            <div 
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-emerald-200 transition"
              onClick={() => setOpenRulesModal('technical')}
            >
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Camera className="text-emerald-600" size={20} />
                  Technical Specifications
                </h3>
                <p className="text-sm text-gray-600">
                  File format, size, dimensions, image integrity, and other technical requirements.
                </p>
              </div>
              <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                Read more
              </button>
            </div>

            {/* Ethical */}
            <div 
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-emerald-200 transition"
              onClick={() => setOpenRulesModal('ethical')}
            >
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="text-amber-600" size={20} />
                  Ethical Standards
                </h3>
                <p className="text-sm text-gray-600">
                  Wildlife safety, fair practices, legal compliance, and ethical conduct.
                </p>
              </div>
              <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                Read more
              </button>
            </div>

            {/* Judging */}
            <div 
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-emerald-200 transition"
              onClick={() => setOpenRulesModal('judging')}
            >
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-600" size={20} />
                  Evaluation & Judging
                </h3>
                <p className="text-sm text-gray-600">
                  Jury panel, judging criteria, shortlisting, and final decision process.
                </p>
              </div>
              <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                Read more
              </button>
            </div>

            {/* Registration */}
            <div 
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-emerald-200 transition"
              onClick={() => setOpenRulesModal('registration')}
            >
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <FileText className="text-emerald-600" size={20} />
                  Registration & Submission
                </h3>
                <p className="text-sm text-gray-600">
                  Timelines, process, categories, fees, and usage rights.
                </p>
              </div>
              <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                Read more
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Modal */}
      <RulesModal
        isOpen={openRulesModal === 'technical'}
        onClose={() => setOpenRulesModal(null)}
        title="Technical Specifications"
      >
        <div className="space-y-8 text-gray-700 text-sm">
          <div>
                  <h4 className="font-bold text-gray-900 mb-2">Eligibility of Photographs</h4>
                  <p>All photographs must have been captured between <b>01 Sep 2025 to 7 July 2026</b>.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Location</h4>
                  <p>Photographs may be taken <b>anywhere within India</b>.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Competition only for Indian Nationals.</h4>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">File Format & Color Mode</h4>
                  <p>Only <b>digital photographs</b> are accepted. Images must be submitted in <b>JPEG (.jpg/.jpeg) format</b> and <b>RGB color mode</b>.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Image Dimensions</h4>
                  <p>The maximum size permitted is <b>1920 pixels on the longer side</b>.</p>
                  <p>Examples:</p>
                  <p className="ml-4">• Horizontal: 1920 × 1280 px</p>
                  <p className="ml-4">• Vertical: 1280 × 1920 px</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">File Size & Resolution</h4>
                  <p>The file size must be <b>between 2 MB to  5 MB</b>.</p>
                  <p>A resolution of <b>72–150 DPI</b> is recommended to maintain optimal quality within the size limit.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Image Integrity</h4>
                  <p>Photographs containing <b>borders, frames, logos, watermarks, timestamps, or signatures will be automatically disqualified</b>.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">File Naming Convention</h4>
                  <p>The participant’s <b>full name must be included in the filename</b> for easy identification.</p>
                  <p>Example: AmanSharma_Wetlands.jpg</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Authenticity Verification</h4>
                  <p>The jury reserves the right to request <b>original RAW files</b> and/or a sequence of images captured immediately before and after the submitted photograph to verify authenticity.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Technical Information</h4>
                  <p> Participants must provide the following details in the <b>submission form</b>:</p>
                  <p className="ml-4">• Date of capture</p>
                  <p className="ml-4">• Camera model/Mobile model used</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Editing & Post-Processing</h4>
                  <p><b>Editing and post-processing are not permitted</b>. Only minimal adjustments in colour and contrast are acceptable (without altering the original content).</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Combing multiple images into one is not permitted.</h4>                
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Verification Documents</h4>
                  <p>For the final round of judging, shortlisted participants may be required to submit <b>additional documents or original files</b> for verification.</p>
                </div>
        </div>
      </RulesModal>

      {/* Ethical Modal */}
      <RulesModal
        isOpen={openRulesModal === 'ethical'}
        onClose={() => setOpenRulesModal(null)}
        title="Ethical Standards"
      >
        <div className="space-y-8 text-gray-700 text-sm">
          <div>
                  <h4 className="font-bold text-gray-900 mb-2">Animal Welfare</h4>
                  <p>Participants must prioritize the <b>safety and well-being of wildlife</b> at all times. No photograph should cause harm, injury, stress, or disturbance to animals or their natural habitats.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Domestic & Staged Subjects</h4>
                  <p>Images featuring <b>farm animals, domestic pets, or staged animal models</b> are not permitted.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Nesting Wildlife</h4>
                  <p>Photographs of <b>nesting birds or vulnerable breeding sites</b> will not be accepted to prevent disturbance during sensitive periods.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Captive Animals</h4>
                  <p>Images of animals in captivity are generally not permitted. Exceptions may be considered <b>only when the photograph is intended to document conservation, rescue, or welfare issues</b> related to captivity.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Use of Bait</h4>
                  <p>Photographs captured using <b>live bait or any method that manipulates or endangers wildlife behavior</b> are strictly prohibited.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Photographer Conduct</h4>
                  <p>Entries may be disqualified if the photographer's presence or actions are deemed to have <b>disturbed, stressed, or placed wildlife at risk</b>.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Truthful Representation</h4>
                  <p> Participants must not <b>mislead viewers</b> by staging, manipulating, or misrepresenting the natural scene or wildlife behavior.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Legal Compliance</h4>
                  <p>Participants are responsible for complying with <b>all applicable local, national, and international laws</b>, including obtaining any necessary permissions or permits required for photography.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Unethical Practices</h4>
                  <p>Any photograph suspected to have been obtained through <b>cruel, exploitative, or unethical practices</b> will be immediately disqualified.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Accurate Information</h4>
                  <p>All details provided in captions, descriptions, and location information must be <b>complete, accurate, and truthful</b>.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Conflict of Interest</h4>
                  <p> Members of the <b>organizing committee, sponsors, partners, and jury</b> are not eligible to participate in the competition.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Rule Enforcement</h4>
                  <p>Any violation of these ethical standards will be treated as a <b>breach of competition rules</b> and may result in disqualification.</p>
                </div>
        </div>
      </RulesModal>

      {/* Judging Modal */}
      <RulesModal
        isOpen={openRulesModal === 'judging'}
        onClose={() => setOpenRulesModal(null)}
        title="Evaluation & Judging Process"
      >
        <div className="space-y-8 text-gray-700 text-sm">
          <div>
                  <h4 className="font-bold text-gray-900 mb-2">Jury Panel</h4>
                  <p>Entries will be evaluated by an independent jury comprising <b>renowned professionals from the fields of photography, wildlife research, and conservation</b>.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Judging Criteria</h4>
                  <p>Photographs will be assessed based on the following parameters:</p>
                  <p className="ml-4">• Suitability to Theme</p>
                  <p className="ml-4">• Creativity</p>
                  <p className="ml-4">• Originality</p>
                  <p className="ml-4">• Composition</p>
                  <p className="ml-4">• Technical excellence</p>
                  <p className="ml-4">• Ethical integrity</p>
                  <p className="ml-4">• Artistic impact</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Category Reassignment</h4>
                  <p>The jury reserves the right to <b>reassign entries to a more suitable category</b>, where deemed appropriate.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Awards & Prize Decisions</h4>
                  <p>The jury may, at its discretion:</p>
                  <p className="ml-4">• Declare a tie for any prize.</p>
                  <p className="ml-4">• Modify the number of prizes.</p>
                  <p className="ml-4">• Withhold an award if entries do not meet the required standards of merit.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Fair Conduct Policy</h4>
                  <p> Any participant who attempts to <b>contact, influence, or lobby jury members or organizers</b> regarding the judging process will be <b>immediately disqualified</b>.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Shortlisting Communication</h4>
                  <p> After submissions close, only participants whose entries are <b>shortlisted</b> will be contacted by the organizers.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Confidentiality of Shortlisting</h4>
                  <p> Shortlisted participants will be informed in <b>strict confidence</b>. Public disclosure or social media announcements prior to official results may lead to <b>withdrawal of the entry</b>.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Final Decision</h4>
                  <p>Final results will be announced <b>only during the official award ceremony</b> as scheduled by the organizers.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Binding Authority</h4>
                  <p>All decisions made by the jury and organizing committee shall be <b>final and binding</b>, and no correspondence or appeals regarding the results will be entertained.</p>
                </div>
        </div>
      </RulesModal>

      {/* Registration Modal */}
      <RulesModal
        isOpen={openRulesModal === 'registration'}
        onClose={() => setOpenRulesModal(null)}
        title="Registration & Submission Guidelines"
      >
        <div className="space-y-8 text-gray-700 text-sm">
          <div>
                  <h4 className="font-bold text-gray-900 mb-2">Registration Period</h4>
                  <p>Registrations will remain open from <b>10 February 2026 to 30 June 2026</b>.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Registration Process</h4>
                  <p>Participants must complete the <b>online registration form</b> available on the official website of <b>Swadhyay Seva Foundation</b>.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Submission Period</h4>
                  <p>Photograph submissions will be accepted from <b>12 February 2026 until 11:59 PM (IST) on 7 July 2026</b>.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Submission Platform</h4>
                  <p>Entries must be submitted <b>only through the official website</b>: <u>www.swadhyayseva.org</u>. Submissions via email or other platforms will not be accepted.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Support & Queries</h4>
                  <p>For assistance or technical issues, participants may contact:</p>
                  <p className="ml-4">• Email: swadhyaysevafoundation@gmail.com</p>
                  <p className="ml-4">• WhatsApp: +91 9599224323</p>
                  <p>Participants are advised to <b>carefully read all guidelines</b> before reaching out.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Competition Categories</h4>
                  <p>Participants may submit entries under either of the following categories:</p>
                  <p className="ml-4">• Nature</p>
                  <p className="ml-4">• Wildlife</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Registration Fee</h4>
                  <p className="ml-4">A <b>non-refundable registration fee of ₹100</b> is applicable per participant.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Cancellation & Refund Policy</h4>
                  <p className="ml-4">Registration fees are <b>non-refundable</b>, and cancellations or withdrawals will not be entertained once registration is completed.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Entry Limit</h4>
                  <p>Each participant may submit <b>only one photograph</b> in <b>any one category</b>.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Usage Rights (Organizers)</h4>
                  <p>By submitting an entry, participants grant the organizers the right to <b>use the photographs for promotional, educational, exhibition, and publicity purposes</b> related to the competition and future events, with due credit to the photographer.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Sponsor Rights</h4>
                  <p>Official sponsors may use selected photographs or related information <b>strictly for competition promotion and documentation purposes</b>, with appropriate acknowledgment.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Prize Disbursement</h4>
                  <p>Prize money is <b>non-transferable</b> and will be awarded directly to the registered participant.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Tie Situation</h4>
                  <p>In the event of a tie, the <b>cash prize will be equally shared</b> among the winners of that category.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Jurisdiction</h4>
                  <p>Any disputes arising from the competition shall be subject to the jurisdiction of Delhi courts only.</p>
                </div>
        </div>
      </RulesModal>

      
      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-3">Frequently Asked Questions</h2>
          <p className="text-center text-gray-500 mb-10">Everything you need to know before registering</p>
          <div className="space-y-4">
            {[
              {
                q: 'Can I submit a photo taken on my phone camera?',
                a: 'Yes, absolutely. Phone camera photos are fully eligible. The competition judges composition, storytelling, and ethical integrity — not the camera brand. Some of the most powerful nature photographs in the world are taken on phones.'
              },
              {
                q: 'What format and size should my photo be?',
                a: 'Submit as JPEG (.jpg/.jpeg) in RGB color mode. Maximum 1920px on the longest side, file size between 2 MB and 5 MB. No watermarks, borders, or logos. You\'ll receive a submission link via email after registering.'
              },
              {
                q: 'How will I know if I\'m shortlisted?',
                a: 'Shortlisted participants will be contacted directly by email in strict confidence. If you don\'t hear from us, your entry was not shortlisted — but final results are announced officially at the award ceremony.'
              },
              {
                q: 'Is ₹100 the only cost? Any hidden fees?',
                a: '₹100 is the complete, one-time registration fee. There are zero additional charges — no evaluation fee, no certificate fee, no submission fee. The fee covers jury honorarium, digital infrastructure, and certificates for all participants.'
              },
              {
                q: 'I missed the deadline. Can I still register?',
                a: 'Registrations are open until 30 June 2026 and photo submissions until 7 July 2026. If you\'re reading this before that date — you still have time. Register now and submit your photo before the deadline.'
              },
              {
                q: 'Can I submit more than one photo?',
                a: 'Each participant may submit one photograph in one category (either Nature or Wildlife). Choose your strongest shot — quality over quantity is exactly what the jury rewards.'
              },
            ].map((faq, i) => (
              <details key={i} className="group bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer font-semibold text-gray-900 text-base list-none">
                  {faq.q}
                  <span className="ml-4 text-emerald-600 text-xl font-bold group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
          </div>
        </section>
      
      

<div className="py-5 bg-emerald-50 border-y border-emerald-100">
  <div className="max-w-6xl mx-auto px-4">
    <LiveParticipation compact />
  </div>
</div>

{/* FINAL CTA */}
<section className="relative overflow-hidden py-24 px-4 bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-900">

  <div className="absolute top-0 left-1/4 h-96 w-96 bg-white/5 rounded-full blur-3xl" />
  <div className="absolute bottom-0 right-1/4 h-96 w-96 bg-emerald-300/10 rounded-full blur-3xl" />

  <div className="relative max-w-5xl mx-auto text-center">

    <span className="inline-flex items-center px-5 py-2 rounded-full bg-white/10 text-emerald-200 text-sm font-semibold mb-6">
      📸 Swadhyay National Photography Competition 2026
    </span>

    <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
      Your Best Photograph
      <span className="block text-emerald-300">
        Deserves a National Audience
      </span>
    </h2>

    <Link to="/register">
      <Button
        size="large"
        variant="fancy"
        className="px-12 py-5 text-lg font-bold shadow-2xl hover:scale-105 transition-all duration-300"
      >
        Register for SNPC 2026 →
      </Button>
    </Link>

    <p className="mt-6 text-sm text-emerald-200">
      Registration closes on <strong>30 June 2026</strong> • Open to participants aged 17–23 years across India
    </p>

  </div>

</section>

{/* Photography Club CTA */}
<section className="py-8 px-4 bg-white">

  <div className="max-w-4xl mx-auto">

    <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 text-center">

      <div className="text-3xl mb-2">📸</div>

      <h3 className="text-xl font-bold text-emerald-900 mb-2">
        Photography Club or College Society?
      </h3>

      <p className="text-gray-600 text-sm mb-5 max-w-xl mx-auto">
        Interested in promoting SNPC 2026 within your photography club,
        media society, or student community? We'd love to connect.
      </p>

      <a
        href="https://wa.me/919599224323?text=Hi%2C%20I'm%20interested%20in%20SNPC%202026%20for%20our%20Photography%20Club."
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 transition"
      >
        Chat on WhatsApp
      </a>

    </div>

  </div>

</section>
       
      

    </main>
  );
};

export default PhotographyCompetition;
