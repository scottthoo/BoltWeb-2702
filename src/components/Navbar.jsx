import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBolt } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { BRIEFING_LINK } from "../lib/contact";

const links = [
  { href: "/#services", label: "Initiatives" },
  { href: "/#process", label: "Framework" },
  { href: "/#recognition", label: "Impact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled ? "border-sand-300/80 bg-paper/85 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-20">
        <a href="/" aria-label="Bolt Interactive home" className="flex items-center gap-2 text-ink">
          <FaBolt className="text-xl text-clay" aria-hidden="true" />
          <span className="text-lg font-semibold tracking-[0.2em]">BOLT</span>
        </a>

        <div className="flex items-center gap-8">
          <div className="hidden items-center gap-8 text-sm text-ink-soft md:flex">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-ink">
                {link.label}
              </a>
            ))}
          </div>
          {/* Visible at every width: on phones this is the only always-on CTA. */}
          <a
            href={BRIEFING_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors duration-300 hover:bg-clay sm:px-5 sm:py-2.5"
          >
            <FaWhatsapp aria-hidden="true" />
            Book a briefing
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
