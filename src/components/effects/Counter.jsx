import { useEffect, useRef } from "react";
import { useInView, useMotionValue, animate } from "framer-motion";

/**
 * Animated count-up that fires once when scrolled into view. Parses a single
 * number out of a label like "+300%", "+4.2x", "< 6 Mo" and animates it while
 * preserving any prefix/suffix. Strings with a range or multiple numbers
 * (e.g. "30-50%") render statically.
 */
const SINGLE_NUMBER = /^(\D*)(\d+(?:\.\d+)?)(\D*)$/;

export default function Counter({ value, className = "", duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const motionVal = useMotionValue(0);

  const match = typeof value === "string" ? value.match(SINGLE_NUMBER) : null;
  const prefix = match ? match[1] : "";
  const target = match ? parseFloat(match[2]) : 0;
  const suffix = match ? match[3] : "";
  const decimals = match && match[2].includes(".") ? 1 : 0;

  useEffect(() => {
    if (!match || !inView) return;
    const node = ref.current;
    const controls = animate(motionVal, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        if (node) {
          node.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`;
        }
      },
    });
    return controls.stop;
  }, [inView, match, target, prefix, suffix, decimals, duration, motionVal]);

  if (!match) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {`${prefix}0${decimals ? ".0" : ""}${suffix}`}
    </span>
  );
}
