import { motion } from "framer-motion";
import { FaBolt } from "react-icons/fa6";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full bg-white/80 backdrop-blur-md z-50 py-4 px-6"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="block">
          <motion.div
            className="flex items-center gap-2 text-2xl font-bold"
            whileHover={{ scale: 1.05 }}
          >
            <FaBolt className="text-orange-500" />
            <span>BOLT</span>
          </motion.div>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="/#services"
            className="hover:text-orange-500 transition-colors"
          >
            Services
          </a>
          <a href="/#about" className="hover:text-orange-500 transition-colors">
            About
          </a>
          <a
            href="/#recognition"
            className="hover:text-orange-500 transition-colors"
          >
            Recognition
          </a>
          <a
            href="/#contact"
            className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
