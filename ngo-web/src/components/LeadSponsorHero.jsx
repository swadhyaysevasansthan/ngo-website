import { motion } from "framer-motion";
import { ExternalLink, Award } from "lucide-react";
import sponsor from "../data/sponsorDemo";

const LeadSponsorHero = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.8 }}
      className="mt-12 max-w-5xl mx-auto"
    >
      <div
        className="
          bg-gradient-to-r
          from-white/10
          to-white/5
          backdrop-blur-xl
          border
          border-white/20
          rounded-3xl
          shadow-2xl
          overflow-hidden
        "
      >
        <div className="grid md:grid-cols-[220px_1fr] items-center">

          {/* Logo */}

          <div
            className="
              flex
              justify-center
              items-center
              p-8
              bg-white/5
            "
          >
            <a
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={sponsor.logo}
                alt={sponsor.company}
                className="
                  h-24
                  md:h-28
                  object-contain
                  hover:scale-105
                  transition
                "
              />
            </a>
          </div>

          {/* Content */}

          <div className="p-8">

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                bg-yellow-400
                text-black
                text-sm
                font-bold
                shadow
              "
            >
              <Award size={16} />

              {sponsor.tier}
            </div>

            <h2
              className="
                text-3xl
                md:text-4xl
                font-bold
                text-white
                mt-5
              "
            >
              {sponsor.company}
            </h2>

            <p
              className="
                text-yellow-300
                font-semibold
                mt-2
                text-lg
              "
            >
              {sponsor.tagline}
            </p>

            <p
              className="
                text-blue-100
                text-lg
                leading-relaxed
                mt-5
                max-w-3xl
              "
            >
              {sponsor.description}
            </p>

            <div
              className="
                flex
                flex-wrap
                gap-4
                mt-8
              "
            >
              <a
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-6
                  py-3
                  rounded-xl
                  bg-white
                  text-primary-700
                  font-semibold
                  hover:scale-105
                  transition
                "
              >
                Visit Website

                <ExternalLink size={18} />
              </a>

              <a
                href="/our-sponsors"
                className="
                  inline-flex
                  items-center
                  px-6
                  py-3
                  rounded-xl
                  border
                  border-white/30
                  text-white
                  font-semibold
                  hover:bg-white/10
                  transition
                "
              >
                Partnership Details
              </a>

            </div>

          </div>

        </div>

        {/* Bottom Strip */}

        <div
          className="
            border-t
            border-white/10
            bg-black/10
            px-8
            py-4
            text-center
            text-sm
            text-blue-100
          "
        >
          Demonstration Preview • Sponsor branding shown is for presentation
          purposes only and does not indicate an active partnership.
        </div>

      </div>
    </motion.div>
  );
};

export default LeadSponsorHero;