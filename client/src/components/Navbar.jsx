import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CalendarDays, Menu, Sparkles, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    setOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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
            <button onClick={() => scrollToSection("services")}>Services</button>
            <button onClick={() => scrollToSection("industries")}>Industries</button>
            <Link to="/services/ai-automation">AEMA AI</Link>
            <Link to="/about-aema-systems">About</Link>
            <button onClick={() => scrollToSection("founder")}>Founder</button>
            <button onClick={() => scrollToSection("booking")}>Contact</button>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/services/ai-automation"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold"
            >
              <Sparkles size={16} />
              Use AEMA AI
            </Link>

            <button
              onClick={() => scrollToSection("booking")}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold"
            >
              <CalendarDays size={16} />
              Book
            </button>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="inline-flex rounded-xl border border-white/10 bg-white/5 p-3 lg:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 lg:hidden">
            <button onClick={() => scrollToSection("services")} className="text-left text-slate-300">
              Services
            </button>
            <button onClick={() => scrollToSection("industries")} className="text-left text-slate-300">
              Industries
            </button>
            <Link onClick={() => setOpen(false)} to="/services/ai-automation" className="text-slate-300">
              AEMA AI
            </Link>
            <Link onClick={() => setOpen(false)} to="/about-aema-systems" className="text-slate-300">
              About
            </Link>
            <button onClick={() => scrollToSection("founder")} className="text-left text-slate-300">
              Founder
            </button>
            <button onClick={() => scrollToSection("booking")} className="text-left text-slate-300">
              Contact
            </button>

            <button
              onClick={() => scrollToSection("booking")}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold"
            >
              <CalendarDays size={16} />
              Book a Consultation
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}