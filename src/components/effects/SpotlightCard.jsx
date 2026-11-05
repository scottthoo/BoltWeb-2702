import { useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * Card with a cursor-following radial spotlight glow and an animated border
 * highlight. Drop-in replacement for a motion.div card wrapper.
 */
export default function SpotlightCard({
  children,
  className = "",
  glow = "166, 72, 31", // clay
  ...motionProps
}) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={`group/spotlight relative overflow-hidden ${className}`}
      {...motionProps}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, rgba(${glow}, 0.18), transparent 65%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(280px circle at ${pos.x}px ${pos.y}px, rgba(${glow}, 0.5), transparent 60%)`,
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
