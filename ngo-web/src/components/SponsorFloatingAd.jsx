import { useState, useEffect } from "react";
import {
  Award,
  ChevronUp,
  ChevronDown,
  X,
  ExternalLink,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import sponsor from "../data/sponsorDemo";

const SponsorFloatingAd = () => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const expiry = localStorage.getItem(
      "sponsor-demo-dismissed"
    );

    if (
      expiry &&
      Date.now() < Number(expiry)
    ) {
      return;
    }

    const timer = setTimeout(() => {
      setVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!expanded) return;

    const timer = setTimeout(() => {
      setExpanded(false);
    }, 12000);

    return () => clearTimeout(timer);
  }, [expanded]);

  const dismiss = () => {
    const expiry =
      Date.now() +
      24 * 60 * 60 * 1000;

    localStorage.setItem(
      "sponsor-demo-dismissed",
      expiry.toString()
    );

    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="
      fixed
      bottom-6
      left-6
      z-[999]
      max-w-[calc(100vw-32px)]
    "
    >
      {/* Expanded Card */}

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            transition={{
              duration: 0.25,
            }}
            className="
            absolute
            bottom-20
            left-0
            w-[360px]
            max-w-[90vw]
            bg-white
            rounded-3xl
            overflow-hidden
            shadow-2xl
            border
            border-gray-200
          "
          >
            {/* Header */}

            <div
              className="
              bg-gradient-to-r
              from-yellow-500
              via-orange-500
              to-orange-600
              text-white
              px-5
              py-3
              flex
              items-center
              justify-between
            "
            >
              <div className="font-bold text-sm">
                {sponsor.tier}
              </div>

              <button
                onClick={dismiss}
                className="hover:opacity-80"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}

            <div className="p-6">

              <img
                src={sponsor.logo}
                alt={sponsor.company}
                className="
                  h-24
                  mx-auto
                  object-contain
                "
              />

              <h3
                className="
                  text-xl
                  font-bold
                  text-center
                  mt-4
                "
              >
                {sponsor.company}
              </h3>

              <p
                className="
                  text-primary-700
                  text-center
                  font-medium
                  mt-2
                "
              >
                {sponsor.tagline}
              </p>

              <p
                className="
                  text-gray-600
                  text-sm
                  text-center
                  mt-4
                  leading-relaxed
                "
              >
                {sponsor.description}
              </p>

              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                  mt-6
                "
              >
                <Link
                  to="/our-sponsors"
                  onClick={() =>
                    setExpanded(false)
                  }
                  className="
                    py-3
                    rounded-xl
                    bg-primary-600
                    hover:bg-primary-700
                    transition
                    text-white
                    text-center
                    font-semibold
                  "
                >
                  Learn More
                </Link>

                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    py-3
                    rounded-xl
                    border
                    border-gray-300
                    hover:bg-gray-50
                    transition
                    font-semibold
                  "
                >
                  Website

                  <ExternalLink size={16} />
                </a>
              </div>

              <div
                className="
                  mt-6
                  text-xs
                  text-center
                  text-gray-400
                  border-t
                  pt-4
                "
              >
                Demonstration Sponsor Preview
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Badge */}

      <motion.button
        animate={{
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
        whileHover={{
          scale: 1.04,
        }}
        whileTap={{
          scale: 0.98,
        }}
        onClick={() =>
          setExpanded(!expanded)
        }
        className="
          flex
          items-center
          gap-3
          bg-white
          px-5
          py-3
          rounded-full
          shadow-xl
          border
          border-gray-200
          hover:shadow-2xl
          transition-all
        "
      >
        <div
          className="
            w-10
            h-10
            rounded-full
            bg-gradient-to-r
            from-yellow-500
            to-orange-500
            flex
            items-center
            justify-center
            text-white
          "
        >
          <Award size={18} />
        </div>

        <div className="text-left">

          <div
            className="
              text-xs
              text-gray-500
            "
          >
            {sponsor.tier}
          </div>

          <div
            className="
              font-bold
              text-sm
              text-gray-900
            "
          >
            {sponsor.shortName}
          </div>

        </div>

        {expanded ? (
          <ChevronDown size={18} />
        ) : (
          <ChevronUp size={18} />
        )}
      </motion.button>
    </div>
  );
};

export default SponsorFloatingAd;