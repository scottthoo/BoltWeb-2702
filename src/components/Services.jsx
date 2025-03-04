import { motion } from 'framer-motion';
import { FaMobileAlt, FaRobot, FaCode } from 'react-icons/fa';

const services = [
  {
    icon: <FaRobot />,
    title: "AI Solutions",
    description: "Custom AI applications that bring intelligence to your business processes."
  },
  {
    icon: <FaCode />,
    title: "Web Applications",
    description: "Responsive and scalable web applications built with modern technologies."
  },
  {
    icon: <FaMobileAlt />,
    title: "Mobile Apps",
    description: "Native and cross-platform mobile applications for iOS and Android."
  }
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-gray-600">Transforming ideas into powerful digital solutions</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="p-8 rounded-2xl bg-gray-50 hover:bg-orange-50 transition-colors"
            >
              <div className="text-4xl text-orange-500 mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}