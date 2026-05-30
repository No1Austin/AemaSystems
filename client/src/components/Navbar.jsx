import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Services", href: "#services" },
    { label: "Events", href: "#events" },
    { label: "Webinars", href: "#webinars" },
    { label: "Founder", href: "#founder" },
    { label: "Book", href: "#booking" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 px-6 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <a href="#home" className="flex items-center">
          <img
            src="/aema-logo.png"
            alt="AEMA Systems"
            className="h-15 w-auto object-contain md:h-24"
          />
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-300 transition hover:text-cyan-300"
            >
              {link.label}
            </a>
          ))}

          <a
            href="#booking"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Book Consultation
          </a>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 md:hidden"
          aria-label="Toggle navigation"
        >
          <span className="h-0.5 w-6 bg-white" />
          <span className="h-0.5 w-6 bg-white" />
          <span className="h-0.5 w-6 bg-white" />
        </button>
      </div>

      {isOpen && (
        <div className="mt-3 rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-xl md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-3 py-3 text-slate-300 transition hover:bg-white/5 hover:text-cyan-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}