import { motion } from "framer-motion";
import {
  FaChessKing,
  FaMap,
  FaCogs,
  FaNetworkWired,
  FaChartLine,
  FaShieldAlt,
} from "react-icons/fa";

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
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-orange-500 font-semibold tracking-wide uppercase">
            Strategic Initiatives
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            AI transformation for the C-Suite
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
            We move beyond simple automation to deliver comprehensive AI
            strategies that reshape how your organization creates value.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              className="group rounded-3xl border border-gray-100 bg-gradient-to-br from-white via-white to-orange-50/40 p-10 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-100 text-orange-500 text-2xl mb-8 group-hover:scale-105 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-slate-900">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
