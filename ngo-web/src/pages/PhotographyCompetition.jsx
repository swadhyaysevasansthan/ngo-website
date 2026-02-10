import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Calendar, Users, Award, FileText, Camera, CheckCircle2, AlertCircle, Mail, ArrowRight } from 'lucide-react';
import competitionPoster from '../assets/SNPC 2026 poster.png';

const RulesModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative z-[70] max-h-[90vh] w-full max-w-3xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 rounded-full p-1.5 hover:bg-gray-100 transition"
            aria-label="Close rules"
          >
            ✕
          </button>
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


const PhotographyCompetition = () => {

  useEffect(() => {
    document.title = 'Swadhyay National Photography Competition';
  }, []);
  
  const [openRulesModal, setOpenRulesModal] = useState(null); 

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-emerald-900 via-emerald-600 to-emerald-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight">
                Swadhyay National Photography Competition
              </h1>
              <p className="text-xl text-emerald-100 mb-8">
                Capture the beauty of nature and wildlife through your lens. Win exciting prizes up to ₹21,000!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://forms.gle/w1CjkXz5o6x9zJGr6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-amber-500 hover:bg-amber-600 rounded-full font-bold text-lg shadow-xl transition text-center"
                >
                  Register Now
                </a>
                <a
                  href="#details"
                  className="px-8 py-4 bg-amber-500 hover:bg-amber-600 rounded-full font-bold text-lg shadow-xl transition text-center"
                >
                  View Details
                </a>
              </div>
            </div>
            <div className="relative flex justify-center">
              <img
                src={competitionPoster}
                alt="SNPC 2026 Poster"
                className="rounded-2xl shadow-2xl border-4 border-white/20 max-w-xs sm:max-w-sm lg:max-w-md h-auto"
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
              <p className="text-sm text-gray-600">₹42,000 </p>
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
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Competition Themes</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border-2 border-emerald-200">
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

      {/* Important Dates */}
      <section className="py-16 px-4 bg-white">
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
                  <h4 className="font-bold text-gray-900 mb-2">Entry Limit & File Size</h4>
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

    {/* Coming Soon CTA */}
    <section className="py-8 px-4 bg-gradient-to-r from-saffron-600 to-blue-800 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Registration Open Now!</h2>
        <p className="text-xl text-emerald-100 mb-6">
          The registration form is live. Register now to showcase your photography talent at the national level!
        </p>

        {/* Register Now button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <a
            href="https://forms.gle/w1CjkXz5o6x9zJGr6"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white text-emerald-700 hover:bg-emerald-100 rounded-full font-bold text-lg shadow-xl transition text-center"
          >
            Register Now <ArrowRight className="inline ml-2" size={20} />
          </a>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
          <p className="text-lg mb-4">
            For updates and detailed information, keep visiting our website:
          </p>
          <a
            href="https://www.swadhyayseva.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-2xl font-bold text-amber-300 hover:text-amber-200 underline mb-6"
          >
            www.swadhyayseva.org
          </a>

          <div className="mt-6 pt-4 border-t border-white/20">
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
