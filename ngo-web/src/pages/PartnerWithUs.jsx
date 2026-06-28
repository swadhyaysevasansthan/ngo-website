import React, { useEffect } from "react";
import {
  ArrowRight,
  Award,
  Building2,
  Globe2,
  HeartHandshake,
  Leaf,
  BookOpen,
  Trees,
  Camera,
  Sprout,
  Users,
  BadgeCheck,
  Megaphone,
  Target,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

const PartnerWithUs = () => {

  useEffect(() => {
    document.title = 'Partner With Us - Swadhyay Seva Foundation';
  }, []);
  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-emerald-400 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] rounded-full bg-yellow-400 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div>
            <span className="inline-flex items-center bg-white/10 border border-white/20 rounded-full px-5 py-2 text-sm font-semibold mb-6">
              Partner With Swadhyay Seva Foundation
            </span>
            <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-8">
              Partner with a Mission that Creates
              <span className="text-yellow-300">
                {" "}Visible, Lasting Impact
              </span>
            </h1>
            <p className="text-xl text-emerald-100 leading-relaxed mb-10">
              Align your organisation with one of India's growing grassroots
              initiatives promoting environmental restoration, natural farming,
              wellness, education, and youth engagement.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-4 rounded-xl transition flex items-center gap-2"
              >
                Become a Sponsor
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Sponsor Us? */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-5">
              Why Sponsor Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Partner with a trusted nonprofit creating measurable impact through
              education, sustainability, wellness and community transformation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BadgeCheck className="text-emerald-600" size={42} />,
                title: "Brand Credibility",
                text: "Associate your brand with health, sustainability, education and values-based social change."
              },
              {
                icon: <Users className="text-emerald-600" size={42} />,
                title: "Wide Audience",
                text: "Reach thousands of students, schools, parents, farmers and educators."
              },
              {
                icon: <Megaphone className="text-emerald-600" size={42} />,
                title: "Powerful Storytelling",
                text: "Impact films, social campaigns and beneficiary stories amplify your CSR."
              },
              {
                icon: <HeartHandshake className="text-emerald-600" size={42} />,
                title: "CSR Engagement",
                text: "Employee volunteering, wellness programmes and meaningful participation."
              },
              {
                icon: <Building2 className="text-emerald-600" size={42} />,
                title: "Strategic Collaboration",
                text: "Go beyond sponsorship through co-created campaigns and long-term partnerships."
              },
              {
                icon: <Target className="text-emerald-600" size={42} />,
                title: "Visible Impact",
                text: "Support projects creating measurable environmental and educational outcomes."
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition duration-300">
                {item.icon}
                <h3 className="text-2xl font-bold mt-6 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-7">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Supported  */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-5">
              Programs Your Sponsorship Strengthens
            </h2>
            <p className="text-xl text-gray-600">
              Education, wellness, environment and youth engagement under one mission.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Globe2 size={38} />,
                title: "SNEAC",
                desc: "India's environmental awareness competition engaging thousands of students."
              },
              {
                icon: <Camera size={38} />,
                title: "Photography Competition",
                desc: "National photography competition promoting biodiversity and conservation."
              },
              {
                icon: <BookOpen size={38} />,
                title: "Pustak Daan",
                desc: "Book donation initiatives helping children gain access to educational resources."
              },
              {
                icon: <Leaf size={38} />,
                title: "Natural Farming",
                desc: "Training farmers in sustainable cow-based natural farming."
              },
              {
                icon: <Trees size={38} />,
                title: "Plantation Drives",
                desc: "Large-scale tree plantation campaigns improving biodiversity."
              },
              {
                icon: <Sprout size={38} />,
                title: "Yoga & Wellness",
                desc: "Holistic wellness programmes through yoga and naturopathy."
              },
            ].map((program) => (
              <div
                key={program.title}
                className="rounded-3xl border border-gray-200 p-8 hover:border-emerald-500 hover:-translate-y-2 transition">
                <div className="text-emerald-600">
                  {program.icon}
                </div>
                <h3 className="text-2xl font-bold mt-5 mb-4">
                  {program.title}
                </h3>
                <p className="text-gray-600 leading-7">
                  {program.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT SPONSORS RECEIVE */}
      <section className="py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-semibold uppercase tracking-widest">
              Sponsor Benefits
            </span>
            <h2 className="text-5xl font-black mt-3 mb-6">
              What Sponsors Receive
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every sponsorship goes beyond logo placement and creates meaningful
              engagement with students, educators, communities and environmental
              initiatives.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "Homepage & Website Recognition",
              "Stage Branding & Event Backdrops",
              "Registration Counter Branding",
              "Certificates & Awards Branding",
              "Social Media Campaign Recognition",
              "Press Releases & Media Coverage",
              "Short Documentary & Impact Stories",
              "Personalized Thank You Videos",
              "CSR Employee Volunteering",
              "Environmental Festivals & Workshops",
              "Exclusive Appreciation Events",
              "Long-Term Partnership Opportunities",
            ].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex items-start gap-4"
              >
                <CheckCircle2
                  className="text-emerald-600 flex-shrink-0 mt-1"
                  size={22}
                />
                <span className="text-gray-700 font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPONSORSHIP PACKAGES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="uppercase tracking-widest text-emerald-600 font-semibold">
              Flexible Partnership Options
            </span>
            <h2 className="text-5xl font-black mt-4 mb-6">
              Choose Your Sponsorship Package
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Each sponsorship tier is designed to provide meaningful visibility,
              CSR engagement and long-term collaboration.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden border-2 border-yellow-400 shadow-2xl mb-10">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-8">
              <div className="flex flex-wrap justify-between items-center">
                <div>
                  <h3 className="text-4xl font-black">
                    Lead Platinum Partner
                  </h3>
                  <p className="mt-2 text-lg">
                    Exclusively for 1 Sponsor
                  </p>
                </div>
                <div className="text-5xl font-black">
                  ₹5,00,000
                </div>
              </div>
            </div>
            <div className="p-10 grid lg:grid-cols-2 gap-10">
              <div>
                <h4 className="font-bold text-2xl mb-5">
                  Branding & Recognition
                </h4>
                <ul className="space-y-3">
                  {[
                    "Homepage Lead Sponsor Recognition",
                    "Grand Finale Stage Branding",
                    "Registration Counters",
                    "Certificates & Shields",
                    "Communication to 7000 Schools",
                    "VIP Mementoes",
                    "Press Releases",
                    "Social Media Campaigns"
                  ].map(item => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle2 className="text-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-2xl mb-5">
                  Premium Benefits
                </h4>
                <ul className="space-y-3">
                  {[
                    "Dedicated Documentary Film",
                    "Thank You Video",
                    "Environmental Festival Presence",
                    "Annual Appreciation Events",
                    "CSR Volunteer Days",
                    "Strategy Meeting Invitation",
                    "Advisory Committee Opportunity",
                    "Long-Term Partnership"
                  ].map(item => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle2 className="text-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="inline-flex mt-8 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold items-center gap-2"
                >
                  Become Platinum Partner
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8 mt-12">
            {[
              {
                name: "Lead Diamond",
                price: "₹2,50,000",
                color: "border-blue-400",
                badge: "Only 1 Sponsor",
                features: [
                  "Grand Finale Branding",
                  "Registration Counters",
                  "Certificates",
                  "Social Campaigns",
                  "Co-created Campaigns",
                  "Annual Events"
                ]
              },
              {
                name: "Gold Partner",
                price: "₹1,25,000",
                color: "border-yellow-500",
                badge: "Only 1 Sponsor",
                features: [
                  "Grand Finale Branding",
                  "Certificates",
                  "Press Releases",
                  "Social Media",
                  "Recognition",
                  "Long-Term Association"
                ]
              },
              {
                name: "Silver Partner",
                price: "₹75,000",
                color: "border-gray-400",
                badge: "2 Sponsors",
                features: [
                  "Grand Finale Branding",
                  "3 Standees",
                  "Social Media",
                  "Campaign Recognition",
                  "Co-created Campaigns"
                ]
              },
              {
                name: "Bronze Partner",
                price: "₹35,000",
                color: "border-orange-400",
                badge: "4 Sponsors",
                features: [
                  "Grand Finale Branding",
                  "2 Standees",
                  "Campaign Recognition",
                  "Co-created Initiatives"
                ]
              },
            ].map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-3xl border-2 ${pkg.color} p-8 hover:shadow-xl transition`}>
                <div className="mb-5">
                  <h3 className="text-3xl font-black">
                    {pkg.name}
                  </h3>
                  <p className="text-emerald-600 font-bold text-3xl mt-2">
                    {pkg.price}
                  </p>
                  <span className="inline-block mt-4 bg-gray-100 rounded-full px-4 py-2 text-sm">
                    {pkg.badge}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map(feature => (
                    <li key={feature} className="flex gap-2">
                      <CheckCircle2
                        size={18}
                        className="text-emerald-600 mt-1" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CSR */}
      <section className="py-24 bg-gradient-to-r from-emerald-900 via-green-800 to-emerald-900 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="uppercase tracking-[5px] text-yellow-300 font-semibold">
            CSR Collaboration
          </span>
          <h2 className="text-5xl font-black mt-5 mb-8">
            Let's Build a Healthier Society
            and a Greener Future Together
          </h2>
          <p className="text-xl text-emerald-100 max-w-4xl mx-auto leading-9">
            Whether you're a corporate organisation, educational institution,
            government body or philanthropic foundation,
            we create customised CSR partnerships that generate measurable
            social and environmental impact while strengthening your brand.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-5">
            <Link
              to="/contact"
              className="bg-yellow-400 text-black font-bold px-8 py-4 rounded-xl hover:bg-yellow-300 transition"
            >
              Schedule a Partnership Discussion
            </Link>
            <a
              href="mailto:swadhyaysevafoundation@gmail.com"
              className="border border-white/30 px-8 py-4 rounded-xl hover:bg-white/10"
            >
              Email Our Team
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 mt-5">
              Everything you may want to know before becoming a partner.
            </p>
          </div>
          <div className="space-y-6">
            {[
              {
                q: "Can organisations sponsor a single event?",
                a: "Yes. We offer event-specific as well as annual sponsorship opportunities."
              },
              {
                q: "Do you provide CSR partnership opportunities?",
                a: "Yes. We design customised CSR engagement programmes including employee volunteering, wellness workshops and environmental campaigns."
              },
              {
                q: "Will our brand receive visibility?",
                a: "Yes. Depending upon your sponsorship tier, branding is provided across events, website, social media, certificates, press releases and campaigns."
              },
              {
                q: "Can educational institutions become partners?",
                a: "Absolutely. Schools, colleges and universities frequently collaborate with us for awareness programmes and competitions."
              },
              {
                q: "How is sponsorship impact communicated?",
                a: "Sponsors receive event reports, photographs, videos and campaign updates showcasing measurable impact."
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl border border-gray-200 p-8">
                <h3 className="font-bold text-2xl mb-4">
                  {faq.q}
                </h3>
                <p className="text-gray-600 leading-8">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CONTACT */}
      <section className="py-24 bg-white text-white bg-gradient-to-r from-emerald-800 to-green-900">
        <div className="max-w-6xl mx-auto px-6 ">
          <div >
            <div>
              <span className="uppercase tracking-[4px] text-yellow-300">
                Let's Work Together
              </span>
              <h2 className="text-5xl font-black mt-5 mb-8">
                Ready to Become a Sponsorship Partner?
              </h2>
              <p className="text-lg text-emerald-100 leading-9 mb-10">
                Partner with us to empower students, support natural farming, promote wellness, and build a greener, healthier future.
              </p>
              <p>
              </p>
              <div className="flex flex-wrap gap-5">
                <Link
                  to="/contact"
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-4 rounded-xl transition">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PartnerWithUs;


