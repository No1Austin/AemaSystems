import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Flame,
  Menu,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

const COMPLIANCE_OS_URL =
  "https://aemacompliance.com/";

const TASKFLOW_URL =
  "https://taskflowaemasystems.com/";

const COMMUNITY_URL =
  "https://t.me/aemasystems";

const productLinks = [
  {
    label: "AEMA AI",
    description:
      "Business intelligence and growth planning",
    href: "/ai",
    Icon: Sparkles,
    tone:
      "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-200",
    external: false,
  },
  {
    label: "Compliance OS",
    description:
      "Governance, readiness, and trust",
    href: COMPLIANCE_OS_URL,
    Icon: ShieldCheck,
    tone:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    external: true,
  },
  {
    label: "TaskFlow",
    description:
      "Contacts, bookings, tasks, and follow-ups",
    href: TASKFLOW_URL,
    Icon: BriefcaseBusiness,
    tone:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
    external: true,
  },
];

function ExternalNavLink({
  href,
  children,
  className,
  onClick,
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={className}
    >
      {children}
    </a>
  );
}

export default function Navbar({
  externalOpen,
  setExternalOpen,
  hideMobileToggle = false,
  className = "",
}) {
  const [internalOpen, setInternalOpen] =
    useState(false);
  const [scrolled, setScrolled] =
    useState(false);

  const open =
    externalOpen ?? internalOpen;
  const setOpen =
    setExternalOpen ?? setInternalOpen;

  const navigate = useNavigate();
  const location = useLocation();

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 16);
    }

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    function handleEscape(event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open]);

  function scrollToSection(id) {
    closeMenu();

    const scroll = () => {
      document
        .getElementById(id)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    };

    if (location.pathname !== "/") {
      navigate("/");
      window.setTimeout(scroll, 260);
      return;
    }

    scroll();
  }

  const navLinks = [
    {
      label: "Services",
      action: () =>
        scrollToSection("services"),
    },
    {
      label: "Industries",
      action: () =>
        scrollToSection("industries"),
    },
    {
      label: "Founder",
      action: () =>
        scrollToSection("founder"),
    },
    {
      label: "Contact",
      action: () =>
        scrollToSection("booking"),
    },
  ];

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-all duration-300 md:px-5",
        className,
      ].join(" ")}
    >
      <motion.nav
        layout
        className={[
          "mx-auto max-w-7xl rounded-[1.4rem] border px-4 py-3 text-white transition-all duration-300 md:rounded-[1.65rem] md:px-5",
          scrolled
            ? "border-white/15 bg-[#050914]/90 shadow-[0_22px_70px_rgba(0,0,0,0.38)] backdrop-blur-2xl"
            : "border-white/10 bg-[#050914]/68 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl",
        ].join(" ")}
      >
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            onClick={closeMenu}
            className="group flex shrink-0 items-center gap-3"
          >
            <motion.div
              whileHover={{
                rotate: -4,
                scale: 1.04,
              }}
              className="relative"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl bg-blue-400/15 blur-xl"
              />

              <img
                src="/aema-logo.png"
                alt="AEMA Systems"
                className="relative h-9 w-auto object-contain md:h-11"
              />
            </motion.div>
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                type="button"
                className="rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/[0.045] hover:text-white"
              >
                {item.label}
              </button>
            ))}

            <div className="mx-2 h-5 w-px bg-white/10" />

            <Link
              to="/ai"
              className="rounded-xl px-3.5 py-2.5 text-sm font-semibold text-fuchsia-300 transition hover:bg-fuchsia-400/[0.08] hover:text-fuchsia-200"
            >
              AEMA AI
            </Link>

            <ExternalNavLink
              href={COMPLIANCE_OS_URL}
              className="rounded-xl px-3.5 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/[0.08] hover:text-emerald-200"
            >
              Compliance OS
            </ExternalNavLink>

            <ExternalNavLink
              href={TASKFLOW_URL}
              className="rounded-xl px-3.5 py-2.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/[0.08] hover:text-cyan-200"
            >
              TaskFlow
            </ExternalNavLink>
          </div>

          <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
            <ExternalNavLink
              href={COMMUNITY_URL}
              className="inline-flex items-center gap-2 rounded-xl border border-orange-400/20 bg-orange-400/[0.08] px-4 py-2.5 text-sm font-bold text-orange-200 transition hover:-translate-y-0.5 hover:border-orange-300/35 hover:bg-orange-400/[0.13] hover:text-white"
            >
              <Flame size={16} />
              Community
            </ExternalNavLink>

            <button
              onClick={() =>
                scrollToSection("booking")
              }
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-300 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-950/25 transition hover:-translate-y-0.5"
              type="button"
            >
              <CalendarDays size={16} />
              Book
              <ArrowRight
                size={15}
                className="transition group-hover:translate-x-0.5"
              />
            </button>
          </div>

          {!hideMobileToggle ? (
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() =>
                setOpen(
                  (previous) => !previous
                )
              }
              aria-label="Toggle navigation menu"
              aria-expanded={open}
              className={[
                "inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition lg:hidden",
                open
                  ? "border-blue-400/25 bg-blue-400/10 text-blue-200"
                  : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]",
              ].join(" ")}
              type="button"
            >
              {open ? (
                <X size={21} />
              ) : (
                <Menu size={21} />
              )}
            </motion.button>
          ) : null}
        </div>
      </motion.nav>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 -z-10 bg-[#030712]/78 backdrop-blur-md lg:hidden"
            />

            <motion.div
              initial={{
                opacity: 0,
                y: -16,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -12,
                scale: 0.98,
              }}
              transition={{ duration: 0.22 }}
              className="mx-auto mt-3 max-h-[calc(100vh-7rem)] max-w-7xl overflow-y-auto rounded-[1.7rem] border border-white/10 bg-[#060b17]/96 p-4 text-white shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl lg:hidden"
            >
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.025] p-3">
                <p className="px-2 pb-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">
                  Navigate
                </p>

                <div className="grid gap-1">
                  {navLinks.map((item) => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className="flex items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                      type="button"
                    >
                      {item.label}

                      <ArrowRight
                        size={15}
                        className="text-slate-600"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="px-1 pb-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">
                  Products
                </p>

                <div className="grid gap-3">
                  {productLinks.map(
                    ({
                      label,
                      description,
                      href,
                      Icon,
                      tone,
                      external,
                    }) => {
                      const content = (
                        <div className="flex items-center gap-4">
                          <div
                            className={[
                              "grid h-11 w-11 shrink-0 place-items-center rounded-2xl border",
                              tone,
                            ].join(" ")}
                          >
                            <Icon size={19} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-white">
                              {label}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {description}
                            </p>
                          </div>

                          <ArrowRight
                            size={16}
                            className="shrink-0 text-slate-600"
                          />
                        </div>
                      );

                      const linkClasses =
                        "block rounded-[1.3rem] border border-white/10 bg-white/[0.025] p-4 transition hover:border-white/20 hover:bg-white/[0.05]";

                      return external ? (
                        <ExternalNavLink
                          key={label}
                          href={href}
                          onClick={closeMenu}
                          className={linkClasses}
                        >
                          {content}
                        </ExternalNavLink>
                      ) : (
                        <Link
                          key={label}
                          to={href}
                          onClick={closeMenu}
                          className={linkClasses}
                        >
                          {content}
                        </Link>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <ExternalNavLink
                  href={COMMUNITY_URL}
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-orange-400/20 bg-orange-400/[0.08] px-4 py-3.5 text-sm font-bold text-orange-200"
                >
                  <Flame size={17} />
                  Join Community
                </ExternalNavLink>

                <button
                  onClick={() =>
                    scrollToSection("booking")
                  }
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-300 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-950/25"
                  type="button"
                >
                  <CalendarDays size={17} />
                  Book Consultation
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
