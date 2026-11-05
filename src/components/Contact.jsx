import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { EMAIL, PARTNERSHIP_LINK, PHONE_DISPLAY, PHONE_E164 } from "../lib/contact";

const channels = [
  { label: "WhatsApp", value: "Message Scott directly", href: PARTNERSHIP_LINK, external: true },
  { label: "Executive inquiry", value: EMAIL, href: `mailto:${EMAIL}` },
  { label: "Direct line", value: PHONE_DISPLAY, href: `tel:${PHONE_E164}` },
];

export default function Contact() {
  return (
    <section id="contact" className="bg-paper py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2rem] bg-sand-200 px-6 py-12 sm:px-10 md:px-14 md:py-16"
        >
          <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 opacity-50 mix-blend-multiply" />
          <div className="relative grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
            <div>
              <p className="eyebrow">Partnership inquiry</p>
              <h2 className="mt-5 font-display text-4xl leading-[1.05] tracking-[-0.02em] md:text-[3.4rem]">
                Engage with us for <em className="font-light italic text-clay">strategic transformation.</em>
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
                We engage with a limited number of visionary organizations each quarter.
                Reach out directly to discuss a potential strategic alignment and how we
                can accelerate your executive agenda.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a href={PARTNERSHIP_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <FaWhatsapp className="text-xl" aria-hidden="true" />
                  <span className="sm:hidden">Schedule a briefing</span>
                  <span className="hidden sm:inline">Schedule an executive briefing</span>
                </a>
                <a href={`mailto:${EMAIL}`} className="btn-secondary">
                  Email directly
                </a>
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <ul className="border-t border-ink/15">
                {channels.map((channel) => (
                  <li key={channel.label} className="border-b border-ink/15">
                    <a
                      href={channel.href}
                      {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-center justify-between gap-4 py-5"
                    >
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
                          {channel.label}
                        </span>
                        <span className="mt-1 block truncate font-display text-xl text-ink transition-colors group-hover:text-clay md:text-2xl">
                          {channel.value}
                        </span>
                      </span>
                      <FiArrowUpRight
                        aria-hidden="true"
                        className="shrink-0 text-xl text-ink-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-clay"
                      />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-relaxed text-ink-muted">
                Headquartered in Kuala Lumpur · BOLT INTERACTIVE PLT (LLP0019699-LGN)
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
