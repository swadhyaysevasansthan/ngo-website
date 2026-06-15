import { motion } from "framer-motion";
import { ExternalLink, Award } from "lucide-react";

const LeadSponsorHero = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="mt-14 max-w-4xl mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-8 py-5 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-6">

          <div className="flex-shrink-0">
            <img
              src="/images/sponsors/galaxy.png"
              alt="Galaxy Basmati Rice"
              className="h-20 md:h-24 object-contain"
            />
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400 text-black text-sm font-bold mb-4">
              <Award size={16} />
              Official Lead Platinum Partner
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Galaxy Basmati Rice
            </h3>

            <p className="text-blue-100 text-lg">
              Proudly supporting environmental education,
              sustainability initiatives and student outreach
              across India.
            </p>

            <a
              href="https://www.goelrice.net/our-profile.php"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 px-5 py-3 rounded-xl bg-white text-primary-700 font-semibold hover:scale-105 transition"
            >
              Visit Partner Website
              <ExternalLink size={18} />
            </a>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default LeadSponsorHero;