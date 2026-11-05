import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { FiMapPin, FiVideo } from "react-icons/fi";
import CupIllustration, { Bean, CoffeeRing } from "./coffee/CupIllustration";
import { BREWS, SETTINGS, TIMINGS, orderMessage } from "../lib/coffee";
import { EMAIL, PHONE_DISPLAY, PHONE_E164, whatsappLink } from "../lib/contact";

const ease = [0.16, 1, 0.3, 1];
const SETTING_ICONS = { cafe: FiMapPin, video: FiVideo };

/*
 * The conversion section. Instead of a formal "partnership inquiry", visitors
 * order a coffee: pick a brew from the house menu (each one a real stage of an
 * engagement), say how and when they would like it, and send. The order arrives
 * on Scott's WhatsApp already written, so nobody has to compose a cold message.
 */
export default function CoffeeMenu() {
  const [brewId, setBrewId] = useState(BREWS[0].id);
  const [settingId, setSettingId] = useState(SETTINGS[0].id);
  const [timingId, setTimingId] = useState(TIMINGS[0].id);

  const brew = BREWS.find((b) => b.id === brewId);
  const setting = SETTINGS.find((s) => s.id === settingId);
  const timing = TIMINGS.find((t) => t.id === timingId);
  const message = orderMessage(brew, setting, timing);

  return (
    <section id="coffee" className="relative overflow-hidden bg-paper py-24 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-0 h-[34rem] w-[34rem] rounded-full bg-sand-200/70 blur-[120px]"
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="mb-14 grid gap-6 lg:mb-16 lg:grid-cols-2 lg:items-end"
        >
          <div>
            <p className="eyebrow">The house menu</p>
            <h2 className="mt-5 font-display text-4xl leading-[1.05] tracking-[-0.02em] md:text-6xl">
              Every good partnership starts <em className="font-light italic text-clay">over coffee.</em>
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-ink-soft lg:justify-self-end">
            Pick a brew and tell us how you take it. Your order lands on Scott&apos;s
            WhatsApp already written, so there is no form and no awkward first message.
            In Kuala Lumpur we meet at a café; anywhere else, over video.
          </p>
        </motion.div>

        <div className="grid items-start gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-10">
          <motion.fieldset
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease }}
            className="relative min-w-0 overflow-hidden rounded-[2rem] bg-espresso px-3 pb-3 pt-7 text-sand-100 shadow-[0_30px_60px_-30px_rgba(33,27,21,0.55)] sm:px-5 sm:pb-5 sm:pt-9"
          >
            <legend className="sr-only">Choose your brew</legend>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-clay/25 blur-[90px]"
            />
            <div className="relative flex items-baseline justify-between gap-4 border-b border-white/10 px-3 pb-6 sm:px-5">
              <p className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.22em] text-clay-light">
                Bolt coffee bar
              </p>
              <p className="whitespace-nowrap font-display text-sm italic text-sand-400">
                <span className="sm:hidden">KL · or video</span>
                <span className="hidden sm:inline">Kuala Lumpur · or over video</span>
              </p>
            </div>

            <div className="relative mt-2">
              {BREWS.map((item) => (
                <label
                  key={item.id}
                  className="group relative flex cursor-pointer gap-4 rounded-2xl px-3 py-5 transition-colors duration-300 hover:bg-white/[0.04] has-[:checked]:bg-white/[0.07] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-clay-light sm:gap-5 sm:px-5 sm:py-6"
                >
                  <input
                    type="radio"
                    name="brew"
                    value={item.id}
                    checked={brewId === item.id}
                    onChange={() => setBrewId(item.id)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className="mt-[0.55rem] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-sand-500/70 transition-colors duration-300 group-hover:border-sand-300 peer-checked:border-clay-light [&>span]:scale-0 peer-checked:[&>span]:scale-100"
                  >
                    <span className="h-2 w-2 rounded-full bg-clay-light transition-transform duration-300" />
                  </span>
                  <span className="min-w-0 flex-1">
                    {/* On the narrowest phones the stage drops under the name instead of squeezing the leader dots. */}
                    <span className="flex flex-wrap items-baseline gap-x-3">
                      <span className="whitespace-nowrap font-display text-[1.45rem] leading-tight text-sand-50 sm:text-[1.75rem]">
                        {item.name}
                      </span>
                      <span
                        aria-hidden="true"
                        className="hidden min-w-4 flex-1 -translate-y-1 border-b-2 border-dotted border-sand-500/35 min-[375px]:block"
                      />
                      <span className="basis-full whitespace-nowrap font-display text-base italic text-clay-light min-[375px]:basis-auto sm:text-lg">
                        {item.stage}
                      </span>
                    </span>
                    <span className="mt-2 block max-w-[34rem] leading-relaxed text-sand-400">{item.description}</span>
                    <span className="mt-3 flex items-center gap-1 text-clay-light">
                      {[1, 2, 3, 4].map((n) => (
                        <Bean
                          key={n}
                          filled={n <= item.strength}
                          className={`h-4 w-3 ${n <= item.strength ? "" : "text-sand-500/45"}`}
                        />
                      ))}
                      <span className="ml-2 whitespace-nowrap text-xs uppercase tracking-[0.16em] text-sand-500">
                        <span className="sr-only">Commitment: {item.strength} of 4, </span>
                        {item.serving}
                      </span>
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </motion.fieldset>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.12, ease }}
            className="drop-shadow-[0_22px_34px_rgba(74,52,30,0.16)] lg:sticky lg:top-28"
          >
            <div className="ticket-edge relative overflow-hidden rounded-t-[1.25rem] bg-[#FFFDF8] px-6 pb-12 pt-7 sm:px-8">
              <CoffeeRing className="pointer-events-none absolute -right-36 top-12 h-60 w-60 rotate-12 sm:-right-24 sm:top-10 lg:-right-40 xl:-right-24" />

              <div className="relative flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
                <span>Order slip</span>
                <span className="font-display text-sm font-normal normal-case italic tracking-normal">for Scott</span>
              </div>

              <div className="relative mt-4 flex items-center gap-5 sm:gap-6" aria-live="polite">
                <div className="relative h-28 w-28 shrink-0 sm:h-36 sm:w-36">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={brew.id}
                      initial={{ opacity: 0, y: 10, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.35, ease }}
                      className="absolute inset-0"
                    >
                      <CupIllustration brew={brew.id} className="h-full w-full" />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-ink-muted">1 ×</p>
                  <p className="font-display text-3xl leading-tight tracking-[-0.01em] text-ink">{brew.name}</p>
                  <p className="mt-1 font-display italic text-clay">{brew.stage}</p>
                </div>
              </div>

              <div className="relative mt-6 space-y-5 border-t border-dashed border-sand-400 pt-6">
                <Choice
                  legend="How do you take it?"
                  name="setting"
                  options={SETTINGS}
                  value={settingId}
                  onChange={setSettingId}
                  icons={SETTING_ICONS}
                />
                <Choice legend="When?" name="timing" options={TIMINGS} value={timingId} onChange={setTimingId} />
              </div>

              <div className="relative mt-6 border-t border-dashed border-sand-400 pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">Your message</p>
                <p className="mt-3 rounded-2xl rounded-bl-md bg-sand-100 px-4 py-3.5 font-display text-[1.05rem] italic leading-relaxed text-ink-soft">
                  {message}
                </p>
              </div>

              <a
                href={whatsappLink(message)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary relative mt-6 w-full"
              >
                <FaWhatsapp className="text-xl" aria-hidden="true" />
                <span>
                  Send my order<span className="hidden min-[375px]:inline"> to Scott</span>
                </span>
              </a>
              <p className="relative mt-3 text-center text-sm text-ink-muted">
                Opens WhatsApp with this message, ready to tweak before you send.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-sand-300 pt-8 text-sm leading-relaxed text-ink-muted md:flex-row md:items-center md:justify-between">
          <p>
            Not a WhatsApp person? Write to{" "}
            <a href={`mailto:${EMAIL}`} className="whitespace-nowrap text-ink underline decoration-sand-400 underline-offset-4 transition-colors hover:text-clay hover:decoration-clay">
              {EMAIL}
            </a>{" "}
            or call{" "}
            <a href={`tel:${PHONE_E164}`} className="whitespace-nowrap text-ink underline decoration-sand-400 underline-offset-4 transition-colors hover:text-clay hover:decoration-clay">
              {PHONE_DISPLAY}
            </a>
            .
          </p>
          <p>Headquartered in Kuala Lumpur · BOLT INTERACTIVE PLT (LLP0019699-LGN)</p>
        </div>
      </div>
    </section>
  );
}

function Choice({ legend, name, options, value, onChange, icons = {} }) {
  return (
    <fieldset>
      <legend className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">{legend}</legend>
      <div
        className={`mt-2.5 grid gap-1 rounded-full bg-sand-100 p-1 ${
          options.length === 3 ? "grid-cols-3" : "grid-cols-2"
        }`}
      >
        {options.map((option) => {
          const Icon = icons[option.id];
          return (
            <label
              key={option.id}
              className="flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full px-2 py-2.5 text-sm font-medium text-ink-soft transition-colors duration-300 hover:text-ink has-[:checked]:bg-ink has-[:checked]:text-paper has-[:checked]:shadow-[0_6px_16px_-8px_rgba(31,26,20,0.6)] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-clay"
            >
              <input
                type="radio"
                name={name}
                value={option.id}
                checked={value === option.id}
                onChange={() => onChange(option.id)}
                className="sr-only"
              />
              {Icon && <Icon aria-hidden="true" className="shrink-0" />}
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
