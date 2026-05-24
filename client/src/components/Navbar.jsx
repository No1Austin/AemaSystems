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
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 px-6 py-4 backdrop-blur">

      <div className="mx-auto flex max-w-7xl items-center justify-between">

        {/* Logo */}
        <a href="#home" className="text-xl font-bold">
          AEMA Systems
        </a>


        {/* Desktop Nav */}
        <div className="hidden items-center gap-6 md:flex">

          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300 hover:text-white"
            >
              {link.label}
            </a>
          ))}

          <a
            href="#booking"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
          >
            Book Consultation
          </a>

        </div>


        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col gap-1 md:hidden"
        >
          <span className="h-0.5 w-6 bg-white"></span>
          <span className="h-0.5 w-6 bg-white"></span>
          <span className="h-0.5 w-6 bg-white"></span>
        </button>

      </div>



      {/* Mobile Dropdown */}
      {isOpen && (

        <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900 p-4 md:hidden">

          <div className="flex flex-col gap-4">

            {navLinks.map((link) => (

              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white"
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