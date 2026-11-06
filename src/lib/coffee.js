// The house menu. Every first conversation with Scott starts over coffee, and each
// brew is a real stage of an engagement, from a first chat to a long partnership.
// `strength` is how much commitment the brew asks for, from 1 to 4, and
// `serving` says the same thing in words.
export const BREWS = [
  {
    id: "espresso",
    name: "Espresso",
    article: "an",
    stage: "First chat",
    strength: 1,
    serving: "A first sip",
    description:
      "Short and strong. Bring your knottiest operations problem and leave knowing where AI fits, and where it doesn't.",
    ask: "a first chat about where AI could fit in my business",
  },
  {
    id: "flat-white",
    name: "Flat White",
    article: "a",
    stage: "Audit",
    strength: 2,
    serving: "A sit-down",
    description:
      "Smooth and thorough. We map where friction lives in your operations and pick the highest-value places for AI.",
    ask: "a strategic audit of where AI can take friction out of our operations",
  },
  {
    id: "pour-over",
    name: "Pour-Over",
    article: "a",
    stage: "Blueprint",
    strength: 3,
    serving: "A project",
    description:
      "Slow-brewed and made to measure. A blueprint of your AI system, fitted to the stack and team you already have.",
    ask: "an AI architecture designed around our stack and our team",
  },
  {
    id: "cold-brew",
    name: "Cold Brew",
    article: "a",
    stage: "Partnership",
    strength: 4,
    serving: "The long pour",
    description:
      "Steeped long. We build it, roll it out across the organization, and stay until your team runs it without us.",
    ask: "a partnership to build and roll out AI across our organization",
  },
];

export const SETTINGS = [
  { id: "cafe", label: "Café in KL", phrase: "over coffee at a café in KL" },
  { id: "video", label: "Video call", phrase: "over a video call" },
];

export const TIMINGS = [
  { id: "this-week", label: "This week", phrase: "sometime this week" },
  { id: "next-week", label: "Next week", phrase: "sometime next week" },
  { id: "flexible", label: "No rush", phrase: "whenever suits you" },
];

/** The WhatsApp message a visitor sends when they place their order. */
export function orderMessage(brew, setting, timing) {
  return `Hi Scott ☕ I'd like to order ${brew.article} ${brew.name}: ${brew.ask}. Ideally ${setting.phrase}, ${timing.phrase}.`;
}
