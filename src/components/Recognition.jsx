import { motion } from "framer-motion";

const highlights = [
  {
    title: "Enterprise Logistics",
    value: "40% Reduction",
    description: "In supply chain operational friction within 3 months.",
  },
  {
    title: "FinTech Scaleup",
    value: "3x Acceleration",
    description: "In customer onboarding speed via intelligent agents.",
  },
  {
    title: "Healthcare Ops",
    value: "100% Compliance",
    description: "Automated regulatory reporting and audit trails.",
  },
];

export default function Recognition() {
  return (
    <section id="recognition" className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl"
        >
          <div className="space-y-10">
            <div>
              <p className="text-orange-300 font-semibold tracking-wide uppercase">
                Executive Impact
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mt-4 leading-tight">
                Delivering outcomes that matter to the board
              </h2>
              <p className="text-slate-300 mt-6 text-lg max-w-2xl">
                We measure our success by the tangible business value we create.
                Here is the impact of our recent strategic implementations.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition-colors"
                >
                  <p className="text-sm text-orange-200 uppercase tracking-[0.1em] font-medium mb-4">
                    {item.title}
                  </p>
                  <p className="text-3xl font-bold text-white mb-3">
                    {item.value}
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
