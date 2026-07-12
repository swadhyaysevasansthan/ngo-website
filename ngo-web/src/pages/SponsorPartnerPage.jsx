import {
  Award,
  ExternalLink,
  Leaf,
  GraduationCap,
  Palette,
  Globe,
  HeartHandshake
} from "lucide-react";
import { motion } from "framer-motion";
import sponsor from "../data/sponsorDemo";

const SponsorPartnerPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO */}

      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-saffron-600 text-white">

        <div className="absolute inset-0 bg-black/10" />

        <div className="relative max-w-6xl mx-auto px-6 py-24">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .6 }}
            className="text-center"
          >

            <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-5 py-2 rounded-full font-bold shadow-lg">
              <Award size={18} />
              {sponsor.tier}
            </div>

            <img
              src={sponsor.logo}
              alt={sponsor.company}
              className="h-40 md:h-52 object-contain mx-auto mt-8"
            />

            <h1 className="text-4xl md:text-6xl font-bold mt-6">
              {sponsor.company}
            </h1>

            <p className="text-yellow-300 font-semibold text-xl mt-3">
              {sponsor.tagline}
            </p>

            <p className="mt-6 max-w-3xl mx-auto text-xl text-blue-100 leading-relaxed">
              {sponsor.description}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">

              <a
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-700 font-semibold hover:scale-105 transition"
              >
                Visit Website
                <ExternalLink size={18}/>
              </a>

              <a
                href="#partnership"
                className="inline-flex items-center px-6 py-3 rounded-xl border border-white/30 hover:bg-white/10 transition"
              >
                Partnership Details
              </a>

            </div>

          </motion.div>

        </div>

      </section>

      {/* ABOUT */}

      <section className="py-20">

        <div className="max-w-6xl mx-auto px-6">

          <motion.div
            initial={{ opacity:0,y:20 }}
            whileInView={{ opacity:1,y:0 }}
            viewport={{ once:true }}
            className="bg-white rounded-3xl shadow-lg p-8 md:p-12"
          >

            <h2 className="text-4xl font-bold mb-8 text-gray-900">
              About Our Partner
            </h2>

            <div className="space-y-6 text-lg text-gray-700 leading-8">

              {sponsor.about.map((paragraph,index)=>(
                <p key={index}>
                  {paragraph}
                </p>
              ))}

            </div>

          </motion.div>

        </div>

      </section>

      {/* PARTNERSHIP */}

      <section
        id="partnership"
        className="pb-20"
      >

        <div className="max-w-6xl mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-8">

            <motion.div
              initial={{ opacity:0,y:20 }}
              whileInView={{ opacity:1,y:0 }}
              viewport={{ once:true }}
              className="bg-white rounded-3xl shadow-lg p-8"
            >

              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <Leaf className="text-green-600" size={30}/>
              </div>

              <h3 className="text-2xl font-bold mb-5">
                Partnership with Swadhyay Seva Foundation
              </h3>

              <div className="space-y-5 text-gray-700 leading-8">

                {sponsor.partnership.map((paragraph,index)=>(
                  <p key={index}>
                    {paragraph}
                  </p>
                ))}

              </div>

            </motion.div>

            <motion.div
              initial={{ opacity:0,y:20 }}
              whileInView={{ opacity:1,y:0 }}
              transition={{ delay:.1 }}
              viewport={{ once:true }}
              className="bg-white rounded-3xl shadow-lg p-8"
            >

              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <HeartHandshake className="text-blue-600" size={30}/>
              </div>

              <h3 className="text-2xl font-bold mb-5">
                Why Become a Lead Platinum Partner?
              </h3>

              <ul className="space-y-4 text-gray-700 leading-7">

                <li>• Premium visibility across the Foundation website.</li>

                <li>• Dedicated sponsor profile showcasing your organisation.</li>

                <li>• Recognition as a strategic partner supporting environmental education.</li>

                <li>• Association with flagship national competitions and awareness initiatives.</li>

                <li>• Opportunity to demonstrate your commitment towards sustainability and community development.</li>

                <li>• Long-term digital recognition across Foundation platforms.</li>

              </ul>

            </motion.div>

          </div>

        </div>

      </section>

      {/* NATIONAL COMPETITIONS */}

      <section className="pb-20">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-12">

            <h2 className="text-4xl font-bold text-gray-900">
              Supporting Our National Initiatives
            </h2>

            <p className="text-gray-600 mt-4 text-lg max-w-3xl mx-auto">
              Lead Platinum Partners receive prominent recognition
              alongside the Foundation's flagship environmental
              competitions that inspire awareness, creativity and
              responsible citizenship among students.
            </p>

          </div>

          <div className="grid lg:grid-cols-2 gap-8">
                        {/* Quiz Competition */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-lg p-8"
            >
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-6">
                <GraduationCap
                  className="text-primary-600"
                  size={30}
                />
              </div>

              <h3 className="text-2xl font-bold mb-5">
                Swadhyay National Environmental Quiz Competition
              </h3>

              <p className="text-gray-700 leading-8">
                {sponsor.quizSupport}
              </p>

            </motion.div>

            {/* Painting Competition */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-lg p-8"
            >
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-6">
                <Palette
                  className="text-orange-600"
                  size={30}
                />
              </div>

              <h3 className="text-2xl font-bold mb-5">
                Swadhyay National Environmental Painting Competition
              </h3>

              <p className="text-gray-700 leading-8">
                {sponsor.paintingSupport}
              </p>

            </motion.div>

          </div>

        </div>

      </section>

      {/* DIGITAL RECOGNITION */}

      <section className="pb-20">

        <div className="max-w-6xl mx-auto px-6">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-lg p-10"
          >

            <div className="flex items-center gap-3 mb-8">

              <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
                <Globe
                  className="text-primary-600"
                  size={28}
                />
              </div>

              <div>

                <h2 className="text-3xl font-bold">
                  Digital Recognition
                </h2>

                <p className="text-gray-500">
                  Premium visibility across the Foundation's
                  digital ecosystem.
                </p>

              </div>

            </div>

            <div className="grid md:grid-cols-2 gap-5">

              {[
                "Featured on the Homepage as Official Lead Platinum Partner",
                "Dedicated Partner Profile Page",
                "Floating Sponsor Recognition Widget",
                "Recognition on National Competition Pages",
                "Website-wide Partner Visibility",
                "Digital acknowledgement on campaign initiatives",
                "Professional brand integration across Foundation platforms",
                "Opportunity for future campaign collaborations"
              ].map((item, index) => (

                <div
                  key={index}
                  className="flex items-start gap-3 bg-gray-50 rounded-xl p-4"
                >

                  <div className="w-3 h-3 rounded-full bg-primary-600 mt-2" />

                  <p className="text-gray-700">
                    {item}
                  </p>

                </div>

              ))}

            </div>

          </motion.div>

        </div>

      </section>

      {/* APPRECIATION */}

      <section className="py-20 bg-gradient-to-r from-primary-600 to-saffron-600 text-white">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <Award
            size={48}
            className="mx-auto mb-6 text-yellow-300"
          />

          <h2 className="text-4xl font-bold mb-8">
            Our Appreciation
          </h2>

          <p className="text-xl leading-9 text-blue-100">
            {sponsor.appreciation}
          </p>

          <p className="mt-10 text-lg text-blue-100 max-w-3xl mx-auto leading-8">
            Swadhyay Seva Foundation values long-term partnerships
            with organisations that believe in environmental
            sustainability, youth empowerment, education and
            community development. Together, we can inspire
            meaningful change and create a healthier future for
            generations to come.
          </p>

        </div>

      </section>

      {/* DEMONSTRATION NOTICE */}

      <section className="py-16">

        <div className="max-w-6xl mx-auto px-6">

          <div className="bg-yellow-50 border border-yellow-300 rounded-3xl p-8">

            <h3 className="text-2xl font-bold text-yellow-900 mb-4">
              Demonstration Notice
            </h3>

            <p className="text-yellow-800 leading-8">
              {sponsor.disclaimer}
            </p>

          </div>

        </div>

      </section>

    </div>
  );
};

export default SponsorPartnerPage;