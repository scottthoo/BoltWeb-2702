import { useLocation } from "react-router-dom";
import { FaBolt } from "react-icons/fa6";
import { FiCoffee } from "react-icons/fi";
import { BRIEFING_LINK, EMAIL } from "../lib/contact";
import AfterHours from "./AfterHours";

const initiatives = [
  "CEO Consultation",
  "Implementation Roadmaps",
  "Operational Transformation",
  "AI Governance",
];

export default function Footer() {
  // The after-hours shelf stands on the footer's top edge, in the quiet strip
  // the coffee section leaves above it, which only the homepage has.
  const { pathname } = useLocation();

  return (
    <footer className="relative bg-espresso py-16 text-sand-400">
      {pathname === "/" && <AfterHours />}
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 grid gap-12 md:grid-cols-2 xl:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-6 flex items-center gap-2 text-sand-50">
              <FaBolt className="text-xl text-clay-light" aria-hidden="true" />
              <span className="text-lg font-semibold tracking-[0.2em]">BOLT</span>
            </div>
            <p className="max-w-md leading-relaxed">
              We partner with forward-thinking executives to build AI-driven
              organizations, reducing operational friction and accelerating execution
              speed through strategic intelligence systems.
            </p>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-sand-50">
              Strategic initiatives
            </h3>
            <ul className="space-y-3">
              {initiatives.map((label) => (
                <li key={label}>
                  <a href="/#services" className="transition-colors hover:text-sand-50">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-sand-50">Connect</h3>
            <ul className="space-y-3">
              <li>
                <a href="/#coffee" className="transition-colors hover:text-sand-50">
                  Grab a coffee with Scott
                </a>
              </li>
              <li>
                <a
                  href={BRIEFING_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-sand-50"
                >
                  Message Scott on WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="transition-colors hover:text-sand-50">
                  {EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Bolt Interactive PLT. All rights reserved.</p>
          <p className="flex items-center gap-2 font-display italic text-sand-300">
            <FiCoffee aria-hidden="true" className="text-clay-light" />
            Brewed in Kuala Lumpur
          </p>
        </div>
      </div>
    </footer>
  );
}
