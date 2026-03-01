import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {FileText, Camera, CheckCircle2, AlertCircle} from 'lucide-react';
import Button from "../components/Button1";
import Card from "../components/Card1";

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
    document.title = 'Swadhyay National Photography Competition';
  }, []);

  const [openRulesModal, setOpenRulesModal] = useState(null); 
  const [openJury, setOpenJury] = useState(null);
  

  const juryMembers = [
    {
      id: 'anup-sah',
      name: 'Anup Sah',
      role: 'Photographer • Environmentalist • Mountaineer',
      shortRole: 'Padma Shri Awardee, Nature Photographer',
      photo: '/images/jury/anup-sah.jpeg', 
      details: [
        `A multifaceted personality, Anup Sah is a highly acclaimed photographer who has won numerous national and international awards, 
        including the President's Padma Shri.`,
        `Born in Nainital on 6 August 1949, his love for nature led to extensive travel, many treks, and the scaling of several Himalayan 
        peaks, including four trips to the Nanda Devi Sanctuary. He is a member of the Indian Mountaineering Federation and President of 
        the Nainital Mountaineering Club.`,
        `He has also worked in horticulture, wildlife conservation, apiculture, and floriculture. His photographs span wildlife, festivals, 
        folk life, and landscapes, supporting tourism and helping explorers and researchers while highlighting environmental and 
        wildlife issues.`,
        `Throughout his life, he has contributed immensely to the Himalayas and their communities, sharing his knowledge with anyone 
        sensitive to nature. He has popularised nature photography across Uttarakhand and beyond, and is an expert in mycology and 
        wild mushrooms, promoting mushroom farming.`,
        `He is also active in education in Nainital as Chairman of Mohan Lal Sah Bal Vidya Mandir and Manager of Chet Ram Sah Inter College.`
      ],

    },
    {
      id: 'bhupesh-little',
      name: 'Prof. Bhupesh C. Little',
      role: 'Fine Art Photographer • Educator • Researcher',
      shortRole: 'Internationally awarded photography educator',
      photo: '/images/jury/bhupesh.JPG',
      details: [
        `Prof. Bhupesh C. Little is an internationally acclaimed fine art photographer and one of India's pioneering photography educators, with a career of over three decades.`,
        `Beginning photography formally in 1987 during his BFA in Graphic Design, he has since received more than 50 international awards, 14 foreign fellowships, and several national honours from Government of India ministries.`,
        `He has been instrumental in establishing advanced photography education in India, helping start the first MFA in Photography at Lucknow University, drafting PhD regulations, and guiding landmark research including the first Indian woman PhD in Photography.`,
        `Prof. Little has taught at leading institutions in India and abroad, including heading the Institute of Creative Arts in the South Pacific and later the Department at Jamia Millia Islamia University, New Delhi.`,
        `He has served on juries for numerous international and national exhibitions, chaired the Horizon International Circuit for many years, and his works are held in prestigious collections such as the Metropolitan Museum, the Photographic Society of America, and major cultural institutions.`
      ],
    }


    // add more jury members here later
  ];

  const currentJury = juryMembers.find((j) => j.id === openJury);

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-emerald-50">
      {/* HERO SECTION – full width bg, content in container */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
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
                  Prizes
                </p>
                <p className="font-bold text-gray-900 mt-1">
                  ₹42,000 + E‑Certificates
                </p>
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
              <li>• Open to students aged 17–23 years (college/university)</li>
              <li>• Only one photograph per participant</li>
              <li>• No heavy editing or digital manipulation allowed</li>
              <li>
                • Photographs must be taken in India on or after 5 February 2026
              </li>
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
                  • Single registration covers one entry in either Nature or
                  Wildlife category
                </li>
                <li>
                  • Payment details / gateway will be provided on the
                  registration form
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
      {/* Theme Section */}
      <section className="py-16 px-4 bg-emerald-50/60">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Competition Themes</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border-2 border-emerald-200">
              <h3 className="text-2xl font-bold text-emerald-900 mb-4"> Nature</h3>
              <p className="text-gray-700">
                Capture the breathtaking beauty of landscapes, flora, ecosystems, and natural phenomena across India.
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-2xl border-2 border-orange-200">
              <h3 className="text-2xl font-bold text-orange-900 mb-4"> Wildlife</h3>
              <p className="text-gray-700">
                Showcase the incredible biodiversity and behavior of wild animals in their natural habitats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prizes Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Prizes & Awards</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-8 rounded-2xl text-center shadow-xl transform hover:scale-105 transition">
              <div className="text-6xl mb-4">🥇</div>
              <h3 className="text-2xl font-bold text-white mb-2">1st Prize</h3>
              <p className="text-4xl font-extrabold text-white">₹21,000</p>
            </div>
            <div className="bg-gradient-to-br from-gray-300 to-gray-400 p-8 rounded-2xl text-center shadow-xl transform hover:scale-105 transition">
              <div className="text-6xl mb-4">🥈</div>
              <h3 className="text-2xl font-bold text-white mb-2">2nd Prize</h3>
              <p className="text-4xl font-extrabold text-white">₹11,000</p>
            </div>
            <div className="bg-gradient-to-br from-orange-400 to-amber-600 p-8 rounded-2xl text-center shadow-xl transform hover:scale-105 transition">
              <div className="text-6xl mb-4">🥉</div>
              <h3 className="text-2xl font-bold text-white mb-2">3rd Prize</h3>
              <p className="text-4xl font-extrabold text-white">₹5,000</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl text-center shadow-md">
            <p className="text-lg font-semibold text-gray-800">
              + 5 Consolation Prizes of ₹1,000 each
            </p>
            <p className="text-gray-600 mt-2">E-Certificates for all participants</p>
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
            Our jury brings together leading voices from photography and conservation.
          </p>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            {juryMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => setOpenJury(member.id)}
                className="group w-full max-w-xs sm:max-w-md cursor-pointer"
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
                  <div className="mt-3 text-center">
                    <h3 className="text-lg sm:text-2xl font-semibold text-slate-900">
                      {member.name}
                    </h3>
                    <p className="text-sm sm:text-md text-slate-500 mt-1">
                      {member.role}
                    </p>
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



      {/* Important Dates */}
      <section className="py-16 px-4 bg-emerald-50/60">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Important Dates</h2>
          <div className="space-y-4">
            {[
              { date: '10 February - 15 April 2026', event: 'Registration Period' },
              { date: '23 April 2026', event: 'Last Date of Photograph Submission' },
              { date: '30 May 2026', event: 'Result Declaration' },
              { date: 'To Be Announced (TBA)', event: 'Prize Distribution' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex-1">
                  <p className="text-xl font-bold text-gray-900">{item.event}</p>
                  <p className="text-sm text-gray-600">{item.date}</p>
                </div>
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
                  <p>All photographs must have been captured between <b>01 Sep 2025 to 23 April 2026</b>.</p>
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
                  <p>Registrations will remain open from <b>10 February 2026 to 15 April 2026</b>.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Registration Process</h4>
                  <p>Participants must complete the <b>online registration form</b> available on the official website of <b>Swadhyay Seva Foundation</b>.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Submission Period</h4>
                  <p>Photograph submissions will be accepted from <b>12 February 2026 until 11:59 PM (IST) on 23 April 2026</b>.</p>
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
                  <h4 className="font-bold text-gray-900 mb-2">Entry Limit </h4>
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

    {/* CONTACT / FOOTER CTA */}
      <section className="bg-emerald-900">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">
              Need more information?
            </h3>
            <p className="text-sm text-emerald-100 max-w-xl">
              Schools, colleges, and photography clubs can reach out for bulk
              registrations, orientation sessions, or collaborations.
            </p>
          </div>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-emerald-900 text-sm font-semibold shadow hover:bg-emerald-50 transition"
          >
            Contact the SNPC Team
          </a>
        </div>
      </section>

    </main>
  );
};

export default PhotographyCompetition;
