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
    title: "Executive Inquiry",
    content: "scott@bolt-interactive.com",
  },
  {
    icon: <FaPhone />,
    title: "Direct Line",
    content: "+601115497865",
  },
  {
    icon: <FaBuilding />,
    title: "Entity",
    content: "BOLT INTERACTIVE PLT (LLP0019699-LGN)",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "HQ",
    content: "Kuala Lumpur",
  },
];

const whatsappLink =
  "https://wa.me/601115497865?text=Hi%20Scott%2C%20I%20would%20like%20to%20discuss%20a%20strategic%20AI%20partnership";

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center"
        >
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm text-orange-600 tracking-wide uppercase">
              Partnership Inquiry
            </span>
            <div>
              <h2 className="text-4xl font-bold mb-6 text-slate-900">
                Engage with us for strategic transformation
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                We engage with a limited number of visionary organizations each
                quarter. Reach out directly to discuss a potential strategic
                alignment and how we can accelerate your executive agenda.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
              >
                <FaWhatsapp className="text-xl" />
                Schedule Executive Briefing
              </a>
              <a
                href="mailto:scott@bolt-interactive.com"
                className="inline-flex items-center gap-3 border border-gray-300 px-8 py-4 rounded-full font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                Email Direct
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
                className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="text-3xl text-orange-500 mb-6">{info.icon}</div>
                <h3 className="text-lg font-bold mb-2 text-slate-900">
                  {info.title}
                </h3>
                <p className="text-gray-600 break-words">{info.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
