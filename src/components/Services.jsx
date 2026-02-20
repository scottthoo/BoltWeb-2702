import { motion } from "framer-motion";
import { FaRobot, FaCode, FaMobileAlt } from "react-icons/fa";
import { FiCloud, FiShare2, FiShield } from "react-icons/fi";

const services = [
  {
    icon: <FaRobot />,
    title: "Executive Systems Architecture",
    description:
      "Design the AI infrastructure that powers CEO-level decisions — from data inputs to strategic outputs.",
  },
  {
    icon: <FiShare2 />,
    title: "Revenue Intelligence Systems",
    description:
      "Give Sales Directors a live AI layer across pipeline, CRM, and market signals to accelerate deal velocity.",
  },
  {
    icon: <FiCloud />,
    title: "Operational Command Systems",
    description:
      "Build a unified AI operating layer for COOs — connecting workflows, teams, and metrics into one intelligent view.",
  },
  {
    icon: <FaCode />,
    title: "Private Executive AI Agents",
    description:
      "Deploy personal AI agents that brief, synthesize, and surface the right information for leadership — before they ask.",
  },
  {
    icon: <FaMobileAlt />,
    title: "Founder's AI Stack",
    description:
      "Build the private AI infrastructure a founder needs to scale decision-making and execution without growing headcount.",
  },
  {
    icon: <FiShield />,
    title: "AI Governance & Security",
    description:
      "Ensure your AI systems are secure, auditable, and board-ready with governance frameworks built from the ground up.",
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
            What I architect
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            AI systems built for the leadership layer
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Not generic tools. Not staff-level automation. Private AI systems designed
            specifically for Founders, COOs, Sales Directors, and Operations Heads.
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
              className="group rounded-3xl border border-gray-100 bg-gradient-to-br from-white via-white to-orange-50/40 p-8 shadow-sm hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-100 text-orange-500 text-2xl mb-6 group-hover:scale-105 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
