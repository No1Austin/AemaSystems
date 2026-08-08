import {
  useEffect,
  useState,
} from "react";
import { motion } from "framer-motion";

import HeroBackground from "./HeroBackground";
import HeroDashboard from "./HeroDashboard";
import FloatingBadges from "./FloatingBadges";
import HeroContent from "./HeroContent";

import "./hero.css";

const premiumEase = [
  0.22,
  1,
  0.36,
  1,
];

export default function Hero() {
  const [isMobile, setIsMobile] =
    useState(false);

  useEffect(() => {
    const mediaQuery =
      window.matchMedia(
        "(max-width: 1023px)"
      );

    const updateMobile =
      () => {
        setIsMobile(
          mediaQuery.matches
        );
      };

    updateMobile();

    mediaQuery.addEventListener(
      "change",
      updateMobile
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        updateMobile
      );
    };
  }, []);

  return (
    <section
      id="home"
      className="
        hero
        relative
        isolate
        min-h-screen
        overflow-hidden
        bg-[#020611]
        px-4
        pb-14
        pt-24
        text-white

        sm:px-6
        sm:pb-16
        sm:pt-28

        md:pb-20
        md:pt-32

        lg:px-5
        lg:pb-16
        lg:pt-40
      "
    >
      {/* Background atmosphere */}
      <HeroBackground />

      {/* Soft cinematic light sweep */}
      <div
        aria-hidden="true"
        className="hero-light-sweep"
      />

      {/* Main hero shell */}
      <div
        className="
          hero-container
          relative
          z-10
          mx-auto
          w-full

          max-w-[430px]

          sm:max-w-[620px]
          md:max-w-[760px]

          lg:max-w-[1380px]
        "
      >
        <div
          className="
            hero-grid
            grid
            items-center

            gap-12

            sm:gap-14

            lg:min-h-[650px]
            lg:grid-cols-[0.9fr_1.1fr]
            lg:gap-16

            xl:gap-20
          "
        >
          {/* =========================
              LEFT — AEMA BRAND STORY
             ========================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: isMobile
                ? 22
                : 34,
              filter:
                isMobile
                  ? "blur(5px)"
                  : "blur(10px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter:
                "blur(0px)",
            }}
            transition={{
              duration:
                isMobile
                  ? 0.7
                  : 0.9,
              ease:
                premiumEase,
            }}
            className="
              relative
              z-20
              min-w-0
              text-center

              lg:text-left
            "
          >
            {/* Mobile width controller */}
            <div
              className="
                mx-auto
                w-full
                max-w-[390px]

                sm:max-w-[560px]
                md:max-w-[620px]

                lg:mx-0
                lg:max-w-none
              "
            >
              <HeroContent />
            </div>
          </motion.div>

          {/* =========================
              RIGHT — COMMAND CENTER
             ========================= */}

          <motion.div
            initial={{
              opacity: 0,

              x: isMobile
                ? 0
                : 94,

              y: isMobile
                ? 34
                : 54,

              rotateX:
                isMobile
                  ? 0
                  : 16,

              rotateY:
                isMobile
                  ? 0
                  : -6,

              scale:
                isMobile
                  ? 0.96
                  : 0.88,

              filter:
                isMobile
                  ? "blur(7px)"
                  : "blur(14px)",
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
              rotateX: 0,
              rotateY: 0,
              scale: 1,
              filter:
                "blur(0px)",
            }}
            transition={{
              opacity: {
                duration:
                  isMobile
                    ? 0.55
                    : 0.7,
                delay:
                  isMobile
                    ? 0.15
                    : 0.22,
              },

              x: {
                duration:
                  isMobile
                    ? 0.7
                    : 1,
                delay: 0.18,
                ease:
                  premiumEase,
              },

              y: {
                duration:
                  isMobile
                    ? 0.75
                    : 1,
                delay: 0.18,
                ease:
                  premiumEase,
              },

              rotateX: {
                duration: 1,
                delay: 0.18,
                ease:
                  premiumEase,
              },

              rotateY: {
                duration: 1,
                delay: 0.18,
                ease:
                  premiumEase,
              },

              scale: {
                duration:
                  isMobile
                    ? 0.75
                    : 1,
                delay: 0.18,
                ease:
                  premiumEase,
              },

              filter: {
                duration:
                  isMobile
                    ? 0.6
                    : 0.8,
                delay: 0.18,
              },
            }}
            style={{
              transformPerspective:
                1450,
            }}
            className="
              relative
              z-20
              flex
              min-w-0
              justify-center

              lg:justify-end
            "
          >
            {/* Dashboard stage */}
            <div
              className="
                relative
                w-full

                max-w-[350px]

                sm:max-w-[460px]
                md:max-w-[540px]

                lg:max-w-[690px]
              "
            >
              {/* Rear atmospheric glow */}
              <motion.div
                aria-hidden="true"
                animate={{
                  opacity: [
                    0.25,
                    0.6,
                    0.25,
                  ],

                  scale: [
                    0.95,
                    1.05,
                    0.95,
                  ],
                }}
                transition={{
                  duration: 7.5,
                  repeat:
                    Infinity,
                  ease:
                    "easeInOut",
                }}
                className="
                  absolute
                  inset-[9%]

                  rounded-[2rem]

                  bg-gradient-to-br
                  from-blue-500/10
                  via-cyan-400/10
                  to-emerald-400/10

                  blur-[50px]

                  sm:blur-[60px]

                  lg:inset-[7%]
                  lg:rounded-[3.25rem]
                  lg:blur-[78px]
                "
              />

              {/* Secondary violet glow */}
              <motion.div
                aria-hidden="true"
                animate={{
                  opacity: [
                    0.12,
                    0.32,
                    0.12,
                  ],

                  x: [
                    0,
                    16,
                    0,
                  ],

                  y: [
                    0,
                    -10,
                    0,
                  ],
                }}
                transition={{
                  duration: 9,
                  repeat:
                    Infinity,
                  ease:
                    "easeInOut",
                }}
                className="
                  absolute
                  right-[5%]
                  top-[10%]

                  h-24
                  w-24

                  rounded-full

                  bg-violet-400/10
                  blur-[60px]

                  lg:h-40
                  lg:w-40
                  lg:blur-[90px]
                "
              />

              {/* Floor light */}
              <motion.div
                aria-hidden="true"
                animate={{
                  opacity: [
                    0.2,
                    0.52,
                    0.2,
                  ],

                  scaleX: [
                    0.84,
                    1,
                    0.84,
                  ],
                }}
                transition={{
                  duration: 6.2,
                  repeat:
                    Infinity,
                  ease:
                    "easeInOut",
                }}
                className="
                  hero-dashboard-floor

                  absolute
                  -bottom-5
                  left-[15%]
                  right-[15%]

                  h-12
                  origin-center

                  rounded-[100%]
                  bg-cyan-400/10
                  blur-2xl

                  lg:-bottom-8
                  lg:left-[12%]
                  lg:right-[12%]
                  lg:h-20
                  lg:blur-3xl
                "
              />

              {/* Dashboard */}
              <div
                className="
                  relative
                  z-20

                  lg:hero-dashboard-float
                  lg:hero-border-glow
                "
              >
                <HeroDashboard />
              </div>

              {/* Floating badges

                  IMPORTANT:
                  Hidden on phones + tablets.

                  Desktop stays exactly
                  as before.
              */}
              <div className="hidden xl:block">
                <FloatingBadges />
              </div>
            </div>
          </motion.div>
        </div>

        {/* =========================
            BOTTOM DIVIDER
           ========================= */}

        <motion.div
          initial={{
            opacity: 0,
            scaleX: 0.72,
          }}
          animate={{
            opacity: 1,
            scaleX: 1,
          }}
          transition={{
            duration: 1.1,
            delay: 1.05,
            ease:
              premiumEase,
          }}
          className="
            mx-auto

            mt-8

            h-px
            w-[74%]

            origin-center

            bg-gradient-to-r
            from-transparent
            via-white/10
            to-transparent

            sm:w-[80%]

            lg:mt-10
            lg:w-[86%]
          "
        />

        {/* =========================
            BRAND POSITIONING
           ========================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.18,
            duration: 0.55,
            ease:
              premiumEase,
          }}
          className="
            mx-auto
            mt-4

            flex
            max-w-[340px]
            flex-wrap
            items-center
            justify-center

            gap-x-2
            gap-y-2

            text-center
            text-[8px]
            font-semibold
            uppercase

            tracking-[0.14em]

            text-slate-600

            sm:max-w-xl
            sm:gap-x-3
            sm:text-[9px]
            sm:tracking-[0.18em]

            lg:mt-5
            lg:max-w-3xl
            lg:text-[10px]
            lg:tracking-[0.2em]
          "
        >
          <span>
            Strategy
          </span>

          <span className="text-slate-800">
            •
          </span>

          <span>
            Automation
          </span>

          <span className="text-slate-800">
            •
          </span>

          <span>
            Software
          </span>

          <span className="text-slate-800">
            •
          </span>

          <span>
            Governance
          </span>

          <span className="text-slate-800">
            •
          </span>

          <span>
            Growth
          </span>
        </motion.div>
      </div>
    </section>
  );
}