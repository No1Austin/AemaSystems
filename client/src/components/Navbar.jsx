export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <a href="#home" className="text-xl font-bold">
          AEMA Systems
        </a>

        <div className="hidden gap-6 text-sm text-slate-300 md:flex">
          <a href="#services" className="hover:text-white">Services</a>
          <a href="#founder" className="hover:text-white">Founder</a>
          <a href="#booking" className="hover:text-white">Book</a>
        </div>

        <a
          href="#booking"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
        >
          Book Consultation
        </a>
      </div>
    </nav>
  );
}