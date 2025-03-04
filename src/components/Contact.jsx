import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa';

const contactInfo = [
  {
    icon: <FaEnvelope />,
    title: "Email",
    content: "scott@bolt-interactive.com"
  },
  {
    icon: <FaPhone />,
    title: "Phone",
    content: "+601115497865"
  },
  {
    icon: <FaBuilding />,
    title: "Company",
    content: "BOLT INTERACTIVE PLT (LLP0019699-LGN)"
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Location",
    content: "Kuala Lumpur"
  }
];

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
          <p className="text-gray-600">Let's discuss your next project</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl text-orange-500 mb-4">{info.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
              <p className="text-gray-600">{info.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}