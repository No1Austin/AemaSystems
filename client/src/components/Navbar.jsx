import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CalendarDays, Flame, Menu, Sparkles, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const taskManagerUrl = "https://task-manager-app-mern-phi.vercel.app/";
  const communityUrl = "https://t.me/aemasystems";

  const scrollToSection = (id) => {
    setOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 250);
    } else {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 py-4">
      <nav className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-[#050816]/80 px-5 py-3 text-white shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <Link to="/" onClick={() => setOpen(false)}>
            <img
              src="/aema-logo.png"
              alt="AEMA Systems"
              className="h-10 w-auto object-contain md:h-12"
            />
          </Link>

          <div className="hidden items-center gap-7 text-sm text-slate-300 lg:flex">
            <button onClick={() => scrollToSection("services")} className="hover:text-white">
              Services
            </button>

            <button onClick={() => scrollToSection("industries")} className="hover:text-white">
              Industries
            </button>

            <a
              href={taskManagerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              TaskManager
            </a>

            <Link to="/about-aema-systems" className="hover:text-white">
              About
            </Link>

            <button onClick={() => scrollToSection("founder")} className="hover:text-white">
              Founder
            </button>

            <button onClick={() => scrollToSection("booking")} className="hover:text-white">
              Contact
            </button>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={communityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-orange-400/25 bg-orange-500/10 px-3.5 py-2 text-sm font-semibold text-orange-200 transition hover:border-orange-300/50 hover:bg-orange-500/15 hover:text-white"
            >
              <Flame size={15} className="text-orange-300" />
              Community
            </a>

            <Link
              to="/ai"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:bg-white/10"
            >
              <Sparkles size={16} />
              AEMA AI
            </Link>

            <button
              onClick={() => scrollToSection("booking")}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold transition hover:bg-blue-500"
            >
              <CalendarDays size={16} />
              Book
            </button>
          </div>

          <button
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="inline-flex rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10 lg:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 lg:hidden">
            <button onClick={() => scrollToSection("services")} className="text-left text-slate-300 hover:text-white">
              Services
            </button>

            <button onClick={() => scrollToSection("industries")} className="text-left text-slate-300 hover:text-white">
              Industries
            </button>

            <a
              href={taskManagerUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="text-slate-300 hover:text-white"
            >
              TaskManager
            </a>

            <Link
              to="/about-aema-systems"
              onClick={() => setOpen(false)}
              className="text-slate-300 hover:text-white"
            >
              About
            </Link>

            <button onClick={() => scrollToSection("founder")} className="text-left text-slate-300 hover:text-white">
              Founder
            </button>

            <button onClick={() => scrollToSection("booking")} className="text-left text-slate-300 hover:text-white">
              Contact
            </button>

            <div className="mt-2 grid gap-3">
              <a
                href={communityUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-orange-400/25 bg-orange-500/10 px-4 py-2.5 text-sm font-semibold text-orange-200 transition hover:bg-orange-500/15"
              >
                <Flame size={16} className="text-orange-300" />
                Join Community
              </a>

              <Link
                to="/ai"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold"
              >
                <Sparkles size={16} />
                AEMA AI
              </Link>

              <button
                onClick={() => scrollToSection("booking")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold"
              >
                <CalendarDays size={16} />
                Book a Consultation
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}