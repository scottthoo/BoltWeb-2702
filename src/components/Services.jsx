import { motion } from "framer-motion";
import SpotlightCard from "./effects/SpotlightCard";
import { FaChessKing, FaMap, FaCogs, FaNetworkWired, FaChartLine, FaShieldAlt } from "react-icons/fa";

const services = [
  {
    icon: <FaChessKing />,
    title: "CEO-Level AI Consultation",
    description:
      "Strategic advisory to identify high-leverage AI opportunities that align with your long-term business vision and competitive positioning.",
  },
  {
    icon: <FaMap />,
    title: "Implementation Roadmaps",
    description:
      "Detailed execution plans that bridge the gap between executive strategy and technical deployment, ensuring measurable ROI.",
  },
  {
    icon: <FaCogs />,
    title: "Operational Transformation",
    description:
      "Re-engineering core business processes with AI to drastically reduce friction, overhead, and manual intervention.",
  },
  {
    icon: <FaNetworkWired />,
    title: "Custom AI Architectures",
    description:
      "Designing proprietary AI systems and agentic workflows that create a defensible competitive advantage for your organization.",
  },
  {
    icon: <FaChartLine />,
    title: "Executive Dashboards",
    description:
      "Real-time intelligence systems that provide granular visibility and clarity for high-stakes executive decision making.",
  },
  {
    icon: <FaShieldAlt />,
    title: "AI Governance & Risk",
    description:
      "Ensuring your AI initiatives are secure, compliant, and aligned with organizational values and global standards.",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-paper py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 grid gap-6 lg:mb-20 lg:grid-cols-2 lg:items-end"
        >
          <div>
            <p className="eyebrow">Strategic initiatives</p>
            <h2 className="mt-5 font-display text-4xl leading-[1.05] tracking-[-0.02em] md:text-6xl">
              AI transformation for the <em className="font-light italic text-clay">C-suite.</em>
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-ink-soft lg:justify-self-end">
            We move beyond simple automation to deliver comprehensive AI strategies
            that reshape how your organization creates value.
          </p>
        </motion.div>

        <div className="grid border-l border-t border-sand-300 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <SpotlightCard
              key={service.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: (index % 3) * 0.1 }}
              className="border-b border-r border-sand-300 p-8 transition-colors duration-300 hover:bg-sand-50 lg:p-10"
            >
              <div className="mb-12 flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sand-200 text-lg text-clay transition-transform duration-300 group-hover/spotlight:-rotate-6 group-hover/spotlight:scale-110">
                  {service.icon}
                </span>
                <span className="font-display text-sm italic text-ink-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mb-3 font-display text-2xl tracking-[-0.01em]">{service.title}</h3>
              <p className="leading-relaxed text-ink-soft">{service.description}</p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
