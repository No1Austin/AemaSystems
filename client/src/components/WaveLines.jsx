import { motion } from "framer-motion";

export default function WaveLines({
  className = "",
  reverse = false,
}) {
  const gradientId = reverse
    ? "aemaWaveGradientReverse"
    : "aemaWaveGradient";

  const maskId = reverse
    ? "aemaWaveMaskReverse"
    : "aemaWaveMask";

  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 900 420"
      fill="none"
      className={`${className} blur-[0.25px]`}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 1.2,
        delay: 0.25,
      }}
      mask={`url(#${maskId})`}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="900"
          y2="0"
        >
          <stop
            offset="0%"
            stopColor={
              reverse
                ? "#67e8f9"
                : "#6ee7b7"
            }
            stopOpacity="0.7"
          />

          <stop
            offset="38%"
            stopColor="#67e8f9"
            stopOpacity="0.85"
          />

          <stop
            offset="68%"
            stopColor="#93c5fd"
            stopOpacity="0.72"
          />

          <stop
            offset="100%"
            stopColor="#c4b5fd"
            stopOpacity="0.52"
          />
        </linearGradient>

        <linearGradient
          id={`${maskId}-fade`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop
            offset="0%"
            stopColor="white"
            stopOpacity="0"
          />

          <stop
            offset="9%"
            stopColor="white"
            stopOpacity="0.35"
          />

          <stop
            offset="23%"
            stopColor="white"
            stopOpacity="0.95"
          />

          <stop
            offset="74%"
            stopColor="white"
            stopOpacity="0.8"
          />

          <stop
            offset="92%"
            stopColor="white"
            stopOpacity="0.2"
          />

          <stop
            offset="100%"
            stopColor="white"
            stopOpacity="0"
          />
        </linearGradient>

        <mask id={maskId}>
          <rect
            width="100%"
            height="100%"
            fill={`url(#${maskId}-fade)`}
          />
        </mask>

        <filter
          id={`${gradientId}-glow`}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feGaussianBlur
            stdDeviation="0.55"
            result="blur"
          />

          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {Array.from({
        length: 18,
      }).map((_, index) => {
        const offset =
          index * 12;

        const strength =
          0.1 +
          Math.sin(
            (index / 17) *
              Math.PI
          ) *
            0.18;

        return (
          <motion.path
            key={index}
            d={
              reverse
                ? `
                  M 900 ${48 + offset}
                  C 760 ${8 + offset},
                    650 ${122 + offset},
                    510 ${92 + offset}
                  C 390 ${66 + offset},
                    300 ${182 + offset},
                    165 ${142 + offset}
                  C 95 ${122 + offset},
                    48 ${164 + offset},
                    0 ${150 + offset}
                `
                : `
                  M 0 ${48 + offset}
                  C 140 ${8 + offset},
                    250 ${122 + offset},
                    390 ${92 + offset}
                  C 510 ${66 + offset},
                    600 ${182 + offset},
                    735 ${142 + offset}
                  C 805 ${122 + offset},
                    852 ${164 + offset},
                    900 ${150 + offset}
                `
            }
            stroke={`url(#${gradientId})`}
            strokeWidth={
              index % 4 === 0
                ? 1.15
                : 0.9
            }
            strokeLinecap="round"
            filter={`url(#${gradientId}-glow)`}
            initial={{
              pathLength: 0,
              opacity: 0,
            }}
            animate={{
              pathLength: 1,
              opacity:
                strength,
              x: reverse
                ? [0, -14, 0]
                : [0, 14, 0],
              y: [
                0,
                index % 2 === 0
                  ? -3
                  : 3,
                0,
              ],
            }}
            transition={{
              pathLength: {
                duration:
                  1.6 +
                  index * 0.035,
                delay:
                  0.2 +
                  index * 0.025,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              },

              opacity: {
                duration: 1.2,
                delay:
                  0.2 +
                  index * 0.025,
              },

              x: {
                duration:
                  15 +
                  index * 0.22,
                repeat:
                  Infinity,
                ease:
                  "easeInOut",
              },

              y: {
                duration:
                  11 +
                  index * 0.18,
                repeat:
                  Infinity,
                ease:
                  "easeInOut",
              },
            }}
          />
        );
      })}
    </motion.svg>
  );
}