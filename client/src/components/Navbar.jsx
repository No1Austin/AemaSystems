export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between">

        {/* Logo */}
        <a href="#home" className="text-xl font-bold">
          AEMA Systems
        </a>

        {/* Desktop Links */}
        <div className="hidden gap-6 text-sm text-slate-300 md:flex">
          <a href="#services" className="hover:text-white transition">
            Services
          </a>

          <a href="#events" className="hover:text-white transition">
            Events
          </a>

          <a href="#webinars" className="hover:text-white transition">
            Webinars
          </a>

          <a href="#founder" className="hover:text-white transition">
            Founder
          </a>

          <a href="#booking" className="hover:text-white transition">
            Book
          </a>
        </div>

        {/* CTA Button */}
        <a
          href="#booking"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500 transition"
        >
          Book Consultation
        </a>

      </div>
    </nav>
  );
}