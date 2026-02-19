import { motion } from "framer-motion";

const whatsappLink =
  "https://wa.me/601115497865?text=Hi%20Scott%2C%20I%20would%20like%20to%20know%20more%20about%20AI%20systems%20architecture";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0">
        <div className="absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-500/20 blur-[160px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-500/20 blur-[140px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-orange-200">
              Private AI Systems Architect · Kuala Lumpur
            </span>
            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                AI systems that reduce friction and accelerate execution at the CEO level.
              </h1>
              <p className="text-lg text-slate-300 mt-5">
                I design and implement private AI systems for Founders, COOs, Sales Directors,
                and Operations Heads — eliminating operational drag and giving leadership
                the speed and clarity to execute at a higher level.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="bg-orange-500 hover:bg-orange-400 text-white px-6 py-3 rounded-full font-semibold transition-colors"
              >
                Book a strategy call
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="border border-white/20 px-6 py-3 rounded-full font-semibold hover:border-white/40 transition-colors"
              >
                WhatsApp Scott
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Active CEO-level systems
              </p>
              <div className="mt-6 space-y-4">
                {[
                  "Revenue pipeline intelligence",
                  "Operational command dashboard",
                  "Executive decision support agent",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-2xl bg-slate-900/70 px-4 py-3"
                  >
                    <span className="text-slate-200">{item}</span>
                    <span className="text-xs text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full">
                      Live
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "AI systems deployed", value: "120+" },
                { label: "Avg. ROI uplift", value: "6.4x" },
                { label: "Exec hours reclaimed", value: "18k" },
                { label: "System accuracy", value: "98%" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
