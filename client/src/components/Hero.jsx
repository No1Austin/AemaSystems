import HeroDashboard from "./HeroDashboard";
import HeroContent from "./HeroContent";

/**
 * AEMA homepage hero
 *
 * Performance goals:
 * - no Framer Motion
 * - no infinite glow animations
 * - no fixed/min-screen height
 * - no large filter/blur entrance effects
 * - same 1440px grid as the navbar and homepage sections
 */
export default function Hero() {
  return (
    <section
      id="home"
      className="
        relative
        overflow-hidden
        bg-[#020611]
        pb-12
        pt-[96px]
        text-white
        sm:pb-14
        sm:pt-[104px]
        md:pb-16
        md:pt-[110px]
        lg:pb-20
        lg:pt-[116px]
      "
    >
      {/* Lightweight static atmosphere */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.10),transparent_34%),radial-gradient(circle_at_82%_34%,rgba(6,182,212,0.08),transparent_32%)]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-cyan-300/10
          to-transparent
        "
      />

      <div className="aema-container relative z-10">
        <div
          className="
            grid
            items-center
            gap-10
            sm:gap-12
            lg:grid-cols-[0.92fr_1.08fr]
            lg:gap-12
            xl:gap-14
          "
        >
          {/* LEFT — AEMA brand story */}
          <div className="relative min-w-0 text-center lg:text-left">
            <div
              className="
                mx-auto
                w-full
                max-w-[560px]
                sm:max-w-[620px]
                lg:mx-0
                lg:max-w-none
              "
            >
              <HeroContent />
            </div>
          </div>

          {/* RIGHT — command center */}
          <div className="relative flex min-w-0 justify-center lg:justify-end">
            <div
              className="
                relative
                w-full
                max-w-[500px]
                sm:max-w-[560px]
                lg:max-w-[650px]
              "
            >
              {/* Static low-cost dashboard halo — desktop only */}
              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-[10%]
                  hidden
                  rounded-[3rem]
                  bg-cyan-400/[0.07]
                  lg:block
                  lg:blur-[46px]
                "
              />

              <div className="relative z-10">
                <HeroDashboard />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div
          aria-hidden="true"
          className="
            mx-auto
            mt-10
            h-px
            w-[86%]
            bg-gradient-to-r
            from-transparent
            via-white/10
            to-transparent
          "
        />

        {/* Brand positioning */}
        <div
          className="
            mx-auto
            mt-4
            flex
            max-w-3xl
            flex-wrap
            items-center
            justify-center
            gap-x-3
            gap-y-2
            text-center
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.16em]
            text-slate-600
            sm:text-[10px]
            sm:tracking-[0.2em]
          "
        >
          <span>Strategy</span>
          <span className="text-slate-800">•</span>
          <span>Automation</span>
          <span className="text-slate-800">•</span>
          <span>Software</span>
          <span className="text-slate-800">•</span>
          <span>Governance</span>
          <span className="text-slate-800">•</span>
          <span>Growth</span>
        </div>
      </div>
    </section>
  );
}
