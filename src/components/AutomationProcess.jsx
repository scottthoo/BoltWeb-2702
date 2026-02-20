import { motion } from "framer-motion";
import { FiLayers, FiCpu, FiTrendingUp } from "react-icons/fi";

const steps = [
  {
    title: "Discover",
    description:
      "Map the highest-impact workflows, data sources, and decision points to automate.",
    icon: <FiLayers />,
  },
  {
    title: "Automate",
    description:
      "Design AI agents, integrations, and orchestration flows that eliminate manual steps.",
    icon: <FiCpu />,
  },
  {
    title: "Scale",
    description:
      "Deploy continuous optimization with analytics, monitoring, and performance tuning.",
    icon: <FiTrendingUp />,
  },
];

const stats = [
  { label: "Avg. hours saved weekly", value: "42+" },
  { label: "Automation accuracy", value: "98%" },
  { label: "Time-to-value", value: "30 days" },
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
            Automation Playbook
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            Launch AI automation that compounds results
          </h2>
          <p className="text-slate-300 mt-5 max-w-3xl mx-auto">
            We design end-to-end automation that connects your people, data, and
            tools into a single intelligent operating system.
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
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-2xl text-orange-300 mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-slate-300">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-white/10"
            >
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-slate-400 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
