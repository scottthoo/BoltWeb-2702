import { motion } from "framer-motion";
import { FaRobot, FaCode, FaMobileAlt } from "react-icons/fa";
import { FiCloud, FiShare2, FiShield } from "react-icons/fi";

const services = [
  {
    icon: <FaRobot />,
    title: "AI Automation Strategy",
    description:
      "Identify high-ROI automation opportunities and build a roadmap that aligns with your teams.",
  },
  {
    icon: <FiShare2 />,
    title: "Workflow Orchestration",
    description:
      "Connect your CRM, inbox, spreadsheets, and databases into coordinated AI-driven flows.",
  },
  {
    icon: <FiCloud />,
    title: "Custom AI Agents",
    description:
      "Deploy assistants that summarize, route, and act on information across your business.",
  },
  {
    icon: <FaCode />,
    title: "Product & Web Experiences",
    description:
      "Launch scalable web apps that showcase automation and keep stakeholders in the loop.",
  },
  {
    icon: <FaMobileAlt />,
    title: "Mobile Automation",
    description:
      "Bring automation insights to the frontline with mobile-first dashboards and alerts.",
  },
  {
    icon: <FiShield />,
    title: "Compliance & Security",
    description:
      "Design automation with governance, data privacy, and observability baked in.",
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
            What we build
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            End-to-end AI automation services
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            From discovery to deployment, we deliver intelligent systems that
            help teams move faster and automate the busywork.
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
