import { motion } from "framer-motion";
import WaveLines from "./WaveLines";

const particles = Array.from({
  length: 18,
});

export default function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Deep background */}
      <div className="absolute inset-0 bg-[#020611]" />

      {/* Premium grid */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize:
            "82px 82px",
          maskImage:
            "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.8) 55%, transparent 100%)",
        }}
      />

      {/* Top blue atmosphere */}
      <motion.div
        animate={{
          x: ["-50%", "-46%", "-50%"],
          y: [0, 34, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-[-22rem] h-[62rem] w-[62rem] -translate-x-1/2 rounded-full bg-blue-500/[0.13] blur-[220px]"
      />

      {/* Emerald atmosphere */}
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 22, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[-16rem] top-[16rem] h-[40rem] w-[40rem] rounded-full bg-emerald-400/[0.075] blur-[190px]"
      />

      {/* Violet atmosphere */}
      <motion.div
        animate={{
          x: [0, 38, 0],
          y: [0, -24, 0],
          scale: [1, 1.06, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[-18rem] top-[22rem] h-[38rem] w-[38rem] rounded-full bg-violet-500/[0.065] blur-[185px]"
      />

      {/* Thin cyan center light */}
      <motion.div
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scaleX: [0.8, 1.05, 0.8],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-[42%] h-px w-[68%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent blur-sm"
      />

      {/* LEFT WAVE */}
      <WaveLines
        className="absolute left-[-22rem] top-[10rem] hidden w-[70rem] opacity-[0.34] lg:block"
      />

      {/* RIGHT WAVE */}
      <WaveLines
        reverse
        className="absolute bottom-[-13rem] right-[-23rem] hidden w-[72rem] opacity-[0.3] lg:block"
      />

      {/* Center haze to keep text readable */}
      <div
        className="absolute inset-y-0 left-1/2 w-[58%] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(circle at center, rgba(2,6,17,0.82) 0%, rgba(2,6,17,0.55) 32%, rgba(2,6,17,0) 72%)",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {particles.map(
          (_, index) => (
            <motion.span
              key={index}
              className="absolute h-[2px] w-[2px] rounded-full bg-cyan-200/50 shadow-[0_0_10px_rgba(103,232,249,0.8)]"
              style={{
                left:
                  `${8 + ((index * 17) % 84)}%`,
                top:
                  `${10 + ((index * 23) % 76)}%`,
              }}
              animate={{
                opacity: [
                  0.12,
                  0.75,
                  0.12,
                ],
                y: [
                  0,
                  -12,
                  0,
                ],
                scale: [
                  0.8,
                  1.4,
                  0.8,
                ],
              }}
              transition={{
                duration:
                  4 +
                  (index % 5),
                delay:
                  index * 0.18,
                repeat:
                  Infinity,
                ease:
                  "easeInOut",
              }}
            />
          )
        )}
      </div>

      {/* Bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#020611] via-[#020611]/75 to-transparent" />

      {/* Edge vignette */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow:
            "inset 0 0 180px 35px rgba(2,6,17,0.72)",
        }}
      />
    </div>
  );
}