import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Calendar, Users, Award, FileText, Camera, CheckCircle2, AlertCircle, ChevronDown, Clock, Mail } from 'lucide-react';
import competitionPoster from '../assets/SNPC 2026.png';

const PhotographyCompetition = () => {

  useEffect(() => {
    document.title = 'Swadhyay National Photography Competition';
  }, []);

  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const CollapsibleSection = ({ title, children, sectionKey, icon: Icon }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="text-emerald-600" size={24} />}
          <h3 className="text-lg font-bold text-gray-900 text-left">{title}</h3>
        </div>
        <ChevronDown
          size={24}
          className={`text-gray-600 transition-transform duration-300 ${
            openSection === sectionKey ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          openSection === sectionKey ? 'max-h-[2000px]' : 'max-h-0'
        }`}
      >
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-white text-sm font-bold mb-6 tracking-wide uppercase animate-pulse">
                <Clock size={16} />
                Coming Soon
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight">
                Swadhyay National Photography Competition
              </h1>
              <p className="text-xl text-emerald-100 mb-8">
                Capture the beauty of nature and wildlife through your lens. Win exciting prizes up to ₹21,000!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#details"
                  className="px-8 py-4 bg-amber-500 hover:bg-amber-600 rounded-full font-bold text-lg shadow-xl transition text-center"
                >
                  View Details
                </a>
              </div>
            </div>
            <div className="relative">
              <img
                src={competitionPoster}
                alt="SNPC 2026 Poster"
                className="rounded-2xl shadow-2xl border-4 border-white/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="py-12 px-4 -mt-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <Calendar className="text-emerald-600 mb-3" size={32} />
              <h3 className="font-bold text-gray-900 mb-2">Registration Period</h3>
              <p className="text-sm text-gray-600">10 Feb - 15 Apr 2026</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <Users className="text-emerald-600 mb-3" size={32} />
              <h3 className="font-bold text-gray-900 mb-2">Eligibility</h3>
              <p className="text-sm text-gray-600">Age 17-23, College Students</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <Award className="text-emerald-600 mb-3" size={32} />
              <h3 className="font-bold text-gray-900 mb-2">Total Prizepool</h3>
              <p className="text-sm text-gray-600">₹42,000 + Certificates</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <FileText className="text-emerald-600 mb-3" size={32} />
              <h3 className="font-bold text-gray-900 mb-2">Registration Fee</h3>
              <p className="text-sm text-gray-600">₹100 only</p>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Section */}
      <section className="py-16 px-4 bg-white" id="details">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Competition Themes</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border-2 border-emerald-200">
              <h3 className="text-2xl font-bold text-emerald-900 mb-4">🌿 Nature</h3>
              <p className="text-gray-700">
                Capture the breathtaking beauty of landscapes, flora, ecosystems, and natural phenomena across India.
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-2xl border-2 border-orange-200">
              <h3 className="text-2xl font-bold text-orange-900 mb-4">🦁 Wildlife</h3>
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
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Prizes & Awards</h2>
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

      {/* Important Dates */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Important Dates</h2>
          <div className="space-y-4">
            {[
              { date: '10 February - 15 April 2026', event: 'Registration Period' },
              { date: '23 April 2026', event: 'Last Date of Photograph Submission' },
              { date: '15 May 2026', event: 'Result Declaration' },
              { date: '30 May 2026', event: 'Prize Distribution' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <Calendar className="text-emerald-600 flex-shrink-0" size={24} />
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{item.event}</p>
                  <p className="text-sm text-gray-600">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collapsible Rules Sections */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Rules & Guidelines</h2>
          <div className="space-y-4">
            {/* Technical Specifications */}
            <CollapsibleSection 
              title="Technical Specifications" 
              sectionKey="technical"
              icon={Camera}
            >
              <div className="space-y-4 text-gray-700">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Eligibility of Photographs</h4>
                  <p>• All photographs must have been captured on or after 5 February 2026</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Location</h4>
                  <p>• Photographs may be taken anywhere within India</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">File Format & Color Mode</h4>
                  <p>• Only digital photographs are accepted</p>
                  <p>• Images must be submitted in JPEG (.jpg/.jpeg) format and RGB color mode</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Image Dimensions</h4>
                  <p>• Maximum size: 1920 pixels on the longer side</p>
                  <p className="ml-4">- Horizontal: 1920 × 1280 px</p>
                  <p className="ml-4">- Vertical: 1280 × 1920 px</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">File Size & Resolution</h4>
                  <p>• File size must not exceed 5 MB</p>
                  <p>• Resolution of 72–150 DPI recommended</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Image Integrity</h4>
                  <p>• Photographs containing borders, frames, logos, watermarks, timestamps, or signatures will be automatically disqualified</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">File Naming Convention</h4>
                  <p>• Participant's full name must be included in filename</p>
                  <p>• Example: AmanSharma_Wetlands.jpg</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Editing & Post-Processing</h4>
                  <p>• Editing and post-processing are not permitted</p>
                  <p>• Only basic adjustments allowed: cropping, resizing, minor exposure correction</p>
                </div>
              </div>
            </CollapsibleSection>

            {/* Ethical Standards */}
            <CollapsibleSection 
              title="Ethical Standards" 
              sectionKey="ethical"
              icon={AlertCircle}
            >
              <div className="space-y-4 text-gray-700">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Animal Welfare</h4>
                  <p>• Prioritize safety and well-being of wildlife at all times</p>
                  <p>• No photograph should cause harm, injury, stress, or disturbance to animals</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Domestic & Staged Subjects</h4>
                  <p>• Images featuring farm animals, domestic pets, or staged animal models are not permitted</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Nesting Wildlife</h4>
                  <p>• Photographs of nesting birds or vulnerable breeding sites will not be accepted</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Captive Animals</h4>
                  <p>• Images of animals in captivity are generally not permitted</p>
                  <p>• Exceptions may be considered for conservation, rescue, or welfare documentation</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Use of Bait</h4>
                  <p>• Photographs using live bait or methods that manipulate wildlife behavior are strictly prohibited</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Truthful Representation</h4>
                  <p>• Participants must not mislead viewers by staging, manipulating, or misrepresenting natural scenes</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Legal Compliance</h4>
                  <p>• Comply with all applicable laws and obtain necessary permits</p>
                </div>
              </div>
            </CollapsibleSection>

            {/* Judging Criteria */}
            <CollapsibleSection 
              title="Judging Criteria" 
              sectionKey="judging"
              icon={CheckCircle2}
            >
              <div className="space-y-4 text-gray-700">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Jury Panel</h4>
                  <p>• Entries evaluated by independent jury of photography, wildlife research, and conservation professionals</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Assessment Parameters</h4>
                  <p>• Creativity</p>
                  <p>• Originality</p>
                  <p>• Composition</p>
                  <p>• Technical excellence</p>
                  <p>• Ethical integrity</p>
                  <p>• Artistic impact</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Fair Conduct Policy</h4>
                  <p>• Attempting to contact or influence jury members will result in immediate disqualification</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Final Decision</h4>
                  <p>• All jury and organizing committee decisions are final and binding</p>
                  <p>• No correspondence or appeals will be entertained</p>
                </div>
              </div>
            </CollapsibleSection>

            {/* Registration & Submission */}
            <CollapsibleSection 
              title="Registration & Submission Guidelines" 
              sectionKey="registration"
              icon={FileText}
            >
              <div className="space-y-4 text-gray-700">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Registration Period</h4>
                  <p>• 10 February 2026 to 15 April 2026</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Submission Period</h4>
                  <p>• 5 February 2026 until 11:59 PM (IST) on 23 April 2026</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Submission Platform</h4>
                  <p>• Entries must be submitted only through official website: www.swadhyayseva.org</p>
                  <p>• Submissions via email or other platforms will not be accepted</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Competition Categories</h4>
                  <p>• Nature</p>
                  <p>• Wildlife</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Registration Fee</h4>
                  <p>• ₹100 (non-refundable) per participant</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Entry Limit</h4>
                  <p>• One photograph per participant in one category</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Support & Queries</h4>
                  <p>• Email: swadhyaysevafoundation@gmail.com</p>
                  <p>• WhatsApp: +91 9599224323</p>
                </div>
              </div>
            </CollapsibleSection>
          </div>
        </div>
      </section>

    {/* Coming Soon CTA */}
    <section className="py-16 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
    <div className="max-w-4xl mx-auto text-center">
        <Clock className="mx-auto mb-6 animate-pulse" size={64} />
        <h2 className="text-4xl font-bold mb-6">Registration Opening Soon!</h2>
        <p className="text-xl text-emerald-100 mb-8">
        Stay tuned! Registration portal will be live soon. Get ready to showcase your photography talent!
        </p>
        <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
        <p className="text-lg mb-6">For updates and information, keep visiting our website:</p>
        <a
            href="http://www.swadhyayseva.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-2xl font-bold text-amber-300 hover:text-amber-200 underline mb-8"
        >
            www.swadhyayseva.org
        </a>
        <div className="mt-8 pt-8 border-t border-white/20">
            <p className="text-lg text-emerald-100 mb-4">Have questions?</p>
            <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 rounded-full font-bold text-lg hover:bg-emerald-50 transition shadow-xl"
            >
            <Mail size={20} />
            Contact Us
            </Link>
        </div>
        </div>
    </div>
    </section>
    </main>
  );
};

export default PhotographyCompetition;
