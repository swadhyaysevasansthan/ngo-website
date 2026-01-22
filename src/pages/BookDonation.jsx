import React, {useEffect} from 'react';
import { Book, Heart, Library, Sparkles, GraduationCap, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BookDonation = () => {

    useEffect(() => {
      document.title = 'Pustak Daan - Swadhyay Seva Foundation';
    }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Campaign Hero Section */}
      <section className="relative py-20 bg-emerald-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center lg:text-left lg:max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-sm font-bold mb-6 tracking-wide uppercase">
              <Sparkles size={16} />
              Foundation Initiative
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight">
              Pustak Daan – <span className="text-emerald-400">Gyaan Ki Udaan</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium italic mb-8 text-emerald-100">
              "Aapki Kitaab, Unka Kal"
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#how-to-donate" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-full font-bold text-lg shadow-xl transition">
                Donate a Book
              </a>
              <Link to="/" className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full font-bold text-lg border border-white/20 transition">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 underline decoration-emerald-500 underline-offset-8">About the Initiative</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Swadhyay Seva Foundation proudly launches this movement dedicated to spreading the joy of reading 
            and opening doors of opportunity for every child—regardless of their background.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed italic border-l-4 border-emerald-500 pl-6 text-left mx-auto max-w-2xl bg-gray-50 p-6 rounded-r-2xl">
            Books are companions of wisdom, carriers of culture, and gateways to imagination. 
            Just one book can spark curiosity, build confidence, and transform a child’s future.
          </p>
        </div>
      </section>

      {/* Donation Details Grid */}
      <section className="py-20 bg-emerald-50 px-4" id="how-to-donate">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 h-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Book className="text-emerald-600" /> What You Can Donate
              </h3>
              <p className="text-gray-600 mb-6 italic">Contribute books that still hold the power to enlighten growing minds:</p>
              <ul className="space-y-4">
                {[
                  "Storybooks that inspire imagination",
                  "Educational textbooks that strengthen knowledge",
                  "Moral and value-based books that shape character",
                  "Activity and skill-building books that spark creativity",
                  "Any meaningful reading material for children"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-500 mt-1 flex-shrink-0" size={20} />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-600 p-8 rounded-3xl text-white shadow-xl h-full">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Library /> Community Library of Dreams
              </h3>
              <p className="mb-8 leading-relaxed text-emerald-50">
                With collective contributions, we envision creating a vibrant learning space 
                where children can read, explore, wonder, and grow. This is not just a library; 
                it is a <span className="font-bold underline text-white">Gateway to Dreams</span>.
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-white/10 rounded-xl flex items-center gap-4">
                  <Sparkles size={24} className="text-emerald-300" /> <span>Learning becomes joy</span>
                </div>
                <div className="p-4 bg-white/10 rounded-xl flex items-center gap-4">
                  <Heart size={24} className="text-emerald-300" /> <span>Imagination finds wings</span>
                </div>
                <div className="p-4 bg-white/10 rounded-xl flex items-center gap-4">
                  <GraduationCap size={24} className="text-emerald-300" /> <span>Aspirations begin to bloom</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* Action Footer */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Join the Movement</h2>
          <p className="text-gray-600 mb-10 text-lg">
            Let's come together with compassion and purpose. Give children the wings to soar high. 
            Donate a book and shape a life today.
          </p>
          
          <div className="flex justify-center">
            <Link 
              to="/contact" 
              className="group inline-flex items-center gap-3 px-10 py-5 bg-emerald-600 text-white rounded-full font-bold text-xl shadow-xl hover:bg-emerald-700 hover:scale-105 transition-all duration-300"
            >
              Contact Us to Donate
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <p className="mt-16 text-3xl font-extrabold text-emerald-600 italic">
            "Aapki Kitaab, Unka Kal"
          </p>
        </div>
      </section>

    </main>
  );
};

export default BookDonation;
