import {
  ArrowRight,
  Bot,
  CalendarDays,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { motion } from "framer-motion";

const productCards = [
  {
    title: "AEMA AI",
    tag: "Business Intelligence",
    description:
      "Evaluate your strategy, competitors, strengths, and growth opportunities.",
    Icon: Bot,
    href: "/ai",
  },
  {
    title: "TaskFlow",
    tag: "Business Management",
    description:
      "Manage contacts, bookings, tasks, follow-ups, and business activity.",
    Icon: Workflow,
    href: "https://taskflowaemasystems.com/",
    external: true,
  },
  {
    title: "Compliance OS",
    tag: "Governance Platform",
    description:
      "Manage policies, risks, controls, evidence, vendors, and compliance readiness.",
    Icon: ShieldCheck,
    href: "/compliance-os",
  },
];

export default function Hero() {
  return (
    <section id="home" className="aema-webflow-hero">
      <div className="aema-hero-bg" />
      <div className="aema-hero-grid" />
      <div className="aema-hero-blue-floor" />

      <div className="aema-hero-inner">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="aema-hero-copy"
        >
          <div className="aema-hero-actions aema-hero-actions-top">
            <a href="#booking" className="aema-primary-btn">
              <CalendarDays size={18} />
              Book a Consultation
              <ArrowRight size={20} />
            </a>

            <a href="/ai" className="aema-secondary-btn">
              <Sparkles size={18} />
              Try AEMA AI
              <ArrowRight size={20} />
            </a>
          </div>

          <h1>
            From Ideas <br />
            To Intelligent Systems
          </h1>

          <p>
            AEMA Systems transforms ideas into intelligent software, AI
            automation, business systems, and digital platforms that help
            organizations operate smarter, scale faster, and grow with
            confidence.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.65 }}
          className="aema-product-grid"
        >
          {productCards.map(({ title, tag, description, Icon, href, external }) => {
            const card = (
              <div className="aema-product-card">
                <div className="aema-product-icon">
                  <Icon size={30} />
                </div>

                <div className="aema-product-content">
                  <p className="aema-product-tag">{tag}</p>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>

                <ArrowRight className="aema-card-arrow" size={25} />
              </div>
            );

            return external ? (
              <a key={title} href={href} target="_blank" rel="noopener noreferrer">
                {card}
              </a>
            ) : (
              <a key={title} href={href}>
                {card}
              </a>
            );
          })}
        </motion.div>

        <p className="aema-hero-bottom-text">
          Start building smarter systems. Upgrade any time.{" "}
          <a href="#booking">Get started →</a>
        </p>
      </div>
    </section>
  );
}