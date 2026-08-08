import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  PlayCircle,
  Sparkles,
} from "lucide-react";

export default function HeroButtons() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0.7,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="mt-12 flex flex-wrap gap-4"
    >
      {/* Primary CTA */}
      <motion.a
        href="#booking"
        whileHover={{
          y: -3,
          scale: 1.015,
        }}
        whileTap={{
          scale: 0.985,
        }}
        className="group relative inline-flex overflow-hidden rounded-2xl"
      >
        <motion.div
          animate={{
            backgroundPosition: [
              "0% 50%",
              "100% 50%",
              "0% 50%",
            ],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "linear",
          }}
          className="
          relative
          flex
          items-center
          gap-2.5
          rounded-2xl
          bg-[linear-gradient(90deg,#22d3ee,#3b82f6,#8b5cf6,#22d3ee)]
          bg-[length:240%_240%]
          px-7
          py-4
          text-sm
          font-bold
          text-white
          shadow-[0_18px_60px_rgba(59,130,246,0.34)]
          "
        >
          {/* subtle shine */}
          <span
            aria-hidden="true"
            className="
            absolute
            inset-y-[-30%]
            left-[-25%]
            w-[22%]
            rotate-[14deg]
            bg-white/25
            blur-md
            transition-all
            duration-700
            group-hover:left-[120%]
            "
          />

          {/* glow edge */}
          <span
            aria-hidden="true"
            className="
            absolute
            inset-0
            rounded-2xl
            ring-1
            ring-inset
            ring-white/20
            "
          />

          <CalendarDays
            size={18}
            className="relative z-10"
          />

          <span className="relative z-10">
            Book a Consultation
          </span>

          <motion.span
            animate={{
              x: [0, 3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative z-10"
          >
            <ArrowRight size={17} />
          </motion.span>
        </motion.div>
      </motion.a>

      {/* Secondary CTA */}
      <motion.a
        href="/ai"
        whileHover={{
          y: -3,
          scale: 1.01,
        }}
        whileTap={{
          scale: 0.985,
        }}
        className="
        group
        relative
        inline-flex
        items-center
        gap-2.5
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-white/[0.04]
        px-7
        py-4
        text-sm
        font-semibold
        text-white
        shadow-[0_14px_45px_rgba(0,0,0,0.22)]
        backdrop-blur-xl
        transition
        hover:border-cyan-300/20
        hover:bg-white/[0.065]
        "
      >
        <motion.span
          aria-hidden="true"
          animate={{
            opacity: [0.15, 0.45, 0.15],
            scale: [0.95, 1.08, 0.95],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
          absolute
          left-[-2rem]
          top-[-2rem]
          h-20
          w-20
          rounded-full
          bg-cyan-400/15
          blur-3xl
          "
        />

        <PlayCircle
          size={18}
          className="relative z-10 text-cyan-300"
        />

        <span className="relative z-10">
          Explore AEMA AI
        </span>

        <ArrowRight
          size={17}
          className="
          relative
          z-10
          text-slate-400
          transition
          group-hover:translate-x-1
          group-hover:text-white
          "
        />
      </motion.a>

      {/* Tertiary action */}
      <motion.a
        href="#products"
        whileHover={{
          y: -2,
        }}
        className="
        group
        inline-flex
        items-center
        gap-2
        rounded-2xl
        px-4
        py-4
        text-sm
        font-medium
        text-slate-400
        transition
        hover:text-white
        "
      >
        <Sparkles
          size={16}
          className="
          text-violet-300
          transition
          group-hover:rotate-6
          "
        />

        View Products

        <ArrowRight
          size={15}
          className="
          transition
          group-hover:translate-x-1
          "
        />
      </motion.a>
    </motion.div>
  );
}