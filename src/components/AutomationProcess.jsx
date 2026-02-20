import { motion } from "framer-motion";
import { FiTarget, FiLayout, FiTrendingUp } from "react-icons/fi";

const steps = [
  {
    title: "Strategic Audit",
    description:
      "We assess your current operational friction, data readiness, and identify high-value AI insertion points.",
    icon: <FiTarget />,
  },
  {
    title: "Architecture Design",
    description:
      "We blueprint a custom AI ecosystem that integrates seamlessly with your existing enterprise stack and workflows.",
    icon: <FiLayout />,
  },
  {
    title: "Execution & Scale",
    description:
      "We lead the technical implementation and oversee organizational change management to ensure adoption.",
    icon: <FiTrendingUp />,
  },
];

const stats = [
  { label: "Reduction in OpEx", value: "30-50%" },
  { label: "Increase in Execution Speed", value: "3x" },
  { label: "Typical ROI Timeline", value: "< 6 Mo" },
];

export default function AutomationProcess() {
  return (
    <section className="py-24 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-orange-300 font-semibold tracking-wide uppercase">
            Implementation Framework
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            From vision to operational reality
          </h2>
          <p className="text-slate-300 mt-5 max-w-3xl mx-auto text-lg">
            Our proprietary methodology ensures that AI initiatives deliver
            tangible business outcomes without disrupting your core operations.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center text-3xl text-orange-300 mb-6">
                {step.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
              <p className="text-slate-300 leading-relaxed text-lg">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 border border-white/10 text-center md:text-left"
            >
              <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-slate-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
