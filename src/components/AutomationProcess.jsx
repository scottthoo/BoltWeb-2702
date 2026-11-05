import { motion } from "framer-motion";
import { FiTarget, FiLayout, FiTrendingUp } from "react-icons/fi";
import Counter from "./effects/Counter";

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
  { label: "Increase in execution speed", value: "3x" },
  { label: "Typical ROI timeline", value: "< 6 Mo" },
];

export default function AutomationProcess() {
  return (
    <section id="process" className="relative overflow-hidden bg-espresso py-24 text-sand-100 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-clay/20 blur-[140px]"
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 max-w-3xl lg:mb-20"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay-light">
            Implementation framework
          </p>
          <h2 className="mt-5 font-display text-4xl leading-[1.05] tracking-[-0.02em] text-sand-50 md:text-6xl">
            From vision to <em className="font-light italic text-clay-light">operational reality.</em>
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-sand-400">
            Our proprietary methodology ensures that AI initiatives deliver tangible
            business outcomes without disrupting your core operations.
          </p>
        </motion.div>

        <ol className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 lg:grid-cols-3">
          {steps.map((step, index) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-espresso p-8 transition-colors duration-500 hover:bg-[#2A221A] lg:p-10"
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="font-display text-6xl font-light italic leading-none text-clay-light">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-2xl text-sand-400 transition-transform duration-300 group-hover:scale-110">
                  {step.icon}
                </span>
              </div>
              <h3 className="mb-3 font-display text-2xl text-sand-50">{step.title}</h3>
              <p className="leading-relaxed text-sand-400">{step.description}</p>
            </motion.li>
          ))}
        </ol>

        <dl className="mt-16 grid gap-10 border-t border-white/10 pt-12 md:grid-cols-3 md:gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2">
              <dt className="order-last text-sand-400">{stat.label}</dt>
              <dd>
                <Counter value={stat.value} className="font-display text-5xl text-sand-50 md:text-6xl" />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
