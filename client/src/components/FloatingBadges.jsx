import { motion } from "framer-motion";
import {
  Bot,
  BrainCircuit,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

const badges = [
  {
    title: "AI Automation",
    subtitle: "AEMA AI",
    Icon: Bot,
    tone:
      "border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-300",
    position:
      "left-[-4%] top-[12%]",
    delay: 0.3,
  },
  {
    title: "Business Systems",
    subtitle: "TaskFlow",
    Icon: Workflow,
    tone:
      "border-blue-400/20 bg-blue-400/[0.08] text-blue-300",
    position:
      "right-[-3%] top-[26%]",
    delay: 0.55,
  },
  {
    title: "Compliance Ready",
    subtitle: "Compliance OS",
    Icon: ShieldCheck,
    tone:
      "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300",
    position:
      "left-[-5%] bottom-[24%]",
    delay: 0.8,
  },
  {
    title: "Growth Intelligence",
    subtitle: "Connected insight",
    Icon: BrainCircuit,
    tone:
      "border-violet-400/20 bg-violet-400/[0.08] text-violet-300",
    position:
      "right-[-4%] bottom-[12%]",
    delay: 1.05,
  },
];

export default function FloatingBadges() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 hidden xl:block"
    >
      {badges.map(
        ({
          title,
          subtitle,
          Icon,
          tone,
          position,
          delay,
        }) => (
          <motion.div
            key={title}
            initial={{
              opacity: 0,
              scale: 0.88,
              y: 10,
              filter:
                "blur(6px)",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [
                0,
                -7,
                0,
              ],
              filter:
                "blur(0px)",
            }}
            transition={{
              opacity: {
                duration: 0.5,
                delay,
              },

              scale: {
                duration: 0.55,
                delay,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              },

              filter: {
                duration: 0.5,
                delay,
              },

              y: {
                duration:
                  5.5 +
                  delay,
                delay:
                  delay +
                  0.55,
                repeat:
                  Infinity,
                ease:
                  "easeInOut",
              },
            }}
            className={`
              hero-floating-badge
              absolute
              ${position}
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-white/10
              bg-[#07101d]/80
              px-3.5
              py-3
              shadow-[0_18px_55px_rgba(0,0,0,0.35)]
              backdrop-blur-2xl
            `}
          >
            <motion.div
              animate={{
                rotate: [
                  0,
                  3,
                  -3,
                  0,
                ],
              }}
              transition={{
                duration: 6,
                repeat:
                  Infinity,
                ease:
                  "easeInOut",
              }}
              className={`
                grid
                h-9
                w-9
                shrink-0
                place-items-center
                rounded-xl
                border
                ${tone}
              `}
            >
              <Icon size={16} />
            </motion.div>

            <div className="min-w-0">
              <p
                className="
                  whitespace-nowrap
                  text-[11px]
                  font-semibold
                  text-white
                "
              >
                {title}
              </p>

              <div
                className="
                  mt-1
                  flex
                  items-center
                  gap-1.5
                "
              >
                <motion.span
                  animate={{
                    opacity: [
                      0.4,
                      1,
                      0.4,
                    ],
                    scale: [
                      0.9,
                      1.1,
                      0.9,
                    ],
                  }}
                  transition={{
                    duration: 2.6,
                    repeat:
                      Infinity,
                    ease:
                      "easeInOut",
                  }}
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-emerald-400
                    shadow-[0_0_8px_rgba(52,211,153,0.7)]
                  "
                />

                <span
                  className="
                    whitespace-nowrap
                    text-[9px]
                    text-slate-500
                  "
                >
                  {subtitle}
                </span>
              </div>
            </div>
          </motion.div>
        )
      )}

      {/* Very subtle floating intelligence marker */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.85,
        }}
        animate={{
          opacity: 0.8,
          scale: 1,
          y: [
            0,
            -5,
            0,
          ],
        }}
        transition={{
          opacity: {
            delay: 1.2,
            duration: 0.5,
          },
          scale: {
            delay: 1.2,
            duration: 0.5,
          },
          y: {
            delay: 1.7,
            duration: 6.5,
            repeat:
              Infinity,
            ease:
              "easeInOut",
          },
        }}
        className="
          absolute
          right-[11%]
          top-[-4%]
          grid
          h-10
          w-10
          place-items-center
          rounded-2xl
          border
          border-violet-400/15
          bg-violet-400/[0.07]
          text-violet-300
          shadow-[0_14px_45px_rgba(0,0,0,0.25)]
          backdrop-blur-xl
        "
      >
        <Sparkles size={16} />
      </motion.div>
    </div>
  );
}