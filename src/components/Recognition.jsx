import { motion } from "framer-motion";
import SpotlightCard from "./effects/SpotlightCard";
import Counter from "./effects/Counter";

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
    <section id="recognition" className="bg-sand-100 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 grid gap-6 lg:mb-20 lg:grid-cols-2 lg:items-end"
        >
          <div>
            <p className="eyebrow">Executive impact</p>
            <h2 className="mt-5 font-display text-4xl leading-[1.05] tracking-[-0.02em] md:text-6xl">
              Outcomes that matter <em className="font-light italic text-clay">to the board.</em>
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-ink-soft lg:justify-self-end">
            We measure our success by the tangible business value we create. Here is
            the impact of our recent strategic implementations.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((item, index) => (
            <SpotlightCard
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl border border-sand-300 bg-paper p-8 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset] lg:p-10"
            >
              <p className="mb-10 text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
                {item.title}
              </p>
              <Counter
                value={item.value}
                className="mb-3 block font-display text-4xl tracking-[-0.02em] text-clay lg:text-5xl"
              />
              <p className="leading-relaxed text-ink-soft">{item.description}</p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
