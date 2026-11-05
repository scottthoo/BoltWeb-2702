import { FaBolt } from "react-icons/fa6";
import { BRIEFING_LINK, EMAIL } from "../lib/contact";

const initiatives = [
  "CEO Consultation",
  "Implementation Roadmaps",
  "Operational Transformation",
  "AI Governance",
];

export default function Footer() {
  return (
    <footer className="bg-espresso py-16 text-sand-400">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 grid gap-12 md:grid-cols-4">
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
                <a
                  href={BRIEFING_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-sand-50"
                >
                  Book a briefing on WhatsApp
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

        <p className="border-t border-white/10 pt-8 text-sm">
          © {new Date().getFullYear()} Bolt Interactive PLT. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
