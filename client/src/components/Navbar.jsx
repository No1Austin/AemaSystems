import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bot,
  CalendarDays,
  Flame,
  Menu,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

export default function Navbar({
  externalOpen,
  setExternalOpen,
  hideMobileToggle = false,
  className = "",
}) {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = externalOpen ?? internalOpen;
  const setOpen = setExternalOpen ?? setInternalOpen;

  const navigate = useNavigate();
  const location = useLocation();

  const taskFlowUrl = "https://taskflowaemasystems.com/";
  const communityUrl = "https://t.me/aemasystems";

  const closeMenu = () => setOpen(false);

  const scrollToSection = (id) => {
    closeMenu();

    const scroll = () => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(scroll, 250);
    } else {
      scroll();
    }
  };

  const navLinks = [
    { label: "Services", action: () => scrollToSection("services") },
    { label: "Industries", action: () => scrollToSection("industries") },
    { label: "Founder", action: () => scrollToSection("founder") },
    { label: "Contact", action: () => scrollToSection("booking") },
  ];

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 px-3 py-3 md:px-5 ${className}`}
    >
      <nav className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-[#020617]/80 px-4 py-3 text-white shadow-2xl shadow-black/30 backdrop-blur-2xl md:rounded-3xl md:px-5">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" onClick={closeMenu} className="flex shrink-0 items-center">
            <img
              src="/aema-logo.png"
              alt="AEMA Systems"
              className="h-9 w-auto object-contain md:h-11"
            />
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-7 text-sm font-medium text-slate-300 lg:flex">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="transition hover:text-white"
                type="button"
              >
                {item.label}
              </button>
            ))}

            <a
              href={taskFlowUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              TaskFlow
            </a>

            <Link
              to="/ai"
              className="font-semibold text-fuchsia-300 transition hover:text-fuchsia-200"
            >
              AEMA AI
            </Link>

            <Link
              to="/compliance-os"
              className="font-semibold text-emerald-300 transition hover:text-emerald-200"
            >
              Compliance OS
            </Link>
          </div>

          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            <a
              href={communityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-orange-400/25 bg-orange-500/10 px-4 py-2.5 text-sm font-bold text-orange-200 transition hover:border-orange-300/50 hover:bg-orange-500/15 hover:text-white"
            >
              <Flame size={16} />
              Community
            </a>

            <button
              onClick={() => scrollToSection("booking")}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
              type="button"
            >
              <CalendarDays size={16} />
              Book
            </button>
          </div>

          {!hideMobileToggle && (
            <button
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={open}
              className="inline-flex rounded-xl border border-white/10 bg-white/5 p-2.5 text-white transition hover:bg-white/10 lg:hidden"
              type="button"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}
        </div>
      </nav>

      {open && (
        <div className="mx-auto mt-3 max-w-7xl rounded-3xl border border-white/10 bg-[#020617]/95 p-4 text-white shadow-2xl shadow-black/40 backdrop-blur-2xl lg:hidden">
          <div className="grid gap-2">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-200 transition hover:bg-white/5 hover:text-white"
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3">
            <Link
              to="/ai"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-2xl border border-fuchsia-400/20 bg-fuchsia-400/10 p-4 text-sm font-bold text-fuchsia-100"
            >
              <Sparkles size={18} />
              AEMA AI
            </Link>

            <Link
              to="/compliance-os"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm font-bold text-emerald-100"
            >
              <ShieldCheck size={18} />
              Compliance OS
            </Link>

            <a
              href={taskFlowUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm font-bold text-cyan-100"
            >
              <Bot size={18} />
              TaskFlow
            </a>

            <a
              href={communityUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-2xl border border-orange-400/20 bg-orange-500/10 p-4 text-sm font-bold text-orange-100"
            >
              <Flame size={18} />
              Join Community
            </a>

            <button
              onClick={() => scrollToSection("booking")}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20"
              type="button"
            >
              <CalendarDays size={17} />
              Book a Consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
