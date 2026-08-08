import { motion } from "framer-motion";
import {
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import HeroButtons from "./HeroButtons";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 26,
    filter: "blur(8px)",
  },

  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
};

const capabilities = [
  "AI Automation",
  "Business Systems",
  "Enterprise Software",
  "Digital Platforms",
  "Compliance",
  "Growth",
];

export default function HeroContent() {
  return (
    <motion.div
      variants={{
        hidden: {},

        visible: {
          transition: {
            staggerChildren: 0.12,
          },
        },
      }}
      initial="hidden"
      animate="visible"
      className="relative z-20 max-w-2xl"
    >
      {/* Brand badge */}
      <motion.div
        variants={fadeUp}
        className="
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          border-cyan-400/20
          bg-cyan-400/10
          px-4
          py-2
          backdrop-blur-xl
        "
      >
        <Sparkles
          size={14}
          className="text-cyan-300"
        />

        <span
          className="
            text-[10px]
            font-bold
            uppercase
            tracking-[0.2em]
            text-cyan-300
          "
        >
          Building intelligent systems for modern organizations
        </span>
      </motion.div>

      {/* Hero headline */}
      <motion.h1
        variants={fadeUp}
        className="
          hero-heading
          mt-7
          text-[4rem]
          font-semibold
          leading-[0.86]
          tracking-[-0.075em]
          text-white
          sm:text-[4.7rem]
          lg:text-[5.6rem]
          xl:text-[6rem]
        "
      >
        <span className="block">
          From ideas
        </span>

        <motion.span
          animate={{
            backgroundPosition: [
              "0% 50%",
              "100% 50%",
              "0% 50%",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          className="
            mt-1
            block
            bg-[linear-gradient(90deg,#6ee7b7,#67e8f9,#93c5fd,#c4b5fd,#6ee7b7)]
            bg-[length:250%_250%]
            bg-clip-text
            text-transparent
          "
        >
          to intelligent
        </motion.span>

        <span className="block">
          systems.
        </span>
      </motion.h1>

      {/* Supporting copy */}
      <motion.p
        variants={fadeUp}
        className="
          mt-7
          max-w-xl
          text-base
          leading-8
          text-slate-400
          sm:text-lg
          sm:leading-9
        "
      >
        AEMA Systems transforms ideas into intelligent software,
        AI automation, business systems, and digital platforms
        that help organizations operate smarter, scale faster,
        and grow with confidence.
      </motion.p>

      {/* Premium CTA group */}
      <motion.div variants={fadeUp}>
        <HeroButtons />
      </motion.div>

      {/* Capability pills */}
      <motion.div
        variants={fadeUp}
        className="
          mt-10
          flex
          flex-wrap
          gap-2.5
        "
      >
        {capabilities.map(
          (capability) => (
            <motion.div
              key={capability}
              whileHover={{
                y: -3,
                scale: 1.015,
              }}
              transition={{
                duration: 0.2,
              }}
              className="
                hero-pill
                flex
                items-center
                gap-2
                rounded-full
                border
                border-white/10
                bg-white/[0.03]
                px-3.5
                py-2
                text-xs
                text-slate-300
                backdrop-blur-xl
              "
            >
              <CheckCircle2
                size={14}
                className="text-emerald-400"
              />

              {capability}
            </motion.div>
          )
        )}
      </motion.div>

      {/* Capability summary */}
      <motion.div
        variants={fadeUp}
        className="
          mt-10
          grid
          max-w-xl
          grid-cols-3
          gap-3
        "
      >
        {[
          {
            top: "AI",
            bottom: "Automation",
          },

          {
            top: "Enterprise",
            bottom: "Software",
          },

          {
            top: "Business",
            bottom: "Systems",
          },
        ].map(
          (item) => (
            <motion.div
              key={item.bottom}
              whileHover={{
                y: -4,
              }}
              transition={{
                duration: 0.2,
              }}
              className="
                rounded-2xl
                border
                border-white/10
                bg-white/[0.025]
                px-4
                py-4
                backdrop-blur-xl
                transition
                hover:border-cyan-400/20
                hover:bg-white/[0.045]
              "
            >
              <p
                className="
                  text-base
                  font-semibold
                  tracking-[-0.03em]
                  text-white
                  sm:text-lg
                "
              >
                {item.top}
              </p>

              <p
                className="
                  mt-1
                  text-[9px]
                  uppercase
                  tracking-[0.12em]
                  text-slate-500
                  sm:text-[10px]
                "
              >
                {item.bottom}
              </p>
            </motion.div>
          )
        )}
      </motion.div>
    </motion.div>
  );
}