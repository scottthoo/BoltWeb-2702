import { motion } from "framer-motion";
import { FiArrowRight, FiCoffee } from "react-icons/fi";
import Counter from "./effects/Counter";
import BoltCanvas from "./three/BoltCanvas";

const stats = [
  { value: "+300%", label: "Execution speed" },
  { value: "-85%", label: "Operational friction" },
  { value: "+4.2x", label: "Revenue per employee" },
];

const rise = (delay) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-sand-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_78%_42%,rgba(255,251,243,0.95),rgba(255,251,243,0)_70%)]"
      />
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply" />

      <div className="relative mx-auto grid max-w-7xl items-center px-6 pb-0 pt-28 lg:min-h-[100svh] lg:grid-cols-[1.08fr_0.92fr] lg:pb-16 lg:pt-24">
        <div className="relative z-10">
          <motion.p {...rise(0)} className="eyebrow">
            Executive AI Partner · Kuala Lumpur
          </motion.p>

          <motion.h1
            {...rise(0.08)}
            className="mt-6 font-display text-[2.6rem] font-normal leading-[1.02] tracking-[-0.025em] text-ink sm:text-6xl lg:text-[4.5rem]"
          >
            AI systems that accelerate{" "}
            <em className="font-light italic text-clay">executive decision-making.</em>
          </motion.h1>

          <motion.p {...rise(0.16)} className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft md:text-xl">
            We partner with CEOs, founders and COOs to design and implement AI
            architectures that reduce operational friction and increase execution
            speed across the organization.
          </motion.p>

          <motion.div {...rise(0.24)} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <a href="#coffee" className="btn-primary">
              <FiCoffee className="text-xl" aria-hidden="true" />
              Grab a coffee with Scott
            </a>
            <a
              href="#process"
              className="group inline-flex items-center justify-center gap-2 px-2 py-3 font-medium text-ink-soft transition-colors hover:text-ink"
            >
              See how we work
              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </a>
          </motion.div>
          <motion.p {...rise(0.3)} className="mt-4 text-sm text-ink-muted">
            Pick a brew, tap send · it lands on Scott&apos;s WhatsApp, no forms.
          </motion.p>

          <motion.dl
            {...rise(0.38)}
            className="mt-12 grid max-w-xl grid-cols-3 divide-x divide-sand-300 border-t border-sand-300 pt-6"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1 px-4 first:pl-0">
                <dt className="order-last text-xs leading-snug text-ink-muted sm:text-sm">{stat.label}</dt>
                <dd>
                  <Counter value={stat.value} className="font-display text-2xl text-ink sm:text-3xl" />
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <figure className="relative -mx-6 mt-4 h-[420px] sm:h-[500px] lg:mx-0 lg:-mr-16 lg:mt-0 lg:h-[min(780px,90svh)]">
          <BoltCanvas className="absolute inset-0" />
          <figcaption className="pointer-events-none absolute bottom-3 left-6 right-6 text-center font-display text-sm italic text-ink-muted lg:bottom-6 lg:left-auto lg:right-16 lg:text-right">
            Fig. 01 · Scattered effort, assembled into one system. Try disturbing it.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
