import {
  X,
  Rocket,
  Briefcase,
  Gem,
  Check,
  ArrowRight,
  ShieldCheck,
  Users,
  TrendingUp,
  Trophy,
  Lock,
} from "lucide-react";
import { createCheckoutSession } from "../services/paymentService";

export default function PricingModal({ open, onClose, profile }) {
  if (!open) return null;

  const handleChoosePlan = async (plan) => {
    try {
      localStorage.setItem("aema_paid_profile", JSON.stringify(profile || {}));

      const result = await createCheckoutSession(plan, profile);

     if (result?.url) {
  window.location.assign(result.url);
}
    } catch (error) {
      console.error(error);
      alert("Payment could not start. Please try again.");
    }
  };

  const plans = [
    {
      id: "blueprint",
      icon: Rocket,
      title: "Growth Blueprint",
      type: "One-time payment",
      price: "$9.99",
      suffix: "CAD",
      color: "blue",
      features: [
        "AI Business Analysis",
        "Growth Blueprint",
        "PDF Report",
        "30-Day Action Plan",
      ],
    },
    {
      id: "expert",
      icon: Briefcase,
      title: "Blueprint + Expert",
      type: "One-time payment",
      price: "$49",
      suffix: "CAD",
      popular: true,
      color: "gold",
      features: [
        "Everything in Growth Blueprint",
        "30-Min Consultation",
        "Growth Strategy Session",
        "Technology Recommendations",
      ],
    },
    {
      id: "partner",
      icon: Gem,
      title: "AEMA Business Partner",
      type: "Subscription",
      price: "$30",
      suffix: "CAD /mo",
      color: "teal",
      features: [
        "Monthly Growth Reports",
        "Monthly Consultation",
        "Unlimited AI Access",
        "Priority Support",
        "3-Month Minimum Commitment",
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 px-4 py-6 backdrop-blur-xl">
      <div className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[1.5rem] border border-white/10 bg-[#020817] text-white shadow-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.22),transparent_35%),radial-gradient(circle_at_10%_40%,rgba(37,99,235,0.18),transparent_30%),radial-gradient(circle_at_90%_45%,rgba(20,184,166,0.18),transparent_30%)]" />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          <X size={22} />
        </button>

        <div className="relative z-10 px-5 py-7 md:px-8">
          <div className="mx-auto mb-7 max-w-2xl text-center">
            <div className="mb-3 flex items-center justify-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-lg font-black">
                A
              </div>
              <p className="text-xs tracking-[0.3em] text-white/80">
                AEMA SYSTEMS
              </p>
            </div>

            <h2 className="text-3xl font-black tracking-tight md:text-5xl">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                Growth Path
              </span>
            </h2>

            <p className="mt-3 text-sm text-slate-300 md:text-base">
              Powerful plans designed to help your business grow smarter,
              faster, and further.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
            {plans.map((plan) => {
              const Icon = plan.icon;

              const styles = {
                blue: {
                  border: "border-blue-500/40",
                  glow: "shadow-blue-500/20",
                  button:
                    "from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400",
                  icon: "border-blue-400/40 bg-blue-500/10 text-cyan-300",
                  check: "text-blue-400",
                },
                gold: {
                  border: "border-yellow-400/80",
                  glow: "shadow-yellow-500/30",
                  button:
                    "from-yellow-300 to-yellow-600 text-black hover:from-yellow-200 hover:to-yellow-500",
                  icon: "border-yellow-400/50 bg-yellow-500/10 text-yellow-300",
                  check: "text-yellow-400",
                },
                teal: {
                  border: "border-teal-400/40",
                  glow: "shadow-teal-500/20",
                  button:
                    "from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400",
                  icon: "border-teal-400/40 bg-teal-500/10 text-teal-300",
                  check: "text-teal-300",
                },
              }[plan.color];

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl border ${styles.border} bg-slate-950/70 p-4 shadow-xl ${styles.glow} transition duration-300 hover:-translate-y-1`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-600 px-3 py-1 text-[10px] font-black text-black shadow">
                      ★ MOST POPULAR
                    </div>
                  )}

                  <div className="mb-4 flex justify-center">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full border ${styles.icon}`}
                    >
                      <Icon size={22} />
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-lg font-bold">{plan.title}</h3>
                    <p className="mt-1 text-xs text-cyan-300">{plan.type}</p>

                    <div className="mt-3 flex items-end justify-center gap-1">
                      <span className="text-3xl font-black">{plan.price}</span>
                      <span className="mb-1 text-[11px] text-slate-400">
                        {plan.suffix}
                      </span>
                    </div>
                  </div>

                  <div className="my-4 h-px bg-white/10" />

                  <div className="space-y-2">
                    {plan.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-2 text-slate-100"
                      >
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-current ${styles.check}`}
                        >
                          <Check size={10} />
                        </span>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleChoosePlan(plan.id)}
                    className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r px-4 py-2.5 text-sm font-bold shadow transition ${styles.button}`}
                  >
                    Choose Plan <ArrowRight size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-slate-300 md:grid-cols-4">
            <TrustItem
              icon={ShieldCheck}
              title="100% Secure Checkout"
              text="Powered by Stripe"
            />
            <TrustItem
              icon={Users}
              title="Built for SMEs"
              text="Practical business growth"
            />
            <TrustItem
              icon={TrendingUp}
              title="Growth Intelligence"
              text="AI-powered insights"
            />
            <TrustItem
              icon={Trophy}
              title="Executive Reports"
              text="Professional PDF output"
            />
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Lock size={13} />
            <span>Your data is protected with secure payment processing.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrustItem({ icon: Icon, title, text }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="text-cyan-300" size={22} />
      <div>
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="text-xs">{text}</p>
      </div>
    </div>
  );
}