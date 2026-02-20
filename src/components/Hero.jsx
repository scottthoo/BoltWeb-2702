import { motion } from "framer-motion";

const whatsappLink =
  "https://wa.me/601115497865?text=Hi%20Scott%2C%20I%20would%20like%20to%20discuss%20strategic%20AI%20implementation";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white min-h-[90vh] flex items-center">
      <div className="absolute inset-0">
        <div className="absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-500/10 blur-[160px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-500/10 blur-[140px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-orange-200 tracking-wide uppercase">
              Executive AI Partner · Kuala Lumpur
            </span>
            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                AI Systems That Accelerate Executive Decision-Making
              </h1>
              <p className="text-xl text-slate-300 mt-6 leading-relaxed max-w-2xl">
                We partner with CEOs, Founders, and COOs to design and implement
                AI architectures that reduce operational friction and increase
                execution speed across the organization.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#contact"
                className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-4 rounded-full font-semibold transition-all hover:scale-105"
              >
                Request Strategic Briefing
              </a>
              <a
                href="#recognition"
                className="border border-white/20 px-8 py-4 rounded-full font-semibold hover:bg-white/5 transition-all"
              >
                View Executive Impact
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-sky-500 rounded-2xl opacity-20 blur"></div>
            <div className="relative rounded-2xl border border-white/10 bg-slate-900/90 p-8 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                  Strategic Impact
                </p>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { label: "Execution Speed", value: "+300%", trend: "up" },
                  {
                    label: "Operational Friction",
                    value: "-85%",
                    trend: "down",
                  },
                  {
                    label: "Revenue per Employee",
                    value: "+4.2x",
                    trend: "up",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-slate-400 text-sm mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-white group-hover:text-orange-400 transition-colors">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        stat.trend === "up"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-orange-500/20 text-orange-400"
                      }`}
                    >
                      {stat.trend === "up" ? "↑" : "↓"}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-900"></div>
                    <div className="w-8 h-8 rounded-full bg-slate-600 border border-slate-900"></div>
                    <div className="w-8 h-8 rounded-full bg-slate-500 border border-slate-900"></div>
                  </div>
                  <p>Partnering with visionary leadership teams</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
