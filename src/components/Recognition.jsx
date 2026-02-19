import { motion } from "framer-motion";

const highlights = [
  {
    title: "Who I work with",
    value: "C-Suite only",
    description: "Founders, COOs, Sales Directors, and Operations Heads — not staff level.",
  },
  {
    title: "Average payback",
    value: "< 90 days",
    description: "Time-to-live for CEO-level AI systems that deliver measurable ROI.",
  },
  {
    title: "Leadership in control",
    value: "100%",
    description: "Every system keeps decision-making authority with the leadership team.",
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
          className="max-w-3xl"
        >
          <div className="space-y-8">
            <p className="text-orange-300 font-semibold tracking-wide uppercase">
              Built for leaders who move fast
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mt-4">
              Private AI systems trusted at the highest level
            </h2>
            <p className="text-slate-300 mt-5">
              I don't do small tasks or generic chatbot builds. I architect private AI systems
              for leaders who need real operational leverage — and the execution speed to match their ambition.
            </p>
            <div className="grid gap-4">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <p className="text-sm text-slate-400 uppercase tracking-[0.2em]">
                    {item.title}
                  </p>
                  <p className="text-2xl font-semibold mt-2">{item.value}</p>
                  <p className="text-slate-400 mt-2">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
