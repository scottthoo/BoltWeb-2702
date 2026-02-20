import { motion } from "framer-motion";
import { FaBolt } from "react-icons/fa6";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full bg-slate-950/80 backdrop-blur-md z-50 py-4 px-6 border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="block">
          <motion.div
            className="flex items-center gap-2 text-2xl font-bold text-white"
            whileHover={{ scale: 1.05 }}
          >
            <FaBolt className="text-orange-500" />
            <span>BOLT</span>
          </motion.div>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="/#services" className="hover:text-white transition-colors">
            Strategic Initiatives
          </a>
          <a
            href="/#recognition"
            className="hover:text-white transition-colors"
          >
            Executive Impact
          </a>
          <a
            href="/#contact"
            className="bg-orange-500 text-white px-6 py-2.5 rounded-full hover:bg-orange-400 transition-colors"
          >
            Request Briefing
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
