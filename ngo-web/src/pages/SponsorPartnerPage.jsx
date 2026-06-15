import { ExternalLink, Award, Leaf, GraduationCap, Palette } from "lucide-react";

const SponsorPartnerPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-saffron-600 text-white py-24">

        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative max-w-6xl mx-auto px-6">

          <div className="text-center">

            <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-5 py-2 rounded-full font-bold text-sm shadow-lg">
              <Award size={18} />
              Official Lead Platinum Partner
            </div>

            <img
              src="/images/sponsors/galaxy.png"
              alt="Galaxy Basmati Rice"
              className="h-40 md:h-52 mx-auto mt-8 object-contain"
            />

            <h1 className="text-4xl md:text-6xl font-bold mt-6">
              Galaxy Basmati Rice
            </h1>

            <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Proudly supporting environmental education,
              youth awareness, sustainability initiatives,
              and community development through a strategic
              partnership with Swadhyay Seva Foundation.
            </p>

            <a
              href="https://www.goelrice.net/our-profile.php"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-white text-primary-700 rounded-xl font-semibold hover:scale-105 transition"
            >
              Visit Official Website
              <ExternalLink size={18} />
            </a>

          </div>

        </div>
      </section>

      {/* ABOUT PARTNER */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">

          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              About Our Partner
            </h2>

            <div className="space-y-6 text-gray-700 text-lg leading-8">

              <p>
                Galaxy Basmati Rice, a distinguished brand under the
                House of Goel, has established itself as a trusted
                name in the rice industry through its commitment to
                quality, excellence, and customer satisfaction.
              </p>

              <p>
                With a strong focus on delivering premium-quality
                basmati rice, the company has earned recognition for
                maintaining high standards of purity, consistency,
                and reliability while serving customers across
                diverse markets.
              </p>

              <p>
                Beyond business excellence, Galaxy Basmati Rice
                believes in contributing to meaningful social
                initiatives that create long-term value for society.
                The organization recognizes the importance of
                environmental responsibility, educational awareness,
                and community participation in building a sustainable
                future for the nation.
              </p>

              <p>
                Through its association with Swadhyay Seva Foundation,
                Galaxy Basmati Rice extends its support to programs
                that encourage environmental consciousness, youth
                engagement, and value-based learning among students
                across India.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* PARTNERSHIP SECTION */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-6">

          <div className="grid md:grid-cols-2 gap-10">

            <div className="bg-white rounded-3xl shadow-lg p-8">

              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <Leaf className="text-green-600" size={30} />
              </div>

              <h3 className="text-2xl font-bold mb-5">
                Partnership with Swadhyay Seva Foundation
              </h3>

              <p className="text-gray-700 leading-8">
                As the Official Lead Platinum Partner of Swadhyay
                Seva Foundation, Galaxy Basmati Rice plays an
                important role in supporting initiatives that promote
                environmental awareness, holistic wellness,
                sustainability, and community engagement.
              </p>

              <p className="text-gray-700 leading-8 mt-4">
                This partnership reflects a shared vision of creating
                positive social impact through education, awareness,
                and active participation in nation-building
                initiatives that benefit future generations.
              </p>

            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8">

              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <GraduationCap className="text-blue-600" size={30} />
              </div>

              <h3 className="text-2xl font-bold mb-5">
                Investing in Future Generations
              </h3>

              <p className="text-gray-700 leading-8">
                By supporting educational and environmental
                initiatives, Galaxy Basmati Rice contributes toward
                nurturing responsible citizens who understand the
                importance of sustainability, environmental
                conservation, and community responsibility.
              </p>

              <p className="text-gray-700 leading-8 mt-4">
                Together, the Foundation and its Lead Platinum
                Partner strive to create opportunities for students
                to learn, engage, and contribute meaningfully toward
                a greener and healthier future.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* COMPETITIONS SUPPORT */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-14">

            <h2 className="text-4xl font-bold text-gray-900 mb-5">
              Supporting National Environmental Competitions
            </h2>

            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Galaxy Basmati Rice proudly supports the Foundation's
              flagship educational initiatives that inspire
              environmental awareness, creativity, and responsible
              citizenship among students.
            </p>

          </div>

          <div className="grid md:grid-cols-2 gap-10">

            {/* QUIZ */}

            <div className="bg-white rounded-3xl shadow-lg p-8">

              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-6">
                <GraduationCap className="text-primary-600" size={30} />
              </div>

              <h3 className="text-2xl font-bold mb-5">
                Swadhyay National Environmental Quiz Competition
              </h3>

              <p className="text-gray-700 leading-8">
                The National Environmental Quiz Competition encourages
                students to explore important environmental topics,
                develop awareness about sustainability challenges,
                and strengthen their knowledge through meaningful
                participation.
              </p>

              <p className="text-gray-700 leading-8 mt-4">
                Through its support, Galaxy Basmati Rice helps create
                opportunities for students to learn, compete, and
                engage with environmental issues that will shape the
                future of our communities and our planet.
              </p>

            </div>

            {/* PAINTING */}

            <div className="bg-white rounded-3xl shadow-lg p-8">

              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-6">
                <Palette className="text-orange-600" size={30} />
              </div>

              <h3 className="text-2xl font-bold mb-5">
                Swadhyay National Environmental Painting Competition
              </h3>

              <p className="text-gray-700 leading-8">
                The National Environmental Painting Competition
                provides a creative platform for students to express
                their ideas and perspectives on environmental
                conservation, sustainability, and responsible living.
              </p>

              <p className="text-gray-700 leading-8 mt-4">
                The support of Galaxy Basmati Rice helps encourage
                creativity, innovation, and environmental awareness
                among young participants while promoting positive
                action through artistic expression.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* APPRECIATION SECTION */}

      <section className="py-20 bg-gradient-to-r from-primary-600 to-saffron-600 text-white">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold mb-8">
            Our Appreciation
          </h2>

          <p className="text-xl leading-9 text-blue-100">
            Swadhyay Seva Foundation expresses its sincere gratitude
            to Galaxy Basmati Rice for supporting initiatives that
            promote environmental education, creativity, awareness,
            and responsible citizenship among students across India.
          </p>

          <p className="text-xl leading-9 text-blue-100 mt-8">
            Together, we are working towards building a healthier,
            greener, and more sustainable future for generations to
            come.
          </p>

        </div>

      </section>

    </div>
  );
};

export default SponsorPartnerPage;