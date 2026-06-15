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

const SponsorFloatingAd = () => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const expiry = localStorage.getItem(
      "galaxy-sponsor-dismissed"
    );

    if (
      expiry &&
      Date.now() < Number(expiry)
    ) {
      return;
    }

    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);

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
      "galaxy-sponsor-dismissed",
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
              w-[340px]
              max-w-[90vw]
              bg-white
              rounded-3xl
              overflow-hidden
              shadow-2xl
              border
              border-gray-200
            "
          >
            <div
              className="
                bg-gradient-to-r
                from-yellow-500
                to-orange-500
                px-5
                py-3
                text-white
                flex
                justify-between
                items-center
              "
            >
              <span className="font-bold text-sm">
                Official Lead Platinum Partner
              </span>

              <button
                onClick={dismiss}
                className="hover:opacity-80"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">

              <img
                src="/images/sponsors/galaxy.png"
                alt="Galaxy Basmati Rice"
                className="
                  h-24
                  object-contain
                  mx-auto
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
                Galaxy Basmati Rice
              </h3>

              <p
                className="
                  text-gray-600
                  text-sm
                  text-center
                  mt-3
                  leading-relaxed
                "
              >
                Proudly supporting environmental
                education, sustainability,
                community engagement and the
                Swadhyay National Environmental
                Competitions.
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
                    text-center
                    py-3
                    rounded-xl
                    bg-primary-600
                    text-white
                    font-semibold
                    hover:bg-primary-700
                    transition
                  "
                >
                  Learn More
                </Link>

                <a
                  href="https://www.goelrice.net/our-profile.php"
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
                    font-semibold
                    hover:bg-gray-50
                    transition
                  "
                >
                  Website
                  <ExternalLink size={16} />
                </a>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed Sponsor Badge */}

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
            Official Lead Platinum Partner
          </div>

          <div
            className="
              font-bold
              text-sm
              text-gray-900
            "
          >
            Galaxy Basmati Rice
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