/*
 * Hand-drawn line illustrations for each brew on the house menu, in the site's
 * warm palette. Steam, the pour-over drip and the cold brew ice are animated in
 * CSS (see index.css) and stand still for visitors who prefer reduced motion.
 */

const INK = "#3B2A1E";
const CERAMIC = "#FFFDF8";
const COFFEE = "#5B3520";
const CREMA = "#B9783F";
const MILK = "#F3E6CF";
const CLAY = "#A6481F";

const line = {
  fill: "none",
  stroke: INK,
  strokeWidth: 2.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Steam({ x = 80, y = 70 }) {
  return (
    <g className="steam" {...line} strokeWidth={2.25} opacity={0.4}>
      <path d={`M${x - 12} ${y} c-6 -7 6 -13 0 -21`} />
      <path d={`M${x} ${y - 4} c-6 -7 6 -14 0 -23`} />
      <path d={`M${x + 12} ${y} c-6 -7 6 -13 0 -21`} />
    </g>
  );
}

function Espresso() {
  return (
    <>
      <ellipse cx="80" cy="128" rx="50" ry="9" fill={CERAMIC} stroke={INK} strokeWidth="2.5" />
      <ellipse cx="80" cy="126" rx="27" ry="4.5" fill="none" stroke={INK} strokeOpacity="0.2" strokeWidth="2" />
      <path d="M106 94 C121 92 123 115 101 117" {...line} />
      <path d="M107 100 C114 100 115 110 103 111" {...line} strokeWidth={2} />
      <path d="M52 88 C52 112 64 125 80 125 C96 125 108 112 108 88 Z" fill={CERAMIC} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M54 100 C64 105 96 105 106 100" fill="none" stroke={CLAY} strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="80" cy="88" rx="28" ry="6" fill={CERAMIC} stroke={INK} strokeWidth="2.5" />
      <ellipse cx="80" cy="89" rx="23.5" ry="4.2" fill={CREMA} />
      <ellipse cx="80" cy="89.5" rx="12" ry="2.2" fill={COFFEE} opacity="0.45" />
      <Steam x={80} y={76} />
    </>
  );
}

function FlatWhite() {
  return (
    <>
      <ellipse cx="80" cy="131" rx="60" ry="10" fill={CERAMIC} stroke={INK} strokeWidth="2.5" />
      <ellipse cx="80" cy="129" rx="32" ry="5" fill="none" stroke={INK} strokeOpacity="0.2" strokeWidth="2" />
      <path d="M118 88 C140 86 141 117 110 119" {...line} />
      <path d="M119 95 C131 95 132 111 113 112" {...line} strokeWidth={2} />
      <path d="M37 76 C39 108 56 128 80 128 C104 128 121 108 123 76 Z" fill={CERAMIC} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M41 94 C56 101 104 101 119 94" fill="none" stroke={CLAY} strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="80" cy="76" rx="43" ry="9" fill={CERAMIC} stroke={INK} strokeWidth="2.5" />
      <ellipse cx="80" cy="77" rx="38" ry="6.8" fill="#9A6136" />
      <path
        d="M80 83 C71 80 65 77.5 68 75.5 C71 73.5 76 74.5 80 77 C84 74.5 89 73.5 92 75.5 C95 77.5 89 80 80 83 Z"
        fill={MILK}
      />
      <Steam x={80} y={62} />
    </>
  );
}

function PourOver() {
  const glass =
    "M50 96 L110 96 C114 106 115 121 107 131 C103 135 57 135 53 131 C45 121 46 106 50 96 Z";
  return (
    <>
      <defs>
        <clipPath id="pour-over-glass">
          <path d={glass} />
        </clipPath>
      </defs>
      <ellipse cx="80" cy="136" rx="44" ry="6" fill="#E6D7BE" />
      <path d={glass} fill={CERAMIC} />
      <rect x="40" y="114" width="80" height="24" fill={COFFEE} clipPath="url(#pour-over-glass)" />
      <path d="M50 114.5 C64 117 96 117 110 114.5" fill="none" stroke={CREMA} strokeWidth="2" clipPath="url(#pour-over-glass)" />
      <path d={glass} fill="none" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M57 103 C54.5 110 54.5 117 56.5 123" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      <circle className="drip" cx="80" cy="98" r="2.6" fill={COFFEE} />
      <rect x="56" y="86" width="48" height="7" rx="3.5" fill={CLAY} stroke={INK} strokeWidth="2.5" />
      <path d="M40 52 L120 52 L96 87 L64 87 Z" fill={CLAY} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M120 57 C134 57 134 77 111 79" {...line} />
      <g stroke={INK} strokeOpacity="0.28" strokeWidth="2" strokeLinecap="round">
        <path d="M66 58 L73 81" />
        <path d="M80 58 L80 81" />
        <path d="M94 58 L87 81" />
      </g>
      <rect x="35" y="47" width="90" height="7" rx="3.5" fill={CLAY} stroke={INK} strokeWidth="2.5" />
      <path d="M44 47 L50 36 L57 44 L64 35 L71 43 L80 34 L89 43 L96 35 L103 44 L110 36 L116 47" fill={CERAMIC} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    </>
  );
}

function ColdBrew() {
  const glass =
    "M46 38 L114 38 L105 131 C104.5 135.5 101 138 97 138 L63 138 C59 138 55.5 135.5 55 131 Z";
  return (
    <>
      <defs>
        <clipPath id="cold-brew-glass">
          <path d={glass} />
        </clipPath>
      </defs>
      <ellipse cx="80" cy="140" rx="46" ry="6" fill="#E6D7BE" />
      <path d={glass} fill={CERAMIC} />
      <path d="M93 14 L78 120" stroke={CLAY} strokeWidth="6" strokeLinecap="round" />
      <g clipPath="url(#cold-brew-glass)">
        <rect x="40" y="56" width="80" height="90" fill="#6B3E22" opacity="0.92" />
        <rect x="40" y="56" width="80" height="7" fill="#8E5530" />
        <g className="bob" fill="#FFFFFF" fillOpacity="0.28" stroke="#FFFFFF" strokeOpacity="0.75" strokeWidth="2">
          <rect x="58" y="60" width="17" height="17" rx="4" transform="rotate(-12 66.5 68.5)" />
          <rect x="83" y="68" width="16" height="16" rx="4" transform="rotate(14 91 76)" />
          <rect x="66" y="86" width="15" height="15" rx="4" transform="rotate(6 73.5 93.5)" />
        </g>
      </g>
      <path d={glass} fill="none" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M53 48 L59 118" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
      <g fill="#FFFFFF" opacity="0.8">
        <ellipse cx="101" cy="102" rx="1.6" ry="2.2" />
        <ellipse cx="97" cy="116" rx="1.3" ry="1.8" />
        <ellipse cx="104" cy="84" rx="1.2" ry="1.7" />
      </g>
    </>
  );
}

const CUPS = {
  espresso: Espresso,
  "flat-white": FlatWhite,
  "pour-over": PourOver,
  "cold-brew": ColdBrew,
};

export default function CupIllustration({ brew, className = "" }) {
  const Cup = CUPS[brew] ?? Espresso;
  return (
    <svg viewBox="0 0 160 150" className={className} aria-hidden="true">
      <Cup />
    </svg>
  );
}

/** A single roasted bean, used as the menu's commitment meter. */
export function Bean({ filled, className = "" }) {
  return (
    <svg viewBox="0 0 12 16" className={className} aria-hidden="true">
      <g transform="rotate(24 6 8)">
        <ellipse
          cx="6"
          cy="8"
          rx="4.6"
          ry="6.6"
          fill={filled ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path
          d="M6 1.8 C3.6 5.2 8.4 10.8 6 14.2"
          fill="none"
          stroke={filled ? "#211B15" : "currentColor"}
          strokeOpacity={filled ? 0.55 : 1}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/** A faint coffee ring, as if a cup had been set down on the order slip. */
export function CoffeeRing({ className = "" }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <filter id="coffee-ring-rough" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="11" />
          <feDisplacementMap in="SourceGraphic" scale="7" />
        </filter>
      </defs>
      <g filter="url(#coffee-ring-rough)" stroke="#8B5A2B">
        <circle cx="100" cy="100" r="70" fill="#8B5A2B" fillOpacity="0.025" strokeWidth="2" strokeOpacity="0.3" />
        <circle cx="100" cy="100" r="66.5" fill="none" strokeWidth="5" strokeOpacity="0.06" />
        <path d="M34 122 A70 70 0 0 0 132 162" fill="none" strokeWidth="4" strokeOpacity="0.14" strokeLinecap="round" />
      </g>
    </svg>
  );
}
