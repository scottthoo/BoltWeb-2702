import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";

const contactInfo = [
  {
    icon: <FaEnvelope />,
    title: "Email",
    content: "scott@bolt-interactive.com",
  },
  {
    icon: <FaPhone />,
    title: "Phone",
    content: "+601115497865",
  },
  {
    icon: <FaBuilding />,
    title: "Company",
    content: "BOLT INTERACTIVE PLT (LLP0019699-LGN)",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Location",
    content: "Kuala Lumpur",
  },
];

const whatsappLink =
  "https://wa.me/601115497865?text=Hi%20Scott%2C%20I%20would%20like%20to%20discuss%20an%20AI%20systems%20architecture%20engagement";

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center"
        >
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm text-orange-600">
              Work with Scott
            </span>
            <div>
              <h2 className="text-4xl font-bold mb-4">Let's build your AI operating system</h2>
              <p className="text-gray-600 text-lg">
                If you're a Founder, COO, Sales Director, or Operations Head looking to
                eliminate friction and accelerate execution — let's talk about what an
                AI system architecture engagement looks like for your business.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors"
              >
                <FaWhatsapp />
                WhatsApp Scott directly
              </a>
              <a
                href="mailto:scott@bolt-interactive.com"
                className="inline-flex items-center gap-3 border border-gray-300 px-6 py-3 rounded-full font-semibold text-gray-700 hover:border-gray-400 transition-colors"
              >
                Email Scott
              </a>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-3xl text-orange-500 mb-4">{info.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                <p className="text-gray-600">{info.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
