
import React, {useEffect} from 'react';
import { UserPlus, Users, Heart, Award, Target, CheckCircle2, ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const PartnerWithUs = () => {

      useEffect(() => {
        document.title = 'Partner With Us - Swadhyay Seva Foundation';
      }, []);
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <UserPlus className="mx-auto mb-6 text-emerald-300" size={64} />
            <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight">
              Partner With Us
            </h1>
            <p className="text-xl text-emerald-100 mb-8">
              Join our mission to create environmental awareness among young minds. 
              Together, we can build a greener, more sustainable future for India.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </section>

      {/* Why Partner Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Partner With Swadhyay Seva Foundation?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <Target className="text-emerald-600 mb-4" size={40} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Direct Impact</h3>
              <p className="text-gray-600">
                Your contribution directly reaches thousands of students across India, 
                creating lasting environmental awareness and behavioral change.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <Award className="text-emerald-600 mb-4" size={40} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Recognition</h3>
              <p className="text-gray-600">
                Partners are recognized on our website, social media, and event materials, 
                showcasing your commitment to environmental education.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <Users className="text-emerald-600 mb-4" size={40} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600">
                Join a network of like-minded individuals and organizations working 
                towards a common goal of environmental sustainability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Options */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Choose Your Partnership Path
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Whether you want to become a member or volunteer your time, there's a 
            perfect way for you to contribute to our mission.
          </p>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Membership Option */}
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-8 sm:p-10 shadow-xl border-2 border-emerald-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                  <Award className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Become a Member</h3>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                Support our foundation through annual membership and gain exclusive 
                benefits while contributing to environmental education nationwide.
              </p>

              <div className="space-y-4 mb-8">
                <h4 className="font-bold text-gray-900 mb-3">Membership Benefits:</h4>
                {[
                  'Priority access to event updates and reports',
                  'Invitations to exclusive webinars and workshops',
                  'Quarterly impact reports and newsletters',
                  'Certificate of membership and recognition',
                  'Voting rights in annual general meetings',
                  'Networking opportunities with environmental leaders',
                //   'Tax exemption benefits under 80G (if applicable)'
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-6 mb-6 border border-emerald-100">
                <h4 className="font-bold text-gray-900 mb-4">Membership Tiers:</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="font-semibold text-gray-700">Individual</span>
                    {/* <span className="text-emerald-600 font-bold">₹1,000/year</span> */}
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="font-semibold text-gray-700">Student</span>
                    {/* <span className="text-emerald-600 font-bold">₹500/year</span> */}
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="font-semibold text-gray-700">Institutional</span>
                    {/* <span className="text-emerald-600 font-bold">₹5,000/year</span> */}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Corporate</span>
                    {/* <span className="text-emerald-600 font-bold">₹25,000/year</span> */}
                  </div>
                </div>
              </div>

              <Link
                to="/contact"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition"
              >
                Apply for Membership <ArrowRight size={20} />
              </Link>
            </div>

            {/* Volunteer Option */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 sm:p-10 shadow-xl border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Heart className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Volunteer With Us</h3>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                Contribute your time, skills, and passion to make a real difference 
                in environmental education. No prior experience required!
              </p>

              <div className="space-y-4 mb-8">
                <h4 className="font-bold text-gray-900 mb-3">Volunteer Opportunities:</h4>
                {[
                  'Event coordination and on-ground support',
                  'Content creation (blog posts, social media)',
                  'Quiz question development and research',
                  'School outreach and partnership building',
                  'Graphic design and marketing materials',
                  'Photography and videography at events',
                  'Data entry and certificate management',
                  'Translation services (regional languages)'
                ].map((opportunity, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">{opportunity}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-6 mb-6 border border-blue-100">
                <h4 className="font-bold text-gray-900 mb-4">What You'll Gain:</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>✓ Certificate of volunteering hours</p>
                  <p>✓ Skill development and hands-on experience</p>
                  <p>✓ Letter of recommendation (after 3+ months)</p>
                  <p>✓ Networking with environmental professionals</p>
                  <p>✓ Flexible commitment based on your availability</p>
                </div>
              </div>

              <Link
                to="/contact"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition"
              >
                Apply to Volunteer <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Mail className="mx-auto mb-6 text-emerald-400" size={48} />
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Have questions or want to discuss custom partnership opportunities? 
            We'd love to hear from you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-8 py-4 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition"
            >
              Contact Us
            </Link>
            <a
              href="mailto:swadhyaysevafoundation@gmail.com"
              className="px-8 py-4 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition border border-white/20"
            >
              Email Directly
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PartnerWithUs;
